import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../api/adminApi";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import InteractiveBackground from "../components/InteractiveBackground";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" }); // Validate on blur

  const onSubmit = async ({ password }) => {
    setServerError("");
    try {
      const response = await resetPassword({ token, password });
      setSuccessMessage(response.message || "Password has been reset successfully. You can now log in.");
      setTimeout(() => navigate("/login"), 5000);
    } catch (err) {
      setServerError(err.response?.data?.error || "Failed to reset password. The link may be invalid or expired.");
    }
  };

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValue = watch("password");

  const calculateStrength = (password) => {
    if (!password) return -1;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Clamp score to max 3 for our 4 levels (0, 1, 2, 3)
    return Math.min(score - 1, 3);
  };
  const passwordStrength = calculateStrength(passwordValue);

  // Variants for staggering animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <InteractiveBackground />
      <Motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-red-950/20 backdrop-blur"
      >
        <Motion.div variants={itemVariants}>
          <h1 className="text-3xl font-semibold text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-300">Enter your new password below.</p>
        </Motion.div>

        {serverError && <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{serverError}</p>}
        {successMessage && <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</p>}

        {!successMessage && (
          <>
            <div className="mt-6 space-y-5">
              <Motion.label variants={itemVariants} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">New Password</span>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...register("password", { required: "Password is required.", minLength: { value: 6, message: "Password must be at least 6 characters." } })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 pr-10 text-white outline-none transition focus:border-red-400"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                <PasswordStrengthIndicator strength={passwordStrength} />
              </Motion.label>
              <Motion.label variants={itemVariants} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Confirm New Password</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", { required: "Please confirm your password.", validate: value => value === watch('password') || "Passwords do not match." })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 pr-10 text-white outline-none transition focus:border-red-400"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </Motion.label>
            </div>
            <Motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Motion.button>
          </>
        )}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-300 transition hover:text-red-300">Back to Login</Link>
        </div>
      </Motion.form>
    </div>
  );
};

export default ResetPassword;