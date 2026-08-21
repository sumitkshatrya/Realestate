import express from "express";
import { getAboutContent, updateAboutContent } from "../controllers/contentController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

// Public route to get content
router.get("/about", getAboutContent);

// Admin route to update content
router.put("/about", protectAdmin, updateAboutContent);

export default router;