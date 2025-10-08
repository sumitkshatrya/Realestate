import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// Only for setup - create first admin
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

export default router;
