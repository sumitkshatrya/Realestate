import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminApi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await adminLogin({ email, password });
      localStorage.setItem("adminToken", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.24),_transparent_32%)]" />
      <Motion.form
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-red-950/20 backdrop-blur"
      >
        <Motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mb-8"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-red-300/80">
            Realestate Admin
          </p>
          <h1 className="text-3xl font-semibold text-white">Control Center</h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to manage testimonials, services, and dashboard data.
          </p>
        </Motion.div>

        {error && (
          <Motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </Motion.p>
        )}

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-red-400"
              placeholder="admin@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-red-400"
              placeholder="Enter your password"
              required
            />
          </label>
        </div>

        <Motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </Motion.button>
      </Motion.form>
    </div>
  );
};

export default Login;
