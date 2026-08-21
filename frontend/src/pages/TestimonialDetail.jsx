
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTestimonialById } from "../api/testimonialApi";
import { motion as Motion } from "framer-motion";

const TestimonialDetail = () => {
  const { id } = useParams();

  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // Create a proper media URL
  const getMediaUrl = (path) => {
    if (!path) return "";

    // If backend already returns a complete URL
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Prevent double slash
    return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  };

  useEffect(() => {
    const loadTestimonial = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetchTestimonialById(id);

        // Supports either:
        // res.data
        // res.data.data
        const testimonialData = res?.data?.data || res?.data;

        if (!testimonialData) {
          throw new Error("Testimonial not found");
        }

        setTestimonial(testimonialData);
      } catch (err) {
        console.error("Failed to fetch testimonial:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load testimonial."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTestimonial();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

          <p className="text-gray-500">
            Loading testimonial...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !testimonial) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">😕</div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Testimonial Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            {error || "The testimonial you're looking for doesn't exist."}
          </p>

          <Link
            to="/testimonials"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Testimonials
          </Link>
        </div>
      </div>
    );
  }

  const profileImage = getMediaUrl(testimonial.profilePicture);

  const mediaUrl = getMediaUrl(testimonial.mediaUrl);

  const isImage = /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(
    testimonial.mediaUrl || ""
  );

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(
    testimonial.mediaUrl || ""
  );

  const rating = Math.min(
    5,
    Math.max(0, Number(testimonial.rating) || 0)
  );

  return (
    <Motion.div
      className="max-w-3xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-r from-blue-400 to-indigo-500 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <img
                  src={
                    profileImage ||
                    "https://via.placeholder.com/80"
                  }
                  alt={testimonial.fullName || "Profile"}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/80";
                  }}
                />
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-800 break-words">
                {testimonial.fullName || "Anonymous"}
              </h2>

              {testimonial.designation && (
                <p className="text-gray-500 mt-1">
                  {testimonial.designation}
                </p>
              )}

              {testimonial.companyName && (
                <p className="text-gray-400 text-sm mt-0.5">
                  {testimonial.companyName}
                </p>
              )}
            </div>
          </div>

          {/* Testimonial Title */}
          {testimonial.title && (
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              {testimonial.title}
            </h3>
          )}

          {/* Feedback */}
          {testimonial.feedback && (
            <p className="text-gray-600 leading-7 whitespace-pre-line mb-5">
              {testimonial.feedback}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center mt-4">
            <div className="flex">
              {[...Array(5)].map((_, idx) => (
                <span
                  key={idx}
                  className={`text-2xl ${
                    idx < rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <span className="ml-2 text-gray-600 font-medium">
              {rating} / 5
            </span>
          </div>

          {/* Media */}
          {testimonial.mediaUrl && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Media
              </h4>

              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                {isImage && (
                  <img
                    src={mediaUrl}
                    alt="Testimonial media"
                    className="w-full max-h-[500px] object-contain bg-gray-50"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                {isVideo && (
                  <video
                    src={mediaUrl}
                    controls
                    preload="metadata"
                    className="w-full max-h-[500px] bg-black"
                  >
                    Your browser does not support video playback.
                  </video>
                )}

                {!isImage && !isVideo && (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 mb-3">
                      This testimonial contains a media file.
                    </p>

                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View Media
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
              ← Back to Testimonials
            </Link>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default TestimonialDetail;

