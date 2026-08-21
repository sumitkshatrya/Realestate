import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/adminApi";
import InteractiveBackground from "../components/InteractiveBackground";

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setMessage("");
    try {
      const response = await forgotPassword({ email });
      setMessage(response.message || "If an account with that email exists, a password reset link has been sent.");
    } catch (error) {
      // We show a generic message even on error to prevent email enumeration
      setMessage("If an account with that email exists, a password reset link has been sent.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <InteractiveBackground />
      <Motion.form
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-red-950/20 backdrop-blur"
      >
        <h1 className="text-3xl font-semibold text-white">Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-300">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message ? (
          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            {message}
          </Motion.p>
        ) : (
          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
              <input
                type="email"
                {...register("email", { required: "Email is required." })}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="admin@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </label>
          </div>
        )}

        {!message && (
          <Motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Motion.button>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-300 transition hover:text-red-300">Back to Login</Link>
        </div>
      </Motion.form>
    </div>
  );
};

export default ForgotPassword;