import { useState, useEffect } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight,
} from "react-icons/fa";
import { adminLogin } from "../api/adminApi";
import InteractiveBackground from "../components/InteractiveBackground";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const data = await adminLogin(formData);
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }
      setSuccess(data.message || "Login successful!");
      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <InteractiveBackground />
      <Motion.form
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-red-950/20 backdrop-blur"
      >
        <div className="text-center mb-8">
          <Motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h2 className="text-4xl font-bold text-white">Admin Login</h2>
          </Motion.div>
          <p className="text-gray-400 mt-2 text-sm">Sign in to manage your dashboard</p>
        </div>

        <AnimatePresence>
          {error && (
            <Motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-200 text-sm"
            >
              {error}
            </Motion.div>
          )}
          {success && (
            <Motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-sm"
            >
              {success}
            </Motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-slate-900/70 text-white outline-none transition focus:border-red-400"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 bg-slate-900/70 text-white outline-none transition focus:border-red-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
        </div>

        <Motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
            />
          ) : (
            <>
              Sign In <FaArrowRight />
            </>
          )}
        </Motion.button>

        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-sm text-slate-300 transition hover:text-red-300">Forgot Password?</Link>
        </div>
      </Motion.form>
    </div>
  );
};

export default Login;

