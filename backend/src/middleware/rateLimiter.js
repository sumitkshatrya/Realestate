import rateLimit from "express-rate-limit";


export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false, 
  message: {
    message:
      "Too many requests from this IP. Please try again after an hour.",
  },
  
});