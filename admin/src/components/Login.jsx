import { useState, useEffect } from "react";
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* =========================================================
          VILLA BACKGROUND
      ========================================================== */}

      <Motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{
          scale: [1.08, 1.02, 1.08],
          opacity: 1,
        }}
        transition={{
          opacity: { duration: 1.5 },
          scale: {
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=90')",
          }}
        />
      </Motion.div>

      {/* =========================================================
          DARK LUXURY OVERLAY
      ========================================================== */}

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/45 to-red-950/50" />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

      {/* =========================================================
          ANIMATED LIGHT GLOW
      ========================================================== */}

      <Motion.div
        className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-red-500/20 blur-3xl"
        animate={{
          x: [0, 180, 0],
          y: [0, 120, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Motion.div
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl"
        animate={{
          x: [0, -160, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* =========================================================
          FLOATING LIGHT PARTICLES
      ========================================================== */}

      {[...Array(15)].map((_, index) => (
        <Motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/60 shadow-lg shadow-white/40"
          style={{
            left: `${5 + index * 6}%`,
            top: `${10 + ((index * 17) % 80)}%`,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, index % 2 === 0 ? 15 : -15, 0],
            opacity: [0.15, 0.8, 0.15],
            scale: [0.7, 1.2, 0.7],
          }}
          transition={{
            duration: 3 + (index % 4),
            repeat: Infinity,
            delay: index * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">

        {/* =======================================================
            LOGIN CARD
        ======================================================== */}

        <Motion.form
          initial={{
            opacity: 0,
            y: 80,
            scale: 0.85,
            rotateX: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          onSubmit={handleSubmit}
          className="
            relative
            w-full
            max-w-md
            overflow-hidden
            rounded-3xl
            border
            border-white/20
            bg-slate-950/60
            p-8
            shadow-2xl
            shadow-black/70
            backdrop-blur-2xl
          "
        >

          {/* Card animated shine */}

          <Motion.div
            className="pointer-events-none absolute -left-40 top-0 h-full w-32 rotate-12 bg-white/10 blur-xl"
            animate={{
              x: [-100, 600],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />

          {/* Top red glow */}

          <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />

          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="relative mb-8 text-center">

            <Motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Motion.div
                animate={{
                  y: [0, -6, 0],
                  rotate: [0, 1, 0, -1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-300/20 bg-red-500/10 shadow-lg shadow-red-900/30">
                  <span className="text-3xl">🏡</span>
                </div>
              </Motion.div>

              <h2 className="text-4xl font-bold tracking-tight text-white">
                Admin Login
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Welcome back. Manage your luxury properties.
              </p>
            </Motion.div>
          </div>

          {/* =====================================================
              ALERTS
          ====================================================== */}

          <AnimatePresence mode="wait">
            {error && (
              <Motion.div
                initial={{
                  opacity: 0,
                  y: -15,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                  scale: 0.95,
                }}
                className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200 backdrop-blur-md"
              >
                {error}
              </Motion.div>
            )}

            {success && (
              <Motion.div
                initial={{
                  opacity: 0,
                  y: -15,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                  scale: 0.95,
                }}
                className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200 backdrop-blur-md"
              >
                {success}
              </Motion.div>
            )}
          </AnimatePresence>

          {/* =====================================================
              EMAIL
          ====================================================== */}

          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </span>

              <div className="group relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-red-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/30
                    py-3.5
                    pl-11
                    pr-4
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition-all
                    duration-300
                    focus:border-red-400/70
                    focus:bg-black/40
                    focus:ring-4
                    focus:ring-red-500/10
                  "
                />
              </div>
            </label>
          </Motion.div>

          {/* =====================================================
              PASSWORD
          ====================================================== */}

          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </span>

              <div className="group relative">

                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-red-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/30
                    py-3.5
                    pl-11
                    pr-12
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition-all
                    duration-300
                    focus:border-red-400/70
                    focus:bg-black/40
                    focus:ring-4
                    focus:ring-red-500/10
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    p-2
                    text-slate-400
                    transition-all
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>
            </label>
          </Motion.div>

          {/* =====================================================
              LOGIN BUTTON
          ====================================================== */}

          <Motion.button
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 15px 40px rgba(220,38,38,0.35)",
            }}
            whileTap={{
              scale: 0.97,
            }}
            type="submit"
            disabled={isLoading}
            className="
              group
              relative
              mt-8
              flex
              w-full
              items-center
              justify-center
              gap-3
              overflow-hidden
              rounded-xl
              bg-gradient-to-r
              from-red-600
              via-red-500
              to-orange-500
              px-4
              py-3.5
              font-semibold
              text-white
              shadow-lg
              shadow-red-900/30
              transition-all
              duration-300
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >

            {/* Button shine */}

            <Motion.span
              className="absolute inset-y-0 -left-20 w-16 rotate-12 bg-white/30 blur-md"
              animate={{
                x: [-50, 450],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />

            {isLoading ? (
              <Motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative h-5 w-5 rounded-full border-2 border-white border-t-transparent"
              />
            ) : (
              <>
                <span className="relative">Sign In</span>

                <Motion.span
                  className="relative"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaArrowRight />
                </Motion.span>
              </>
            )}
          </Motion.button>

          {/* =====================================================
              FORGOT PASSWORD
          ====================================================== */}

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative mt-6 text-center"
          >
            <Link
              to="/forgot-password"
              className="text-sm text-slate-300 transition-colors duration-300 hover:text-red-300"
            >
              Forgot Password?
            </Link>
          </Motion.div>

          {/* Bottom decorative line */}

          <Motion.div
            className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-red-400/60 to-transparent"
            animate={{
              width: [96, 150, 96],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

        </Motion.form>
      </div>
    </div>
  );
};

export default Login;