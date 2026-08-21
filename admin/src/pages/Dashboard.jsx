import React, { useMemo } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaBuilding,
  FaCheckCircle,
  FaClipboardList,
  FaEnvelope,
  FaHandshake,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { servicesAPI } from "../api/servicesApi";
import { adminFetchAll } from "../api/testimonialApi";
import { contactAPI } from "../api/contactApi";
import { tourAPI } from "../api/tourApi";
import { popularAreaAPI } from "../api/popularAreaApi";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi";
import { useFetchData } from "../api/useFetchData";

const Dashboard = () => {
  const { data: testimonials, totalCount: totalTestimonials } = useFetchData(adminFetchAll);
  const { data: services } = useFetchData(servicesAPI.getServices);
  const { data: contacts } = useFetchData(contactAPI.getContacts);
  const { data: tours } = useFetchData(tourAPI.getTours);
  const { data: areas } = useFetchData(popularAreaAPI.getAreas);
  const { data: properties } = useFetchData(propertyAPI.getProperties);
  const { data: users } = useFetchData(userAPI.getUsers);

  const metrics = useMemo(
    () => [
      {
        label: "Total Testimonials",
        value: totalTestimonials,
        icon: FaClipboardList,
      },
      {
        label: "Approved Testimonials",
        value: testimonials.filter((item) => item.status === "Approved").length,
        icon: FaCheckCircle,
      },
      {
        label: "Services",
        value: services.length,
        icon: FaLayerGroup,
      },
      {
        label: "Properties",
        value: properties.length,
        icon: FaBuilding,
      },
      {
        label: "Popular Areas",
        value: areas.length,
        icon: FaMapMarkerAlt,
      },
      {
        label: "Tour Requests",
        value: tours.length,
        icon: FaHandshake,
      },
      {
        label: "Contact Messages",
        value: contacts.length,
        icon: FaEnvelope,
      },
      {
        label: "Registered Users",
        value: users.length,
        icon: FaUsers,
      },
    ],
    [
      services.length,
      testimonials,
      totalTestimonials,
      properties.length,
      areas.length,
      tours.length,
      contacts.length,
      users.length,
    ]
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
          Overview
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Your admin workspace is live
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
          Manage public content from the dedicated admin project. Testimonials
          and services are now organized away from the customer-facing app.
        </p>
      </Motion.section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const MetricIcon = metric.icon;

          return (
          <Motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * index, duration: 0.28 }}
            className="rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
              </div>
              <div className="rounded-2xl bg-red-500/15 p-4 text-red-300">
                <MetricIcon className="text-xl" />
              </div>
            </div>
          </Motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
