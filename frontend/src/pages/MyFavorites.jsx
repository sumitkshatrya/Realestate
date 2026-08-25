import React, { useEffect, useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { userAPI } from "../api/userApi";
import toast from "react-hot-toast";
import PropertyCard from "../components/PropertyCard";
import ListingsMap from "../components/ListingsMap";
import { FaList, FaMap, FaHeart, FaArrowLeft, FaSliders } from "react-icons/fa6";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("list");
  const [visibleOnMap, setVisibleOnMap] = useState([]);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const { isAuthenticated } = useAuth();

  const parsePrice = (priceString) =>
    parseFloat((priceString || "").replace(/[^0-9.-]+/g, "")) || 0;

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getFavorites();
        setFavorites(response.data || []);
      } catch (err) {
        setError("Failed to load your saved properties.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const sortedFavorites = useMemo(() => {
    const sorted = [...favorites];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "date-asc":
        break;
      case "date-desc":
      default:
        sorted.reverse();
    }
    return sorted;
  }, [favorites, sortBy]);

  const handleToggleFavorite = async (propertyId) => {
    const originalFavorites = [...favorites];
    const propertyToRemove = favorites.find((p) => p._id === propertyId);
    if (!propertyToRemove) return;

    setFavorites((prev) => prev.filter((p) => p._id !== propertyId));

    try {
      const removePromise = userAPI.toggleFavorite(propertyId);
      toast((t) => (
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-800">Removed from saved homes.</span>
          <button
            className="text-xs font-extrabold text-blue-600 hover:underline cursor-pointer"
            onClick={async () => {
              toast.dismiss(t.id);
              setFavorites(originalFavorites);
              try {
                await userAPI.toggleFavorite(propertyId);
              } catch (undoErr) {
                toast.error("Failed to restore property.");
              }
            }}
          >
            Undo
          </button>
        </div>
      ));
      await removePromise;
    } catch (err) {
      toast.error("Failed to remove saved property.");
      setFavorites(originalFavorites);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-7xl animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-64 mx-auto" />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 pt-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 bg-slate-200 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl">
            <FaHeart />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign In Required</h2>
          <p className="text-sm text-slate-600">Please log in to view and organize your saved luxury properties.</p>
          <RouterLink to="/login" className="btn btn-primary w-full py-3">
            Sign In Now
          </RouterLink>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 pt-36 pb-20 text-center">
        <p className="text-lg text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  const handleMarkerClick = (propertyId) => {
    const cardElement = document.getElementById(`property-card-${propertyId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-red-500 text-sm font-bold uppercase tracking-wider mb-1">
              <FaHeart /> Personal Portfolio
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Saved Favorites ({favorites.length})
            </h1>
          </div>

          {favorites.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-slate-200/80 p-1.5 rounded-xl border border-slate-300/60">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FaList /> List View
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FaMap /> Map View
                </button>
              </div>

              {/* Sort selector */}
              {viewMode === 'list' && (
                <div className="flex items-center gap-2">
                  <FaSliders className="text-slate-400 text-xs" />
                  <select
                    id="sort-favorites"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="date-desc">Newest Saved</option>
                    <option value="date-asc">Oldest Saved</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Mode Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {viewMode === 'list' && (
              sortedFavorites.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto shadow-sm p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl">
                    <FaHeart />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">No Saved Properties Yet</h3>
                  <p className="text-sm text-slate-500">
                    Click the heart icon on any property card to save listings to your personal collection.
                  </p>
                  <RouterLink to="/#properties" className="inline-flex items-center gap-2 btn btn-primary mt-2">
                    <FaArrowLeft className="text-xs" /> Explore Listings
                  </RouterLink>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {sortedFavorites.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={true}
                      isAuthenticated={true}
                    />
                  ))}
                </div>
              )
            )}

            {viewMode === 'map' && (
              <div className="space-y-8">
                <ListingsMap
                  properties={favorites}
                  onVisibleChange={setVisibleOnMap}
                  hoveredPropertyId={hoveredPropertyId}
                  onMarkerClick={handleMarkerClick}
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {visibleOnMap.length} saved home{visibleOnMap.length === 1 ? '' : 's'} in view
                  </h3>
                  {visibleOnMap.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                      {visibleOnMap.map((p) => (
                        <div
                          id={`property-card-${p._id}`}
                          key={p._id}
                          onMouseEnter={() => setHoveredPropertyId(p._id)}
                          onMouseLeave={() => setHoveredPropertyId(null)}
                        >
                          <PropertyCard
                            property={p}
                            onToggleFavorite={handleToggleFavorite}
                            isFavorite={true}
                            isAuthenticated={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Pan or zoom the map to reveal saved homes in other regions.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MyFavorites;
