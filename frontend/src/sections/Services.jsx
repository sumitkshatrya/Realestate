// pages/Services.js
import React, { useEffect, useState, useCallback } from "react";
import { useDarkMode } from "../components/DarkModeContext";
import { servicesAPI } from "../api/servicesApi";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaKey, 
  FaMapMarkerAlt, 
  FaChartLine, 
  FaBuilding, 
  FaTools,
  FaHandshake,
  FaCity,
  FaSearchDollar,
  FaClipboardList,
  FaSyncAlt
} from "react-icons/fa";

// Enhanced icon map with more options
const iconMap = {
  FaHome: FaHome,
  FaKey: FaKey,
  FaMapMarkerAlt: FaMapMarkerAlt,
  FaChartLine: FaChartLine,
  FaBuilding: FaBuilding,
  FaTools: FaTools,
  FaHandshake: FaHandshake,
  FaCity: FaCity,
  FaSearchDollar: FaSearchDollar,
  FaClipboardList: FaClipboardList,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 600,
      easing: "ease-in-out",
      delay: 50,
      once: true,
      mirror: false
    });
  }, []);

  // Refresh AOS when services load
  useEffect(() => {
    if (services.length > 0) {
      AOS.refresh();
    }
  }, [services]);

  // Memoized fetch function
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Starting to fetch services...');
      
      const servicesData = await servicesAPI.getServices();
      console.log('📦 Raw API response:', servicesData);
      
      // Validate and transform data
      let validatedServices = [];
      
      if (Array.isArray(servicesData)) {
        console.log('✅ API returned array with', servicesData.length, 'items');
        
        // Filter active services
        const activeServices = servicesData.filter(service => {
          const isActive = service.isActive !== false;
          console.log(`Service: ${service.title}, isActive: ${service.isActive}, Display: ${isActive}`);
          return isActive;
        });
        
        console.log('🎯 Active services after filtering:', activeServices.length);
        
        // Sort by order
        validatedServices = activeServices
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(service => ({
            ...service,
            title: service.title || 'Untitled Service',
            description: service.description || 'No description available.',
            icon: service.icon in iconMap ? service.icon : 'FaBuilding'
          }));
      } else {
        console.log('❌ API did not return an array:', typeof servicesData);
      }
      
      console.log('🎨 Final processed services:', validatedServices);
      setServices(validatedServices);
      
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      setError("Unable to load services. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Add this function to manually check the API
  const checkAPI = async () => {
    try {
      console.log('🔍 Manually checking API...');
      const response = await servicesAPI.getServices();
      console.log('🔍 Manual API check:', response);
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error('🔍 Manual API check failed:', error);
    }
  };

  // Loading component
  if (loading) {
    return (
      <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen flex items-center justify-center py-20`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Loading our services...
          </p>
          <button 
            onClick={checkAPI}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Debug API
          </button>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen flex items-center justify-center py-20`}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSyncAlt className="text-red-600 dark:text-red-400 text-2xl" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Something went wrong
          </h3>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {error}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={fetchServices}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
            <button
              onClick={checkAPI}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              Debug API
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <section
        id="services"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
            What We Offer
          </div>
          <h1
            data-aos="fade-up"
            className={`text-4xl lg:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Our <span className="text-red-600 dark:text-red-500">Services</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className={`text-xl max-w-3xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Comprehensive real estate solutions tailored to meet your unique needs and aspirations
          </p>
          
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Debug Info:</strong> Showing {services.length} services | 
              <button 
                onClick={checkAPI} 
                className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded text-xs"
              >
                Check API
              </button>
              <button 
                onClick={fetchServices} 
                className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
              >
                Refresh
              </button>
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              
              return (
                <div
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  key={service._id || index}
                  className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-750 border border-gray-700" 
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  } hover:shadow-xl hover:-translate-y-2`}
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="text-white text-2xl" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {service.title}
                    </h3>
                    
                    <p className={`leading-relaxed mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {service.description}
                    </p>

                    {/* Read More Button */}
                    <Link
                      to={`/services/${service.slug || service._id}`}
                      className="inline-flex items-center font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300 group/btn"
                    >
                      Learn More
                      <svg 
                        className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Debug info for each service */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {service.icon}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            // Empty state
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTools className="text-gray-400 dark:text-gray-500 text-3xl" />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                No Services Available
              </h3>
              <p className={`text-lg max-w-md mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                We're currently updating our services. Please check back later.
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <button
                  onClick={fetchServices}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Refresh Page
                </button>
                <button
                  onClick={checkAPI}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Debug API
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        {services.length > 0 && (
          <div 
            data-aos="fade-up"
            className="text-center mt-16 lg:mt-20"
          >
            <div className={`rounded-2xl p-8 lg:p-12 ${
              darkMode 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200"
            }`}>
              <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Ready to Get Started?
              </h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Let us help you find the perfect property or service for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Get In Touch
                </Link>
                <Link
                  to="/about"
                  className={`px-8 py-4 font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Services;