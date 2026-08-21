import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaPhone, 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCheckCircle, 
  FaShieldAlt,
  FaMagic,
} from "react-icons/fa";
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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
      setSuccess(data.message);
    } catch (err) {
      setError(err.message || "Something went wrong");
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
      setError("Please enter OTP");
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.verifyOtp({
        email: formData.email,
        phone: formData.phone,
        verificationCode: otp,
      });
      setSuccess(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Villa Background Images
  const villaBackgrounds = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920",
   
  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % villaBackgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Villa Background */}
      <AnimatePresence mode="wait">
        <Motion.div
          key={bgIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${villaBackgrounds[bgIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </AnimatePresence>

      {/* Animated Gradient Overlay */}
      <Motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "rgba(0,0,0,0.5) 0%, rgba(59,130,246,0.15) 50%, rgba(139,92,246,0.15) 100%",
            "rgba(0,0,0,0.4) 0%, rgba(139,92,246,0.15) 50%, rgba(59,130,246,0.15) 100%",
            "rgba(0,0,0,0.5) 0%, rgba(59,130,246,0.15) 50%, rgba(139,92,246,0.15) 100%",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Mouse-following glow */}
      <Motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-yellow-400/10 via-purple-400/10 to-pink-400/10 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x * 3,
          y: mousePosition.y * 3,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 50,
        }}
      />

      {/* Header Label */}
      <Motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center"
      >
        <div className="bg-white/10 backdrop-blur-2xl px-8 py-3 rounded-full border border-white/20 shadow-2xl">
          <h1 className="text-white font-bold text-lg tracking-wider">
            LUXURY VILLA ESTATE
          </h1>
        </div>
      </Motion.div>

      {/* Main Signup Form */}
      <Motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
          duration: 0.8,
          delay: 0.2,
        }}
        className="relative z-20 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <Motion.div
          whileHover={{ 
            scale: 1.02, 
            rotateY: 5,
            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
          }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-white/50"
        >
          {/* Animated Border Glow */}
          <Motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(234,179,8,0.2), 0 0 60px rgba(147,51,234,0.1)",
                "0 0 40px rgba(147,51,234,0.2), 0 0 80px rgba(234,179,8,0.1)",
                "0 0 30px rgba(234,179,8,0.2), 0 0 60px rgba(147,51,234,0.1)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-1 rounded-3xl -z-10"
          />

          {/* Back Button */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <Motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors duration-300 group"
            >
              <Motion.div
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FaArrowLeft className="text-sm" />
              </Motion.div>
              <span className="font-medium">Back</span>
            </Motion.button>
          </Motion.div>

          {/* Header */}
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <Motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block p-4 rounded-full bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-pink-400/20 mb-4"
            >
              <FaUser className="text-4xl text-yellow-500" />
            </Motion.div>
            <Motion.h2
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              Join Luxury Living
            </Motion.h2>
            <p className="text-gray-500 mt-2 text-sm">Create your account to get started</p>
          </Motion.div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <Motion.form
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                {/* Error/Success Messages */}
                <AnimatePresence>
                  {error && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="p-3 rounded-lg bg-red-100 border-2 border-red-300 text-red-700 text-sm flex items-center gap-2"
                    >
                      {error}
                    </Motion.div>
                  )}
                  {success && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="p-3 rounded-lg bg-green-100 border-2 border-green-300 text-green-700 text-sm flex items-center gap-2"
                    >
                      <FaCheckCircle /> {success}
                    </Motion.div>
                  )}
                </AnimatePresence>

                {/* Username Field */}
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-yellow-500" /> Username
                  </label>
                  <div className="relative">
                    <Motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <FaUser className="text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                    </Motion.div>
                    <Motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-yellow-400/20 outline-none"
                      name="username"
                      type="text"
                      required
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </Motion.div>

                {/* Email Field */}
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-blue-500" /> Email
                  </label>
                  <div className="relative">
                    <Motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <FaEnvelope className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </Motion.div>
                    <Motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-yellow-400/20 outline-none"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </Motion.div>

                {/* Phone Field */}
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="group"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-green-500" /> Phone
                  </label>
                  <div className="relative">
                    <Motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6,
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <FaPhone className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    </Motion.div>
                    <Motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-yellow-400/20 outline-none"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+919999999999"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </Motion.div>

                {/* Password Field */}
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="group"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaLock className="text-purple-500" /> Password
                  </label>
                  <div className="relative">
                    <Motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.9,
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <FaLock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </Motion.div>
                    <Motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-yellow-400/20 outline-none"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <Motion.button
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Motion.button>
                  </div>
                </Motion.div>

                {/* Confirm Password Field */}
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="group"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaShieldAlt className="text-indigo-500" /> Confirm Password
                  </label>
                  <div className="relative">
                    <Motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.2,
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <FaShieldAlt className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </Motion.div>
                    <Motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-yellow-400/20 outline-none"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <Motion.button
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Motion.button>
                  </div>
                </Motion.div>

                {/* Verification Method */}
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="group"
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FaMagic className="text-pink-500" /> Verification Method
                  </label>
                  <Motion.select
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-yellow-400/20 outline-none cursor-pointer"
                    name="verificationMethod"
                    value={formData.verificationMethod}
                    onChange={handleChange}
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="call">Call</option>
                  </Motion.select>
                </Motion.div>

                {/* Submit Button */}
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px -10px rgba(234,179,8,0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 disabled:opacity-50"
                  >
                    {/* Shimmer Effect */}
                    <Motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                      style={{ width: "50%" }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <Motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          Join Luxury Living
                        </>
                      )}
                    </span>
                  </Motion.button>
                </Motion.div>

                {/* Login Link */}
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-center text-sm"
                >
                  <p className="text-gray-600">
                    Already a member?{" "}
                    <Motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-yellow-500 hover:text-yellow-600 font-bold transition-colors"
                    >
                      Login
                    </Motion.button>
                  </p>
                </Motion.div>
              </Motion.form>
            ) : (
              <Motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div className="text-center">
                  <Motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block p-4 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 mb-4"
                  >
                    <FaCheckCircle className="text-5xl text-green-500" />
                  </Motion.div>
                  <h3 className="text-2xl font-bold text-gray-800">Verify Your Account</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    We sent a verification code to{" "}
                    <span className="font-bold text-yellow-500">
                      {formData.email || formData.phone}
                    </span>
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="p-3 rounded-lg bg-red-100 border-2 border-red-300 text-red-700 text-sm flex items-center gap-2"
                    >
                      {error}
                    </Motion.div>
                  )}
                  {success && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="p-3 rounded-lg bg-green-100 border-2 border-green-300 text-green-700 text-sm flex items-center gap-2"
                    >
                      <FaCheckCircle /> {success}
                    </Motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                    Enter OTP
                  </label>
                  <Motion.input
                    whileFocus={{ scale: 1.02 }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-yellow-400/20 outline-none text-center text-2xl tracking-widest font-bold"
                    placeholder="XXXXXX"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                  />
                </div>

                <Motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px -10px rgba(16,185,129,0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    "Verify OTP"
                  )}
                </Motion.button>

                <div className="text-center">
                  <Motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-yellow-500 hover:text-yellow-600 font-bold transition-colors"
                  >
                    &larr; Back to Registration
                  </Motion.button>
                </div>
              </Motion.form>
            )}
          </AnimatePresence>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default SignupForm;
