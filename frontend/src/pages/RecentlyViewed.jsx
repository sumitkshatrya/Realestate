import React, { useEffect, useState } from 'react';
import { propertyAPI } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/useAuth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { userAPI } from '../api/userApi';
import toast from 'react-hot-toast';

const RecentlyViewed = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, updateUser } = useAuth();

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (viewedIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await propertyAPI.getPropertiesByIds(viewedIds);
        // Ensure the order is the same as the viewedIds (most recent first)
        const sortedProperties = viewedIds
          .map(id => response.data?.find(p => p._id === id))
          .filter(Boolean); // Filter out any properties that might not have been found
        setProperties(sortedProperties);
      } catch (error) {
        console.error("Failed to fetch recently viewed properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, []);

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save properties.");
      return;
    }
    try {
      const res = await userAPI.toggleFavorite(propertyId);
      if (updateUser && res?.data?.favorites) {
        updateUser({ favorites: res.data.favorites });
      }
      const isFav = user?.favorites?.includes(propertyId);
      toast.success(isFav ? "Removed from favorites." : "Added to favorites!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favorites.");
    }
  };

  if (loading || properties.length === 0) {
    return null; // Don't render the section if there's nothing to show or it's loading
  }

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/60 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-block mb-3">
            Your History
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Recently Viewed Properties</h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Pick up where you left off in your search.</p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="pb-14"
        >
          {properties.map((property) => (
            <SwiperSlide key={property._id}>
              <div className="h-full">
                <PropertyCard
                  property={property}
                  isFavorite={user?.favorites?.includes(property._id)}
                  onToggleFavorite={handleToggleFavorite}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecentlyViewed;