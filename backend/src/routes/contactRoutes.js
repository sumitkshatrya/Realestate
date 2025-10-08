// routes/contactRoutes.js
import express from "express";
import {
  createContact,
  getContacts,
} from "../controllers/ContactController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/contact", verifyToken, createContact);
router.get("/contacts", verifyToken, getContacts);

export default router;
