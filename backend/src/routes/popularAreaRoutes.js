import express from "express";
import {
  getPopularAreas,
  createPopularArea,
  updatePopularArea,
  deletePopularArea,
} from "../controllers/popularAreaController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

// Public route
router.get("/", getPopularAreas);

// Admin routes
router.post("/", protectAdmin, createPopularArea);
router.put("/:id", protectAdmin, updatePopularArea);
router.delete("/:id", protectAdmin, deletePopularArea);

export default router;