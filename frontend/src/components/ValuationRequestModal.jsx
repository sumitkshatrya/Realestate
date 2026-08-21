import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { useFocusTrap } from "../hooks/useFocusTrap";
import toast from "react-hot-toast";
import { agentAPI } from "../api/agentApi";
import { FaTimes, FaHome, FaPaperPlane } from "react-icons/fa";

const ValuationRequestModal = ({ isOpen, onClose, agent }) => {
  const { user, isAuthenticated } = useAuth();
  const modalRef = useFocusTrap(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    propertyType: "Single Family",
    bedrooms: "",
    bathrooms: "",
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
    setLoading(true);
    try {
      await agentAPI.requestValuation({
        ...formData,
        agentId: agent._id,
      });
      toast.success("Valuation request sent successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to send request. Please try again.");
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
            className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="valuation-modal-title"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <h2 id="valuation-modal-title" className="text-2xl font-bold text-slate-900 mb-2">
              Request a Property Valuation
            </h2>
            <p className="text-slate-600 mb-6">Get an expert opinion from <span className="font-semibold">{agent.username}</span>.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Your Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="form-input" />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="form-input" />
              </div>
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="form-input" />

              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 pt-4">Property Details</h3>
              <input type="text" name="propertyAddress" placeholder="Property Address" value={formData.propertyAddress} onChange={handleChange} required className="form-input" />
              <div className="grid sm:grid-cols-3 gap-4">
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="form-input">
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Multi-Family</option>
                  <option>Land</option>
                </select>
                <input type="number" name="bedrooms" placeholder="Beds" value={formData.bedrooms} onChange={handleChange} required className="form-input" />
                <input type="number" name="bathrooms" placeholder="Baths" value={formData.bathrooms} onChange={handleChange} required className="form-input" />
              </div>
              <textarea name="message" placeholder="Additional notes for the agent (optional)" value={formData.message} onChange={handleChange} rows="3" className="form-input"></textarea>
              
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center gap-2">
                  {loading ? "Sending..." : "Send Request"}
                  {!loading && <FaPaperPlane />}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValuationRequestModal;