import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFocusTrap } from "../hooks/useFocusTrap";
import toast from "react-hot-toast";
import { testimonialAPI } from "../api/testimonialApi";
import { FaTimes, FaStar, FaPaperPlane } from "react-icons/fa";

const SubmitTestimonialModal = ({ isOpen, onClose, agent, onTestimonialSubmitted }) => {
  const modalRef = useFocusTrap(isOpen, onClose);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset form on open
      setRating(0);
      setFeedback("");
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }
    if (!feedback.trim()) {
      toast.error("Please write some feedback.");
      return;
    }

    setLoading(true);
    try {
      const response = await testimonialAPI.submitTestimonialForAgent({
        agentId: agent._id,
        rating,
        feedback,
      });
      toast.success("Thank you! Your testimonial has been submitted for review.");
      if (onTestimonialSubmitted) {
        onTestimonialSubmitted(response.data.testimonial);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl"
            role="dialog"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close modal">
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Leave a Review for {agent.username}</h2>
            <p className="text-slate-600 mb-6">Share your experience to help others.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-600">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    return (
                      <motion.div
                        key={starValue}
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starValue)}
                      >
                        <FaStar className={`cursor-pointer text-3xl transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-slate-300'}`} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-semibold mb-2 text-slate-600">Your Feedback</label>
                <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} required rows="5" className="form-input" placeholder="Describe your experience with the agent..."></textarea>
              </div>
              
              <button type="submit" disabled={loading} className="btn btn-primary w-full inline-flex items-center justify-center gap-2">
                {loading ? "Submitting..." : "Submit Review"}
                {!loading && <FaPaperPlane />}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitTestimonialModal;