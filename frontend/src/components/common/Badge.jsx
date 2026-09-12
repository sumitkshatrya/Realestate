import React from "react";

const Badge = ({ children, variant = "default", size = "md", className = "" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    sale: "bg-emerald-600 text-white font-extrabold shadow-sm",
    rent: "bg-blue-600 text-white font-extrabold shadow-sm",
    commercial: "bg-purple-600 text-white font-extrabold shadow-sm",
    available: "bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold",
    booked: "bg-amber-100 text-amber-900 border border-amber-200 font-bold",
    rented: "bg-blue-100 text-blue-900 border border-blue-200 font-bold",
    sold: "bg-rose-100 text-rose-900 border border-rose-200 font-bold",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase tracking-wider ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

