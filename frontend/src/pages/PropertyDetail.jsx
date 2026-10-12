import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi";
import { getSocket } from "../api/socketClient";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed, FaBath, FaArrowLeft, FaHeart, FaCalendarCheck, FaImages, FaShareNodes, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.name || "Property Details",
          text: `Check out this listing: ${property?.name}`,
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing URL copied to clipboard!");
    }
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    if (!property?.images?.length) return;
    setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    if (!property?.images?.length) return;
    setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-200 rounded-lg w-32 sm:w-48" />
            <div className="h-9 bg-slate-200 rounded-xl w-36" />
          </div>
          <div className="h-[260px] sm:h-[380px] lg:h-[480px] bg-slate-200 rounded-3xl w-full" />
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-10 bg-slate-200 rounded-2xl w-3/4" />
              <div className="h-5 bg-slate-200 rounded-lg w-1/2" />
              <div className="h-32 bg-slate-200 rounded-3xl" />
              <div className="h-64 bg-slate-200 rounded-3xl" />
            </div>
            <div className="hidden lg:block lg:col-span-4 h-96 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Property Not Found</h2>
          <p className="text-sm text-slate-600">{error || "The requested property listing is no longer available or was removed."}</p>
          <Link 
            to="/#properties" 
            className="inline-block w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
          >
            Explore Other Properties
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = (user?.favorites || []).some((f) => String(f?._id || f) === String(property?._id));

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-28 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/#properties"
            className="inline-flex items-center gap-2 text-slate-700 font-bold text-xs sm:text-sm hover:text-blue-600 transition group py-1.5"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-slate-500" />
            <span className="hidden sm:inline">Back to All Listings</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="px-3 sm:px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
              aria-label="Share listing"
            >
              <FaShareNodes />
              <span>Share</span>
            </button>
            <button
              onClick={() => handleToggleFavorite(property._id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 border ${
                isSaved
                  ? "bg-red-500 text-white border-red-500 shadow-red-500/20"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              }`}
              aria-label={isSaved ? "Saved to favorites" : "Save to favorites"}
            >
              <FaHeart className={isSaved ? "fill-white" : ""} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="mb-8 sm:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            
            {/* Main Featured Image with Navigation Arrows */}
            <div
              className="lg:col-span-2 h-[260px] sm:h-[380px] lg:h-[460px] rounded-2xl sm:rounded-3xl bg-slate-900 overflow-hidden relative group cursor-pointer shadow-md select-none"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={property.images[selectedImage]}
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

              {/* On-Hero Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-10"
                    aria-label="Previous property photo"
                  >
                    <FaChevronLeft className="text-sm sm:text-base" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-10"
                    aria-label="Next property photo"
                  >
                    <FaChevronRight className="text-sm sm:text-base" />
                  </button>
                </>
              )}

              {/* View Full Gallery Badge */}
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 flex items-center gap-2">
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 border border-white/20 shadow-lg">
                  <FaImages /> 
                  <span>{selectedImage + 1} / {property.images.length}</span>
                  <span className="hidden sm:inline">Photos</span>
                </span>
              </div>
            </div>

            {/* Desktop Side Thumbnails */}
            <div className="hidden lg:grid grid-cols-1 gap-4">
              {property.images.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-[220px] rounded-3xl overflow-hidden cursor-pointer relative group border-2 transition-all ${
                    selectedImage === idx ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

          </div>

          {/* Mobile & Tablet Interactive Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar py-2 mt-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-16 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === idx ? 'border-blue-600 ring-2 ring-blue-600/30 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Info Left Column (8 cols on Desktop) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
              
              {/* Purpose, Category & Availability Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-sm ${
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
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                    {property.category}
                  </span>
                )}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
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
                  className={`p-4 rounded-2xl border text-sm font-bold flex items-start sm:items-center gap-3 ${
                    (property.status || "").toLowerCase() === "sold"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : (property.status || "").toLowerCase() === "rented"
                      ? "bg-blue-50 border-blue-200 text-blue-800"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5 sm:mt-0">
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
                    <p className="text-xs font-normal opacity-90 mt-0.5">
                      You can still contact our team below for waitlist inquiries or similar alternative listings.
                    </p>
                  </div>
                </div>
              )}

              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pt-1">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {property.name}
                  </h1>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 tracking-tight">
                    {property.price}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {(property.purpose || "").toLowerCase() === "rent" ? "Per Month" : "Listing Price"}
                  </p>
                </div>
              </div>

              {/* Address with Map Link */}
              <button
                type="button"
                onClick={handleOpenMap}
                className="flex items-start sm:items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer text-left font-medium group"
                title="Click to view location on Google Maps"
              >
                <FaMapMarkerAlt className="text-amber-500 text-base shrink-0 mt-0.5 sm:mt-0 group-hover:scale-110 transition-transform" />
                <span>
                  {property.address}{" "}
                  <span className="text-xs text-blue-600 font-bold underline ml-1 inline-flex items-center">
                    (Open Map)
                  </span>
                </span>
              </button>

              {/* Key Specs Responsive Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
                  <FaBed className="mx-auto text-lg sm:text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-base sm:text-lg text-slate-900">{property.bed || 0}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Beds</p>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
                  <FaBath className="mx-auto text-lg sm:text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-base sm:text-lg text-slate-900">{property.bath || 0}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Baths</p>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
                  <MdSpaceDashboard className="mx-auto text-lg sm:text-xl text-blue-600 mb-1" />
                  <p className="font-extrabold text-base sm:text-lg text-slate-900 truncate">{property.area || "N/A"}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Sq Ft</p>
                </div>
              </div>
            </div>

            {/* AI Property Intelligence Card */}
            <AIPropertyInsightsCard property={property} />

            {/* Detailed Tabs Component */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
              <PropertyTabs property={property} />
            </div>
          </div>

          {/* Right Sidebar Action Column (4 cols on Desktop, Full width on Mobile/Tablet) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            
            {/* Tour Schedule Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaCalendarCheck className="text-amber-400 shrink-0" />
                <span>
                  {(property.purpose || "").toLowerCase() === "rent"
                    ? "Rent & Tour Inquiry"
                    : (property.purpose || "").toLowerCase() === "commercial"
                    ? "Commercial Leasing"
                    : "Schedule A Viewing"}
                </span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {(property.status || "").toLowerCase() === "available"
                  ? "Book a private in-person or live video walkthrough with a verified real estate specialist."
                  : `This property is currently ${(property.status || "booked").toUpperCase()}. Contact us for waitlists.`}
              </p>
              <button
                onClick={() => setIsTourModalOpen(true)}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-md transition cursor-pointer active:scale-95 ${
                  (property.status || "").toLowerCase() === "available"
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                {(property.status || "").toLowerCase() === "available"
                  ? "Request Private Tour / Booking"
                  : `Inquire (${(property.status || "booked").toUpperCase()})`}
              </button>
            </div>

            {/* Agent Contact Card */}
            <div id="agent-contact-section">
              <ContactAgentForm
                agentName={property.owner}
                propertyName={property.name}
                propertyId={property._id}
              />
            </div>
          </div>

        </div>

        {/* Similar Listings Section */}
        <div className="mt-16 sm:mt-20 pt-10 sm:pt-12 border-t border-slate-200">
          <div className="mb-6 sm:mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Curated Matches</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Similar Luxury Properties</h2>
          </div>
          {similarLoading ? (
            <div className="text-center py-10 text-slate-500 font-semibold">Loading recommendations...</div>
          ) : similarProperties.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
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
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm italic">
              No similar properties currently listed in this category or area.
            </div>
          )}
        </div>

      </div>

      {/* Sticky Mobile / Tablet Bottom Bar (Elevates Mobile Conversion & UX) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">
              {(property.purpose || "").toLowerCase() === "rent" ? "Rent" : "Price"}
            </p>
            <p className="text-lg sm:text-xl font-black text-blue-600 truncate">
              {property.price}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const contactElement = document.getElementById("agent-contact-section");
                if (contactElement) {
                  contactElement.scrollIntoView({ behavior: "smooth" });
                } else {
                  setIsTourModalOpen(true);
                }
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition active:scale-95 cursor-pointer"
            >
              Contact Agent
            </button>
            <button
              onClick={() => setIsTourModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <FaCalendarCheck /> Schedule Tour
            </button>
          </div>
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


