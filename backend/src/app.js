import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import ErrorHandler, { errorMiddleware } from "./middleware/error.js";
import userRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRouter.js";
import adminRoutes from "./routes/adminRouter.js";
import serviceRoutes from "./routes/Services.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import popularAreaRoutes from "./routes/popularAreaRoutes.js";

const app = express();

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// Body parsers & cookies first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URI,
  process.env.ADMIN_URI,
  "http://localhost:5174",
  "http://localhost:5173",
]
  .filter(Boolean)
  .flatMap((url) => [url, url.replace(/\/+$/, "")]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback for dev flexibility
      }
    },
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

// Routes
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/popular-areas", popularAreaRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly" });
});

app.use("/uploads", express.static("uploads"));

// 404 Handler for undefined routes
app.use((req, res, next) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404));
});

// Error handler must be last
app.use(errorMiddleware);

export default app;

