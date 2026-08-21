import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorHandler, { errorMiddleware } from "./middleware/error.js";
import userRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testmonialRoutes from "./routes/testimonialRouter.js";
import admiRoutes from "./routes/adminRouter.js";
import Services from "./routes/Services.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import contentRoutes from "./routes/contentRoutes.js"; // Import new content routes
import tourRoutes from "./routes/tourRoutes.js";
const app = express();

//  Body parsers & cookies first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URI,
      process.env.ADMIN_URI,
      "http://localhost:5174",
      "http://localhost:5173",
    ].filter(Boolean),
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

//  Routes
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api/testimonials", testmonialRoutes);
app.use("/api/admin", admiRoutes);
app.use("/api/services", Services);
app.use("/api/properties", propertyRoutes);
app.use("/api/content", contentRoutes); // Use new content routes
app.use("/api/tours", tourRoutes);
//  Test route
app.get("/", (req, res) => {
  res.send("this is server");
});
app.use("/uploads", express.static("uploads"));
//  Error handler must be last
app.use(errorMiddleware);

export default app;
