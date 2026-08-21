import React from "react";
import { motion as Motion } from "framer-motion";

const PaginationControls = ({ currentPage, totalPages, onPageChange, isDisabled = false }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-center space-x-2">
      <Motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isDisabled}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </Motion.button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          disabled={currentPage === page || isDisabled}
          className={`rounded-xl border border-white/10 px-4 py-2 text-sm font-medium transition ${
            currentPage === page
              ? "bg-red-600 text-white"
              : "bg-white/5 text-slate-100 hover:bg-white/10"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {page}
        </Motion.button>
      ))}

      <Motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isDisabled}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </Motion.button>
    </div>
  );
};

export default PaginationControls;