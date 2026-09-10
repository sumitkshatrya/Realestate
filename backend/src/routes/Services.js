// src/routes/serviceRoutes.js
import express from "express";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  searchServices,
} from "../controllers/serviceController.js";
import { protectAdmin } from "../middleware/Auth.Middleware.js";

const router = express.Router();

router.route("/").get(getServices).post(protectAdmin, createService);

router.route("/search").get(searchServices);

router
  .route("/:id")
  .get(getService)
  .put(protectAdmin, updateService)
  .delete(protectAdmin, deleteService);

export default router;
