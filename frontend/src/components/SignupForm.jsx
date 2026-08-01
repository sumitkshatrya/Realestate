import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import aboutImage from "../assets/images/about.jpg";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  verificationMethod: "email",
};

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (Object.values(formData).some((value) => !value)) return setError("All fields are required");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setSuccess(data.message || "Verification code sent");
      setStep(2);
    } catch (submitError) {
      setError(submitError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!otp) return setError("Please enter OTP");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, phone: formData.phone, verificationCode: otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed");
      setSuccess(data.message || "Account verified");
      setFormData(initialForm);
      setOtp("");
      setTimeout(() => navigate("/login"), 700);
    } catch (submitError) {
      setError(submitError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${aboutImage})` }} />
      <div className="absolute inset-0 bg-slate-950/65" />
      <Motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl backdrop-blur sm:p-8"
      >
        <Motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-red-600">Realestate</p>
          <h1 className="mt-3 text-center text-3xl font-bold text-slate-900">{step === 1 ? "Create Account" : "Verify OTP"}</h1>
          <AnimatePresence mode="wait">
            {error && <Motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</Motion.p>}
            {success && <Motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</Motion.p>}
          </AnimatePresence>
          {step === 1 ? (
            <form onSubmit={handleRegister} className="mt-6 space-y-3">
              {[
                ["username", "Username", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone (+919999999999)", "tel"],
                ["password", "Password", "password"],
                ["confirmPassword", "Confirm Password", "password"],
              ].map(([name, placeholder, type]) => (
                <input key={name} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100" name={name} type={type} placeholder={placeholder} value={formData[name]} onChange={handleChange} />
              ))}
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-red-500" name="verificationMethod" value={formData.verificationMethod} onChange={handleChange}>
                <option value="email">Verify by email</option><option value="sms">Verify by SMS</option><option value="call">Verify by call</option>
              </select>
              <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60" type="submit">{loading ? "Sending..." : "Register"}</Motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <input autoFocus className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center tracking-[0.5em] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" placeholder="Enter OTP" value={otp} onChange={(event) => setOtp(event.target.value)} />
              <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60" type="submit">{loading ? "Verifying..." : "Verify OTP"}</Motion.button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link className="font-semibold text-red-600 hover:underline" to="/login">Sign in</Link></p>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default SignupForm;
