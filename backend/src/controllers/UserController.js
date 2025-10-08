import ErrorHandler from "../middleware/error.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

dotenv.config();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// ================= REGISTER =================
const register = catchAsyncError(async (req, res, next) => {
  try {
    const { username, email, password, phone, verificationMethod } = req.body;

    if (!username || !email || !password || !phone || !verificationMethod) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (!["email", "sms", "call"].includes(verificationMethod)) {
      return next(new ErrorHandler("Invalid verification method", 400));
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return next(
        new ErrorHandler(
          "Phone must be in E.164 format, e.g., +919999999999",
          400
        )
      );
    }

    let user = await User.findOne({ $or: [{ email }, { phone }] });

    if (user && user.accountVerified) {
      return next(new ErrorHandler("Phone or Email is already used", 400));
    }

    if (user && !user.accountVerified) {
      const attempts = await User.countDocuments({
        $or: [{ email }, { phone }],
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
        username,
        email,
        phone,
        password,
        verificationMethod,
      });
    }

    const verificationCode = user.generateVerificationCode();
    await user.save();

    try {
      await sendVerificationCode(
        verificationMethod,
        verificationCode,
        phone,
        email,
        username
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
//=======================loginUser==========
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json(new ApiResponse(null, "All fields are required", 400));
    }

    const user = await User.findOne({ username });
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
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .status(200)
      .json(
        new ApiResponse(
          { username: user.username, email: user.email },
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
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
      throw new ApiError("Refresh token is required", 401);
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select(
      "-password -refresh_token"
    );
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const { accessToken, refreshToken: newRefreshToken } = await generatetoken(
      user
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
      throw new ApiError("Access token not verified", 401);
    }

    res.status(200).json(new ApiResponse(user, "Success", 200));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Verification failed",
    });
  }
};
//==================== FORGOT PASSWORD ===========
const requestPasswordReset = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Generate reset code (5-digit)
  const resetCode = Math.floor(10000 + Math.random() * 90000);
  user.resetPassword = resetCode;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  // Send email
  await sendEmail(
    email,
    "Password Reset Code",
    `Your reset code is: ${resetCode}`
  );
  res
    .status(200)
    .json({ success: true, message: "Reset code sent to your email" });
});
// =========================== Reset Psswrod ============================================
const resetPassword = catchAsyncError(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return next(
      new ErrorHandler("Email, code, and new password are required", 400)
    );

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.resetPassword !== Number(code))
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
const changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new ApiError("Old and new passwords are required", 400);
    }

    const isMatch = await user.isPasswordValid(oldPassword);
    if (!isMatch) {
      throw new ApiError("Old password is incorrect", 401);
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(null, "✅ Password changed successfully", 200));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "❌ Failed to change password" });
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
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(username, verificationCode);
      await sendEmail(email, "Your verification code", message);
      console.log("📧 Email sent successfully to:", email);
    } else if (verificationMethod === "sms") {
      await client.messages.create({
        body: `Your verification code is ${verificationCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log("📩 SMS sent successfully to:", phone);
    } else if (verificationMethod === "call") {
      const codeWithSpaces = verificationCode.toString().split("").join(" ");
      const call = await client.calls.create({
        twiml: `<Response><Say>Your verification code is ${codeWithSpaces}</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log("📞 Voice call initiated:", call.sid);
    } else {
      throw new ErrorHandler("Invalid verification method", 400);
    }
  } catch (err) {
    console.error("sendVerificationCode error:", err);
    throw new ErrorHandler("Failed to send verification code", 500);
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
        <p style="font-size:12px;color:#888;">&copy; 2025 Your Company</p>
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
  const user = await User.findOne({ $or: [{ email }, { phone }] });
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

  // 6. Return success
  res.status(200).json({
    success: true,
    message: "✅ Account verified successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      accountVerified: user.accountVerified,
    },
  });
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
};
