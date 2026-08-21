import React, { useEffect, useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { userAPI } from "../api/userApi";
import toast from "react-hot-toast";
import PropertyCard from "../components/PropertyCard";
import ListingsMap from "../components/ListingsMap";
import { FaList, FaMap } from "react-icons/fa";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("list");
  const [visibleOnMap, setVisibleOnMap] = useState([]);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const { isAuthenticated, updateUser } = useAuth();

  const parsePrice = (priceString) =>
    parseFloat(priceString.replace(/[^0-9.-]+/g, ""));

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
        setError("Failed to load your favorite properties.");
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
    const propertyToRemove = favorites.find(p => p._id === propertyId);
    if (!propertyToRemove) return;

    // 1. Optimistically update the UI
    setFavorites(prev => prev.filter(p => p._id !== propertyId));

    // 2. Immediately fire the API request to remove
    try {
      const removePromise = userAPI.toggleFavorite(propertyId);

      // 3. Show toast with Undo option
      toast(
        (t) => (
          <div className="flex items-center justify-between gap-4">
            <span>Removed from favorites.</span>
            <button
              className="font-semibold text-[var(--primary-color)]"
              onClick={async () => {
                toast.dismiss(t.id);
                // 4a. Optimistically add back to UI
                setFavorites(originalFavorites);
                // 4b. Fire API request to add back
                try {
                  await userAPI.toggleFavorite(propertyId);
                } catch (undoErr) {
                  toast.error("Failed to undo. Please refresh.");
                }
              }}
            >
              Undo
            </button>
          </div>
        )
      );
      await removePromise;
    } catch (err) {
      // 5. If the initial removal fails, revert the UI
      toast.error("Failed to remove favorite. Please try again.");
      setFavorites(originalFavorites);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading Your Favorites...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-lg text-slate-600 mb-6">You need to be logged in to see your favorite properties.</p>
        <RouterLink to="/login" className="btn btn-primary">Login</RouterLink>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  const handleMarkerClick = (propertyId) => {
    const cardElement = document.getElementById(`property-card-${propertyId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="section-shell py-12">
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 text-center mb-10">My Favorite Properties</h1>

      {favorites.length > 0 && !loading && (
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-slate-200 p-1">
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${viewMode === 'list' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}><FaList /> List View</button>
            <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${viewMode === 'map' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}><FaMap /> Map View</button>
          </div>

          {viewMode === 'list' && (
            <div className="flex items-center gap-3">
              <label htmlFor="sort-favorites" className="font-semibold text-slate-700">Sort by:</label>
              <select
                id="sort-favorites"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input !w-auto !py-2 !px-4"
              >
                <option value="date-desc">Date Added (Newest)</option>
                <option value="date-asc">Date Added (Oldest)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="price-asc">Price (Low to High)</option>
              </select>
            </div>
            )}
          </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' && (
            sortedFavorites.length === 0 && !loading ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">No Favorites Yet</h3>
              <p className="text-[var(--text-secondary)] mt-2 mb-6">You haven't saved any properties. Start exploring to find your favorites!</p>
              <RouterLink to="/#properties" className="btn btn-primary">Explore Properties</RouterLink>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {sortedFavorites.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            </AnimatePresence>
          ))}
          {viewMode === 'map' && (
            <div className="space-y-8">
              <ListingsMap properties={favorites} onVisibleChange={setVisibleOnMap} hoveredPropertyId={hoveredPropertyId} onMarkerClick={handleMarkerClick} />
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {visibleOnMap.length} favorite{visibleOnMap.length === 1 ? '' : 's'} in this area
                </h3>
                {visibleOnMap.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {visibleOnMap.map((p) =>
                      <div
                        id={`property-card-${p._id}`}
                        key={p._id}
                        onMouseEnter={() => setHoveredPropertyId(p._id)}
                        onMouseLeave={() => setHoveredPropertyId(null)}>
                        <PropertyCard
                          property={p}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={true}
                        />
                      </div>
                    )}
                  </div>
                ) : <p className="text-slate-500">Zoom or pan the map to find more of your favorite properties.</p>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyFavorites;
