import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { contactAPI } from "../api/contactApi";
import { motion } from "framer-motion";
import { FaPaperPlane, FaEnvelope, FaPhone } from "react-icons/fa";

const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullname: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      setError("Please login to send a message.");
      return;
    }

    setLoading(true);
    try {
      const data = await contactAPI.sendMessage(formData);
      setSuccess(data.message || "Message sent successfully!");
      setFormData({ ...formData, message: "", phone: "" });
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[var(--background-color)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)]">
            Contact Us
          </span>
          <h2 className="mt-4 text-4xl font-bold text-[var(--text-primary)] lg:text-5xl">
            Let's Start a Conversation
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-[var(--text-secondary)]">
            Have a question or a project in mind? Our team is ready to listen and provide expert guidance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-[var(--neutral-100)] p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Send a Message</h3>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            {success && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4">{success}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleChange} required className="w-full px-4 py-3 rounded-md border border-[var(--neutral-200)] bg-[var(--background-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-md border border-[var(--neutral-200)] bg-[var(--background-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              <input type="tel" name="phone" placeholder="Phone (Optional)" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-md border border-[var(--neutral-200)] bg-[var(--background-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-4 py-3 rounded-md border border-[var(--neutral-200)] bg-[var(--background-color)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"></textarea>
              <button type="submit" disabled={loading || !user} className="btn btn-primary w-full disabled:bg-opacity-50 disabled:cursor-not-allowed">
                {loading ? "Sending..." : "Send Message"}
              </button>
              {!user && <p className="text-center text-sm text-[var(--text-secondary)]">You must be logged in to send a message.</p>}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Our Commitment</h3>
              <p className="mt-2 text-lg text-[var(--text-secondary)]">
                Our experts are dedicated to providing you with the insights and support you need. Whether you're planning your next transaction or just have a question, we're here to help you navigate the market with confidence.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xl">
                  <FaPhone />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">Call Us</h4>
                  <p className="text-[var(--text-secondary)]">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xl">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">Email Us</h4>
                  <p className="text-[var(--text-secondary)]">hello@realestate.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
