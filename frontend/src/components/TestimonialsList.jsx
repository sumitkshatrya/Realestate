import React, { useEffect, useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaSearch, FaStar, FaPlus, FaTimes, FaFilter, FaArrowLeft } from "react-icons/fa";
import TestimonialCard from "./TestimonialCard";
import { testimonialAPI } from "../api/testimonialApi.js";

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedMediaTestimonial, setSelectedMediaTestimonial] = useState(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const response = await testimonialAPI.getApprovedTestimonials(1, 50);
        setTestimonials(Array.isArray(response.testimonials) ? response.testimonials : []);
      } catch (err) {
        setError(err.message || "Error fetching client testimonials");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  // Filter & Sort logic
  const processedTestimonials = useMemo(() => {
    let result = (testimonials || []).filter((t) => {
      const matchesSearch =
        (t.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.feedback || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.designation || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.companyName || "").toLowerCase().includes(searchQuery.toLowerCase());

      const r = Number(t.rating) || 5;
      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "5star" && r >= 5) ||
        (ratingFilter === "4star" && r >= 4) ||
        (ratingFilter === "media" && Boolean(t.mediaUrl));

      return matchesSearch && matchesRating;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === "highest") {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      // 'recent' by default
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [testimonials, searchQuery, ratingFilter, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-700 font-semibold text-sm hover:text-blue-600 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <Link
            to="/submit-testimonial"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <FaPlus className="text-xs" />
            Write A Review
          </Link>
        </div>

        {/* Hero Header */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 inline-block mb-3">
              Verified Feedback
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Client Testimonials & Stories</h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              Explore firsthand accounts from clients who have bought, sold, or rented premium real estate with our agency.
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mb-10 space-y-4">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search reviews by name, keyword, or designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Rating Filter Selector */}
            <div className="md:col-span-3">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Star Ratings</option>
                <option value="5star">5 ★ Rating Only</option>
                <option value="4star">4+ ★ Rating</option>
                <option value="media">Photo & Video Reviews</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="recent">Sort by Most Recent</option>
                <option value="highest">Sort by Highest Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-slate-200/70 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-200 max-w-lg mx-auto">
            <p className="text-red-700 font-bold text-lg">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && processedTestimonials.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto shadow-sm p-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
              <FaSearch />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No Reviews Found</h3>
            <p className="text-slate-500 mt-2 text-sm">No client testimonials matched your active search or filter selection.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setRatingFilter("all");
              }}
              className="mt-6 px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && !error && processedTestimonials.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {processedTestimonials.map((t) => (
              <Motion.div
                key={t._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <TestimonialCard
                  testimonial={t}
                  onOpenMedia={(item) => setSelectedMediaTestimonial(item)}
                />
              </Motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Media Lightbox Modal */}
      <AnimatePresence>
        {selectedMediaTestimonial && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
            onClick={() => setSelectedMediaTestimonial(null)}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-6 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMediaTestimonial(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <FaTimes />
              </button>

              <div className="mb-4">
                <h3 className="text-xl font-bold">{selectedMediaTestimonial.fullName}</h3>
                <p className="text-xs text-amber-400">{selectedMediaTestimonial.designation}</p>
              </div>

              {selectedMediaTestimonial.mediaUrl && (
                <div className="rounded-2xl overflow-hidden max-h-[500px] bg-black flex items-center justify-center">
                  {/\.(mp4|webm|ogg|mov)$/i.test(selectedMediaTestimonial.mediaUrl) ? (
                    <video src={selectedMediaTestimonial.mediaUrl} controls autoPlay className="w-full max-h-[500px]" />
                  ) : (
                    <img src={selectedMediaTestimonial.mediaUrl} alt="Review media" className="w-full max-h-[500px] object-contain" />
                  )}
                </div>
              )}
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}