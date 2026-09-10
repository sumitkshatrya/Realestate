import React, { useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { ArrowRight, Sparkles, Award } from "lucide-react";
import TestimonialCard from "../components/TestimonialCard";
import { testimonialAPI } from "../api/testimonialApi";

export default function Client() {
  const [testimonials, setTestimonials] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ avgRating: 0, total: 0 });
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMediaTestimonial, setSelectedMediaTestimonial] =
    useState(null);

  const limit = 6;

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await testimonialAPI.getApprovedTestimonials(page, limit);

        setTestimonials(Array.isArray(data?.testimonials) ? data.testimonials : []);
        setTotalPages(Number(data?.totalPages) || 1);
      } catch (err) {
        setError(err?.message || "Error fetching client testimonials.");
        setTestimonials([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [page]);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await testimonialAPI.getSummary();

        setSummary({
          avgRating: Number(data?.avgRating) || 0,
          total: Number(data?.total) || 0,
        });
      } catch (err) {
        console.error("Error fetching summary:", err);
        setSummary({ avgRating: 0, total: 0 });
      }
    };

    loadSummary();
  }, []);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((testimonial) => {
      const rating = Number(testimonial?.rating) || 0;

      if (activeFilter === "5star") return rating >= 5;
      if (activeFilter === "4star") return rating >= 4;
      if (activeFilter === "media") return Boolean(testimonial?.mediaUrl);

      return true;
    });
  }, [testimonials, activeFilter]);

  if (loading) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-3xl bg-slate-200/60 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="text-center py-12 px-4">
          <div className="max-w-md mx-auto bg-red-50 rounded-3xl border border-red-200 p-8">
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="bg-slate-50 py-24 border-t border-slate-200/60 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Client Success &amp; Reviews
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Homeowners &amp; Investors
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Real stories and verified experiences from clients who found their
            dream properties with our estate specialists.
          </p>
        </Motion.div>

        {/* Aggregate Satisfaction Dashboard Card */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-4xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-3xl font-black border border-amber-400/30 shrink-0">
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {summary.avgRating ? summary.avgRating.toFixed(1) : "4.9"}
                </span>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} className="text-amber-400 text-sm" />
                  ))}
                </div>
              </div>

              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                Overall Client Satisfaction Score
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="text-center md:text-left">
              <span className="text-2xl font-extrabold text-slate-900">
                {summary.total || testimonials.length}+
              </span>
              <p className="text-xs font-medium text-slate-500">
                Verified Reviews
              </p>
            </div>

            <div className="text-center md:text-left">
              <span className="text-2xl font-extrabold text-emerald-600">
                98%
              </span>
              <p className="text-xs font-medium text-slate-500">
                Recommendation Rate
              </p>
            </div>
          </div>
        </Motion.div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", label: "All Stories" },
            { id: "5star", label: "5 ★ Rating Only" },
            { id: "4star", label: "4+ ★ Rating" },
            { id: "media", label: "Photo & Video Reviews" },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                activeFilter === filter.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-slate-900">
              No Testimonials Yet
            </h3>
            <p className="text-slate-600 mt-2">
              Be the first to share your experience!
            </p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 max-w-md mx-auto shadow-sm">
            <p className="text-base font-bold text-slate-900">
              No matching reviews found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try switching your filter to see all client experiences.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Testimonials Grid */}
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {filteredTestimonials.map((testimonial, index) => (
                <Motion.div
                  key={testimonial?._id || testimonial?.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="h-full"
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    onOpenMedia={(item) =>
                      setSelectedMediaTestimonial(item)
                    }
                  />
                </Motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setPage(number)}
                      className={`h-10 w-10 rounded-xl font-extrabold text-xs transition ${
                        number === page
                          ? "bg-slate-900 text-white shadow-lg"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-3xl mx-auto shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Have you purchased or leased with us?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Share your story to help future homeowners make informed
              decisions.
            </p>
          </div>

          <Link to="/submit-testimonial" className="shrink-0">
            <Motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <FaPlus className="text-xs" />
              Write A Client Review
              <ArrowRight className="w-5 h-5" />
            </Motion.button>
          </Link>
        </div>
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
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close media preview"
                onClick={() => setSelectedMediaTestimonial(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <FaTimes />
              </button>

              <div className="mb-4 pr-10">
                <h3 className="text-xl font-bold">
                  {selectedMediaTestimonial.fullName}
                </h3>
                <p className="text-xs text-amber-400">
                  {selectedMediaTestimonial.designation}
                </p>
              </div>

              {selectedMediaTestimonial.mediaUrl && (
                <div className="rounded-2xl overflow-hidden max-h-[500px] bg-black flex items-center justify-center">
                  {/\.(mp4|webm|ogg|mov)$/i.test(
                    selectedMediaTestimonial.mediaUrl
                  ) ? (
                    <video
                      src={selectedMediaTestimonial.mediaUrl}
                      controls
                      autoPlay
                      className="w-full max-h-[500px]"
                    />
                  ) : (
                    <img
                      src={selectedMediaTestimonial.mediaUrl}
                      alt="Review attachment"
                      className="w-full max-h-[500px] object-contain"
                    />
                  )}
                </div>
              )}
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
