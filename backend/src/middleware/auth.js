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

    // 3️⃣ Verify token
    const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default_jwt_secret";
    const decoded = jwt.verify(token, secret);
    // It's better practice to not select out the refresh token here, but in the controller if needed.
    const user = await User.findById(decoded?.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "unauthorized access - user not found" });
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
