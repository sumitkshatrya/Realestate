import React, { useEffect, useState } from 'react';
import { propertyAPI } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/useAuth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RecentlyViewed = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
          .map(id => response.data.find(p => p._id === id))
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

  if (loading || properties.length === 0) {
    return null; // Don't render the section if there's nothing to show or it's loading
  }

  return (
    <div className="section-shell py-16 bg-slate-50">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold text-slate-900">Recently Viewed Properties</h2>
        <p className="text-slate-600 mt-2">Pick up where you left off.</p>
      </div>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12" // Add padding for pagination
      >
        {properties.map((property) => (
          <SwiperSlide key={property._id}>
            <PropertyCard
              property={property}
              isFavorite={user?.favorites?.includes(property._id)}
              // The onToggleFavorite prop would need to be passed if you want that functionality here
              onToggleFavorite={null} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecentlyViewed;