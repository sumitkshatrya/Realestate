import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight,
  FaXmark,
  FaBuildingCircleCheck,
  FaShieldHalved,
} from "react-icons/fa6";
import { useAuth } from "../context/useAuth";

const LoginForm = ({ onClose, switchToSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  const luxuryBackgrounds = [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % luxuryBackgrounds.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [luxuryBackgrounds.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setError("Please enter both username and password.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await login(formData);
      setSuccess(data.message || "Welcome back! Redirecting...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 overflow-hidden bg-slate-950">
      
      {/* Animated Villa Background Carousel */}
      <AnimatePresence mode="wait">
        <Motion.div
          key={bgIndex}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${luxuryBackgrounds[bgIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </AnimatePresence>

      {/* Dark Luxury Gradient Overlay */}
      <Motion.div
        className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/80 to-blue-950/70 backdrop-blur-md"
        animate={{
          opacity: [0.85, 0.95, 0.85],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mouse Parallax Floating Orbs */}
      <Motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/20 via-blue-600/20 to-indigo-600/20 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x * 2.5,
          y: mousePosition.y * 2.5,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 60,
        }}
      />

      {/* Main Glass Card */}
      <Motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{
          type: "spring",
          damping: 22,
          stiffness: 220,
        }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/15 relative overflow-hidden">
          
          {/* Subtle Ambient Light Edge */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-blue-600/20 blur-2xl pointer-events-none" />

          {/* Close / Return Button */}
          <Motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose || (() => navigate("/"))}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            aria-label="Close"
          >
            <FaXmark className="text-base" />
          </Motion.button>

          {/* Brand Header */}
          <div className="text-center mb-8">
            <Motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 mb-4 border border-amber-300/30 font-bold text-2xl"
            >
              <FaBuildingCircleCheck />
            </Motion.div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
              Access your luxury estate portfolio
            </p>
          </div>

          {/* Error & Success Feedback Banners */}
          <AnimatePresence mode="wait">
            {error && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2"
              >
                <FaShieldHalved className="text-red-400 shrink-0 text-sm" />
                <span>{error}</span>
              </Motion.div>
            )}
            {success && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2"
              >
                <FaShieldHalved className="text-emerald-400 shrink-0 text-sm" />
                <span>{success}</span>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <FaArrowRight className="text-xs" />
                </>
              )}
            </Motion.button>
          </form>

          {/* Switch to Signup CTA */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={switchToSignup || (() => navigate("/signup"))}
                className="font-bold text-amber-400 hover:text-amber-300 transition hover:underline cursor-pointer ml-1"
              >
                Create an account
              </button>
            </p>
          </div>

        </div>
      </Motion.div>
    </div>
  );
};

export default LoginForm;