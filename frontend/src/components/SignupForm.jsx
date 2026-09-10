import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaBuilding,
  FaTimes,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { authAPI } from "../api/authApi";

const luxuryBackgrounds = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
];

export default function SignupForm({ onClose, switchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    verificationMethod: "email",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Registration, 2 = Verification
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % luxuryBackgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { username, email, phone, password, confirmPassword } = formData;
    if (!username.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("All required fields must be completed.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be in E.164 format (e.g., +14155552671).");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.register(formData);
      setStep(2);
      setSuccess(response?.message || "Account created! Enter the verification code sent to you.");
    } catch (err) {
      setError(err?.message || "Registration failed. Please check your information and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim() || otp.length < 4) {
      setError("Please enter a valid verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyOtp({
        email: formData.email,
        phone: formData.phone,
        verificationCode: otp.trim(),
      });
      setSuccess(response?.message || "Verification successful! Redirecting to login...");
      setTimeout(() => {
        if (switchToLogin) {
          switchToLogin();
        } else {
          navigate("/login");
        }
      }, 1200);
    } catch (err) {
      setError(err?.message || "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden">
      {/* Background Slideshow Overlay */}
      <AnimatePresence mode="wait">
        <Motion.div
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${luxuryBackgrounds[bgIndex]})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60 pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <Motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl no-scrollbar max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition cursor-pointer"
          aria-label="Close"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 mb-3 border border-amber-300/30">
            <FaBuilding className="text-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {step === 1 ? "Create Account" : "Verify Account"}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {step === 1 ? "Join our luxury real estate platform" : "Enter the verification code sent to your details"}
          </p>
        </div>

        {/* Alert Feedback Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <Motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3.5 py-2.5 text-xs font-semibold text-rose-300"
            >
              <FaExclamationCircle className="shrink-0 text-sm" />
              <span>{error}</span>
            </Motion.div>
          )}
          {success && (
            <Motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2.5 text-xs font-semibold text-emerald-300"
            >
              <FaCheckCircle className="shrink-0 text-sm" />
              <span>{success}</span>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Signup Inputs */}
        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Username */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Phone (E.164) *
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+14155552671"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Verification Method */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Verification Method
                </label>
                <div className="relative">
                  <FaShieldAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <select
                    name="verificationMethod"
                    value={formData.verificationMethod}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none transition cursor-pointer appearance-none"
                  >
                    <option value="email" className="bg-slate-900 text-white">Email Code</option>
                    <option value="sms" className="bg-slate-900 text-white">SMS Code</option>
                    <option value="call" className="bg-slate-900 text-white">Phone Call</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition cursor-pointer text-xs"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition cursor-pointer text-xs"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? "Creating Account..." : "Register & Send Verification"}
            </button>

            {/* Sign In CTA */}
            <div className="pt-3 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={switchToLogin || (() => navigate("/login"))}
                  className="font-bold text-amber-400 hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-300">
                Code sent to <span className="font-bold text-amber-400">{formData.email}</span>
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center mb-1">
                Enter Verification Code *
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (error) setError("");
                }}
                placeholder="123456"
                maxLength={6}
                className="w-full py-3 rounded-xl border border-white/10 bg-slate-950/80 text-amber-400 placeholder-slate-600 text-xl font-mono font-bold text-center tracking-widest focus:border-amber-400 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP & Continue"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <FaArrowLeft className="text-[10px]" /> Back to Edit Details
              </button>
            </div>
          </form>
        )}
      </Motion.div>
    </div>
  );
}
