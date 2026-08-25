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
  FaArrowUp,
  FaArrowDown,
  FaPlusCircle,
  FaChartLine,
  FaRegCompass,
  FaCog,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { servicesAPI } from "../api/servicesApi";
import { adminFetchAll } from "../api/testimonialApi";
import { contactAPI } from "../api/contactApi";
import { tourAPI } from "../api/tourApi";
import { popularAreaAPI } from "../api/popularAreaApi";
import { propertyAPI } from "../api/propertyApi";
import { userAPI } from "../api/userApi";
import { useFetchData } from "../api/useFetchData";

const Dashboard = () => {
  const navigate = useNavigate();

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
        label: "Total Properties",
        value: properties.length,
        trend: "+12% this month",
        isPositive: true,
        icon: FaBuilding,
        color: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20",
        path: "/properties",
      },
      {
        label: "Tour Requests",
        value: tours.length,
        trend: "+18% leads",
        isPositive: true,
        icon: FaHandshake,
        color: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20",
        path: "/tours",
      },
      {
        label: "Contact Messages",
        value: contacts.length,
        trend: "5 pending reply",
        isPositive: true,
        icon: FaEnvelope,
        color: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20",
        path: "/contacts",
      },
      {
        label: "Registered Users",
        value: users.length,
        trend: "+8 new users",
        isPositive: true,
        icon: FaUsers,
        color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
        path: "/users",
      },
      {
        label: "Popular Areas",
        value: areas.length,
        trend: "Active locations",
        isPositive: true,
        icon: FaMapMarkerAlt,
        color: "from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20",
        path: "/popular-areas",
      },
      {
        label: "Services Offered",
        value: services.length,
        trend: "Platform features",
        isPositive: true,
        icon: FaLayerGroup,
        color: "from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20",
        path: "/services",
      },
      {
        label: "Total Testimonials",
        value: totalTestimonials,
        trend: "Client feedback",
        isPositive: true,
        icon: FaClipboardList,
        color: "from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/20",
        path: "/testimonials",
      },
      {
        label: "Approved Reviews",
        value: testimonials.filter((item) => item.status === "Approved").length,
        trend: "Published live",
        isPositive: true,
        icon: FaCheckCircle,
        color: "from-teal-500/20 to-teal-600/5 text-teal-400 border-teal-500/20",
        path: "/testimonials",
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

  // Recent activity aggregated from recent items
  const recentActivities = useMemo(() => {
    const tourItems = (tours || []).slice(0, 3).map((t) => ({
      id: t._id || Math.random(),
      title: `Tour Request from ${t.name || t.fullName || "Customer"}`,
      sub: t.propertyTitle || "Property Viewing",
      date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recent",
      type: "Tour",
      badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    }));

    const contactItems = (contacts || []).slice(0, 3).map((c) => ({
      id: c._id || Math.random(),
      title: `Message from ${c.name || "Visitor"}`,
      sub: c.subject || c.message || "General Enquiry",
      date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recent",
      type: "Contact",
      badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    }));

    return [...tourItems, ...contactItems].slice(0, 5);
  }, [tours, contacts]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* EXECUTIVE WELCOME BANNER */}
      <Motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                Market Console Active
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
              Real Estate Enterprise Executive Dashboard
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
              Real-time monitoring of property inventory, customer viewing tours, lead messages, and platform analytics.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/properties")}
              className="btn btn-primary shadow-lg"
            >
              <FaPlusCircle className="text-xs" />
              <span>Add Property</span>
            </button>
            <button
              onClick={() => navigate("/property-map")}
              className="btn btn-secondary"
            >
              <FaRegCompass className="text-xs" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </Motion.section>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const MetricIcon = metric.icon;

          return (
            <Motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.28 }}
              onClick={() => navigate(metric.path)}
              className="group cursor-pointer rounded-3xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/30 hover:bg-slate-900 hover:shadow-xl hover:shadow-red-500/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{metric.label}</span>
                <div className={`rounded-2xl border bg-gradient-to-br p-3 shadow-inner ${metric.color}`}>
                  <MetricIcon className="text-base" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">{metric.value}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <FaArrowUp className="text-[9px]" />
                  {metric.trend}
                </span>
              </div>
            </Motion.div>
          );
        })}
      </div>

      {/* ANALYTICS VISUALIZERS SECTION */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inventory & Lead Breakdown Chart (Visual SVG Bars) */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FaChartLine className="text-red-400" />
                Platform Inventory & Operations Funnel
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Live distribution of platform assets and customer activity</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              Realtime
            </span>
          </div>

          {/* Visual SVG Progress Bars */}
          <div className="space-y-4">
            {[
              { title: "Properties Inventory", count: properties.length, max: Math.max(properties.length, 20), color: "bg-blue-500" },
              { title: "Tour Booking Requests", count: tours.length, max: Math.max(tours.length, 20), color: "bg-purple-500" },
              { title: "Contact Enquiries", count: contacts.length, max: Math.max(contacts.length, 20), color: "bg-amber-500" },
              { title: "Registered Users", count: users.length, max: Math.max(users.length, 20), color: "bg-emerald-500" },
              { title: "Popular Areas Managed", count: areas.length, max: Math.max(areas.length, 20), color: "bg-cyan-500" },
            ].map((item) => {
              const percentage = Math.min(Math.round((item.count / (item.max || 1)) * 100), 100);
              return (
                <div key={item.title} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{item.title}</span>
                    <span className="font-bold text-white">{item.count} items ({percentage}%)</span>
                  </div>
                  <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-white/5">
                    <Motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Motion.div>

        {/* RECENT ACTIVITY & SYSTEM LOGS */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white">Recent Activity</h3>
            <button
              onClick={() => navigate("/tours")}
              className="text-xs font-semibold text-red-400 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No recent activity logged.</p>
            ) : (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 hover:bg-white/5 transition"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-white truncate">{act.title}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{act.sub}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold ${act.badgeBg}`}>
                      {act.type}
                    </span>
                    <p className="text-[9px] text-slate-500 mt-1">{act.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
