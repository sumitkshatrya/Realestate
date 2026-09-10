import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTestimonialById } from "../api/testimonialApi";
import { motion as Motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaCheckCircle, FaArrowLeft, FaShareAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_APP_BASE_URL || "";

const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return `${BACKEND_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

const TestimonialDetail = () => {
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTestimonial = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchTestimonialById(id);
        const data = res?.data || res;
        if (!data) throw new Error("Testimonial not found");
        setTestimonial(data);
      } catch (err) {
        console.error("Failed to fetch testimonial:", err);
        setError(err?.message || "Failed to load testimonial spotlight.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTestimonial();
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Spotlight link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
        <div className="animate-pulse space-y-4 max-w-md w-full p-8 bg-white rounded-3xl border border-slate-200">
          <div className="h-16 w-16 bg-slate-200 rounded-full mx-auto" />
          <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="bg-slate-50 min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">{error || "The client story could not be retrieved."}</p>
          <Link to="/testimonials" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition">
            <FaArrowLeft className="text-xs" /> Back to All Stories
          </Link>
        </div>
      </div>
    );
  }

  const profileImage = getMediaUrl(testimonial.profilePicture) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
  const mediaUrl = getMediaUrl(testimonial.mediaUrl);
  const isImage = mediaUrl && /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(testimonial.mediaUrl || "");
  const isVideo = mediaUrl && /\.(mp4|webm|ogg|mov)$/i.test(testimonial.mediaUrl || "");
  const rating = Math.min(5, Math.max(0, Number(testimonial.rating) || 5));

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 text-slate-700 font-semibold text-sm hover:text-amber-600 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to All Testimonials
          </Link>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FaShareAlt /> Share Story
          </button>
        </div>

        {/* Spotlight Card */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden p-8 sm:p-12 relative"
        >
          <FaQuoteLeft className="absolute top-8 right-8 text-slate-100 text-8xl pointer-events-none" />

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 border-b border-slate-100 pb-8 text-center sm:text-left">
            <div className="relative shrink-0">
              <img
                src={profileImage}
                alt={testimonial.fullName || "Client"}
                className="h-24 w-24 rounded-3xl object-cover ring-4 ring-amber-400/50 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 text-xs shadow-md" title="Verified Client">
                <FaCheckCircle />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {testimonial.fullName || "Valued Client"}
                </h1>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider">
                  Verified Client
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-500 mt-1">
                {testimonial.designation || "Homeowner"}
                {testimonial.companyName ? ` • ${testimonial.companyName}` : ""}
              </p>

              {/* Rating Bar */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-base ${
                        i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          {testimonial.title && (
            <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">
              "{testimonial.title}"
            </h2>
          )}

          {/* Feedback */}
          <blockquote className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal italic mb-8">
            "{testimonial.feedback}"
          </blockquote>

          {/* Attached Media Showcase */}
          {mediaUrl && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                Attached Media Experience
              </h3>

              <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-[500px] flex items-center justify-center shadow-lg border border-slate-200">
                {isImage ? (
                  <img src={mediaUrl} alt="Client media" className="w-full max-h-[500px] object-contain" />
                ) : isVideo ? (
                  <video src={mediaUrl} controls className="w-full max-h-[500px]" />
                ) : (
                  <a href={mediaUrl} target="_blank" rel="noreferrer" className="p-6 text-amber-400 font-bold underline text-sm">
                    View Media Attachment
                  </a>
                )}
              </div>
            </div>
          )}
        </Motion.div>
      </div>
    </div>
  );
};

export default TestimonialDetail;
