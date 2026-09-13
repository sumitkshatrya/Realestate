import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi";
import { getSocket } from "../api/socketClient";
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
import AIPropertyInsightsCard from "../components/ai/AIPropertyInsightsCard";

import { getImageUrl } from "../utils/backendUrl";

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

        const propertyResponse = await propertyAPI.getPropertyById(id);
        const propertyData = propertyResponse.data;

        const rawImages = Array.isArray(propertyData.images) && propertyData.images.length > 0
          ? propertyData.images
          : [propertyData.images || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

        propertyData.images = rawImages.map(getImageUrl);

        setProperty(propertyData);

        // Store in recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const filtered = recentlyViewed.filter(viewedId => viewedId !== propertyData._id);
        const updatedRecentlyViewed = [propertyData._id, ...filtered].slice(0, 6);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));

        setSelectedImage(0);

        try {
          const similarResponse = await propertyAPI.getSimilarProperties(id);
          setSimilarProperties(similarResponse?.data || []);
        } catch (simErr) {
          console.error("Failed to load similar properties:", simErr);
          setSimilarProperties([]);
        } finally {
          setSimilarLoading(false);
        }
      } catch (err) {
        setError("Unable to load property details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const socket = getSocket();

    const handlePropertyUpdated = (updatedProp) => {
      if (updatedProp && (updatedProp._id === id || updatedProp.id === id)) {
        const rawImages = Array.isArray(updatedProp.images) && updatedProp.images.length > 0
          ? updatedProp.images
          : [updatedProp.images || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
        
        const images = rawImages.map(getImageUrl);

        setProperty((prev) => {
          if (prev && prev.status !== updatedProp.status) {
            toast.info(`Listing status updated to ${updatedProp.status.toUpperCase()}`);
          } else {
            toast.info("Listing details updated in real time");
          }
          return { ...updatedProp, images };
        });
      }
    };

    const handlePropertyDeleted = ({ id: deletedId }) => {
      if (deletedId === id) {
        toast.error("This property listing has been removed by admin.");
        setError("This property listing has been removed.");
      }
    };

    socket.on("property:updated", handlePropertyUpdated);
    socket.on("property:deleted", handlePropertyDeleted);

    return () => {
      socket.off("property:updated", handlePropertyUpdated);
      socket.off("property:deleted", handlePropertyDeleted);
    };
  }, [id]);

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to manage saved homes.");
      return;
    }

    const currentFavs = (user?.favorites || []).map((f) => (f?._id || f).toString());
    const isCurrentlyFavorite = currentFavs.includes(String(propertyId));

    const newFavorites = isCurrentlyFavorite
      ? currentFavs.filter((favId) => favId !== String(propertyId))
      : [...currentFavs, String(propertyId)];

    if (updateUser) {
      updateUser({ favorites: newFavorites });
    }

    try {
      const response = await userAPI.toggleFavorite(propertyId);
      if (response?.data?.favorites && updateUser) {
        updateUser({ favorites: response.data.favorites });
      }
      toast.success(isCurrentlyFavorite ? "Removed from saved homes." : "Saved to favorites!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favorites.");
      if (updateUser) {
        updateUser({ favorites: currentFavs });
      }
    }
  };

  const handleOpenMap = () => {
    if (!property) return;
    const { latitude, longitude, address } = property;
    let url = "";
    if (typeof latitude === "number" && typeof longitude === "number" && !isNaN(latitude) && !isNaN(longitude)) {
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } else if (address) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
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

  const isSaved = (user?.favorites || []).some((f) => String(f?._id || f) === String(property?._id));

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
                isSaved
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <FaHeart />
              {isSaved ? "Saved" : "Save Listing"}
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
              {/* Purpose, Category & Availability Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white ${
                    (property.purpose || "").toLowerCase() === "rent"
                      ? "bg-blue-600"
                      : (property.purpose || "").toLowerCase() === "commercial"
                      ? "bg-purple-600"
                      : "bg-emerald-600"
                  }`}
                >
                  {(property.purpose || "").toLowerCase() === "rent"
                    ? "For Rent"
                    : (property.purpose || "").toLowerCase() === "commercial"
                    ? "Commercial"
                    : "For Sale"}
                </span>

                {property.category && (
                  <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                    {property.category}
                  </span>
                )}

                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    (property.status || "").toLowerCase() === "sold"
                      ? "bg-rose-100 text-rose-700 border border-rose-300"
                      : (property.status || "").toLowerCase() === "rented"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : (property.status || "").toLowerCase() === "booked"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  Status: {property.status || "available"}
                </span>
              </div>

              {/* Status Alert Banner if not available */}
              {(property.status || "").toLowerCase() !== "available" && (
                <div
                  className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 ${
                    (property.status || "").toLowerCase() === "sold"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : (property.status || "").toLowerCase() === "rented"
                      ? "bg-blue-50 border-blue-200 text-blue-800"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="text-lg">
                    {(property.status || "").toLowerCase() === "sold"
                      ? "🏷️"
                      : (property.status || "").toLowerCase() === "rented"
                      ? "🔑"
                      : "📅"}
                  </span>
                  <div>
                    <p className="font-extrabold uppercase tracking-wide">
                      This property has been {(property.status || "booked").toUpperCase()}
                    </p>
                    <p className="text-xs font-normal opacity-90">
                      You can still contact our team below for waitlist inquiries or similar alternative listings.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {property.name}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                    {property.price}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {(property.purpose || "").toLowerCase() === "rent" ? "/ month" : "Est. Mortgage"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenMap}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:underline transition-colors text-sm cursor-pointer text-left font-medium"
                title="Click to view location on Google Maps"
              >
                <FaMapMarkerAlt className="text-amber-500 text-base shrink-0" />
                <span>{property.address} <span className="text-xs text-blue-600 font-semibold underline ml-1">(Open Map)</span></span>
              </button>

              {/* Key Specs Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <FaBed className="mx-auto text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-slate-900">{property.bed || 0}</p>
                  <p className="text-xs text-slate-500 font-medium">Bedrooms</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <FaBath className="mx-auto text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-slate-900">{property.bath || 0}</p>
                  <p className="text-xs text-slate-500 font-medium">Bathrooms</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <MdSpaceDashboard className="mx-auto text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-slate-900">{property.area || "N/A"}</p>
                  <p className="text-xs text-slate-500 font-medium">Square Feet</p>
                </div>
              </div>
            </div>

            {/* AI Property Intelligence Card */}
            <AIPropertyInsightsCard property={property} />

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
                <FaCalendarCheck className="text-amber-400" />
                {(property.purpose || "").toLowerCase() === "rent"
                  ? "Rent & Tour Inquiry"
                  : (property.purpose || "").toLowerCase() === "commercial"
                  ? "Commercial Leasing"
                  : "Schedule A Viewing"}
              </h3>
              <p className="text-xs text-slate-300">
                {(property.status || "").toLowerCase() === "available"
                  ? "Book a private in-person or live video walkthrough with an estate specialist."
                  : `This property is currently ${(property.status || "booked").toUpperCase()}. Contact us for waitlists.`}
              </p>
              <button
                onClick={() => setIsTourModalOpen(true)}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-md transition cursor-pointer active:scale-95 ${
                  (property.status || "").toLowerCase() === "available"
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                {(property.status || "").toLowerCase() === "available"
                  ? "Request Private Tour / Booking"
                  : `Inquire (${(property.status || "booked").toUpperCase()})`}
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

