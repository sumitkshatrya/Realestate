import React from "react";

const BASE_URL = "http://localhost:5000"; // Backend base URL

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="border rounded-xl shadow-md p-5 bg-white hover:shadow-lg transition">
      {/* User Info */}
      <div className="flex items-center space-x-4 mb-3">
        <img
          src={
            testimonial.profilePicture
              ? `${BASE_URL}${testimonial.profilePicture}`
              : "https://via.placeholder.com/60"
          }
          alt={testimonial.fullName}
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <h2 className="font-bold text-lg">{testimonial.fullName}</h2>
          <p className="text-sm text-gray-500">
            {testimonial.designation}{" "}
            {testimonial.companyName && `• ${testimonial.companyName}`}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-md font-semibold mb-2">{testimonial.title}</h3>

      {/* Feedback (short preview) */}
      <p className="text-gray-700 text-sm line-clamp-3">{testimonial.feedback}</p>

      {/* Media Preview */}
      {testimonial.mediaUrl && (
        <div className="mt-3">
          {testimonial.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img
              src={`${BASE_URL}${testimonial.mediaUrl}`}
              alt="testimonial media"
              className="rounded-md w-full max-h-40 object-cover"
            />
          ) : testimonial.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={`${BASE_URL}${testimonial.mediaUrl}`}
              controls
              className="rounded-md w-full max-h-40"
            />
          ) : (
            <a
              href={`${BASE_URL}${testimonial.mediaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              View Media
            </a>
          )}
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center mt-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              testimonial.rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">{testimonial.rating}/5</span>
      </div>
    </div>
  );
}
