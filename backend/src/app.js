import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorHandler, { errorMiddleware } from "./middleware/error.js";
import userRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testmonialRoutes from "./routes/testimonialRouter.js";
import admiRoutes from "./routes/adminRouter.js";
import Services from "./routes/Services.js";
const app = express();

//  Body parsers & cookies first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
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
//  Test route
app.get("/", (req, res) => {
  res.send("this is server");
});
app.use("/uploads", express.static("uploads"));
// ✅ Error handler must be last
app.use(errorMiddleware);

export default app;
