import React, { useMemo } from "react";
import {
  FaCheck,
  FaCircle,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";

const strengthConfig = {
  0: {
    label: "Weak",
    description: "Your password is easy to guess.",
    color: "bg-rose-500",
    textColor: "text-rose-400",
    borderColor: "border-rose-400/20",
    bgColor: "bg-rose-500/5",
  },

  1: {
    label: "Medium",
    description: "Consider making your password longer.",
    color: "bg-amber-500",
    textColor: "text-amber-400",
    borderColor: "border-amber-400/20",
    bgColor: "bg-amber-500/5",
  },

  2: {
    label: "Strong",
    description: "Good password strength.",
    color: "bg-emerald-500",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-500/5",
  },

  3: {
    label: "Very Strong",
    description: "Excellent password strength.",
    color: "bg-emerald-500",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-500/5",
  },
};

const PasswordStrengthIndicator = ({
  strength = -1,

  password = "",

  showRequirements = true,
  showDescription = true,
}) => {
  /* ---------------------------------------------------------------------- */
  /* NO PASSWORD                                                            */
  /* ---------------------------------------------------------------------- */

  if (!password || strength < 0) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* NORMALIZE STRENGTH                                                     */
  /* ---------------------------------------------------------------------- */

  const normalizedStrength = Math.min(
    Math.max(Number(strength) || 0, 0),
    3
  );

  const config =
    strengthConfig[normalizedStrength] ||
    strengthConfig[0];

  /* ---------------------------------------------------------------------- */
  /* PASSWORD REQUIREMENTS                                                  */
  /* ---------------------------------------------------------------------- */

  const requirements = useMemo(() => {
    return [
      {
        label: "8+ characters",
        valid: password.length >= 8,
      },
      {
        label: "Uppercase letter",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "Lowercase letter",
        valid: /[a-z]/.test(password),
      },
      {
        label: "Number",
        valid: /\d/.test(password),
      },
      {
        label: "Special character",
        valid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }, [password]);

  const completedRequirements =
    requirements.filter((item) => item.valid).length;

  return (
    <div className="mt-3 space-y-3">
      {/* ================================================================== */}
      {/* STRENGTH HEADER                                                     */}
      {/* ================================================================== */}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <FaShieldAlt
            className={`shrink-0 text-xs ${config.textColor}`}
          />

          <span className="text-xs font-semibold text-slate-400">
            Password strength
          </span>
        </div>

        <span
          className={`shrink-0 text-xs font-bold ${config.textColor}`}
        >
          {config.label}
        </span>
      </div>

      {/* ================================================================== */}
      {/* STRENGTH BARS                                                       */}
      {/* ================================================================== */}

      <div
        className="grid grid-cols-4 gap-1.5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={normalizedStrength}
        aria-label={`Password strength: ${config.label}`}
      >
        {Array.from({ length: 4 }).map((_, index) => {
          const isActive = index <= normalizedStrength;

          return (
            <div
              key={index}
              className={`h-1.5 overflow-hidden rounded-full ${
                isActive
                  ? config.color
                  : "bg-slate-800"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-full"
                    : "w-0"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* DESCRIPTION                                                         */}
      {/* ================================================================== */}

      {showDescription && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${config.borderColor} ${config.bgColor}`}
        >
          {normalizedStrength <= 1 ? (
            <FaExclamationTriangle
              className={`shrink-0 text-[10px] ${config.textColor}`}
            />
          ) : (
            <FaCheck
              className={`shrink-0 text-[10px] ${config.textColor}`}
            />
          )}

          <p className="text-[11px] leading-5 text-slate-500">
            {config.description}
          </p>
        </div>
      )}

      {/* ================================================================== */}
      {/* REQUIREMENTS                                                        */}
      {/* ================================================================== */}

      {showRequirements && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
              Requirements
            </span>

            <span className="text-[10px] font-semibold text-slate-600">
              {completedRequirements}/{requirements.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {requirements.map((requirement) => (
              <div
                key={requirement.label}
                className="flex items-center gap-2"
              >
                {requirement.valid ? (
                  <FaCheck className="text-[8px] text-emerald-400" />
                ) : (
                  <FaCircle className="text-[5px] text-slate-700" />
                )}

                <span
                  className={`text-[10px] ${
                    requirement.valid
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                >
                  {requirement.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;