import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.js";
import userRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testmonialRoutes from "./routes/testimonialRouter.js";
import admiRoutes from "./routes/adminRouter.js";
import Services from "./routes/Services.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import popularAreaRoutes from "./routes/popularAreaRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Body parsers & cookies first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URI,
  process.env.ADMIN_URI,
  "https://propsestate-admin.onrender.com",
  "https://propsestate-ytdn.onrender.com",
  "https://propsestate.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      // Allow any onrender.com subdomains
      if (origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }
      return callback(null, origin);
    },
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api/testimonials", testmonialRoutes);
app.use("/api/admin", admiRoutes);
app.use("/api/services", Services);
app.use("/api/properties", propertyRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/popular-areas", popularAreaRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/ai", aiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("this is server");
});

app.use("/uploads", express.static("uploads"));

// Error handler must be last
app.use(errorMiddleware);

export default app;
