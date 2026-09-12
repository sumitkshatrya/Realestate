import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import Button from "./Button";

const ErrorState = ({
  title = "Something went wrong",
  message = "We ran into an issue loading this information. Please check your connection and try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-rose-50/50 rounded-3xl border border-rose-200/80 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <FaTriangleExclamation className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

