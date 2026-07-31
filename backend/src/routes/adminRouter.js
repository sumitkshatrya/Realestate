import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";
import { getAllContacts, deleteContact } from "../controllers/ContactController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

// Only for setup - create first admin
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Admin routes
router.get("/contacts", protectAdmin, getAllContacts);
router.delete("/contacts/:id", protectAdmin, deleteContact);

export default router;
