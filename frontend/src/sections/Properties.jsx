import React, { useEffect, useState, useCallback } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaArrowRight,
  FaBath,
  FaBed,
  FaHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi.js";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";

const PropertyCard = React.memo(({ item, onToggleFavorite, onSelectProperty, isFavorite, isAuthenticated }) => {
  return (
    <Motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group overflow-hidden rounded-2xl border border-[var(--neutral-200)] bg-[var(--background-color)] shadow-lg transition-shadow hover:shadow-2xl"
    >
      <div
        className="relative h-64 bg-cover bg-center"
        // Use the first image for the card, with a fallback.
        style={{ backgroundImage: `url(${Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'placeholder.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onToggleFavorite(item._id)}
            disabled={!isAuthenticated}
            className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition disabled:cursor-not-allowed ${
              isFavorite ? "bg-red-500/80 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
            aria-label={`Save ${item.name}`}>
            <FaHeart className="transition-transform group-hover:scale-110" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 p-5 text-white">
          <h3 className="text-2xl font-bold">{item.name}</h3>
          <div className="mt-1 inline-flex items-center gap-2 text-sm">
            <FaMapMarkerAlt />
            <span>{item.address}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <p className="text-2xl font-extrabold text-[var(--primary-color)]">{item.price}</p>
            <span className="rounded-full bg-[var(--primary-color)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary-color)]">For Sale</span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-y border-[var(--neutral-200)] py-4 mb-5">
          <div key="beds"><div className="mx-auto mb-1 text-2xl text-[var(--primary-color)]"><FaBed /></div><p className="text-sm font-bold text-[var(--text-primary)]">{item.bed}</p><p className="text-xs text-[var(--text-secondary)]">Beds</p></div>
          <div key="baths"><div className="mx-auto mb-1 text-2xl text-[var(--primary-color)]"><FaBath /></div><p className="text-sm font-bold text-[var(--text-primary)]">{item.bath}</p><p className="text-xs text-[var(--text-secondary)]">Baths</p></div>
          <div key="area"><div className="mx-auto mb-1 text-2xl text-[var(--primary-color)]"><MdSpaceDashboard /></div><p className="text-sm font-bold text-[var(--text-primary)]">{item.area}</p><p className="text-xs text-[var(--text-secondary)]">Area</p></div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => onSelectProperty(item)} className="btn btn-secondary w-full text-center">Map</button>
          <RouterLink to={`/properties/${item._id}`} className="btn btn-primary w-full inline-flex items-center justify-center gap-2">Details <FaArrowRight className="text-xs" /></RouterLink>
        </div>
      </div>
    </Motion.article>
  );
});

const Properties = ({ searchCriteria, setSearchCriteria }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearchCriteria = useDebounce(searchCriteria, 500);
  const { user, isAuthenticated, updateUser, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.searchProperties(debouncedSearchCriteria);
        const fetchedProperties = data?.data || [];
        setProperties(fetchedProperties);

        // Update selected property based on search results
        if (fetchedProperties.length > 0 && !fetchedProperties.find(p => p._id === selectedProperty?._id)) {
          setSelectedProperty(fetchedProperties[0]);
        } else if (fetchedProperties.length === 0) {
          setSelectedProperty(null);
        }
      } catch (err) {
        setError("Failed to load properties. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [debouncedSearchCriteria, selectedProperty?._id]);

  const mapUrl = selectedProperty ? `https://www.openstreetmap.org/export/embed.html?bbox=${selectedProperty.longitude - 0.08}%2C${selectedProperty.latitude - 0.05}%2C${selectedProperty.longitude + 0.08}%2C${selectedProperty.latitude + 0.05}&layer=mapnik&marker=${selectedProperty.latitude}%2C${selectedProperty.longitude}` : "";

  const handleToggleFavorite = useCallback(async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to save favorites.");
      return;
    }
    if (authLoading) {
      toast.error("Please wait until your session is verified.");
      return;
    }
    const isCurrentlyFavorite = user?.favorites?.includes(propertyId);
    try {
      const response = await userAPI.toggleFavorite(propertyId);
      updateUser({ favorites: response.data.favorites });
      if (isCurrentlyFavorite) {
        toast.success("Removed from favorites!");
      } else {
        toast.success("Added to favorites!");
      }
    } catch (err) {
      console.error("Failed to update favorites:", err);
      toast.error("Failed to update favorites.");
    }
  }, [isAuthenticated, updateUser, user, authLoading]);

  return (
    <section id="properties" className="bg-[var(--neutral-100)] py-24">
      <div className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)]">
            Featured Collection
          </span>
          <h2 className="mt-4 text-4xl font-bold text-[var(--text-primary)] lg:text-5xl">
            Curated for Quality & Comfort
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg leading-8 text-[var(--text-secondary)]">
            Browse standout listings curated for design, quality, and long-term value, giving you a sharper starting point on your journey.
          </p>
        </Motion.div>

        <div className="mb-10">
          <input
            type="text"
            placeholder="Search by property name or address..."
            value={searchCriteria.q}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, q: e.target.value })}
            className="w-full max-w-2xl mx-auto block rounded-full border-2 border-[var(--neutral-200)] bg-[var(--background-color)] px-6 py-4 text-center text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          />
        </div>

        {loading && <p className="text-center text-lg text-[var(--text-secondary)]">Loading properties...</p>}
        {error && <p className="text-center text-lg text-red-600">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">No Properties Found</h3>
            <p className="text-[var(--text-secondary)] mt-2">
              {searchCriteria.q || searchCriteria.type || searchCriteria.category
                ? "No properties match your search. Try a different term."
                : "There are currently no properties to display. Please check back later."}
            </p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((item) => (
                <PropertyCard
                  key={item._id}
                  item={item}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectProperty={setSelectedProperty}
                  isFavorite={user?.favorites?.includes(item._id)}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
            
            {selectedProperty && (
              <Motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 overflow-hidden rounded-2xl border border-[var(--neutral-200)] bg-[var(--background-color)] shadow-xl">
                <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)]">Property Map</span>
                    <h3 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{selectedProperty.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{selectedProperty.address}</p>
                  </div>
                  <a href={`https://www.openstreetmap.org/?mlat=${selectedProperty.latitude}&mlon=${selectedProperty.longitude}#map=14/${selectedProperty.latitude}/${selectedProperty.longitude}`} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    Open Full Map
                  </a>
                </div>
                <iframe title={`Map showing ${selectedProperty.name}`} src={mapUrl} className="h-96 w-full border-0" loading="lazy" />
              </Motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Properties;
