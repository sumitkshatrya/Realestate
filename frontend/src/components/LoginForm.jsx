import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight,
} from "react-icons/fa";
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
  const navigate = useNavigate();

  // Background image URL
  const bgImageUrl = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const data = await login(formData);
      setSuccess(data.message || "Login successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-hidden">
      {/* Animated Background with Gradient */}
      <Motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Animated Gradient Overlay */}
      <Motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(236,72,153,0.3) 100%",
            "rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 50%, rgba(59,130,246,0.3) 100%",
            "rgba(236,72,153,0.3) 0%, rgba(59,130,246,0.3) 50%, rgba(139,92,246,0.3) 100%",
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
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 50,
        }}
      />

      {/* Main Card */}
      <Motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 200,
          duration: 0.8,
        }}
        className="relative w-full max-w-md"
      >
        <Motion.div
          whileHover={{ scale: 1.02, rotateY: 5 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-4 border-white/50"
        >
          {/* Animated Border Glow */}
          <Motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(59,130,246,0.3), 0 0 40px rgba(139,92,246,0.2)",
                "0 0 30px rgba(139,92,246,0.3), 0 0 60px rgba(236,72,153,0.2)",
                "0 0 20px rgba(236,72,153,0.3), 0 0 40px rgba(59,130,246,0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-1 rounded-3xl -z-10"
          />

          {/* Close Button */}
          <Motion.button
            whileHover={{ 
              scale: 1.2,
              rotate: 90,
              backgroundColor: "#ef4444",
              color: "white",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose || (() => navigate("/"))}
            className="absolute top-4 right-4 p-2 rounded-full z-10 transition-all duration-300 bg-gray-100 hover:bg-red-500 text-gray-700 hover:text-white w-10 h-10 flex items-center justify-center text-xl font-bold"
          >
            ×
          </Motion.button>

          {/* Header */}
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
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
              className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 mb-4"
            >
              <FaUser className="text-4xl text-blue-500" />
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
              className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Welcome Back!
            </Motion.h2>
            <p className="text-gray-500 mt-2 text-sm">Please sign in to continue</p>
          </Motion.div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <Motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="mb-4 p-3 rounded-lg bg-red-100 border-2 border-red-300 text-red-700 text-sm flex items-center gap-2"
              >
                {error}
              </Motion.div>
            )}
            {success && (
              <Motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="mb-4 p-3 rounded-lg bg-green-100 border-2 border-green-300 text-green-700 text-sm flex items-center gap-2"
              >
                {success}
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-blue-500" /> Username
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
                  <FaUser className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </Motion.div>
                <Motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-blue-500/20 outline-none"
                />
              </div>
            </Motion.div>

            {/* Password Field */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
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
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <FaLock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </Motion.div>
                <Motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password" // Fixed here
                  className="w-full px-12 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/20 outline-none"
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

            {/* Submit Button */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px -10px rgba(59,130,246,0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-300 disabled:opacity-50"
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
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Sign In <FaArrowRight />
                    </>
                  )}
                </span>
              </Motion.button>
            </Motion.div>
          </form>

          {/* Forgot Password */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-right"
          >
            <Motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-purple-500 hover:text-purple-600 font-semibold transition-colors duration-200"
            >
              Forgot Password?
            </Motion.button>
          </Motion.div>

          {/* Footer Links */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center space-y-2"
          >
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={switchToSignup || (() => navigate("/signup"))}
                className="text-blue-500 hover:text-blue-600 font-bold transition-colors duration-200"
              >
                Create account here
              </Motion.button>
            </p>
          </Motion.div>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default LoginForm;