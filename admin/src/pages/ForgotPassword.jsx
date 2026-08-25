import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { forgotPassword } from "../api/adminApi";

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

      setMessage(
        response.message ||
          "If an account with that email exists, a password reset link has been sent."
      );
    } catch (error) {
      // Generic response prevents email enumeration
      setMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
    }
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

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Luxury red gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/40 to-red-950/60" />

      {/* Bottom shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

      {/* =========================================
          ANIMATED AMBIENT LIGHTS
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
          MAIN CONTENT
      ========================================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">

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

          {/* Moving light across card */}
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

          <div className="relative mb-8 text-center">

            <Motion.div
              initial={{
                opacity: 0,
                y: -25,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: 0.25,
                duration: 0.6,
              }}
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
                <FaEnvelope className="text-2xl text-red-400" />
              </Motion.div>
            </Motion.div>

            <Motion.h1
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.6,
              }}
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
              "
            >
              Forgot Password?
            </Motion.h1>

            <Motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 0.6,
              }}
              className="mt-3 text-sm leading-6 text-slate-300"
            >
              No worries. Enter your email and we'll send you
              a secure link to reset your password.
            </Motion.p>
          </div>

          {/* =========================================
              MESSAGE
          ========================================= */}

          <AnimatePresence mode="wait">
            {message && (
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
                  mb-6
                  rounded-2xl
                  border
                  border-emerald-400/30
                  bg-emerald-500/10
                  px-4
                  py-4
                  text-sm
                  leading-6
                  text-emerald-200
                  backdrop-blur-md
                "
              >
                {message}
              </Motion.div>
            )}
          </AnimatePresence>

          {/* =========================================
              EMAIL FIELD
          ========================================= */}

          {!message && (
            <Motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.55,
                duration: 0.6,
              }}
              className="relative"
            >
              <label className="block">

                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Email Address
                </span>

                <div className="group relative">

                  <FaEnvelope
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
                    type="email"
                    {...register("email", {
                      required: "Email is required.",
                    })}
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

                <AnimatePresence>
                  {errors.email && (
                    <Motion.p
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      className="mt-2 text-xs text-red-400"
                    >
                      {errors.email.message}
                    </Motion.p>
                  )}
                </AnimatePresence>

              </label>
            </Motion.div>
          )}

          {/* =========================================
              SEND BUTTON
          ========================================= */}

          {!message && (
            <Motion.button
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 0.6,
              }}
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

              {/* Button shine */}
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
                    Sending...
                  </span>
                </>
              ) : (
                <>
                  <span className="relative">
                    Send Reset Link
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
                    <FaPaperPlane />
                  </Motion.span>
                </>
              )}

            </Motion.button>
          )}

          {/* =========================================
              BACK TO LOGIN
          ========================================= */}

          <Motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.9,
            }}
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
                transition-all
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

          {/* Decorative animated line */}
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

export default ForgotPassword;