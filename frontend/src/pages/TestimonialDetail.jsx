import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTestimonialById } from "../api/testimonialApi";
import { motion } from "framer-motion";

const TestimonialDetail = () => {
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState(null);

  useEffect(() => {
    const loadTestimonial = async () => {
      try {
        const res = await fetchTestimonialById(id);
        setTestimonial(res.data);
      } catch (err) {
        console.error("Failed to fetch testimonial:", err);
      }
    };
    loadTestimonial();
  }, [id]);

  if (!testimonial)
    return <p className="p-4 text-center text-gray-500">Loading...</p>;

  const BASE_URL = "http://localhost:5000";

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Profile Section */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-blue-400 to-indigo-500 p-1">
          <img
            src={
              testimonial.profilePicture
                ? `${BASE_URL}${testimonial.profilePicture}`
                : "https://via.placeholder.com/80"
            }
            alt="profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {testimonial.fullName}
          </h2>
          {testimonial.designation && (
            <p className="text-gray-500">{testimonial.designation}</p>
          )}
          {testimonial.companyName && (
            <p className="text-gray-400 text-sm">{testimonial.companyName}</p>
          )}
        </div>
      </div>

      {/* Testimonial Title */}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {testimonial.title}
      </h3>

      {/* Feedback */}
      <p className="text-gray-600 mb-4 whitespace-pre-line">{testimonial.feedback}</p>

      {/* Media */}
      {testimonial.mediaUrl && (
        <div className="mt-4 rounded overflow-hidden shadow-sm">
          {testimonial.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img
              src={`${BASE_URL}${testimonial.mediaUrl}`}
              alt="testimonial media"
              className="w-full max-h-96 object-cover rounded-lg"
            />
          ) : testimonial.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={`${BASE_URL}${testimonial.mediaUrl}`}
              controls
              className="w-full max-h-96 rounded-lg"
            />
          ) : (
            <a
              href={`${BASE_URL}${testimonial.mediaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Media
            </a>
          )}
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center mt-4">
        {[...Array(5)].map((_, idx) => (
          <span
            key={idx}
            className={`text-2xl ${
              idx < testimonial.rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-gray-600 font-medium">
          {testimonial.rating} / 5
        </span>
      </div>
    </motion.div>
  );
};

export default TestimonialDetail;
