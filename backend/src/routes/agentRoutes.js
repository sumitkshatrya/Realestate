import express from "express";
import {
  getAgentProfile,
  getAgentTestimonials,
  updateAgentProfile,
  requestValuation,
} from "../controllers/agentController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/:id", getAgentProfile);
router.get("/:id/testimonials", getAgentTestimonials);
router.put("/profile", verifyToken, upload.single("profilePicture"), updateAgentProfile);
router.post("/request-valuation", requestValuation);

export default router;

