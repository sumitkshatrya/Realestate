import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { contactAPI } from "../api/contactApi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaTag, 
  FaPaperPlane, 
  FaClock, 
  FaLocationDot, 
  FaCircleCheck, 
  FaShieldHalved,
  FaArrowRight,
  FaLock,
  FaWandMagicSparkles
} from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Buying a Property",
  "Selling a Property",
  "Property Valuation",
  "Investment Advisory",
  "Other Questions",
];

const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        fullname: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 500) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to send a message to our team.");
      return;
    }

    if (!formData.fullname.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await contactAPI.sendMessage(formData);
      toast.success(data.message || "Your message has been sent successfully!");
      setIsSubmitted(true);
      setFormData((prev) => ({
        ...prev,
        phone: "",
        subject: "General Inquiry",
        message: "",
      }));
    } catch (err) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <FaWandMagicSparkles className="text-blue-400" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Let's Start a <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">Conversation</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Have questions about buying, selling, or evaluating properties? Our real estate specialists are ready to guide you.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl relative"
          >
            {/* User Auth Banner */}
            {isAuthenticated ? (
              <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs sm:text-sm text-blue-300">
                <FaCircleCheck className="text-blue-400 shrink-0 text-base" />
                <span>
                  Signed in as <strong className="text-white font-medium">{user?.username || user?.email}</strong>. Your message will be linked to your account.
                </span>
              </div>
            ) : (
              <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-xs sm:text-sm text-amber-300">
                <div className="flex items-center gap-2">
                  <FaLock className="text-amber-400 shrink-0" />
                  <span>Authentication required to submit inquiries.</span>
                </div>
                <Link to="/login" className="font-semibold underline hover:text-white shrink-0 ml-2">
                  Sign In
                </Link>
              </div>
            )}

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl">
                    <FaCircleCheck />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                    Thank you for reaching out. A real estate advisor has received your request and will contact you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white mb-2">Send Us a Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                          type="text"
                          name="fullname"
                          placeholder="John Doe"
                          value={formData.fullname}
                          onChange={handleChange}
                          required
                          disabled={!isAuthenticated || loading}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={!isAuthenticated || loading}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone (Optional) */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Phone Number <span className="text-slate-500">(Optional)</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isAuthenticated || loading}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Inquiry Topic <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={!isAuthenticated || loading}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50 appearance-none cursor-pointer"
                        >
                          {SUBJECT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-medium text-slate-400">
                        Your Message <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formData.message.length} / 500
                      </span>
                    </div>
                    <div className="relative">
                      <FaCommentAlt className="absolute left-3.5 top-3 text-slate-500 text-xs" />
                      <textarea
                        name="message"
                        placeholder="Tell us about your requirement or questions..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        disabled={!isAuthenticated || loading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-950/60 text-slate-100 placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isAuthenticated || loading}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <FaPaperPlane className="text-xs" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Contact Details & Guarantee */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Contact Cards */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-5">
              <h3 className="text-lg font-bold text-white">Direct Contact</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <FaPhone className="text-sm" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Phone Support</div>
                    <div className="text-sm font-semibold text-slate-200">+91 9528865099</div>
                    <div className="text-[11px] text-slate-500">Mon-Fri 8am - 8pm IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Email Inquiry</div>
                    <div className="text-sm font-semibold text-slate-200">skumar21082001@gmail.com</div>
                    <div className="text-[11px] text-slate-500">24/7 digital intake</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <FaLocationDot className="text-sm" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Headquarters</div>
                    <div className="text-sm font-semibold text-slate-200">100 Real Estate Blvd, Suite 400</div>
                    <div className="text-[11px] text-slate-500">India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Response Guarantee Pill */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <FaClock className="text-sm" />
                Response Guarantee
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our dedicated client support team guarantees an initial response within <strong className="text-white">2 business hours</strong> for all property inquiries.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400">
                <FaShieldHalved />
                <span>100% Privacy Protected & No Spam</span>
              </div>
            </div>

            {/* Quick Navigation Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Looking for something specific?</div>
                <div className="text-[11px] text-slate-400">Explore active property listings</div>
              </div>
              <a
                href="#properties"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition"
              >
                <span>Browse</span>
                <FaArrowRight className="text-[10px]" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
