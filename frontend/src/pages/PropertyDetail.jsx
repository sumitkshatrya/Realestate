import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { FaBed, FaBath, FaMapMarkerAlt, FaArrowLeft, FaHeart } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { motion } from "framer-motion";
import ScheduleTourModal from "../components/ScheduleTourModal";
import PropertyCard from "../components/PropertyCard";
import ImageLightbox from "../components/ImageLightbox";
import PropertyTabs from "../components/PropertyTabs";
import ContactAgentForm from "../components/ContactAgentForm";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const { user, isAuthenticated, updateUser } = useAuth();

  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);


  useEffect(() => {
    const fetchProperty = async () => {
      // Scroll to top on new property navigation
      window.scrollTo(0, 0);

      try {
        setLoading(true);
        setError(null);
        setSimilarLoading(true);

        // 1. Fetch main property and similar properties in parallel
        const [propertyResponse, similarResponse] = await Promise.all([
          propertyAPI.getPropertyById(id),
          propertyAPI.getSimilarProperties(id),
        ]);

        // 2. Process main property data
        const propertyData = propertyResponse.data;
        propertyData.images = Array.isArray(propertyData.images) ? propertyData.images : [propertyData.images];
        setProperty(propertyData);

        // Add to recently viewed properties in localStorage
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        // Remove the current property ID if it already exists to move it to the front
        const filtered = recentlyViewed.filter(viewedId => viewedId !== propertyData._id);
        // Add the new ID to the beginning and limit the list to 6 items
        const updatedRecentlyViewed = [propertyData._id, ...filtered].slice(0, 6);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));

        setSelectedImage(0); // Reset selected image

        // 3. Process similar properties data
        setSimilarProperties(similarResponse.data || []);
      } catch (err) {
        setError("Failed to load property details.");
        console.error(err);
      } finally {
        // 4. Update loading states
        setLoading(false);
        setSimilarLoading(false);
      }
    };

    fetchProperty();
  }, [id]); // Re-run when the ID from the URL changes

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage your favorites.");
      return;
    }

    const isCurrentlyFavorite = user?.favorites?.includes(propertyId);
    const originalFavorites = user?.favorites ? [...user.favorites] : [];

    // Optimistic update
    const newFavorites = isCurrentlyFavorite
      ? originalFavorites.filter((favId) => favId !== propertyId)
      : [...originalFavorites, propertyId];
    updateUser({ favorites: newFavorites });

    try {
      await userAPI.toggleFavorite(propertyId);
    } catch (err) {
      toast.error("Failed to update favorites. Please try again.");
      updateUser({ favorites: originalFavorites }); // Revert on error
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading Property...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  if (!property) {
    return <div className="text-center py-20 text-xl">Property not found.</div>;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/#properties"
          className="inline-flex items-center gap-2 text-rose-600 font-semibold mb-6 hover:underline"
        >
          <FaArrowLeft />
          Back to Listings
        </Link>

        <div>
          <div
            className="h-96 rounded-3xl bg-cover bg-center mb-4 shadow-lg transition-all duration-300 cursor-pointer"
            style={{ backgroundImage: `url(${property.images[selectedImage]})` }}
            onClick={() => setIsLightboxOpen(true)}
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
            {property.images.map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={img}
                  alt={`View ${index + 1} of ${property.name}`}
                  onClick={() => {
                    setSelectedImage(index);
                    setIsLightboxOpen(true);
                  }}
                  className={`w-full h-24 object-cover rounded-xl cursor-pointer border-4 transition-all ${
                    selectedImage === index ? 'border-rose-500' : 'border-transparent hover:border-rose-200'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
              {property.name}
            </h1>
            <div className="flex items-center gap-2 mt-4 text-slate-600">
              <FaMapMarkerAlt />
              <p className="text-lg">{property.address}</p>
            </div>
            <div className="absolute top-0 right-0 mt-4 mr-4">
              {isAuthenticated && (
                <button
                  onClick={() => handleToggleFavorite(property._id)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-white backdrop-blur-sm transition ${
                    user?.favorites?.includes(property._id)
                      ? "bg-red-500/80"
                      : "bg-slate-500/50"
                  }`}
                  aria-label={`Toggle favorite for ${property.name}`}
                >
                  <FaHeart size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-md">
              <p className="text-4xl font-bold text-rose-600 mb-4">
                {property.price}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <FaBed className="mx-auto text-2xl text-rose-500 mb-1" />
                  <p className="font-semibold">{property.bed} Beds</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <FaBath className="mx-auto text-2xl text-rose-500 mb-1" />
                  <p className="font-semibold">{property.bath} Baths</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <MdSpaceDashboard className="mx-auto text-2xl text-rose-500 mb-1" />
                  <p className="font-semibold">{property.area}</p>
                </div>
              </div>
              <button
                onClick={() => setIsTourModalOpen(true)}
                className="w-full mt-6 bg-slate-900 text-white font-semibold py-3 rounded-full hover:bg-slate-800 transition"
              >
                Schedule a Tour
              </button>
            </div>
            <ContactAgentForm
              agentName={property.owner}
              propertyName={property.name}
              propertyId={property._id}
            />
          </div>
        </div>

        {/* Similar Properties Section */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8">
            Similar Properties
          </h2>
          {similarLoading ? (
            <div className="text-center text-slate-500">Loading similar properties...</div>
          ) : similarProperties.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {similarProperties.map((p) => (
                <PropertyCard
                  key={p._id}
                  property={p}
                  isFavorite={user?.favorites?.includes(p._id)}
                  onToggleFavorite={isAuthenticated ? handleToggleFavorite : null}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">No similar properties found.</p>
          )}
        </div>

      </motion.div>
      <ScheduleTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        property={property}
      />
      {isLightboxOpen && (
        <ImageLightbox
          images={property.images}
          startIndex={selectedImage}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default PropertyDetail;
