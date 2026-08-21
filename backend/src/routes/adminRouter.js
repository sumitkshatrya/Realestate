import express from "express";
import {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/adminController.js";
import { getAllContacts, deleteContact } from "../controllers/ContactController.js";
import {
  getAllUsers,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "../controllers/adminUserController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

// Only for setup - create first admin
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Forgot / Reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Admin routes
router.get("/contacts", protectAdmin, getAllContacts);
router.delete("/contacts/:id", protectAdmin, deleteContact);

// Admin - user management
router.get("/users", protectAdmin, getAllUsers);
router.put("/users/:id", protectAdmin, updateUser);
router.put("/users/:id/status", protectAdmin, toggleUserStatus);
router.delete("/users/:id", protectAdmin, deleteUser);

export default router;
