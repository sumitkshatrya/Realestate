import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/authApi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import aboutImage from "../assets/images/about.jpg";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter code and new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setError(err.message || "Failed to send reset code.");
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
      setSuccess(response.message || "Password has been reset successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundImage: `url(${aboutImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black bg-opacity-30"
      />
      <Motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-gray-900"
      >
        <AnimatePresence mode="wait">
          <Motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-6">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Forgot Password
                </h2>
                <p className="text-center text-gray-600">
                  Enter your email, and we'll send you a code to reset your password.
                </p>

                {error && <div className="p-3 rounded-lg bg-red-100 text-red-700 text-center">{error}</div>}
                {success && <div className="p-3 rounded-lg bg-green-100 text-green-700 text-center">{success}</div>}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 bg-white border-gray-300 text-gray-900"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  type="submit"
                  disabled={loading}
                >
                  {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Reset Your Password
                </h2>
                <p className="text-center text-gray-600">
                  A reset code was sent to <strong>{email}</strong>.
                </p>

                {error && <div className="p-3 rounded-lg bg-red-100 text-red-700 text-center">{error}</div>}
                {success && <div className="p-3 rounded-lg bg-green-100 text-green-700 text-center">{success}</div>}

                <div>
                  <label htmlFor="code" className="block text-sm font-semibold mb-2">Reset Code</label>
                  <input
                    id="code"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 bg-white border-gray-300 text-gray-900"
                    placeholder="Enter 5-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">New Password</label>
                  <input
                    id="newPassword"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 bg-white border-gray-300 text-gray-900"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  type="submit"
                  disabled={loading}
                >
                  {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </Motion.div>
        </AnimatePresence>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-red-600 font-semibold underline transition-colors duration-200"
          >
            Back to Login
          </button>
        </div>
      </Motion.div>
    </div>
  );
};

export default ForgotPassword;