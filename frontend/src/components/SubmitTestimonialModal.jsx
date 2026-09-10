import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useFocusTrap } from "../hooks/useFocusTrap";
import toast from "react-hot-toast";
import { testimonialAPI } from "../api/testimonialApi";

import {
  FaTimes,
  FaStar,
  FaPaperPlane,
  FaCheckCircle,
  FaUserTie,
  FaShieldAlt,
} from "react-icons/fa";

const ratingLabels = {
  1: "Disappointing",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Exceptional",
};

const MAX_FEEDBACK_LENGTH = 1000;

const SubmitTestimonialModal = ({
  isOpen,
  onClose,
  agent,
  onTestimonialSubmitted,
}) => {
  const modalRef = useFocusTrap(isOpen, onClose);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const activeRating = hoverRating || rating;

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    setRating(5);
    setHoverRating(0);
    setFeedback("");
    setLoading(false);

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, loading, onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const trimmedFeedback = feedback.trim();

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!trimmedFeedback) {
      toast.error("Please write your review.");
      return;
    }

    if (trimmedFeedback.length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }

    if (trimmedFeedback.length > MAX_FEEDBACK_LENGTH) {
      toast.error(
        `Review cannot exceed ${MAX_FEEDBACK_LENGTH} characters.`
      );
      return;
    }

    if (!agent?._id) {
      toast.error("Agent information is unavailable.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await testimonialAPI.submitTestimonialForAgent({
          agentId: agent._id,
          rating,
          feedback: trimmedFeedback,
        });

      toast.success(
        "Thank you! Your review has been submitted successfully."
      );

      onTestimonialSubmitted?.(
        response?.data?.testimonial
      );

      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to submit your review. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  };

  const agentName =
    agent?.username ||
    agent?.fullName ||
    "Estate Specialist";

  const agentInitials = agentName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={handleBackdropClick}
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-slate-950/85
            backdrop-blur-xl
            p-3 sm:p-5
          "
          aria-hidden={!isOpen}
        >
          <Motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-modal-title"
            aria-describedby="testimonial-modal-description"
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            onMouseDown={(event) => event.stopPropagation()}
            className="
              relative
              w-full
              max-w-3xl
              overflow-hidden
              rounded-2xl
              border border-white/10
              bg-slate-900
              text-white
              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
            "
          >
            {/* =========================================================
                HEADER
            ========================================================== */}

            <div
              className="
                flex items-center justify-between
                border-b border-white/10
                px-4 py-3.5
                sm:px-5
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-amber-400/20
                    bg-amber-400/10
                    text-sm font-extrabold
                    text-amber-400
                  "
                >
                  {agentInitials || <FaUserTie />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2
                      id="testimonial-modal-title"
                      className="
                        truncate
                        text-sm font-extrabold
                        text-white
                        sm:text-base
                      "
                    >
                      Review {agentName}
                    </h2>

                    <FaCheckCircle
                      className="shrink-0 text-xs text-emerald-400"
                      title="Verified agent"
                    />
                  </div>

                  <p
                    id="testimonial-modal-description"
                    className="
                      mt-0.5 truncate
                      text-[11px]
                      text-slate-500
                    "
                  >
                    Share your experience with this estate specialist.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                aria-label="Close review modal"
                className="
                  ml-3
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-lg
                  border border-white/10
                  bg-white/[0.03]
                  text-slate-400
                  transition
                  hover:border-white/20
                  hover:bg-white/[0.08]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-5"
            >
              <div
                className="
                  mb-4
                  inline-flex items-center gap-2
                  rounded-full
                  border border-amber-400/15
                  bg-amber-400/[0.07]
                  px-2.5 py-1
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-amber-400
                "
              >
                <FaShieldAlt className="text-[9px]" />
                Verified Agent Review
              </div>

              <div
                className="
                  grid
                  gap-4
                  lg:grid-cols-[0.8fr_1.2fr]
                  lg:items-start
                "
              >
                <section
                  className="
                    rounded-xl
                    border border-white/10
                    bg-white/[0.025]
                    p-4
                  "
                >
                  <p
                    className="
                      mb-3
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-[0.16em]
                      text-slate-500
                    "
                  >
                    Your Rating
                  </p>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= activeRating;

                      return (
                        <button
                          key={star}
                          type="button"
                          aria-label={`${star} star${
                            star > 1 ? "s" : ""
                          }`}
                          aria-pressed={rating === star}
                          onMouseEnter={() =>
                            setHoverRating(star)
                          }
                          onMouseLeave={() =>
                            setHoverRating(0)
                          }
                          onFocus={() =>
                            setHoverRating(star)
                          }
                          onBlur={() =>
                            setHoverRating(0)
                          }
                          onClick={() =>
                            setRating(star)
                          }
                          className="
                            rounded-lg
                            p-1
                            transition
                            focus:outline-none
                            focus:ring-2
                            focus:ring-amber-400/50
                          "
                        >
                          <Motion.span
                            animate={{
                              scale: isActive ? 1.05 : 1,
                            }}
                            className="block"
                          >
                            <FaStar
                              className={`
                                text-2xl
                                transition-colors
                                sm:text-3xl
                                ${
                                  isActive
                                    ? "text-amber-400"
                                    : "text-slate-700"
                                }
                              `}
                            />
                          </Motion.span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                      className="
                        text-lg
                        font-black
                        text-white
                      "
                    >
                      {activeRating}/5
                    </span>

                    <span
                      className="
                        rounded-lg
                        border border-amber-400/15
                        bg-amber-400/[0.07]
                        px-2 py-1
                        text-[10px]
                        font-bold
                        text-amber-400
                      "
                    >
                      {ratingLabels[activeRating]}
                    </span>
                  </div>

                  <p className="mt-3 text-[10px] leading-relaxed text-slate-600">
                    Rate the agent based on communication,
                    professionalism, expertise, and service.
                  </p>
                </section>

                
                <section>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="feedback"
                      className="
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-[0.16em]
                        text-slate-400
                      "
                    >
                      Your Review
                      <span className="ml-1 text-amber-400">*</span>
                    </label>

                    <span
                      className={`
                        text-[10px]
                        font-semibold
                        ${
                          feedback.length > 900
                            ? "text-amber-400"
                            : "text-slate-600"
                        }
                      `}
                    >
                      {feedback.length}/{MAX_FEEDBACK_LENGTH}
                    </span>
                  </div>

                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(event) =>
                      setFeedback(
                        event.target.value.slice(
                          0,
                          MAX_FEEDBACK_LENGTH
                        )
                      )
                    }
                    required
                    rows={7}
                    maxLength={MAX_FEEDBACK_LENGTH}
                    disabled={loading}
                    placeholder="Describe your experience with this agent — responsiveness, negotiation, local expertise, professionalism..."
                    className="
                      block
                      w-full
                      resize-none
                      rounded-xl
                      border border-white/10
                      bg-slate-950/70
                      px-3.5 py-3
                      text-sm
                      leading-6
                      text-white
                      placeholder:text-slate-600
                      outline-none
                      transition
                      focus:border-amber-400/50
                      focus:ring-2
                      focus:ring-amber-400/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <p className="mt-1.5 text-[10px] text-slate-600">
                    Your review will help future clients make
                    better decisions.
                  </p>
                </section>
              </div>

              <div
                className="
                  mt-4
                  flex
                  flex-col-reverse
                  gap-2
                  border-t border-white/10
                  pt-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    px-4 py-2.5
                    text-xs
                    font-bold
                    text-slate-400
                    transition
                    hover:bg-white/[0.07]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    sm:w-auto
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !feedback.trim() ||
                    !agent?._id
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-amber-400
                    px-5 py-2.5
                    text-xs
                    font-extrabold
                    text-slate-950
                    shadow-lg
                    shadow-amber-400/10
                    transition
                    hover:bg-amber-300
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    sm:w-auto
                  "
                >
                  {loading ? (
                    <>
                      <span
                        className="
                          h-3.5 w-3.5
                          animate-spin
                          rounded-full
                          border-2
                          border-slate-950/30
                          border-t-slate-950
                        "
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Review
                      <FaPaperPlane className="text-[10px]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitTestimonialModal;