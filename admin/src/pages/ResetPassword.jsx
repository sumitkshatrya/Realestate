import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
} from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { resetPassword } from "../api/adminApi";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";

const ResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const token = params.token || searchParams.get("token");

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });

  const passwordValue = watch("password");

  const calculateStrength = (password) => {
    if (!password) return -1;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return Math.min(score - 1, 3);
  };

  const passwordStrength = calculateStrength(passwordValue);

  const onSubmit = async ({ password }) => {
    setServerError("");
    setSuccessMessage("");

    if (!token) {
      setServerError(
        "Reset token is missing or invalid. Please request a new password reset link."
      );
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password,
      });

      setSuccessMessage(
        response.message ||
          "Password has been reset successfully. You can now log in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      setServerError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to reset password. The link may be invalid or expired."
      );
    }
  };

  /* =========================================
     ANIMATION VARIANTS
  ========================================= */

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* =========================================
          LUXURY VILLA BACKGROUND
      ========================================= */}

      <Motion.div
        className="absolute inset-0"
        initial={{
          opacity: 0,
          scale: 1.08,
        }}
        animate={{
          opacity: 1,
          scale: [1.08, 1.02, 1.08],
        }}
        transition={{
          opacity: {
            duration: 1.5,
          },
          scale: {
            duration: 20,
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

      {/* Cinematic overlays */}

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/40 to-red-950/60" />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

      {/* =========================================
          AMBIENT LIGHTS
      ========================================= */}

      <Motion.div
        className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-red-500/20 blur-3xl"
        animate={{
          x: [0, 180, 0],
          y: [0, 120, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Motion.div
        className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl"
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

      {/* =========================================
          FLOATING PARTICLES
      ========================================= */}

      {[...Array(18)].map((_, index) => (
        <Motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/50 shadow-lg shadow-white/30"
          style={{
            left: `${5 + ((index * 17) % 90)}%`,
            top: `${8 + ((index * 23) % 85)}%`,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, index % 2 === 0 ? 15 : -15, 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [0.6, 1.2, 0.6],
          }}
          transition={{
            duration: 3 + (index % 4),
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* =========================================
          FORM
      ========================================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">

        <Motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit(onSubmit)}
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

          {/* Card glow */}

          <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />

          {/* Animated light */}

          <Motion.div
            className="
              pointer-events-none
              absolute
              -left-40
              top-0
              h-full
              w-32
              rotate-12
              bg-white/10
              blur-xl
            "
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

          {/* =========================================
              HEADER
          ========================================= */}

          <Motion.div
            variants={itemVariants}
            className="relative mb-8 text-center"
          >

            <Motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-red-300/20
                bg-red-500/10
                shadow-lg
                shadow-red-900/30
              "
            >
              <FaLock className="text-2xl text-red-400" />
            </Motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Reset Password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Create a new secure password for your admin account.
            </p>
          </Motion.div>

          {/* =========================================
              SERVER ERROR
          ========================================= */}

          <AnimatePresence>
            {serverError && (
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
                className="
                  relative
                  mb-5
                  rounded-2xl
                  border
                  border-red-400/30
                  bg-red-500/10
                  px-4
                  py-4
                  text-sm
                  leading-6
                  text-red-200
                "
              >
                {serverError}
              </Motion.div>
            )}
          </AnimatePresence>

          {/* =========================================
              SUCCESS
          ========================================= */}

          <AnimatePresence>
            {successMessage && (
              <Motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                className="
                  relative
                  rounded-2xl
                  border
                  border-emerald-400/30
                  bg-emerald-500/10
                  px-5
                  py-6
                  text-center
                  text-emerald-200
                "
              >

                <Motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="mb-3"
                >
                  <FaCheckCircle className="mx-auto text-4xl text-emerald-400" />
                </Motion.div>

                <p className="text-sm leading-6">
                  {successMessage}
                </p>

                <Motion.div
                  animate={{
                    scaleX: [0, 1],
                  }}
                  transition={{
                    duration: 5,
                    ease: "linear",
                  }}
                  className="
                    mx-auto
                    mt-5
                    h-1
                    origin-left
                    rounded-full
                    bg-emerald-400/50
                  "
                />

                <p className="mt-3 text-xs text-emerald-300/70">
                  Redirecting you to login...
                </p>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* =========================================
              PASSWORD FORM
          ========================================= */}

          {!successMessage && (
            <>
              <div className="relative mt-6 space-y-5">

                {/* New password */}

                <Motion.label
                  variants={itemVariants}
                  className="block"
                >
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    New Password
                  </span>

                  <div className="group relative">

                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        duration-300
                        group-focus-within:text-red-400
                      "
                    />

                    <input
                      type={showNewPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters.",
                        },
                      })}
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
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(!showNewPassword)
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-white/5
                        hover:text-white
                      "
                    >
                      {showNewPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <Motion.p
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-2 text-xs text-red-400"
                    >
                      {errors.password.message}
                    </Motion.p>
                  )}

                  <Motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                  >
                    <PasswordStrengthIndicator
                      strength={passwordStrength}
                    />
                  </Motion.div>
                </Motion.label>

                {/* Confirm password */}

                <Motion.label
                  variants={itemVariants}
                  className="block"
                >
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Confirm New Password
                  </span>

                  <div className="group relative">

                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition-colors
                        duration-300
                        group-focus-within:text-red-400
                      "
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      {...register("confirmPassword", {
                        required:
                          "Please confirm your password.",
                        validate: (value) =>
                          value === passwordValue ||
                          "Passwords do not match.",
                      })}
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
                      placeholder="Confirm new password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-white/5
                        hover:text-white
                      "
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <Motion.p
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-2 text-xs text-red-400"
                    >
                      {errors.confirmPassword.message}
                    </Motion.p>
                  )}
                </Motion.label>
              </div>

              {/* =========================================
                  RESET BUTTON
              ========================================= */}

              <Motion.button
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 15px 40px rgba(220,38,38,0.35)",
                }}
                whileTap={{
                  scale: 0.97,
                }}
                type="submit"
                disabled={isSubmitting}
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

                {/* Moving shine */}

                <Motion.span
                  className="
                    absolute
                    inset-y-0
                    -left-20
                    w-16
                    rotate-12
                    bg-white/30
                    blur-md
                  "
                  animate={{
                    x: [-50, 450],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />

                {isSubmitting ? (
                  <>
                    <Motion.span
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="
                        relative
                        h-5
                        w-5
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />

                    <span className="relative">
                      Resetting...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative">
                      Reset Password
                    </span>

                    <Motion.span
                      className="relative"
                      animate={{
                        x: [0, 5, 0],
                      }}
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
            </>
          )}

          {/* =========================================
              BACK TO LOGIN
          ========================================= */}

          <Motion.div
            variants={itemVariants}
            className="relative mt-7 text-center"
          >
            <Link
              to="/login"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                text-slate-300
                transition-colors
                duration-300
                hover:text-red-300
              "
            >
              <Motion.span
                whileHover={{
                  x: -4,
                }}
              >
                <FaArrowLeft />
              </Motion.span>

              Back to Login
            </Link>
          </Motion.div>

          {/* Bottom animated line */}

          <Motion.div
            className="
              mx-auto
              mt-7
              h-px
              w-24
              bg-gradient-to-r
              from-transparent
              via-red-400/60
              to-transparent
            "
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

export default ResetPassword;