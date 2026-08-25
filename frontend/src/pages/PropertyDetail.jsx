import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed, FaBath, FaArrowLeft, FaHeart, FaCalendarCheck, FaImages, FaShareNodes } from "react-icons/fa6";
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
      window.scrollTo(0, 0);
      try {
        setLoading(true);
        setError(null);
        setSimilarLoading(true);

        const [propertyResponse, similarResponse] = await Promise.all([
          propertyAPI.getPropertyById(id),
          propertyAPI.getSimilarProperties(id),
        ]);

        const propertyData = propertyResponse.data;
        propertyData.images = Array.isArray(propertyData.images) && propertyData.images.length > 0
          ? propertyData.images
          : [propertyData.images || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

        setProperty(propertyData);

        // Store in recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const filtered = recentlyViewed.filter(viewedId => viewedId !== propertyData._id);
        const updatedRecentlyViewed = [propertyData._id, ...filtered].slice(0, 6);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));

        setSelectedImage(0);
        setSimilarProperties(similarResponse.data || []);
      } catch (err) {
        setError("Unable to load property details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
        setSimilarLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage saved homes.");
      return;
    }

    const isCurrentlyFavorite = user?.favorites?.includes(propertyId);
    const originalFavorites = user?.favorites ? [...user.favorites] : [];

    const newFavorites = isCurrentlyFavorite
      ? originalFavorites.filter((favId) => favId !== propertyId)
      : [...originalFavorites, propertyId];
    updateUser({ favorites: newFavorites });

    try {
      await userAPI.toggleFavorite(propertyId);
      toast.success(isCurrentlyFavorite ? "Removed from saved homes." : "Saved to favorites!");
    } catch (err) {
      toast.error("Failed to update favorites.");
      updateUser({ favorites: originalFavorites });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing URL copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-28 max-w-7xl animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-48" />
        <div className="h-[450px] bg-slate-200 rounded-3xl w-full" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-md">
        <div className="p-8 bg-red-50 rounded-3xl border border-red-200">
          <h2 className="text-2xl font-bold text-red-700">Property Not Found</h2>
          <p className="text-sm text-red-600 mt-2">{error || "The property listing could not be found."}</p>
          <Link to="/#properties" className="mt-6 inline-block btn btn-primary">
            Return to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/#properties"
            className="inline-flex items-center gap-2 text-slate-700 font-semibold text-sm hover:text-blue-600 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to All Listings
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FaShareNodes /> Share
            </button>
            <button
              onClick={() => handleToggleFavorite(property._id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer border ${
                user?.favorites?.includes(property._id)
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <FaHeart />
              {user?.favorites?.includes(property._id) ? "Saved" : "Save Listing"}
            </button>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Featured Image */}
            <div
              className="lg:col-span-2 h-[420px] rounded-3xl bg-slate-900 overflow-hidden relative group cursor-pointer shadow-lg"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={property.images[selectedImage]}
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <button
                className="absolute bottom-5 right-5 px-4 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 border border-white/20 shadow-md"
              >
                <FaImages /> View Gallery ({property.images.length})
              </button>
            </div>

            {/* Side Image Thumbnails */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {property.images.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedImage(idx);
                    setIsLightboxOpen(true);
                  }}
                  className={`h-[200px] rounded-2xl overflow-hidden cursor-pointer relative group border-2 transition-all ${
                    selectedImage === idx ? 'border-amber-500 shadow-md' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Main Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Info Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-2">
                    {property.type || "For Sale"}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {property.name}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                    {property.price}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Est. $5,420/month</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <FaMapMarkerAlt className="text-amber-500" />
                <span>{property.address}</span>
              </div>

              {/* Key Specs Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <FaBed className="mx-auto text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-slate-900">{property.bed}</p>
                  <p className="text-xs text-slate-500 font-medium">Bedrooms</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <FaBath className="mx-auto text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-slate-900">{property.bath}</p>
                  <p className="text-xs text-slate-500 font-medium">Bathrooms</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <MdSpaceDashboard className="mx-auto text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-slate-900">{property.area}</p>
                  <p className="text-xs text-slate-500 font-medium">Square Feet</p>
                </div>
              </div>
            </div>

            {/* Detailed Tabs Component */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <PropertyTabs property={property} />
            </div>
          </div>

          {/* Right Sidebar Action Column */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            {/* Tour Schedule Box */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaCalendarCheck className="text-amber-400" /> Schedule A Viewing
              </h3>
              <p className="text-xs text-slate-300">
                Book a private in-person or live video walkthrough with an estate specialist.
              </p>
              <button
                onClick={() => setIsTourModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition cursor-pointer active:scale-95"
              >
                Request Private Tour
              </button>
            </div>

            {/* Agent Contact Card */}
            <ContactAgentForm
              agentName={property.owner}
              propertyName={property.name}
              propertyId={property._id}
            />
          </div>

        </div>

        {/* Similar Listings Carousel / Grid */}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Curated Matches</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Similar Luxury Properties</h2>
          </div>
          {similarLoading ? (
            <div className="text-center py-10 text-slate-500 font-semibold">Loading recommendations...</div>
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
            <p className="text-slate-500 italic">No similar properties currently listed in this area.</p>
          )}
        </div>

      </div>

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
    </div>
  );
};

export default PropertyDetail;

