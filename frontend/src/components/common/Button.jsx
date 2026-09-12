import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus-visible:ring-blue-600 active:scale-[0.98]",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus-visible:ring-slate-400 active:scale-[0.98]",
    accent:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md hover:shadow-lg focus-visible:ring-amber-500 active:scale-[0.98]",
    outline:
      "border border-slate-300 hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-400 active:scale-[0.98]",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus-visible:ring-slate-400",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-md focus-visible:ring-rose-600 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && Icon && iconPosition === "left" && <Icon className="shrink-0" />}
      {children}
      {!isLoading && Icon && iconPosition === "right" && <Icon className="shrink-0" />}
    </button>
  );
};

export default Button;

