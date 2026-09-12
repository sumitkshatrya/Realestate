import express from "express";
import {
  parseNaturalQuery,
  calculateMatchScore,
  compareProperties,
  getPropertyInsights,
  generateDescription,
  calculateListingScore,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/parse-query", parseNaturalQuery);
router.post("/match-score", calculateMatchScore);
router.post("/compare", compareProperties);
router.post("/insights", getPropertyInsights);
router.post("/generate-description", generateDescription);
router.post("/listing-score", calculateListingScore);

export default router;

