// src/routes/Services.js
import express from "express";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  searchServices,
  getAllServicesForAdmin,
} from "../controllers/serviceController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

router.route("/").get(getServices).post(protectAdmin, createService);

router.route("/search").get(searchServices);
router.route("/all").get(protectAdmin, getAllServicesForAdmin);

router
  .route("/:id")
  .get(getService)
  .put(protectAdmin, updateService)
  .delete(protectAdmin, deleteService);

export default router;

