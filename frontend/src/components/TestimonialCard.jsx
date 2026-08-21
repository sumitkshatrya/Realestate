import React from "react";
import { FaStar } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
const buildMediaUrl = (path) =>
  path ? `${BACKEND_URL}${path}` : "https://via.placeholder.com/72";

export default function TestimonialCard({ testimonial }) {
  return (
    <article className="h-full flex flex-col overflow-hidden rounded-2xl border border-[var(--neutral-200)] bg-[var(--background-color)] p-6 shadow-lg transition-shadow hover:shadow-xl">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={buildMediaUrl(testimonial.profilePicture)}
          alt={testimonial.fullName}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--primary-color)]/50"
        />
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            {testimonial.fullName}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {testimonial.designation}
            {testimonial.companyName ? ` at ${testimonial.companyName}` : ""}
          </p>
        </div>
      </div>
      
      <div className="mb-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`
                ${i < testimonial.rating ? "text-[var(--accent-color)]" : "text-[var(--neutral-200)]"}
              `}
            />
          ))}
      </div>

      <blockquote className="flex-grow">
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          "{testimonial.feedback}"
        </p>
      </blockquote>

      {testimonial.mediaUrl && (
        <div className="mt-5 overflow-hidden rounded-lg bg-[var(--neutral-100)]">
          {testimonial.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img
              src={buildMediaUrl(testimonial.mediaUrl)}
              alt="Testimonial media"
              className="h-40 w-full object-cover"
            />
          ) : testimonial.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={buildMediaUrl(testimonial.mediaUrl)}
              controls
              className="h-40 w-full object-cover"
            />
          ) : null}
        </div>
      )}
    </article>
  );
}
