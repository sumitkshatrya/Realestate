import express from 'express';
import dotenv from 'dotenv';
import passport from "passport";
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { connectDB } from './lib/db.js';
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import { generateTokens } from './utils/token.js';

dotenv.config();
connectDB();

const app = express();

// Create rate limiters FIRST (before using them)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Add CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Passport Google OAuth 
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5001/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile received:', profile);
    
    let user = await User.findOne({ 
      $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
    });
    
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true
      });
      console.log('New Google user created:', user.email);
    } else if (!user.googleId) {
      user.googleId = profile.id;
      user.isVerified = true;
      await user.save();
      console.log('Google account linked to existing user:', user.email);
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Google auth error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

// Google OAuth routes
app.get("/auth/google", (req, res, next) => {
  console.log('Initiating Google OAuth');
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    session: false 
  })(req, res, next);
});

app.get("/auth/google/callback",
  (req, res, next) => {
    console.log('Google callback received');
    passport.authenticate("google", { 
      failureRedirect: process.env.CLIENT_URL + "/login?error=google-auth-failed",
      session: false 
    })(req, res, next);
  },
  async (req, res) => {
    try {
      console.log('Google authentication successful, user:', req.user)
      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(req.user._id);
      
      // Update user with refresh token
      await User.findByIdAndUpdate(req.user._id, { refreshToken });
      
      console.log('Tokens generated, redirecting to frontend...'); 
      
      // Redirect to frontend with tokens
      res.redirect(`${process.env.CLIENT_URL}/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth-failed`);
    }
  }
);

// Add debug endpoints
app.get('/api/debug/env', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
    clientUrl: process.env.CLIENT_URL,
    port: process.env.PORT
  });
});

app.get('/api/debug/cors', (req, res) => {
  res.json({ message: 'CORS is working!', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));