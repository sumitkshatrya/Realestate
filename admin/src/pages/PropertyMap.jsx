import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaBuilding,
  FaBed,
  FaBath,
  FaSearch,
  FaGlobeAmericas,
} from "react-icons/fa";
import { propertyAPI } from "../api/propertyApi";
import { useFetchData } from "../api/useFetchData";

const PropertyMap = () => {
  const { data: properties, loading } = useFetchData(propertyAPI.getProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const listings = (properties || []).filter(
    (p) =>
      p.isActive !== false &&
      typeof p.latitude === "number" &&
      typeof p.longitude === "number" &&
      !Number.isNaN(p.latitude) &&
      !Number.isNaN(p.longitude)
  );

  const filteredListings = listings.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.address || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProperty =
    filteredListings.find((p) => p._id === selectedPropertyId) || filteredListings[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <Motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Geographic Spatial Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Interactive Property Map</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore property coordinates and spatial locations rendered on live map feeds.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center shrink-0">
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Mapped Locations</span>
          <span className="text-lg font-extrabold text-red-400">{listings.length} Properties</span>
        </div>
      </Motion.div>

      {/* MAP WORKSPACE GRID */}
      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          Loading spatial maps and property coordinates...
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-16 text-center">
          <FaGlobeAmericas className="text-4xl text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No Coordinates Configured</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Provide latitude and longitude coordinates when adding or editing properties to display them on the map.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* SIDE PANEL LIST OF MAPPED PROPERTIES */}
          <div className="space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter locations..."
                className="input-field pl-10"
              />
            </div>

            <div className="max-h-[560px] overflow-y-auto space-y-3 pr-1">
              {filteredListings.map((prop) => {
                const isSelected = activeProperty && activeProperty._id === prop._id;

                return (
                  <div
                    key={prop._id}
                    onClick={() => setSelectedPropertyId(prop._id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/5"
                        : "border-white/10 bg-slate-900/70 hover:bg-slate-900 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white line-clamp-1">{prop.name}</h3>
                      <span className="text-xs font-black text-red-400 shrink-0">{prop.price}</span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                      <FaMapMarkerAlt className="text-red-400 text-[10px] shrink-0" />
                      {prop.address}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Lat: {prop.latitude}</span>
                      <span>Lng: {prop.longitude}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FEATURED MAP VIEWER */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/80 overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col min-h-[500px]">
            {activeProperty ? (
              <>
                <div className="relative flex-1 min-h-[400px]">
                  <iframe
                    title={`Map showing ${activeProperty.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeProperty.longitude - 0.05}%2C${activeProperty.latitude - 0.03}%2C${activeProperty.longitude + 0.05}%2C${activeProperty.latitude + 0.03}&layer=mapnik&marker=${activeProperty.latitude}%2C${activeProperty.longitude}`}
                    className="h-full w-full border-0"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 border-t border-white/10 bg-slate-950/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white">{activeProperty.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-red-400 text-xs" />
                      {activeProperty.address}
                    </p>
                  </div>

                  <a
                    href={`https://www.openstreetmap.org/?mlat=${activeProperty.latitude}&mlon=${activeProperty.longitude}#map=15/${activeProperty.latitude}/${activeProperty.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary text-xs py-2 shrink-0"
                  >
                    <FaExternalLinkAlt className="text-[10px]" />
                    <span>Open External Map</span>
                  </a>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-12 text-slate-500 text-sm">
                Select a property listing to view location coordinates.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
