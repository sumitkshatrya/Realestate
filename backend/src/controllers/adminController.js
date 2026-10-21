import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { sendEmail } from "../utils/sendEmail.js";

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await Admin.findOne({
      email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ error: "Admin already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new Admin({ email: cleanEmail, passwordHash });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully.", adminId: admin._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({
      email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role, email: admin.email },
      process.env.JWT_SECRET || "testing-realstate",
      { expiresIn: "1d" }
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
    if (!email) return res.status(400).json({ error: "Email is required." });

    const cleanEmail = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({
      email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });

    const genericMessage =
      "If an account with that email exists, a password reset link has been sent.";

    if (!admin) {
      console.log(`ℹ️ [ADMIN FORGOT PASSWORD] No admin found for email: ${cleanEmail}`);
      return res.status(200).json({ message: genericMessage });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await admin.save();

    // Dynamically determine the admin panel base URL
    let origin = req.headers.origin || null;
    if (!origin && req.headers.referer) {
      try {
        origin = new URL(req.headers.referer).origin;
      } catch (e) {
        origin = null;
      }
    }

    let adminBase;
    if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
      adminBase = origin;
    } else if (process.env.ADMIN_URI && !process.env.ADMIN_URI.includes("localhost")) {
      adminBase = process.env.ADMIN_URI;
    } else if (origin) {
      adminBase = origin;
    } else {
      adminBase = process.env.ADMIN_URI || "https://propsestate-admin.onrender.com";
    }
    adminBase = adminBase.replace(/\/+$/, "");
    const resetUrl = `${adminBase}/reset-password/${resetToken}`;

    console.log(`🔑 [ADMIN PASSWORD RESET LINK] for ${admin.email}: ${resetUrl}`);

    let emailDelivered = false;
    let emailErrorMsg = null;

    try {
      await sendEmail(
        admin.email,
        "Admin Password Reset - PROPSESTATE",
        `<div style="font-family: Arial, sans-serif; padding: 25px; max-width: 550px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
          <h2 style="color: #f59e0b; margin-top: 0; font-size: 22px;">Admin Password Reset Request</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">You requested a password reset for your administrator account on <strong>PROPSESTATE</strong>.</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>:</p>
          <div style="margin: 25px 0; text-align: center;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background: #ef4444; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);">Reset Admin Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">Or copy and paste this URL into your browser:<br/><a href="${resetUrl}" style="color: #38bdf8; word-break: break-all;">${resetUrl}</a></p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 11px;">If you did not request this password reset, please secure your account immediately or ignore this email.</p>
        </div>`
      );
      emailDelivered = true;
    } catch (emailError) {
      emailErrorMsg = emailError.message;
      console.error("⚠️ Failed to deliver admin reset email:", emailError.message);
    }

    res.status(200).json({
      message: genericMessage,
      emailDelivered,
      resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password - verify token and set new password
export const resetPassword = async (req, res) => {
  try {
    const body = req.body || {};
    const token = body.token || req.query.token;
    const password = body.password || body.newPassword;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ error: "Reset link is invalid or has expired." });
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

// Change password for logged-in admin
export const changePassword = async (req, res) => {
  try {
    const adminId = req.admin?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
