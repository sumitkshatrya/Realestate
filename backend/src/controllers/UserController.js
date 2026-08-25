import ErrorHandler from "../middleware/error.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

dotenv.config();

let client = null;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn("Twilio client initialization skipped:", err.message);
  }
}

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

// ================= REGISTER =================
const register = catchAsyncError(async (req, res, next) => {
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
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.password = password;
    user.verificationMethod = verificationMethod;
  } else {
    user = new User({
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
      "Verification code failed to send, but user record exists:",
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
});

// ================= LOGIN USER =================
const loginUser = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new ErrorHandler("Username and password are required", 400));
  }

  const user = await User.findOne({ username });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  if (!user.accountVerified) {
    return next(
      new ErrorHandler("Account not verified. Please verify OTP first", 401)
    );
  }

  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default_jwt_secret";
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

  const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "7d" });

  const cookieOpts = getCookieOptions();

  res
    .cookie("accessToken", accessToken, { ...cookieOpts, maxAge: 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json(
      new ApiResponse(
        { id: user._id, username: user.username, email: user.email },
        "Login successful",
        200
      )
    );
});

// ================= LOGOUT =================
const logoutUser = catchAsyncError(async (req, res, next) => {
  const cookieOpts = getCookieOptions();
  res
    .clearCookie("accessToken", cookieOpts)
    .clearCookie("refreshToken", cookieOpts)
    .status(200)
    .json(new ApiResponse(null, "Logout successful", 200));
});

// ================= REFRESH TOKEN =================
const refreshAccessToken = catchAsyncError(async (req, res, next) => {
  const refreshToken =
    req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token is required", 401));
  }

  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET || "default_refresh_secret";
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default_jwt_secret";

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired refresh token", 401));
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
  const newRefreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "7d" });

  const cookieOpts = getCookieOptions();

  res
    .cookie("refreshToken", newRefreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .cookie("accessToken", accessToken, { ...cookieOpts, maxAge: 60 * 60 * 1000 })
    .status(200)
    .json(new ApiResponse(null, "Access token refreshed successfully", 200));
});

// ================= VERIFY USER =================
const verifyUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  if (!user || !user._id) {
    return next(new ErrorHandler("Access token not verified", 401));
  }

  res.status(200).json(new ApiResponse(user, "Success", 200));
});

// ================= FORGOT PASSWORD =================
const requestPasswordReset = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const resetCode = Math.floor(10000 + Math.random() * 90000);
  user.resetPassword = String(resetCode);
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  await sendEmail(
    email,
    "Password Reset Code",
    `Your reset code is: ${resetCode}`
  );
  res
    .status(200)
    .json(new ApiResponse(null, "Reset code sent to your email", 200));
});

// ================= RESET PASSWORD =================
const resetPassword = catchAsyncError(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return next(
      new ErrorHandler("Email, code, and new password are required", 400)
    );
  }

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (String(user.resetPassword) !== String(code)) {
    return next(new ErrorHandler("Invalid reset code", 400));
  }

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
    return next(new ErrorHandler("Reset code expired", 400));
  }

  user.password = newPassword;
  user.resetPassword = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(null, "Password reset successfully", 200));
});

// ================= UPDATE USERNAME =================
const updateUsername = catchAsyncError(async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return next(new ErrorHandler("Username is required", 400));
  }

  const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
  if (existingUser) {
    return next(new ErrorHandler("Username is already taken", 400));
  }

  const user = req.user;
  user.username = username;
  await user.save();

  res.status(200).json(new ApiResponse(null, "Username updated successfully", 200));
});

// ================= CHANGE PASSWORD =================
const changePassword = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Old and new passwords are required", 400));
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(null, "Password changed successfully", 200));
});

// ================= DELETE ACCOUNT =================
const deleteAccount = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  const cookieOpts = getCookieOptions();
  res
    .clearCookie("accessToken", cookieOpts)
    .clearCookie("refreshToken", cookieOpts);
  res.json(new ApiResponse(null, "Account deleted successfully", 200));
});

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
      if (!client) throw new Error("Twilio service is not configured");
      await client.messages.create({
        body: `Your verification code is ${verificationCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log("📩 SMS sent successfully to:", phone);
    } else if (verificationMethod === "call") {
      if (!client) throw new Error("Twilio service is not configured");
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
    throw new ErrorHandler(err.message || "Failed to send verification code", 500);
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

  if ((!email && !phone) || !otp) {
    return next(new ErrorHandler("Email or phone and code are required", 400));
  }

  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const user = await User.findOne({ $or: query });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (!user.verificationCode || String(user.verificationCode) !== String(otp)) {
    return next(new ErrorHandler("Invalid verification code", 400));
  }

  if (
    !user.verificationCodeExpire ||
    user.verificationCodeExpire < Date.now()
  ) {
    return next(new ErrorHandler("Verification code expired", 400));
  }

  user.accountVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Account verified successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      accountVerified: user.accountVerified,
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

  const index = user.favorites.indexOf(propertyId);
  let message;

  if (index === -1) {
    user.favorites.push(propertyId);
    message = "Property added to favorites";
  } else {
    user.favorites.splice(index, 1);
    message = "Property removed from favorites";
  }

  await user.save();
  res.status(200).json(new ApiResponse({ favorites: user.favorites }, message, 200));
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

