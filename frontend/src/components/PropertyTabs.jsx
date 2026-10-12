import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle, FaListUl, FaMapMarkedAlt, FaCalculator } from "react-icons/fa";
import { Link } from "react-router-dom";
import MortgageCalculator from "./MortgageCalculator";

const PropertyTabs = ({ property }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", icon: <FaInfoCircle /> },
    { id: "features", label: "Features", icon: <FaListUl /> },
    { id: "mortgage", label: "Mortgage", icon: <FaCalculator /> },
    { id: "location", label: "Location Map", icon: <FaMapMarkedAlt /> },
  ];

  const mapUrl =
    property.latitude && property.longitude
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01},${property.latitude - 0.01},${property.longitude + 0.01},${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude},${property.longitude}`
      : null;

  const features = [
    { label: "Price", value: property.price },
    { label: "Bedrooms", value: property.bed },
    { label: "Bathrooms", value: property.bath },
    { label: "Area", value: property.area },
    { label: "Listed By", value: property.owner },
    // Add more features here if they exist in your data model
  ];

  return (
    <div className="mt-2 sm:mt-6">
      {/* Scrollable Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav 
          className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar scroll-smooth py-1" 
          aria-label="Property Information Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 font-bold bg-blue-50/50 sm:bg-transparent rounded-lg sm:rounded-none"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium"
              } flex items-center gap-2 shrink-0 py-3 sm:py-4 px-3 sm:px-2 border-b-2 text-xs sm:text-sm transition-all cursor-pointer`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "description" && (
              <div className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
                <p className="whitespace-pre-line">{property.about || "No detailed description provided for this property listing."}</p>
              </div>
            )}

            {activeTab === "features" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm"
                  >
                    <span className="font-semibold text-slate-500 text-xs sm:text-sm">{feature.label}</span>
                    {feature.label === "Listed By" && property.ownerId ? (
                      <Link 
                        to={`/agent/${property.ownerId}`} 
                        className="text-blue-600 font-bold hover:underline truncate max-w-[180px]"
                      >
                        {feature.value || "Verified Agent"}
                      </Link>
                    ) : (
                      <span className="font-bold text-slate-800 truncate max-w-[180px]">{feature.value || "N/A"}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "mortgage" && (
              <div className="overflow-hidden">
                <MortgageCalculator propertyPrice={property.price} />
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-3">
                {mapUrl ? (
                  <div className="h-[260px] sm:h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                    <iframe
                      title="Property Location"
                      src={mapUrl}
                      className="h-full w-full border-0"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FaMapMarkedAlt className="mx-auto text-3xl text-slate-300 mb-2" />
                    <p className="text-sm font-medium">Exact coordinates are not available for this listing.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyTabs;