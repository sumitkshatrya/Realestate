import React from "react";
import { FaArrowRight } from "react-icons/fa";

const BASE_URL = "http://localhost:8080";

const buildMediaUrl = (path) =>
  path ? `${BASE_URL}${path}` : "https://via.placeholder.com/72";

export default function TestimonialCard({ testimonial }) {
  return (
    <article className="h-full overflow-hidden rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.16)]">
      <div className="mb-5 flex items-center gap-4">
        <img
          src={buildMediaUrl(testimonial.profilePicture)}
          alt={testimonial.fullName}
          className="h-16 w-16 rounded-2xl object-cover ring-4 ring-rose-100"
        />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {testimonial.fullName}
          </h3>
          <p className="text-sm text-slate-500">
            {testimonial.designation}
            {testimonial.companyName ? ` • ${testimonial.companyName}` : ""}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
          {testimonial.rating}/5
        </div>
        <div className="flex items-center text-lg text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={testimonial.rating >= star ? "" : "opacity-30"}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <h4 className="font-serif text-2xl text-slate-900">{testimonial.title}</h4>
      <p className="mt-4 text-sm leading-7 text-slate-600 line-clamp-5">
        {testimonial.feedback}
      </p>

      {testimonial.mediaUrl && (
        <div className="mt-5 overflow-hidden rounded-[22px] bg-slate-100">
          {testimonial.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img
              src={buildMediaUrl(testimonial.mediaUrl)}
              alt="testimonial media"
              className="h-48 w-full object-cover"
            />
          ) : testimonial.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={buildMediaUrl(testimonial.mediaUrl)}
              controls
              className="h-48 w-full object-cover"
            />
          ) : (
            <a
              href={buildMediaUrl(testimonial.mediaUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 text-sm font-semibold text-rose-600"
            >
              View attached media
              <FaArrowRight className="text-xs" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
