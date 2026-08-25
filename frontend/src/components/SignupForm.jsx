import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldHalved,
  FaWandMagicSparkles,
  FaBuildingCircleCheck,
  FaXmark,
} from "react-icons/fa6";
import { authAPI } from "../api/authApi";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    verificationMethod: "email",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  const luxuryBackgrounds = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Phone must be in E.164 format, e.g., +919999999999");
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.register(formData);
      setStep(2);
      setSuccess(data.message || "Account registered! Enter OTP to verify.");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!otp) {
      setError("Please enter the 6-digit OTP code.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.verifyOtp({
        email: formData.email,
        phone: formData.phone,
        verificationCode: otp,
      });
      setSuccess(data.message || "Account verified! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Invalid OTP code. Please try again.");
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
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-600/20 via-amber-500/20 to-purple-600/20 blur-3xl pointer-events-none"
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
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto z-10 custom-scrollbar"
      >
        <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/15 relative">
          
          {/* Close / Return Button */}
          <Motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            aria-label="Close"
          >
            <FaXmark className="text-base" />
          </Motion.button>

          {/* Header */}
          <div className="text-center mb-6">
            <Motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 mb-3 border border-amber-300/30 font-bold text-xl"
            >
              <FaBuildingCircleCheck />
            </Motion.div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {step === 1 ? "Create Account" : "Verify Account"}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {step === 1 ? "Join our luxury real estate network" : "Enter code sent to your email / phone"}
            </p>
          </div>

          {/* Error & Success Feedback Banners */}
          <AnimatePresence mode="wait">
            {error && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2"
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
                className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2"
              >
                <FaCheckCircle className="text-emerald-400 shrink-0 text-sm" />
                <span>{success}</span>
              </Motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* Step 1: Registration Form */
              <Motion.form
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                {/* Username */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Username
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Phone Number (E.164)
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+14155552671"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-8 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Confirm
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-8 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Verification Method */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Verification Mode
                  </label>
                  <div className="relative">
                    <FaWandMagicSparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <select
                      name="verificationMethod"
                      value={formData.verificationMethod}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium cursor-pointer"
                    >
                      <option value="email" className="bg-slate-900 text-white">Email Code</option>
                      <option value="sms" className="bg-slate-900 text-white">SMS Code</option>
                      <option value="call" className="bg-slate-900 text-white">Phone Call</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Register & Send Code"
                  )}
                </Motion.button>

                {/* Switch to Login */}
                <div className="pt-4 border-t border-slate-800 text-center">
                  <p className="text-xs text-slate-400 font-medium">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="font-bold text-amber-400 hover:text-amber-300 transition hover:underline cursor-pointer ml-1"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </Motion.form>
            ) : (
              /* Step 2: OTP Form */
              <Motion.form
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-400 font-medium">
                    Code sent to <span className="font-bold text-amber-400">{formData.email}</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 text-center">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full py-4 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-400 placeholder-slate-600 text-2xl font-mono font-extrabold text-center tracking-widest focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                    required
                  />
                </div>

                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Verify OTP & Finish"
                  )}
                </Motion.button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <FaArrowLeft className="text-[10px]" /> Back to Edit Info
                  </button>
                </div>
              </Motion.form>
            )}
          </AnimatePresence>

        </div>
      </Motion.div>
    </div>
  );
};

export default SignupForm;

