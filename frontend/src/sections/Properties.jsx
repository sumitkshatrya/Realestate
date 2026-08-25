import React, { useEffect, useState, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import { FaMapLocationDot, FaXmark, FaSliders } from "react-icons/fa6";
import { useAuth } from "../context/useAuth";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi.js";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";
import PropertyCard from "../components/PropertyCard";

const categoriesList = [
  { label: "All Properties", value: "" },
  { label: "Apartments", value: "apartments" },
  { label: "Houses & Villas", value: "houses" },
  { label: "Penthouses", value: "condos" },
  { label: "Duplexes", value: "duplexes" },
  { label: "Townhomes", value: "townhomes" },
];

const SkeletonCard = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse space-y-4">
    <div className="h-56 rounded-2xl bg-slate-200 w-full" />
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100">
      <div className="h-8 bg-slate-200 rounded" />
      <div className="h-8 bg-slate-200 rounded" />
      <div className="h-8 bg-slate-200 rounded" />
    </div>
    <div className="h-10 bg-slate-200 rounded-xl w-full" />
  </div>
);

const Properties = ({ searchCriteria, setSearchCriteria }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(searchCriteria.category || "");
  const [showMapModal, setShowMapModal] = useState(false);

  const debouncedSearchCriteria = useDebounce(searchCriteria, 400);
  const { user, isAuthenticated, updateUser, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await propertyAPI.searchProperties(debouncedSearchCriteria);
        const fetchedProperties = data?.data || [];
        setProperties(fetchedProperties);

        if (fetchedProperties.length > 0 && !fetchedProperties.find(p => p._id === selectedProperty?._id)) {
          setSelectedProperty(fetchedProperties[0]);
        } else if (fetchedProperties.length === 0) {
          setSelectedProperty(null);
        }
      } catch (err) {
        setError("Unable to retrieve real estate listings. Please verify server connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [debouncedSearchCriteria]);

  const handleCategoryFilter = (catValue) => {
    setActiveCategory(catValue);
    setSearchCriteria({ ...searchCriteria, category: catValue });
  };

  const handleClearSearch = () => {
    setActiveCategory("");
    setSearchCriteria({ q: "", type: "", category: "" });
  };

  const handleToggleFavorite = useCallback(async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save your favorite homes.");
      return;
    }
    if (authLoading) {
      toast.error("Authenticating session...");
      return;
    }
    const isCurrentlyFavorite = user?.favorites?.includes(propertyId);
    try {
      const response = await userAPI.toggleFavorite(propertyId);
      updateUser({ favorites: response.data.favorites });
      if (isCurrentlyFavorite) {
        toast.success("Removed from saved favorites.");
      } else {
        toast.success("Saved to your favorites list!");
      }
    } catch (err) {
      console.error("Failed to update favorites:", err);
      toast.error("Could not update favorites.");
    }
  }, [isAuthenticated, updateUser, user, authLoading]);

  const mapUrl = selectedProperty
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${(selectedProperty.longitude || -115.17) - 0.06}%2C${(selectedProperty.latitude || 36.16) - 0.04}%2C${(selectedProperty.longitude || -115.17) + 0.06}%2C${(selectedProperty.latitude || 36.16) + 0.04}&layer=mapnik&marker=${selectedProperty.latitude || 36.16}%2C${selectedProperty.longitude || -115.17}`
    : "";

  return (
    <section id="properties" className="bg-slate-50 py-24 border-t border-slate-200/60">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-block mb-3">
            Curated Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore Standout Luxury Homes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every listing is vetted for architectural excellence, location value, and superior amenities.
          </p>
        </Motion.div>

        {/* Filter Bar Controls */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          
          {/* Search Box */}
          <div className="relative flex items-center">
            <FaSearch className="absolute left-5 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Search by city, title, address, or keyword..."
              value={searchCriteria.q || ""}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, q: e.target.value })}
              className="w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-12 py-4 text-slate-900 placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
            />
            {searchCriteria.q && (
              <button
                onClick={() => setSearchCriteria({ ...searchCriteria, q: "" })}
                className="absolute right-4 p-2 text-slate-400 hover:text-slate-700 transition"
                aria-label="Clear search"
              >
                <FaXmark className="text-base" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            {categoriesList.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleCategoryFilter(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                  activeCategory === cat.value
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {(searchCriteria.q || searchCriteria.type || searchCriteria.category) && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition whitespace-nowrap cursor-pointer ml-2 flex items-center gap-1"
              >
                <FaXmark className="text-xs" />
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Loading State Skeleton Grid */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {/* Error Notification */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-3xl text-center max-w-xl mx-auto my-8">
            <p className="font-bold text-lg">{error}</p>
            <button
              onClick={() => setSearchCriteria({ ...searchCriteria })}
              className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-2xl mx-auto shadow-sm p-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
              <FaSearch />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No Properties Found</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
              We couldn't find any listings matching your search parameters. Try clearing your filters or searching for another city.
            </p>
            <button
              onClick={handleClearSearch}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              View All Listings
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && properties.length > 0 && (
          <>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((item) => (
                <PropertyCard
                  key={item._id}
                  item={item}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectProperty={(prop) => {
                    setSelectedProperty(prop);
                    setShowMapModal(true);
                  }}
                  isFavorite={user?.favorites?.includes(item._id)}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>

            {/* Interactive Embedded Map Modal / Preview Banner */}
            {selectedProperty && (
              <Motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-900 text-white gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 text-lg font-bold">
                      <FaMapLocationDot />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">Selected Map Location</p>
                      <h3 className="text-xl font-bold">{selectedProperty.name}</h3>
                      <p className="text-xs text-slate-300">{selectedProperty.address}</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedProperty.latitude}&mlon=${selectedProperty.longitude}#map=14/${selectedProperty.latitude}/${selectedProperty.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                  >
                    Open Fullscreen Map
                  </a>
                </div>
                <iframe
                  title={`Map location for ${selectedProperty.name}`}
                  src={mapUrl}
                  className="h-96 w-full border-0"
                  loading="lazy"
                />
              </Motion.div>
            )}
          </>
        )}

      </div>
    </section>
  );
};

export default Properties;

