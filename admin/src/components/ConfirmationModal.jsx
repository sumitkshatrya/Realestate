import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

const VARIANTS = {
  danger: {
    icon: FaTrash,
    iconWrapper:
      "border-rose-400/20 bg-rose-500/10 text-rose-400",
    confirm:
      "border border-rose-400/20 bg-rose-500 text-white shadow-lg shadow-rose-950/30 hover:bg-rose-400",
    accent: "bg-rose-500",
  },

  warning: {
    icon: FaExclamationTriangle,
    iconWrapper:
      "border border-amber-400/20 bg-amber-500/10 text-amber-400",
    confirm:
      "border border-amber-400/20 bg-amber-500 text-white shadow-lg shadow-amber-950/30 hover:bg-amber-400",
    accent: "bg-amber-500",
  },

  success: {
    icon: FaCheck,
    iconWrapper:
      "border border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
    confirm:
      "border border-emerald-400/20 bg-emerald-500 text-white shadow-lg shadow-emerald-950/30 hover:bg-emerald-400",
    accent: "bg-emerald-500",
  },

  info: {
    icon: FaInfoCircle,
    iconWrapper:
      "border border-blue-400/20 bg-blue-500/10 text-blue-400",
    confirm:
      "border border-blue-400/20 bg-blue-500 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-400",
    accent: "bg-blue-500",
  },
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,

  title = "Confirm Action",
  message = "Are you sure you want to continue?",

  confirmText = "Confirm",
  cancelText = "Cancel",

  variant = "danger",

  isLoading = false,
  loadingText = "Processing...",

  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const config = VARIANTS[variant] || VARIANTS.danger;
  const Icon = config.icon;

  /* ---------------------------------------------------------------------- */
  /* ESCAPE KEY                                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, isLoading, onClose]);

  /* ---------------------------------------------------------------------- */
  /* BODY SCROLL LOCK                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /* ---------------------------------------------------------------------- */
  /* AUTO FOCUS                                                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  /* ---------------------------------------------------------------------- */
  /* CONFIRM                                                                */
  /* ---------------------------------------------------------------------- */

  const handleConfirm = async () => {
    if (isLoading) return;

    await onConfirm?.();
  };

  /* ---------------------------------------------------------------------- */
  /* BACKDROP                                                               */
  /* ---------------------------------------------------------------------- */

  const handleBackdropClick = () => {
    if (!closeOnBackdrop || isLoading) return;

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="presentation"
        >
          {/* ============================================================ */}
          {/* BACKDROP                                                      */}
          {/* ============================================================ */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onMouseDown={handleBackdropClick}
            aria-hidden="true"
          />

          {/* ============================================================ */}
          {/* MODAL                                                         */}
          {/* ============================================================ */}

          <motion.div
            ref={modalRef}
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-modal-title"
            aria-describedby="confirmation-modal-description"
            onMouseDown={(event) => event.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-2xl shadow-black/50"
          >
            {/* ======================================================== */}
            {/* TOP ACCENT                                               */}
            {/* ======================================================== */}

            <div
              className={`absolute inset-x-0 top-0 h-[2px] ${config.accent}`}
            />

            {/* ======================================================== */}
            {/* CLOSE BUTTON                                             */}
            {/* ======================================================== */}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close confirmation dialog"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaTimes className="text-sm" />
              </button>
            )}

            {/* ======================================================== */}
            {/* CONTENT                                                   */}
            {/* ======================================================== */}

            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4 pr-8">
                {/* Icon */}

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.05,
                    duration: 0.2,
                  }}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconWrapper}`}
                >
                  <Icon className="text-lg" />
                </motion.div>

                {/* Heading */}

                <div className="min-w-0 flex-1">
                  <h2
                    id="confirmation-modal-title"
                    className="text-lg font-bold tracking-tight text-white"
                  >
                    {title}
                  </h2>

                  <p
                    id="confirmation-modal-description"
                    className="mt-2 text-sm leading-6 text-slate-400"
                  >
                    {message}
                  </p>
                </div>
              </div>

              {/* ====================================================== */}
              {/* WARNING MESSAGE                                        */}
              {/* ====================================================== */}

              {variant === "danger" && (
                <div className="mt-5 rounded-xl border border-rose-400/10 bg-rose-500/[0.04] px-4 py-3">
                  <div className="flex gap-3">
                    <FaExclamationTriangle className="mt-0.5 shrink-0 text-xs text-rose-400" />

                    <p className="text-xs leading-5 text-slate-400">
                      This action may permanently change or remove
                      this data. Please verify before continuing.
                    </p>
                  </div>
                </div>
              )}

              {/* ====================================================== */}
              {/* ACTIONS                                                 */}
              {/* ====================================================== */}

              <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <motion.button
                  ref={cancelButtonRef}
                  type="button"
                  whileHover={!isLoading ? { y: -1 } : undefined}
                  whileTap={!isLoading ? { scale: 0.98 } : undefined}
                  onClick={onClose}
                  disabled={isLoading}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {cancelText}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={!isLoading ? { y: -1 } : undefined}
                  whileTap={!isLoading ? { scale: 0.98 } : undefined}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50 ${config.confirm}`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      {loadingText}
                    </>
                  ) : (
                    <>
                      {variant === "danger" && (
                        <FaTrash className="text-xs" />
                      )}

                      {confirmText}
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BOTTOM SHINE                                             */}
            {/* ======================================================== */}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/[0.015] to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;