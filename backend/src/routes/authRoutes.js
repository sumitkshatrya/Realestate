import express from "express";
import { 
  signup, 
  login,
  verifyOTP, 
  resendOTP,
  refreshAccessToken, 
  logout, 
  requestPasswordReset,
  resetPassword,
  changePassword
} from "../controllers/authController.js";

import validationMiddleware from "../middleware/validation.js";
import {
  signupSchema,
  verifyOtpSchema,
  resendOtpSchema,
  refreshTokenSchema,
  logoutSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  changePasswordSchema
} from "../validators/authValidators.js";

import { otpLimiter, passwordResetLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// Auth routes
router.post("/signup", otpLimiter, validationMiddleware(signupSchema), signup);
router.post("/login", login);

router.post("/verify-otp", validationMiddleware(verifyOtpSchema), verifyOTP);
router.post("/resend-otp", otpLimiter, validationMiddleware(resendOtpSchema), resendOTP);

router.post("/refresh-token", validationMiddleware(refreshTokenSchema), refreshAccessToken);
router.post("/logout", validationMiddleware(logoutSchema), logout);

// Password reset routes
router.post(
  "/request-password-reset",
  passwordResetLimiter,
  validationMiddleware(requestPasswordResetSchema),
  requestPasswordReset
);
router.post("/reset-password", validationMiddleware(resetPasswordSchema), resetPassword);
router.post("/change-password", validationMiddleware(changePasswordSchema), changePassword);

export default router;
