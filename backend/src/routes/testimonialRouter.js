import express from "express";
import {
  createTestimonial,
  getApprovedTestimonials,
  getRatingSummary,
  getTestimonialById,
  getAllTestimonials,
  updateStatus,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ==================
// Public Routes
// ==================

// Create a new testimonial (with file uploads)
router.post(
  "/create",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "media", maxCount: 1 },
  ]),
  createTestimonial
);

// Get approved testimonials with optional pagination
// Example: /approved?page=1&limit=5
router.get("/approved", getApprovedTestimonials);

// Get rating summary (average rating & total)
router.get("/summary", getRatingSummary);

// Get testimonial by ID
router.get("/:id", getTestimonialById);

// ==================
// Admin Routes (Protected)
// ==================
router.get("/all/list", protectAdmin, getAllTestimonials);
router.put("/:id/status", protectAdmin, updateStatus);
router.delete("/:id", protectAdmin, deleteTestimonial);

export default router;
