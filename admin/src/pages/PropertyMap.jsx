import React from "react";
import { motion as Motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { propertyAPI } from "../api/propertyApi";
import { useFetchData } from "../api/useFetchData";

const PropertyMap = () => {
  const { data: properties, loading } = useFetchData(propertyAPI.getProperties);

  const listings = properties.filter(
    (p) =>
      p.isActive !== false &&
      typeof p.latitude === "number" &&
      typeof p.longitude === "number" &&
      !Number.isNaN(p.latitude) &&
      !Number.isNaN(p.longitude)
  );

  return (
    <div className="space-y-6">
      <Motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-red-300/75">
          Location directory
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Property map</h1>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          Review the published location for every property type shown on the
          customer website. Only properties with valid coordinates are listed.
        </p>
      </Motion.section>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading property locations...
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center">
          <p className="font-semibold text-white">No properties with coordinates</p>
          <p className="mt-1 text-sm text-slate-400">
            Add latitude and longitude when creating properties to see them on the map.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((property, index) => {
            const { latitude, longitude } = property;
            const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.08}%2C${latitude - 0.05}%2C${longitude + 0.08}%2C${latitude + 0.05}&layer=mapnik&marker=${latitude}%2C${longitude}`;
            return (
              <Motion.article
                key={property._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75"
              >
                <iframe
                  title={`Map showing ${property.name}`}
                  src={mapUrl}
                  className="h-52 w-full border-0"
                  loading="lazy"
                />
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <h2 className="font-semibold text-white">{property.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      <FaMapMarkerAlt className="mr-1 inline text-red-300" />
                      {property.address}
                    </p>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-red-300 hover:text-white"
                  >
                    Open
                  </a>
                </div>
              </Motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
