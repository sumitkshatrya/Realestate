import React from "react";
import { motion as Motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaChartPie,
  FaCommentDots,
  FaEnvelope,
  FaHandshake,
  FaLayerGroup,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartPie },
  { to: "/testimonials", label: "Testimonials", icon: FaCommentDots },
  { to: "/services", label: "Services", icon: FaLayerGroup },
  { to: "/properties", label: "Properties", icon: FaBuilding },
  { to: "/property-map", label: "Property Map", icon: FaMapMarkedAlt },
  { to: "/popular-areas", label: "Popular Areas", icon: FaMapMarkerAlt },
  { to: "/tours", label: "Tour Requests", icon: FaHandshake },
  { to: "/contacts", label: "Contact Messages", icon: FaEnvelope },
  { to: "/users", label: "Users", icon: FaUsers },
  { to: "/about-content", label: "About Content", icon: FaFileAlt },
];

const Sidebar = () => {
  return (
    <Motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="hidden w-72 border-r border-white/10 bg-slate-950/80 px-4 py-6 lg:block"
    >
      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-red-300/70">
          Workspace
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Admin Suite</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Manage the public website content from a dedicated admin application.
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;

          return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <IconComponent className="text-base" />
            <span>{item.label}</span>
          </NavLink>
          );
        })}
      </nav>
    </Motion.aside>
  );
};

export default Sidebar;
