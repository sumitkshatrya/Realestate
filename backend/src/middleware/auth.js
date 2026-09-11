import jwt from "jsonwebtoken";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import User from "../models/User.js";

export const verifyToken = catchAsyncError(async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check cookie first
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2️⃣ Check Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      // Use return next() for consistency with error handling middleware
      return next(new ErrorHandler("Unauthorized access - no token provided", 401));
    }

    // 3️⃣ Verify token with fallback
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "testing-realstate");
    } catch {
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "testing-realstate");
      } catch (err) {
        throw err;
      }
    }

    const user = await User.findById(decoded?.id);

    if (!user) {
      return next(new ErrorHandler("Unauthorized access - user not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    // Catch JWT errors (like expiration) and provide a clear message.
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return next(new ErrorHandler("Unauthorized access - invalid or expired token", 401));
    }
    // Pass other errors to the central error handler
    next(error);
  }
});
