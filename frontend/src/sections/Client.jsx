import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TestimonialCard from "../components/TestimonialCard";
import { testimonialAPI } from "../api/testimonialApi";

export default function Client() {
  const [testimonials, setTestimonials] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ avgRating: 0, total: 0 });

  const limit = 3;

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const data = await testimonialAPI.getApprovedTestimonials(page, limit);
        setTestimonials(data?.testimonials || []);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        setError(err.message || "Error fetching testimonials");
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
        setSummary(data || { avgRating: 0, total: 0 });
      } catch (err) {
        console.error("Error fetching summary", err);
        setSummary({ avgRating: 0, total: 0 });
      }
    };
    loadSummary();
  }, []);

  if (loading) {
    return <p className="text-center py-24 text-lg text-[var(--text-secondary)]">Loading Testimonials...</p>;
  }
  if (error) {
    return <p className="text-center py-24 text-lg text-red-500">{error}</p>;
  }

  return (
    <section id="testimonials" className="py-24 bg-[var(--neutral-100)]">
      <div className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)]">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl font-bold text-[var(--text-primary)] lg:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-[var(--text-secondary)]">
            Real stories from homeowners, investors, and partners who have trusted us with their vision.
          </p>
        </Motion.div>

        {summary.total > 0 && (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12 bg-[var(--background-color)] p-6 rounded-2xl text-center shadow-lg max-w-sm mx-auto"
          >
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Overall Satisfaction</h3>
            <p className="mt-2 text-3xl font-extrabold text-[var(--primary-color)]">
              ⭐ {summary.avgRating?.toFixed(1) || "N/A"} / 5
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Based on {summary.total} reviews</p>
          </Motion.div>
        )}

        {testimonials.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <Motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TestimonialCard testimonial={t} />
                </Motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      num === page
                        ? "bg-[var(--primary-color)] text-white shadow-lg scale-105"
                        : "bg-[var(--neutral-200)] text-[var(--text-primary)] hover:bg-[var(--neutral-300)]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">No Testimonials Yet</h3>
            <p className="text-[var(--text-secondary)] mt-2">Be the first to share your experience!</p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link to="/submit-testimonial">
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              Add Your Review
              <ArrowRight className="w-5 h-5" />
            </Motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
