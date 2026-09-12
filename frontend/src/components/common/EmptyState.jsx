import React from "react";
import { FaBuildingCircleExclamation, FaHouseCircleCheck } from "react-icons/fa6";
import Button from "./Button";

const EmptyState = ({
  icon: Icon = FaHouseCircleCheck,
  title = "No properties found",
  description = "We couldn't find any properties matching your current search parameters. Try clearing filters.",
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

