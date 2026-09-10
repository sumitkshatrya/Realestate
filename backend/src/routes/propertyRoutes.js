import express from "express";
import {
  getProperties,
  searchProperties,
  getPropertyById,
  getAllPropertiesAdmin,
  createProperty,
  updateProperty,
  deleteProperty,
  seedProperties,
} from "../controllers/propertyController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Admin routes (must be declared before /:id to avoid conflict)
router.get("/admin/all", protectAdmin, getAllPropertiesAdmin);
router.post("/admin/seed", protectAdmin, seedProperties);
router.post("/seed", seedProperties);
router.post("/", protectAdmin, upload.any(), createProperty);
router.put("/:id", protectAdmin, upload.any(), updateProperty);
router.delete("/:id", protectAdmin, deleteProperty);

// Public routes
router.route("/").get(getProperties);
router.route("/search").get(searchProperties);
router.route("/:id").get(getPropertyById);

export default router;

