import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBath, FaBed, FaMapMarkerAlt, FaHeart, FaArrowRight, FaEye } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

const getImageUrl = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const backendBase = (import.meta.env.VITE_BACKEND_URL || "http://localhost:8080").replace(/\/+$/, "");
  return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

const PropertyCard = ({ property, item, onToggleFavorite, onSelectProperty, isFavorite, isAuthenticated }) => {
  const prop = property || item || {};
  const { _id, images, name, address, price, bed, bath, area, type, category, purpose, status, latitude, longitude } = prop;

  const currentPurpose = (purpose || type || "buy").toLowerCase();
  const currentStatus = (status || "available").toLowerCase();

  const rawImage = Array.isArray(images) && images.length > 0 
    ? images[0] 
    : (typeof images === 'string' ? images : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80');
  const displayImage = getImageUrl(rawImage);

  const targetId = _id || prop.id;

  const handleOpenMap = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (onSelectProperty) {
      onSelectProperty(prop);
      return;
    }
    let url = "";
    if (typeof latitude === "number" && typeof longitude === "number" && !isNaN(latitude) && !isNaN(longitude)) {
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      url = `https://maps.google.com/?q=${latitude},${longitude}`;
    } else if (address) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      url = `https://maps.google.com/?q=${encodeURIComponent((name ? name + ", " : "") + address)}`;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Card Header & Image */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-900">
          <img
            src={displayImage}
            alt={name || "Luxury Property"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
            {/* Purpose Tag */}
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ${
                currentPurpose === "rent"
                  ? "bg-blue-600"
                  : currentPurpose === "commercial"
                  ? "bg-purple-600"
                  : "bg-emerald-600"
              }`}
            >
              {currentPurpose === "rent"
                ? "FOR RENT"
                : currentPurpose === "commercial"
                ? "COMMERCIAL"
                : "FOR SALE"}
            </span>

            {/* Category Tag */}
            {category && (
              <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-slate-200 border border-white/20 shadow-md">
                {category}
              </span>
            )}
          </div>

          {/* Availability Status Tag */}
          <div className="absolute top-4 right-16 z-10">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-md ${
                currentStatus === "sold"
                  ? "bg-rose-600 text-white"
                  : currentStatus === "rented"
                  ? "bg-blue-600 text-white"
                  : currentStatus === "booked"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-emerald-500/90 text-slate-950"
              }`}
            >
              {currentStatus}
            </span>
          </div>

          {/* Status Overlay for Sold / Rented / Booked */}
          {currentStatus !== "available" && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <span className="transform -rotate-6 border-2 border-white text-white font-black text-xl tracking-widest uppercase px-6 py-2 rounded-2xl shadow-2xl bg-slate-900/80">
                {currentStatus === "sold"
                  ? "SOLD"
                  : currentStatus === "rented"
                  ? "RENTED"
                  : "BOOKED"}
              </span>
            </div>
          )}

          {/* Favorite Heart Button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (targetId) onToggleFavorite(targetId);
              }}
              className={`absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer ${
                isFavorite
                  ? "bg-red-500 text-white scale-105"
                  : "bg-slate-900/60 text-white hover:bg-red-500 hover:text-white"
              }`}
              aria-label={`Save ${name} to favorites`}
            >
              <FaHeart className={`text-base transition-transform ${isFavorite ? "scale-110" : ""}`} />
            </button>
          )}

          {/* Bottom Title & Address overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
            <h3 className="text-xl font-bold tracking-tight truncate group-hover:text-amber-300 transition-colors">
              {name || "Exclusive Luxury Estate"}
            </h3>
            <button
              type="button"
              onClick={handleOpenMap}
              className="mt-1 flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 hover:underline transition-colors truncate cursor-pointer text-left"
              title="Click to view location on map"
            >
              <FaMapMarkerAlt className="text-amber-400 shrink-0" />
              <span className="truncate">{address || "Prime City Center Location"}</span>
            </button>
          </div>
        </div>

        {/* Card Body Specs */}
        <div className="p-6">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {price || "$1,250,000"}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {currentPurpose === "rent" ? "/ month" : "Est. Mortgage"}
            </span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-center mb-5 bg-slate-50/80 rounded-2xl">
            <div className="p-1">
              <div className="flex justify-center text-blue-600 mb-1">
                <FaBed className="text-lg" />
              </div>
              <p className="text-sm font-bold text-slate-900">{bed || 0}</p>
              <p className="text-[11px] font-medium text-slate-500">Beds</p>
            </div>
            <div className="p-1 border-x border-slate-200/60">
              <div className="flex justify-center text-blue-600 mb-1">
                <FaBath className="text-lg" />
              </div>
              <p className="text-sm font-bold text-slate-900">{bath || 0}</p>
              <p className="text-[11px] font-medium text-slate-500">Baths</p>
            </div>
            <div className="p-1">
              <div className="flex justify-center text-blue-600 mb-1">
                <MdSpaceDashboard className="text-lg" />
              </div>
              <p className="text-sm font-bold text-slate-900">{area || "N/A"}</p>
              <p className="text-[11px] font-medium text-slate-500">Area</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6 pt-0 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            handleOpenMap(e);
            if (onSelectProperty) onSelectProperty(prop);
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 hover:text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
          title="Open map location"
        >
          <FaMapMarkerAlt className="text-xs text-red-500" />
          Map
        </button>
        <RouterLink
          to={`/properties/${_id}`}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          View Details
          <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
        </RouterLink>
      </div>
    </motion.article>
  );
};

export default PropertyCard;