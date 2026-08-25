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
    <div className="mt-10">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "description" && (
              <div className="prose max-w-none text-slate-700 leading-8">
                <p>{property.about}</p>
              </div>
            )}

            {activeTab === "features" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {features.map((feature, index) => (
                  feature.label === "Listed By" && property.ownerId ? (
                    <div key={index} className="flex justify-between border-b border-slate-200 py-3">
                      <span className="font-semibold text-slate-600">{feature.label}</span>
                      <Link to={`/agent/${property.ownerId}`} className="text-rose-600 font-semibold hover:underline">
                        {feature.value}
                      </Link>
                    </div>
                  ) : (
                    <div key={index} className="flex justify-between border-b border-slate-200 py-3">
                      <span className="font-semibold text-slate-600">{feature.label}</span>
                      <span className="text-slate-800">{feature.value}</span>
                    </div>
                  )
                ))}
              </div>
            )}

            {activeTab === "mortgage" && (
              <MortgageCalculator propertyPrice={property.price} />
            )}

            {activeTab === "location" && (
              <div>
                {mapUrl ? (
                  <div className="h-[400px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                    <iframe
                      title="Property Location"
                      src={mapUrl}
                      className="h-full w-full border-0"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-10">
                    Location data is not available for this property.
                  </p>
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