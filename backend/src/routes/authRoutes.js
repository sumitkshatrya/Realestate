import { Router } from "express";
import {
  register,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyUser,
  updateUsername,
  changePassword,
  deleteAccount,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  toggleFavorite,
  getFavoriteProperties,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/auth.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "User route is working" });
});

router.route("/create").post(formLimiter, register);
router.route("/login").post(formLimiter, loginUser);
router.route("/verify").post(verifyToken, verifyUser);
router.route("/verify-user").get(verifyToken, verifyUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.post("/verify-otp", formLimiter, verifyOtp);
router.post("/request-password-reset", formLimiter, requestPasswordReset);
router.post("/reset-password", formLimiter, resetPassword);
router.put("/update-username/", verifyToken, updateUsername);
router.put("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);

// Favorites
router.post("/favorites/:propertyId", verifyToken, toggleFavorite);
router.get("/favorites", verifyToken, getFavoriteProperties);

export default router;

