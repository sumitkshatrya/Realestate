import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaQuoteLeft, FaCheckCircle, FaPlay, FaExpandAlt } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_APP_BASE_URL || "";

const buildMediaUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export default function TestimonialCard({ testimonial, onOpenMedia }) {
  if (!testimonial) return null;

  const rating = Math.min(5, Math.max(0, Number(testimonial.rating) || 5));
  const profileImg = buildMediaUrl(testimonial.profilePicture);
  const mediaUrl = testimonial.mediaUrl ? buildMediaUrl(testimonial.mediaUrl) : null;
  const isVideo = mediaUrl && /\.(mp4|webm|ogg|mov)$/i.test(testimonial.mediaUrl || "");
  const isImage = mediaUrl && /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(testimonial.mediaUrl || "");

  const dateFormatted = testimonial.createdAt
    ? new Date(testimonial.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Verified Review";

  return (
    <article className="group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-md hover:shadow-2xl hover:border-amber-400/50 transition-all duration-300">
      {/* Subtle Quote Background Decor */}
      <FaQuoteLeft className="absolute top-6 right-6 text-slate-100 text-6xl group-hover:text-amber-500/10 transition-colors pointer-events-none" />

      <div>
        {/* Header: Client Info & Avatar */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative shrink-0">
            <img
              src={profileImg}
              alt={testimonial.fullName || "Client"}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-400/60 shadow-md group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
              }}
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] shadow-sm" title="Verified Client">
              <FaCheckCircle />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 truncate tracking-tight">
                {testimonial.fullName || "Valued Client"}
              </h3>
            </div>

            <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
              {testimonial.designation || "Homeowner"}
              {testimonial.companyName ? ` • ${testimonial.companyName}` : ""}
            </p>

            {/* Rating Stars & Badge */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xs ${
                      i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700 border border-amber-200">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Title / Headline */}
        {testimonial.title && (
          <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
            "{testimonial.title}"
          </h4>
        )}

        {/* Feedback Body */}
        <blockquote className="text-sm leading-relaxed text-slate-600 font-normal italic">
          "{testimonial.feedback}"
        </blockquote>

        {/* Media Preview (Photo / Video Attachment) */}
        {mediaUrl && (
          <div
            onClick={() => onOpenMedia && onOpenMedia(testimonial)}
            className="mt-5 relative overflow-hidden rounded-2xl bg-slate-950 h-44 cursor-pointer group/media border border-slate-200 shadow-inner"
          >
            {isImage ? (
              <img
                src={mediaUrl}
                alt="Client media attachment"
                className="h-full w-full object-cover group-hover/media:scale-105 transition-transform duration-500 opacity-90 hover:opacity-100"
              />
            ) : isVideo ? (
              <div className="relative h-full w-full flex items-center justify-center bg-slate-900">
                <video
                  src={mediaUrl}
                  className="h-full w-full object-cover opacity-60"
                  muted
                />
                <div className="absolute h-12 w-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg backdrop-blur-md group-hover/media:scale-110 transition-transform">
                  <FaPlay className="ml-1 text-sm" />
                </div>
              </div>
            ) : null}

            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
              <FaExpandAlt /> Preview Media
            </div>
          </div>
        )}
      </div>

      {/* Footer Link & Verification */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{dateFormatted}</span>
        {testimonial._id && (
          <Link
            to={`/testimonials/${testimonial._id}`}
            className="font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 group/link"
          >
            Read Story
            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        )}
      </div>
    </article>
  );
}
