import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { sendSMS } from "../utils/sendSMS.js";
import { generateTokens } from "../utils/token.js";

// ========== Helpers ==========
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateResetToken = () => crypto.randomBytes(32).toString("hex");

// ========== Signup ==========
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Require at least email or phone
    if (!email && !phone) {
      return res.status(422).json({
        message: "Either email or phone is required",
        errors: [{ field: "email", message: "Email or phone is required" }],
      });
    }

    let user = await User.findOne({ $or: [{ email }, { phone }] });


    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }
     
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; 

    if (user && !user.isVerified) {
      // Update existing unverified user
      user.name = name;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      user.otp = otp;
    user.otpExpiry = otpExpiry;
    } else {
      // Create new user
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      user = new User({ name, email, phone, password: hashedPassword, otp, otpExpiry });
    }

    await user.save();
    
    // Send OTP via Email or SMS
    try{
    if (email) {
      await sendEmail(
        email,
        "Verify your RealEstate account",
        `Your verification OTP is: ${otp}\nThis OTP will expire in 10 minutes.`
      );
      console.log(`OTP email sent to: ${email}`);
    }
    if (phone) {
      await sendSMS(phone, `Your RealEstate verification OTP is: ${otp}`);
      console.log(`OTP SMS sent to: ${phone}`);
    }
      } catch (sendError) {
    console.error("Error sending OTP:", sendError); 
  }
    res.json({ 
      message: "OTP sent successfully",
      userId: user._id,
      otp: process.env.NODE_ENV === "development" ? otp : undefined
    });

     } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== Verify OTP ==========
export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp, userId } = req.body;

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
    };

    res.json({ accessToken, refreshToken, user: userResponse });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== Refresh Token ==========
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err) => {
      if (err) {
        user.refreshToken = null;
        await user.save();
        return res.status(403).json({ message: "Expired refresh token" });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add this to your existing authController.js
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    
    // Validation - need either email or phone
    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    // Find user by email or phone
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your account first" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified
    };

    res.json({ 
      user: userResponse, 
      accessToken, 
      refreshToken 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== Logout ==========
export const logout = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== Resend OTP ==========
export const resendOTP = async (req, res) => {
  try {
    const { email, phone, userId } = req.body;

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    if (email) {
      await sendEmail(
        email,
        "Your new verification OTP",
        `Your new verification OTP is: ${otp}\nThis OTP will expire in 10 minutes.`
      );
    }
    if (phone) {
      await sendSMS(phone, `Your new verification OTP is: ${otp}`);
    }

    res.json({ message: "OTP resent successfully", userId: user._id });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== Request Password Reset ==========
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.json({ message: "If the account exists, a reset link has been sent" });
    }

    const resetToken = generateResetToken();
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    if (email) {
      await sendEmail(
        email,
        "Password Reset Request",
        `Click to reset your password: ${resetUrl}\nThis link will expire in 1 hour.`
      );
    }
    if (phone) {
      await sendSMS(
        phone,
        `Password reset requested. Use this token: ${resetToken} or visit: ${resetUrl}`
      );
    }

    res.json({ message: "Password reset instructions sent" });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== Reset Password ==========
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ========== Change Password ==========
export const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
