import React, { useEffect, useState, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import { FaMapLocationDot, FaXmark, FaSliders, FaScaleUnbalanced, FaWandMagicSparkles } from "react-icons/fa6";
import { useAuth } from "../context/useAuth";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi.js";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";
import PropertyCard from "../components/PropertyCard";
import AINaturalSearchBar from "../components/ai/AINaturalSearchBar";
import AIPropertyComparisonModal from "../components/ai/AIPropertyComparisonModal";

import { getSocket } from "../api/socketClient";

const categoriesList = [
  { label: "All Categories", value: "" },
  { label: "Luxury Apartment", value: "Luxury Apartment" },
  { label: "Private Villa / House", value: "Private Villa / House" },
  { label: "Penthouse / Condo", value: "Penthouse / Condo" },
  { label: "Duplex", value: "Duplex" },
  { label: "Townhome", value: "Townhome" },
  { label: "Commercial Space", value: "Commercial Space" },
];

const purposeList = [
  { label: "All Properties", value: "" },
  { label: "Buy (For Sale)", value: "buy" },
  { label: "Rent (For Rent)", value: "rent" },
  { label: "Commercial", value: "commercial" },
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
  const [activePurpose, setActivePurpose] = useState(searchCriteria.purpose || searchCriteria.type || "");
  const [showMapModal, setShowMapModal] = useState(false);

  // AI Multi-Property Compare State
  const [comparedProperties, setComparedProperties] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleToggleCompare = (property) => {
    const propId = property._id || property.id;
    setComparedProperties((prev) => {
      const exists = prev.some((p) => String(p._id || p.id) === String(propId));
      if (exists) {
        toast.info(`Removed "${property.name}" from comparison`);
        return prev.filter((p) => String(p._id || p.id) !== String(propId));
      } else {
        if (prev.length >= 4) {
          toast.error("You can compare a maximum of 4 properties at once.");
          return prev;
        }
        toast.success(`Added "${property.name}" to AI comparison!`);
        return [...prev, property];
      }
    });
  };

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

        setSelectedProperty((prev) => {
          if (fetchedProperties.length > 0 && !fetchedProperties.find((p) => p._id === prev?._id)) {
            return fetchedProperties[0];
          }
          if (fetchedProperties.length === 0) {
            return null;
          }
          return prev;
        });
      } catch (err) {
        setError("Unable to retrieve real estate listings. Please verify server connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [debouncedSearchCriteria]);

  // Real-time WebSocket event listener
  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (newProperty) => {
      setProperties((prev) => [newProperty, ...prev]);
      toast.success(`✨ New listing added: "${newProperty.name}"`, { id: `created-${newProperty._id}` });
    };

    const handleUpdated = (updatedProperty) => {
      setProperties((prev) =>
        prev.map((item) => (item._id === updatedProperty._id ? updatedProperty : item))
      );
      setSelectedProperty((prevSelected) =>
        prevSelected?._id === updatedProperty._id ? updatedProperty : prevSelected
      );
      toast.success(`🔄 "${updatedProperty.name}" details updated live`, { id: `updated-${updatedProperty._id}` });
    };

    const handleDeleted = ({ id }) => {
      setProperties((prev) => prev.filter((item) => item._id !== id));
      setSelectedProperty((prevSelected) =>
        prevSelected?._id === id ? null : prevSelected
      );
    };

    socket.on("property:created", handleCreated);
    socket.on("property:updated", handleUpdated);
    socket.on("property:deleted", handleDeleted);

    return () => {
      socket.off("property:created", handleCreated);
      socket.off("property:updated", handleUpdated);
      socket.off("property:deleted", handleDeleted);
    };
  }, [selectedProperty]);

  const handlePurposeFilter = (purposeValue) => {
    setActivePurpose(purposeValue);
    setSearchCriteria({ ...searchCriteria, purpose: purposeValue, type: purposeValue });
  };

  const handleCategoryFilter = (catValue) => {
    setActiveCategory(catValue);
    setSearchCriteria({ ...searchCriteria, category: catValue });
  };

  const handleClearSearch = () => {
    setActiveCategory("");
    setActivePurpose("");
    setSearchCriteria({ q: "", type: "", purpose: "", category: "", status: "" });
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
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${(selectedProperty.longitude || 75.82) - 0.008}%2C${(selectedProperty.latitude || 26.84) - 0.005}%2C${(selectedProperty.longitude || 75.82) + 0.008}%2C${(selectedProperty.latitude || 26.84) + 0.005}&layer=mapnik&marker=${selectedProperty.latitude || 26.84}%2C${selectedProperty.longitude || 75.82}`
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
            Explore Standout Properties
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Find residential houses, luxury apartments, and prime commercial real estate available for buy or rent.
          </p>
        </Motion.div>

        {/* Filter Bar Controls */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          
          {/* AI Natural Language Search */}
          <AINaturalSearchBar
            onApplySearch={(structured) => {
              setSearchCriteria((prev) => ({
                ...prev,
                q: structured.q !== undefined ? structured.q : prev.q,
                purpose: structured.purpose || prev.purpose,
                category: structured.category || prev.category,
                type: structured.purpose || prev.type,
              }));
            }}
          />

          {/* Purpose Tabs (Buy / Rent / Commercial) */}
          <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-200/70 backdrop-blur-md rounded-2xl max-w-xl mx-auto">
            {purposeList.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePurposeFilter(p.value)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  activePurpose === p.value
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-700 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

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
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {(searchCriteria.q || searchCriteria.type || searchCriteria.purpose || searchCriteria.category) && (
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
                  searchCriteria={searchCriteria}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedProperties.some((p) => String(p._id || p.id) === String(item._id || item.id))}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectProperty={(prop) => {
                    setSelectedProperty(prop);
                    setShowMapModal(true);
                    setTimeout(() => {
                      document.getElementById("selected-property-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }}
                  isFavorite={Boolean(
                    (user?.favorites || []).some(
                      (f) => String(f?._id || f) === String(item._id || item.id)
                    )
                  )}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>

            {/* Interactive Embedded Map Modal / Preview Banner */}
            {/* Interactive Embedded Map Preview Banner for Selected Property */}
            {selectedProperty && (
              <Motion.div
                id="selected-property-map"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl scroll-mt-24"
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
                  <div className="flex items-center gap-2">
                    <a
                      href={
                        typeof selectedProperty.latitude === "number" && typeof selectedProperty.longitude === "number"
                          ? `https://maps.google.com/?q=${selectedProperty.latitude},${selectedProperty.longitude}`
                          : `https://maps.google.com/?q=${encodeURIComponent(selectedProperty.name + ", " + selectedProperty.address)}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Open Google Maps
                    </a>
                  </div>
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

      {/* Floating Compare Action Bar */}
      <AnimatePresence>
        {comparedProperties.length > 0 && (
          <Motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-center gap-4 max-w-xl w-[92%]"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FaScaleUnbalanced className="text-amber-400 text-lg shrink-0" />
              <div className="truncate text-xs">
                <p className="font-extrabold text-white">{comparedProperties.length} Properties Selected</p>
                <p className="text-slate-400 truncate">{comparedProperties.map((p) => p.name).join(", ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setComparedProperties([])}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <FaWandMagicSparkles />
                Compare with AI
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* AI Comparison Modal */}
      <AIPropertyComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedProperties={comparedProperties}
      />
    </section>
  );
};

export default Properties;

