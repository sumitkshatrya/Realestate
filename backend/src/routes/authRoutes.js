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
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "User route is working" });
});

router.route("/create").post(register);
router.route("/login").post(loginUser);
router.route("/verify").post(verifyToken, verifyUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.post("/verify-otp", verifyOtp);
router.put("/update-username/", verifyToken, updateUsername);
router.put("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);

export default router;
