import express from "express";
import {
  scheduleTour,
  getAllTours,
  updateTourStatus,
  deleteTour,
} from "../controllers/tourController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public - schedule a tour
router.post("/schedule", formLimiter, scheduleTour);

// Admin - manage tour requests
router.get("/", protectAdmin, getAllTours);
router.put("/:id/status", protectAdmin, updateTourStatus);
router.delete("/:id", protectAdmin, deleteTour);

export default router;


