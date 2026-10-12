import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { useFocusTrap } from "./../hooks/useFocusTrap";
import toast from "react-hot-toast";
import { tourAPI } from "../api/tourApi";
import { FaTimes } from "react-icons/fa";

const ScheduleTourModal = ({ isOpen, onClose, property }) => {
  const { user, isAuthenticated } = useAuth();
  const modalRef = useFocusTrap(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to schedule a tour.");
      return;
    }
    setLoading(true);
    try {
      await tourAPI.scheduleTour({
        ...formData,
        propertyId: property._id,
        propertyName: property.name,
      });
      toast.success("Tour requested successfully! We will be in touch shortly.");
      onClose();
      setFormData({ name: user.username || "", email: user.email || "", phone: "", preferredDate: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to schedule tour. Please try again.");
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-modal-title"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <h2 id="tour-modal-title" className="text-2xl font-bold text-slate-900 mb-1">
              Schedule a Tour
            </h2>
            <p className="text-slate-600 text-sm mb-6">For: <span className="font-semibold text-blue-600">{property.name}</span></p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition font-medium"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition font-medium"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition font-medium"
                />
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition font-medium"
                />
              </div>
              <textarea
                name="message"
                placeholder="Any specific questions or requests?"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition font-medium resize-none"
              />
              
              <button
                type="submit"
                disabled={loading || !isAuthenticated}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Submitting..." : "Request Tour"}
              </button>
              {!isAuthenticated && (
                <p className="text-center text-xs text-red-600 font-semibold">
                  You must be logged in to request a tour.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleTourModal;