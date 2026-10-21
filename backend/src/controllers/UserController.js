import ErrorHandler from "../middleware/error.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

dotenv.config();

// ================= REGISTER =================
const register = catchAsyncError(async (req, res, next) => {
  try {
    const { username, email, password, phone, verificationMethod } = req.body;
    const method = verificationMethod || "email";

    if (!username || !email || !password || !phone) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanUsername = String(username).trim();
    const cleanPhone = String(phone).trim();

    if (!["email", "sms", "call"].includes(method)) {
      return next(new ErrorHandler("Invalid verification method", 400));
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return next(
        new ErrorHandler(
          "Phone must be in E.164 format, e.g., +919999999999",
          400
        )
      );
    }

    const escapedEmail = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } },
        { phone: cleanPhone },
      ],
    });

    if (user && user.accountVerified) {
      return next(new ErrorHandler("Phone or Email is already used", 400));
    }

    if (user && !user.accountVerified) {
      const attempts = await User.countDocuments({
        $or: [
          { email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } },
          { phone: cleanPhone },
        ],
        accountVerified: false,
      });
      if (attempts >= 3) {
        return next(
          new ErrorHandler(
            "Maximum registration attempts exceeded. Try again later",
            400
          )
        );
      }
    } else if (!user) {
      user = await User.create({
        username: cleanUsername,
        email: cleanEmail,
        phone: cleanPhone,
        password,
        verificationMethod: method,
      });
    }

    const verificationCode = user.generateVerificationCode();
    await user.save();

    try {
      await sendVerificationCode(
        method,
        verificationCode,
        cleanPhone,
        cleanEmail,
        cleanUsername
      );
      res
        .status(200)
        .json(new ApiResponse(null, "Verification code sent", 200));
    } catch (err) {
      console.warn(
        "Verification code failed to send, but user is saved:",
        err.message
      );
      res
        .status(200)
        .json(
          new ApiResponse(
            null,
            "User registered, but failed to send verification code. Try alternative verification method.",
            200
          )
        );
    }
  } catch (error) {
    next(error);
  }
});

// ================= LOGIN USER =================
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json(new ApiResponse(null, "All fields are required", 400));
    }

    const cleanInput = String(username).trim();
    const escapedInput = cleanInput.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${escapedInput}$`, "i") } },
        { email: { $regex: new RegExp(`^${escapedInput}$`, "i") } },
      ],
    });
    if (!user) {
      return res.status(404).json(new ApiResponse(null, "User not found", 404));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json(new ApiResponse(null, "Invalid password", 401));
    }

    if (!user.accountVerified) {
      return res
        .status(401)
        .json(
          new ApiResponse(
            null,
            "Account not verified. Please verify OTP first",
            401
          )
        );
    }

    // Generate JWT
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET || "testing-realstate",
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || "testing-refreshtoken",
      { expiresIn: "7d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          {
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            accountVerified: user.accountVerified,
            favorites: user.favorites || [],
            token: accessToken,
            accessToken: accessToken,
          },
          "Login successful",
          200
        )
      );
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================
const logoutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json(new ApiResponse(null, "Logout successful", 200));
  } catch (error) {
    next(error);
  }
};

// ================= REFRESH TOKEN =================
const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
      return next(new ErrorHandler("Refresh token is required", 401));
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "testing-refreshtoken");
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET || "testing-realstate",
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || "testing-refreshtoken",
      { expiresIn: "7d" }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json(new ApiResponse(null, "Access token refreshed successfully", 200));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message:
        error.message || "An error occurred while refreshing access token",
    });
  }
};

// ================= VERIFY USER =================
const verifyUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json(new ApiResponse(null, "Access token not verified", 401));
    }

    res.status(200).json(new ApiResponse(user, "Success", 200));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Verification failed",
    });
  }
};

// ================= FORGOT PASSWORD =================
const requestPasswordReset = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Email is required", 400));

  const cleanEmail = String(email).trim().toLowerCase();
  const escapedEmail = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const user = await User.findOne({
    email: { $regex: new RegExp(`^${escapedEmail}$`, "i") },
  });
  if (!user) return next(new ErrorHandler("User not found with this email address", 404));

  // Generate reset code (5-digit)
  const resetCode = Math.floor(10000 + Math.random() * 90000);
  user.resetPassword = String(resetCode);
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  // Send email (safe error handling if SMTP is not configured)
  let emailDelivered = false;
  try {
    await sendEmail(
      cleanEmail,
      `Your PROPSESTATE Password Reset Code: ${resetCode}`,
      `<div style="font-family: Arial, sans-serif; padding: 25px; max-width: 500px; margin: 0 auto; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 16px;">
        <h2 style="color: #f59e0b; margin-top: 0; font-size: 22px;">Password Reset Request</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hello ${user.username || "User"},</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Use the 5-digit verification code below to reset your password on <strong>PROPSESTATE</strong>:</p>
        <div style="background: #1e293b; border: 1px dashed #f59e0b; padding: 18px; text-align: center; margin: 25px 0; border-radius: 12px;">
          <span style="font-size: 34px; font-weight: 800; color: #f59e0b; letter-spacing: 8px; font-family: monospace;">${resetCode}</span>
        </div>
        <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">This code will expire in <strong>15 minutes</strong>. If you did not request this, please secure your account or ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
        <p style="color: #64748b; font-size: 11px;">PROPSESTATE Security Team</p>
      </div>`
    );
    emailDelivered = true;
  } catch (emailErr) {
    console.warn("⚠️ Password reset email delivery skipped or failed:", emailErr.message);
  }

  console.log(`🔑 [USER PASSWORD RESET CODE] for ${cleanEmail}: ${resetCode}`);

  res.status(200).json({
    success: true,
    message: emailDelivered
      ? "Reset code sent to your email (please also check your Spam/Promotions folder)."
      : "Reset code generated.",
    resetCode: resetCode,
    emailDelivered,
  });
});

// ================= RESET PASSWORD =================
const resetPassword = catchAsyncError(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return next(
      new ErrorHandler("Email, code, and new password are required", 400)
    );

  const cleanEmail = String(email).trim().toLowerCase();
  const escapedEmail = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const user = await User.findOne({
    email: { $regex: new RegExp(`^${escapedEmail}$`, "i") },
  });
  if (!user) return next(new ErrorHandler("User not found with this email address", 404));

  if (!user.resetPassword || String(user.resetPassword).trim() !== String(code).trim())
    return next(new ErrorHandler("Invalid reset code", 400));

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now())
    return next(new ErrorHandler("Reset code expired", 400));

  user.password = newPassword;
  user.resetPassword = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
});

// ================= UPDATE USERNAME =================
const updateUsername = async (req, res) => {
  try {
    const user = req.user;
    user.username = req.body.username;
    await user.save();
    res.json(new ApiResponse(null, "Username updated successfully", 200));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to update username",
    });
  }
};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Old and new passwords are required", 400));
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(null, "✅ Password changed successfully", 200));
  } catch (error) {
    next(error);
  }
};

// ================= DELETE ACCOUNT =================
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie("accessToken").clearCookie("refreshToken");
    res.json(new ApiResponse(null, "Account deleted successfully", 200));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to delete account",
    });
  }
};

// ================= HELPER FUNCTIONS =================
async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  phone,
  email,
  username
) {
  try {
    if (email) {
      const message = generateEmailTemplate(username, verificationCode);
      await sendEmail(email, "Your verification code", message);
      console.log("📧 Verification email sent successfully to:", email);
    }
    console.log(`🔑 [VERIFICATION CODE] OTP for ${phone || email} (${username}): ${verificationCode}`);
  } catch (err) {
    console.error("sendVerificationCode email error:", err.message || err);
    console.log(`🔑 [DEV VERIFICATION CODE] OTP for ${phone || email} (${username}): ${verificationCode}`);
  }
}

function generateEmailTemplate(username, verificationCode) {
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background:#f6f9fc; padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:10px;">
        <h2 style="color:#333;">Email Verification</h2>
        <p>Hello, ${username}</p>
        <p>Thank you for registering. Please use the following verification code to complete your signup:</p>
        <div style="background:#f0f4ff;padding:12px 24px;font-size:24px;font-weight:bold;letter-spacing:3px;border-radius:8px;color:#1a73e8;text-align:center;">
          ${verificationCode}
        </div>
        <p>This code will expire in <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p style="font-size:12px;color:#888;">&copy; 2025 PROPSESTATE</p>
      </div>
    </body>
  </html>
  `;
}

// ================= VERIFY OTP =================
const verifyOtp = catchAsyncError(async (req, res, next) => {
  const { email, phone, code, verificationCode } = req.body;
  const otp = code || verificationCode;

  // 1. Validate input
  if ((!email && !phone) || !otp) {
    return next(new ErrorHandler("Email or phone and code are required", 400));
  }

  // 2. Find user
  const cleanEmail = email ? String(email).trim().toLowerCase() : null;
  const escapedEmail = cleanEmail ? cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : null;
  const conditions = [];
  if (escapedEmail) {
    conditions.push({ email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } });
  }
  if (phone) {
    conditions.push({ phone: String(phone).trim() });
  }

  const user = await User.findOne({ $or: conditions });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // 3. Check verification code
  if (!user.verificationCode || String(user.verificationCode) !== String(otp)) {
    return next(new ErrorHandler("Invalid verification code", 400));
  }

  // 4. Check expiration
  if (
    !user.verificationCodeExpire ||
    user.verificationCodeExpire < Date.now()
  ) {
    return next(new ErrorHandler("Verification code expired", 400));
  }

  // 5. Mark account as verified
  user.accountVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();

  // Generate JWT tokens
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET || "testing-realstate",
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || "testing-refreshtoken",
    { expiresIn: "7d" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 6. Return success with token
  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json({
      success: true,
      message: "✅ Account verified successfully",
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        accountVerified: user.accountVerified,
        favorites: user.favorites || [],
        token: accessToken,
        accessToken: accessToken,
      },
    });
});

// ================= TOGGLE FAVORITE =================
const toggleFavorite = catchAsyncError(async (req, res, next) => {
  const { propertyId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const stringFavorites = (user.favorites || []).map((fav) => (fav?._id || fav).toString());
  const index = stringFavorites.indexOf(String(propertyId));
  let message;

  if (index === -1) {
    // Add to favorites
    user.favorites.push(propertyId);
    message = "Property added to favorites";
  } else {
    // Remove from favorites
    user.favorites.splice(index, 1);
    message = "Property removed from favorites";
  }

  await user.save();
  const updatedIds = user.favorites.map((fav) => (fav?._id || fav).toString());
  res.status(200).json(new ApiResponse({ favorites: updatedIds }, message, 200));
});

// ================= GET FAVORITE PROPERTIES =================
const getFavoriteProperties = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('favorites');

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json(new ApiResponse(user.favorites, "Favorite properties fetched successfully", 200));
});

// ================= EXPORT =================
export {
  register,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyUser,
  deleteAccount,
  changePassword,
  updateUsername,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  toggleFavorite,
  getFavoriteProperties,
};
