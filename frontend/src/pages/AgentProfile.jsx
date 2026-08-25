import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { agentAPI } from "../api/agentApi";
import { userAPI } from "../api/userApi";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import PropertyCard from "../components/PropertyCard";
import ContactAgentModal from "../components/ContactAgentModal";
import EditAgentProfileModal from "../components/EditAgentProfileModal";
import SubmitTestimonialModal from "../components/SubmitTestimonialModal";
import ValuationRequestModal from "../components/ValuationRequestModal";
import TestimonialCard from "../components/TestimonialCard";
import ListingsMap from "../components/ListingsMap";
import ShareProfile from "../components/ShareProfile";
import { FaEnvelope, FaPhone, FaUserCircle, FaArrowLeft, FaSearch, FaPaperPlane, FaArrowUp, FaList, FaMap, FaEdit, FaSort, FaCalculator, FaPen } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AgentProfile = () => {
  const { id } = useParams();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleOnMap, setVisibleOnMap] = useState([]);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchAgentProfile = async () => {
      window.scrollTo(0, 0);
      try {
        setLoading(true);
        const [profileResponse, testimonialsResponse] = await Promise.all([
          agentAPI.getAgentProfile(id),
          agentAPI.getAgentTestimonials(id)
        ]);

        setAgent(profileResponse.data.agent);
        setProperties(profileResponse.data.properties);
        setTestimonials(testimonialsResponse.data.testimonials || []);
      } catch (err) {
        setError("Failed to load agent profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentProfile();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage your favorites.");
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
    } catch (err) {
      toast.error("Failed to update favorites.");
      updateUser({ favorites: originalFavorites });
    }
  };

  const handleProfileUpdate = (updatedAgent) => {
    setAgent(updatedAgent);
    // If the username was changed, update it in the auth context as well
    if (user?._id === updatedAgent._id) updateUser(updatedAgent);
  };

  const parsePrice = (priceString) => {
    if (typeof priceString !== "string") return 0;
    return parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  };

  const sortedAndFilteredProperties = useMemo(() => {
    let filtered = properties;
    if (searchQuery) {
      filtered = properties.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "date-asc":
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "date-desc":
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return sorted;
  }, [properties, searchQuery, sortBy]);

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading Agent Profile...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  if (!agent) {
    return <div className="text-center py-20 text-xl">Agent not found.</div>;
  }

  const handleMarkerClick = (propertyId) => {
    const cardElement = document.getElementById(`property-card-${propertyId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="section-shell py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <Link to="/#properties" className="inline-flex items-center gap-2 text-rose-600 font-semibold mb-8 hover:underline">
          <FaArrowLeft />
          Back to Listings
        </Link>

        <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-200 mb-12 flex flex-col md:flex-row items-center gap-8">
          {agent.profilePicture ? (
            <img src={agent.profilePicture} alt={agent.username} className="w-32 h-32 rounded-full object-cover border-4 border-rose-500" />
          ) : (
            <FaUserCircle className="w-32 h-32 text-slate-300" />
          )}
          <div className="flex-grow">
            <h1 className="font-serif text-4xl font-bold text-slate-900">{agent.username}</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">{agent.bio || "This agent has not provided a biography yet."}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm">
              <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-slate-700 hover:text-rose-600">
                <FaEnvelope /> {agent.email}
              </a>
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-rose-600">
                  <FaPhone /> {agent.phone}
                </a>
              )}
            </div>
            {/* Agent Statistics */}
            {(agent.propertiesSold || agent.averageResponseTime || agent.yearsOfExperience) && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-t border-slate-200 pt-6">
                {agent.propertiesSold && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-rose-600">{agent.propertiesSold}</p>
                    <p className="text-sm text-slate-600">Properties Sold</p>
                  </div>
                )}
                {agent.averageResponseTime && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-rose-600">{agent.averageResponseTime}</p>
                    <p className="text-sm text-slate-600">Avg. Response</p>
                  </div>
                )}
                {agent.yearsOfExperience && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-rose-600">{agent.yearsOfExperience}+</p>
                    <p className="text-sm text-slate-600">Years Exp.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 self-start md:self-center">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="btn btn-primary inline-flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FaPaperPlane />
              Contact Agent
            </button>
            <button
              onClick={() => setIsValuationModalOpen(true)}
              className="btn btn-secondary inline-flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FaCalculator />
              Request Valuation
            </button>
            <ShareProfile agent={agent} />
            {isAuthenticated && user?._id === agent?._id && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="btn btn-secondary inline-flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="font-serif text-3xl font-bold text-slate-900">Properties Listed by {agent.username}</h2>
          <div className="flex items-center gap-2 rounded-full bg-slate-200 p-1">
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${viewMode === 'list' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}><FaList /> List View</button>
            <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${viewMode === 'map' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}><FaMap /> Map View</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'list' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-end">
                  <div className="relative w-full sm:w-auto flex-grow">
                    <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Filter listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-input pl-12 w-full" />
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <FaSort className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input pl-12 w-full appearance-none">
                      <option value="date-desc">Sort by: Newest</option>
                      <option value="date-asc">Sort by: Oldest</option>
                      <option value="price-desc">Sort by: Price (High-Low)</option>
                      <option value="price-asc">Sort by: Price (Low-High)</option>
                    </select>
                  </div>
                </div>

                {sortedAndFilteredProperties.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {sortedAndFilteredProperties.map((p) => (
                      <PropertyCard key={p._id} property={p} isFavorite={user?.favorites?.includes(p._id)} onToggleFavorite={handleToggleFavorite} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-10 bg-slate-50 rounded-lg">{searchQuery ? `No listings match "${searchQuery}"` : "This agent has no active listings."}</p>
                )}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="space-y-8">
                <ListingsMap properties={properties} onVisibleChange={setVisibleOnMap} hoveredPropertyId={hoveredPropertyId} onMarkerClick={handleMarkerClick} />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    {visibleOnMap.length} propert{visibleOnMap.length === 1 ? 'y' : 'ies'} found in this area
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
                            isFavorite={
                              user?.favorites?.includes(p._id)
                            }
                            onToggleFavorite={handleToggleFavorite}
                          />
                        </div>
                      )}
                    </div>
                  ) : <p className="text-slate-500">Zoom or pan the map to find more properties.</p>}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {testimonials.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row justify-center items-center text-center gap-4 mb-8">
            <h2 className="font-serif text-3xl font-bold text-slate-900">What Clients Say</h2>
            {isAuthenticated && user?._id !== agent?._id && (
              <button
                onClick={() => setIsTestimonialModalOpen(true)}
                className="btn btn-secondary btn-sm inline-flex items-center gap-2"
              >
                <FaPen />
                Leave a Review
              </button>
            )}
          </div>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12" 
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial._id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {agent && (
        <ContactAgentModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          agent={agent}
        />
      )}

      {agent && (
        <EditAgentProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          agent={agent}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {agent && (
        <SubmitTestimonialModal
          isOpen={isTestimonialModalOpen}
          onClose={() => setIsTestimonialModalOpen(false)}
          agent={agent}
        />
      )}

      {agent && (
        <ValuationRequestModal
          isOpen={isValuationModalOpen}
          onClose={() => setIsValuationModalOpen(false)}
          agent={agent}
        />
      )}

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg"
            aria-label="Back to top"
          >
            <FaArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentProfile;