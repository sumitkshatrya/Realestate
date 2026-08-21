import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBath, FaBed, FaMapMarkerAlt, FaHeart, FaArrowRight } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

const PropertyCard = ({ property, onToggleFavorite, isFavorite }) => {
  const { _id, images, name, address, price, bed, bath, area } = property;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group overflow-hidden rounded-2xl border border-[var(--neutral-200)] bg-[var(--background-color)] shadow-lg"
    >
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${Array.isArray(images) && images.length > 0 ? images[0] : 'placeholder.jpg'})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {onToggleFavorite && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => onToggleFavorite(_id)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition ${
                isFavorite ? "bg-red-500/80" : "bg-slate-500/50"
              }`}
              aria-label={`Toggle favorite for ${name}`}
            >
              <FaHeart />
            </button>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-5 text-white">
          <h3 className="text-2xl font-bold">{name}</h3>
          <div className="mt-1 inline-flex items-center gap-2 text-sm">
            <FaMapMarkerAlt />
            <span>{address}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-2xl font-extrabold text-[var(--primary-color)] mb-4">{price}</p>
        <div className="grid grid-cols-3 gap-4 text-center border-y border-[var(--neutral-200)] py-4 mb-5">
          <div><FaBed className="mx-auto mb-1 text-2xl text-[var(--primary-color)]" /><p className="text-sm font-bold">{bed}</p><p className="text-xs text-[var(--text-secondary)]">Beds</p></div>
          <div><FaBath className="mx-auto mb-1 text-2xl text-[var(--primary-color)]" /><p className="text-sm font-bold">{bath}</p><p className="text-xs text-[var(--text-secondary)]">Baths</p></div>
          <div><MdSpaceDashboard className="mx-auto mb-1 text-2xl text-[var(--primary-color)]" /><p className="text-sm font-bold">{area}</p><p className="text-xs text-[var(--text-secondary)]">Area</p></div>
        </div>
        <RouterLink to={`/properties/${_id}`} className="btn btn-primary w-full inline-flex items-center justify-center gap-2">
          View Details <FaArrowRight className="text-xs" />
        </RouterLink>
      </div>
    </motion.div>
  );
};

export default PropertyCard;