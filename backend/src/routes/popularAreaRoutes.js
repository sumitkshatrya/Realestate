import express from "express";
import {
  getPopularAreas,
  createPopularArea,
  updatePopularArea,
  deletePopularArea,
} from "../controllers/PopularAreaController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Public route
router.get("/", getPopularAreas);

// Admin routes
router.post("/", protectAdmin, upload.single("image"), createPopularArea);
router.put("/:id", protectAdmin, upload.single("image"), updatePopularArea);
router.delete("/:id", protectAdmin, deletePopularArea);

export default router;