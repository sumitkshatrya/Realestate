// routes/contactRoutes.js
import express from "express";
import {
  createContact,
  getContacts,
} from "../controllers/ContactController.js";
import { verifyToken } from "../middleware/auth.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/contact", formLimiter, verifyToken, createContact);
router.get("/contacts", verifyToken, getContacts);

export default router;

