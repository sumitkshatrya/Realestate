import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { 
  FaStar, 
  FaUpload, 
  FaCircleCheck, 
  FaArrowLeft, 
  FaXmark, 
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaBuilding,
  FaCommentDots,
  FaQuoteLeft,
  FaShieldHalved,
  FaWandMagicSparkles,
  FaImage
} from "react-icons/fa6";
import { submitTestimonial } from "../api/testimonialApi.js";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

const ratingLabels = {
  1: "Disappointing",
  2: "Fair",
  3: "Good & Reliable",
  4: "Very Good",
  5: "Exceptional",
};

const DESIGNATION_SUGGESTIONS = [
  "Home Buyer",
  "Home Seller",
  "Property Investor",
  "Tenant",
  "Commercial Client",
];

export default function SubmitTestimonial() {
  const { user, isAuthenticated } = useAuth();
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    designation: "Home Buyer",
    companyName: "",
    rating: 5,
    title: "",
    feedback: "",
    consent: false,
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.username || "",
        email: user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  const activeRating = hoverRating || form.rating;

  const handleChange = (field, value) => {
    if (field === "feedback" && value.length > 500) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be under 5MB.");
      return;
    }
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleMediaFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Attachment media must be under 10MB.");
      return;
    }
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Please provide your full name and email address.");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Please enter a review headline.");
      return;
    }
    if (!form.feedback.trim() || form.feedback.trim().length < 10) {
      toast.error("Please provide detailed feedback (at least 10 characters).");
      return;
    }
    if (!form.consent) {
      toast.error("Please accept consent to publish your review.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      if (profileFile) formData.append("profilePicture", profileFile);
      if (mediaFile) formData.append("media", mediaFile);

      await submitTestimonial(formData);

      setSuccess(true);
      setForm({
        fullName: isAuthenticated && user ? user.username || "" : "",
        email: isAuthenticated && user ? user.email || "" : "",
        designation: "Home Buyer",
        companyName: "",
        rating: 5,
        title: "",
        feedback: "",
        consent: false,
      });
      setProfileFile(null);
      setProfilePreview(null);
      setMediaFile(null);
      setMediaPreview(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Testimonial submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen pt-24 pb-20 text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 font-semibold text-xs transition duration-200 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-xs" />
            Back to Reviews
          </Link>
        </div>

        {/* Main Card */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Decorative Corner Icon */}
          <FaQuoteLeft className="absolute top-6 right-6 text-slate-800/40 text-5xl pointer-events-none" />

          {/* Header */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3">
              <FaWandMagicSparkles className="text-amber-400 text-xs" />
              Verified Client Review
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Share Your <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Experience</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Your feedback helps future clients navigate the real estate market with clarity and confidence.
            </p>

            {isAuthenticated && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300">
                <FaCircleCheck className="text-blue-400 text-xs" />
                <span>Logged in as <strong>{user?.username || user?.email}</strong></span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Interactive Rating Picker */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Overall Experience Rating <span className="text-amber-400">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = star <= activeRating;
                    return (
                      <Motion.button
                        type="button"
                        key={star}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleChange("rating", star)}
                        className="p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition cursor-pointer"
                      >
                        <FaStar
                          className={`text-2xl sm:text-3xl transition-colors ${
                            isActive ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-slate-800"
                          }`}
                        />
                      </Motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0">
                <span className="inline-block px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 font-extrabold text-xs">
                  {activeRating} / 5 — {ratingLabels[activeRating]}
                </span>
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              {/* Role / Designation */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Client Role / Relationship
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <select
                    value={form.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition appearance-none cursor-pointer"
                  >
                    {DESIGNATION_SUGGESTIONS.map((item) => (
                      <option key={item} value={item} className="bg-slate-900 text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Company / City */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Company or Location <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="text"
                    placeholder="e.g. New York, NY"
                    value={form.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Headline Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Review Headline <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <FaCommentDots className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Smooth transaction & fantastic advisory!"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            {/* Detailed Feedback Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-400">
                  Detailed Feedback <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {form.feedback.length} / 500
                </span>
              </div>
              <textarea
                rows={4}
                required
                placeholder="Share your experience regarding property search, agent communication, pricing guidance, and overall satisfaction..."
                value={form.feedback}
                onChange={(e) => handleChange("feedback", e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition resize-none leading-relaxed"
              />
            </div>

            {/* Media Uploads Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Profile Photo */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Profile Avatar <span className="text-slate-500">(Optional)</span>
                </label>
                {profilePreview ? (
                  <div className="relative p-2 rounded-xl bg-slate-950 border border-amber-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={profilePreview} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <span className="text-xs text-slate-300 font-medium truncate">Avatar Uploaded</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileFile(null);
                        setProfilePreview(null);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 text-xs transition cursor-pointer"
                    >
                      <FaXmark />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-amber-400/40 cursor-pointer transition text-xs text-slate-400 hover:text-slate-200">
                    <FaUpload className="text-amber-400 text-xs" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProfileFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Property Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Property Attachment <span className="text-slate-500">(Optional)</span>
                </label>
                {mediaPreview ? (
                  <div className="relative p-2 rounded-xl bg-slate-950 border border-amber-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FaImage className="text-amber-400 text-sm shrink-0" />
                      <span className="text-xs text-amber-300 font-medium truncate">Media Attached</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaFile(null);
                        setMediaPreview(null);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 text-xs transition cursor-pointer"
                    >
                      <FaXmark />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-amber-400/40 cursor-pointer transition text-xs text-slate-400 hover:text-slate-200">
                    <FaUpload className="text-amber-400 text-xs" />
                    <span>Attach Photo/Video</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleMediaFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Consent & Submit */}
            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  checked={form.consent}
                  onChange={(e) => handleChange("consent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition leading-relaxed">
                  I confirm this is an authentic client review based on genuine real estate services and consent to its public display upon moderation.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !form.consent}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Review</span>
                    <FaPaperPlane className="text-xs" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <FaShieldHalved className="text-emerald-400 text-xs" />
                <span>Screened for authenticity & anti-spam compliance</span>
              </div>
            </div>

          </form>
        </Motion.div>

      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4"
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mx-auto">
                <FaCircleCheck />
              </div>
              
              <h3 className="text-2xl font-bold text-white">Review Submitted!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Thank you for your valuable feedback. Your review will be published to the client portal following rapid staff moderation.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/testimonials"
                  onClick={() => setSuccess(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  Return to Reviews
                </Link>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Submit Another
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
