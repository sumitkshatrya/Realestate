import React from "react";

const strengthConfig = {
  0: { label: "Weak", color: "bg-red-500", textColor: "text-red-400" },
  1: { label: "Medium", color: "bg-amber-500", textColor: "text-amber-400" },
  2: { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-400" },
  3: { label: "Very Strong", color: "bg-emerald-500", textColor: "text-emerald-400" },
};

const PasswordStrengthIndicator = ({ strength = -1 }) => {
  if (strength < 0) {
    return null; // Don't show anything if there's no password
  }

  const { label, color, textColor } = strengthConfig[strength];
  const barCount = 4;

  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="grid flex-grow grid-cols-4 gap-2">
        {Array.from({ length: barCount }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-colors ${
              index <= strength ? color : "bg-slate-700"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColor}`}>{label}</p>
    </div>
  );
};

export default PasswordStrengthIndicator;