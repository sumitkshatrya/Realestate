import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { contactAPI } from "../api/contactApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPaperPlane } from "react-icons/fa";

const ContactAgentForm = ({ agentName, propertyName, propertyId }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: `I am interested in the property "${propertyName}". Please send me more details.`,
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
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.contactAgent({
        ...formData,
        agentName,
        propertyName,
        propertyId,
      });
      toast.success("Your message has been sent!");
      // Reset message field after successful submission
      setFormData((prev) => ({
        ...prev,
        message: `I am interested in the property "${propertyName}". Please send me more details.`,
      }));
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-2xl border border-slate-200 bg-white shadow-md"
    >
      <h3 className="font-bold text-xl mb-4 text-slate-800">Contact Agent</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input pl-10"
          />
        </div>
        <div className="relative">
          <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input pl-10"
          />
        </div>
        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="form-input"
          ></textarea>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full inline-flex items-center justify-center gap-2">
          {loading ? "Sending..." : "Send Message"}
          {!loading && <FaPaperPlane />}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactAgentForm;