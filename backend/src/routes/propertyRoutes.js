import express from "express";
import {
  getProperties,
  searchProperties,
  getPropertyById,
  getAllPropertiesAdmin,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

// Admin routes (must be declared before /:id to avoid conflict)
router.get("/admin/all", protectAdmin, getAllPropertiesAdmin);
router.post("/", protectAdmin, createProperty);
router.put("/:id", protectAdmin, updateProperty);
router.delete("/:id", protectAdmin, deleteProperty);

// Public routes
router.route("/").get(getProperties);
router.route("/search").get(searchProperties);
router.route("/:id").get(getPropertyById);

export default router;
