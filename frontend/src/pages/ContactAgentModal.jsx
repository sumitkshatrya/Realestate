import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { useFocusTrap } from "../hooks/useFocusTrap";
import toast from "react-hot-toast";
import { contactAPI } from "../api/contactApi";
import { FaTimes, FaUser, FaEnvelope, FaPaperPlane } from "react-icons/fa";

const ContactAgentModal = ({ isOpen, onClose, agent }) => {
  const { user, isAuthenticated } = useAuth();
  const modalRef = useFocusTrap(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: `Hello ${agent.username}, I'm interested in your listings and would like to know more.`,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || "",
        email: user.email || "",
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
      await contactAPI.contactAgent({
        ...formData,
        agentName: agent.username,
        agentEmail: agent.email, // Pass agent's email to backend
      });
      toast.success("Message sent successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
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
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <h2 id="contact-modal-title" className="text-2xl font-bold text-slate-900 mb-2">
              Contact {agent.username}
            </h2>
            <p className="text-slate-600 mb-6">Send a message directly to the agent.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="form-input pl-10" />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="form-input pl-10" />
              </div>
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows="5" className="form-input"></textarea>
              
              <button type="submit" disabled={loading} className="btn btn-primary w-full inline-flex items-center justify-center gap-2">
                {loading ? "Sending..." : "Send Message"}
                {!loading && <FaPaperPlane />}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactAgentModal;