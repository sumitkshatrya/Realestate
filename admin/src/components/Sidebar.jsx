import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaCommentDots,
  FaEnvelope,
  FaFileAlt,
  FaHandshake,
  FaLayerGroup,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCog,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";

const navigationSections = [
  {
    title: "Overview",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: FaChartPie,
      },
    ],
  },
  {
    title: "Property Operations",
    items: [
      {
        to: "/properties",
        label: "Properties",
        icon: FaBuilding,
      },
      {
        to: "/property-map",
        label: "Property Map",
        icon: FaMapMarkedAlt,
      },
      {
        to: "/popular-areas",
        label: "Popular Areas",
        icon: FaMapMarkerAlt,
      },
      {
        to: "/services",
        label: "Services",
        icon: FaLayerGroup,
      },
    ],
  },
  {
    title: "Customer Operations",
    items: [
      {
        to: "/tours",
        label: "Tour Requests",
        icon: FaHandshake,
        badgeKey: "tours",
      },
      {
        to: "/contacts",
        label: "Contact Messages",
        icon: FaEnvelope,
        badgeKey: "contacts",
      },
      {
        to: "/testimonials",
        label: "Testimonials",
        icon: FaCommentDots,
        badgeKey: "testimonials",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        to: "/users",
        label: "Users",
        icon: FaUsers,
      },
      {
        to: "/about-content",
        label: "About Content",
        icon: FaFileAlt,
      },
    ],
  },
];

const SidebarContent = ({ collapsed, badges, onItemClick }) => (
  <div className="relative flex h-full flex-col">
    {/* BRAND / WORKSPACE */}
    <div className={`border-b border-white/10 ${collapsed ? "px-3 py-5" : "px-5 py-5"}`}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        <NavLink to="/dashboard" onClick={onItemClick} className="group flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-red-500/20 blur-md" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/20 bg-gradient-to-br from-red-500/20 to-slate-900 shadow-lg">
              <FaBuilding className="text-sm text-red-300" />
            </div>
          </div>

          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.25em] text-red-400">
                Real Estate
              </p>
              <p className="truncate text-sm font-bold text-white">
                Admin Console
              </p>
            </div>
          )}
        </NavLink>
      </div>
    </div>

    {/* NAVIGATION */}
    <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin">
      {navigationSections.map((section) => (
        <div key={section.title} className="mb-6 last:mb-0">
          {!collapsed && (
            <div className="mb-2 px-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {section.title}
              </p>
            </div>
          )}

          <div className="space-y-1">
            {section.items.map((item) => {
              const IconComponent = item.icon;
              const badge = badges[item.badgeKey] || 0;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onItemClick}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center rounded-xl transition-all duration-200 ${
                      collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-red-500/15 text-white font-bold"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <Motion.span
                          layoutId="sidebar-active"
                          className="absolute left-0 h-6 w-0.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]"
                        />
                      )}

                      <span
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-red-500/20 text-red-300"
                            : "bg-white/[0.03] text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                        }`}
                      >
                        <IconComponent className="text-xs" />
                        {badge > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-slate-950 bg-red-500 px-1 text-[7px] font-black text-white">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </span>

                      {!collapsed && (
                        <span className="flex min-w-0 flex-1 items-center justify-between">
                          <span className="truncate text-xs font-semibold">{item.label}</span>
                          {badge > 0 && (
                            <span className="ml-2 rounded-md bg-red-500/20 px-1.5 py-0.5 text-[8px] font-bold text-red-300">
                              {badge}
                            </span>
                          )}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>

    {/* SYSTEM STATUS */}
    <div className={`border-t border-white/10 ${collapsed ? "px-3 py-4" : "px-4 py-4"}`}>
      {!collapsed ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <FaShieldAlt className="text-[10px] text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                  Operational
                </span>
              </div>
              <p className="mt-1 truncate text-[9px] text-slate-500">
                All systems operational
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div title="All systems operational" className="flex justify-center">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
        </div>
      )}
    </div>

    {/* SETTINGS */}
    <div className={`border-t border-white/10 ${collapsed ? "px-3 py-3" : "px-4 py-3"}`}>
      <NavLink
        to="/settings"
        onClick={onItemClick}
        title={collapsed ? "Settings" : undefined}
        className={({ isActive }) =>
          `flex items-center rounded-xl transition ${
            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
          } ${
            isActive
              ? "bg-white/10 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`
        }
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
          <FaCog className="text-xs" />
        </span>
        {!collapsed && <span className="text-xs font-semibold">Settings</span>}
      </NavLink>
    </div>
  </div>
);

const Sidebar = ({
  badges = {},
  collapsed: controlledCollapsed,
  onCollapsedChange,
  mobileOpen = false,
  onMobileClose,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = typeof controlledCollapsed === "boolean";
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const toggleSidebar = () => {
    const nextState = !collapsed;
    if (onCollapsedChange) onCollapsedChange(nextState);
    if (!isControlled) setInternalCollapsed(nextState);
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <Motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, width: collapsed ? 88 : 288 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative hidden h-screen shrink-0 border-r border-white/10 bg-slate-950 lg:block"
      >
        <SidebarContent collapsed={collapsed} badges={badges} />

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-400 shadow-lg transition hover:border-red-400/30 hover:text-white"
        >
          {collapsed ? <FaChevronRight className="text-[8px]" /> : <FaChevronLeft className="text-[8px]" />}
        </button>
      </Motion.aside>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Slide-over Content */}
            <Motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[85vw] bg-slate-950 border-r border-white/10 h-full shadow-2xl z-10 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Navigation Menu</span>
                <button
                  onClick={onMobileClose}
                  className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <SidebarContent collapsed={false} badges={badges} onItemClick={onMobileClose} />
              </div>
            </Motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;