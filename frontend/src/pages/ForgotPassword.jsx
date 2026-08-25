import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/authApi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaEnvelope, FaLock, FaKey, FaCheckCircle } from "react-icons/fa";
import { FaShieldHalved, FaXmark, FaBuildingCircleCheck } from "react-icons/fa6";
import aboutImage from "../assets/images/about.jpg";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: request code, 2: reset password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  const luxuryBackgrounds = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
  ];

  const floatingNodes = Array.from({ length: 12 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 35,
        y: (e.clientY / window.innerHeight - 0.5) * 35,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % luxuryBackgrounds.length);
    }, 8500);
    return () => clearInterval(interval);
  }, [luxuryBackgrounds.length]);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authAPI.requestPasswordReset({ email });
      setSuccess(response.message || "Reset code sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send reset code. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authAPI.resetPassword({ email, code, newPassword });
      setSuccess(response.message || "Password has been reset successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please verify your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 overflow-hidden bg-slate-950">
      
      <AnimatePresence mode="wait">
        <Motion.div
          key={bgIndex}
          initial={{ scale: 1.18, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.08, opacity: 0 }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${luxuryBackgrounds[bgIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </AnimatePresence>

      <Motion.div
        className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-slate-900/85 to-amber-950/70 backdrop-blur-md"
        animate={{
          opacity: [0.85, 0.95, 0.85],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Motion.div
        className="absolute w-[700px] h-[700px] rounded-full border border-amber-500/10 bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-transparent blur-3xl pointer-events-none"
        animate={{
          rotate: [0, 360],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <Motion.div
        className="absolute w-[550px] h-[550px] rounded-full bg-gradient-to-r from-amber-500/20 via-red-600/15 to-indigo-600/20 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x * 2.8,
          y: mousePosition.y * 2.8,
        }}
        transition={{
          type: "spring",
          damping: 24,
          stiffness: 55,
        }}
      />

      {floatingNodes.map((_, i) => (
        <Motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-400/40 blur-[1px] pointer-events-none"
          style={{
            left: `${15 + (i * 7)}%`,
            top: `${20 + (i * 6)}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      <Motion.div
        initial={{ opacity: 0, y: 35, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -35, scale: 0.94 }}
        transition={{
          type: "spring",
          damping: 22,
          stiffness: 220,
        }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/15 relative overflow-hidden">
          
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/25 blur-2xl pointer-events-none" />

          <Motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/login")}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
            aria-label="Close"
          >
            <FaXmark className="text-base" />
          </Motion.button>

          <div className="text-center mb-8">
            <Motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 mb-4 border border-amber-300/30 font-bold text-2xl"
            >
              <FaBuildingCircleCheck />
            </Motion.div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
              {step === 1 ? "Enter your registered email to receive a code" : `Code sent to ${email}`}
            </p>
          </div>

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
                <FaCheckCircle className="text-emerald-400 shrink-0 text-sm" />
                <span>{success}</span>
              </Motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* Step 1: Request Code Form */
              <Motion.form
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleRequestCode}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                      required
                    />
                  </div>
                </div>

                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Recovery Code <FaArrowRight className="text-xs" />
                    </>
                  )}
                </Motion.button>

                <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <FaArrowLeft className="text-[10px]" /> Return to Sign In
                  </button>
                </div>
              </Motion.form>
            ) : (
              /* Step 2: Reset Password Form */
              <Motion.form
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    5-Digit Reset Code
                  </label>
                  <div className="relative">
                    <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="12345"
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-400 placeholder-slate-600 text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
                      required
                    />
                  </div>
                </div>

                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Reset Password & Sign In"
                  )}
                </Motion.button>

                <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <FaArrowLeft className="text-[10px]" /> Back to Request Code
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

export default ForgotPassword;