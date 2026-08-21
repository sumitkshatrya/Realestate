import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { sendEmail } from "../utils/sendEmail.js";

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Admin already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, passwordHash });
    await admin.save();

    res.status(201).json({ message: "Admin registered", adminId: admin._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot password - generate reset token and send reset link to admin email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const admin = await Admin.findOne({ email });
    // Always return the same generic message to prevent email enumeration
    const genericMessage =
      "If an account with that email exists, a password reset link has been sent.";

    if (!admin) {
      return res.status(200).json({ message: genericMessage });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    const resetUrl = `${process.env.ADMIN_URI}/reset-password/${resetToken}`;

    try {
      await sendEmail(
        email,
        "Admin Password Reset",
        `<h2>Password Reset Request</h2>
         <p>You requested a password reset for your admin account.</p>
         <p>Click the link below to reset your password. This link is valid for <b>10 minutes</b>.</p>
         <p><a href="${resetUrl}">Reset Password</a></p>
         <p>If you did not request this, please ignore this email.</p>`
      );
    } catch (emailError) {
      console.warn("Failed to send reset email:", emailError.message);
    }

    res.status(200).json({ message: genericMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password - verify token and set new password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ error: "Reset link is invalid or has expired" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    admin.passwordHash = passwordHash;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({ message: "Password has been reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
