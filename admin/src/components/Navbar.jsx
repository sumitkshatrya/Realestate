import React, { useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaBell,
  FaChevronRight,
  FaClock,
  FaHome,
  FaPowerOff,
  FaRedo,
  FaUserShield,
  FaSearch,
  FaCheck,
  FaHandshake,
  FaEnvelope,
  FaCog,
  FaBars,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import { clearFetchCache } from "../api/useFetchData";

const pageConfig = {
  "/dashboard": {
    title: "Dashboard Overview",
    description: "Monitor your real estate platform metrics and activity",
  },
  "/testimonials": {
    title: "Testimonial Control",
    description: "Review and manage customer testimonials",
  },
  "/services": {
    title: "Service Management",
    description: "Manage platform offerings and services",
  },
  "/properties": {
    title: "Property Inventory",
    description: "Manage property listings, pricing, and specs",
  },
  "/property-map": {
    title: "Property Map",
    description: "Explore properties geographically",
  },
  "/popular-areas": {
    title: "Popular Areas",
    description: "Manage popular locations and region highlights",
  },
  "/tours": {
    title: "Tour Requests",
    description: "Review and manage property tour requests",
  },
  "/contacts": {
    title: "Contact Messages",
    description: "Manage customer enquiries and feedback",
  },
  "/users": {
    title: "User Management",
    description: "Manage platform user accounts and permissions",
  },
  "/about-content": {
    title: "About Content",
    description: "Manage company details and platform information",
  },
  "/settings": {
    title: "Settings & System Control",
    description: "Configure system preferences and security",
  },
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "New Property Tour Request", time: "10m ago", icon: FaHandshake, unread: true },
  { id: 2, title: "New Contact Message", time: "1h ago", icon: FaEnvelope, unread: true },
  { id: 3, title: "Testimonial Pending Approval", time: "3h ago", icon: FaCheck, unread: false },
];

const Navbar = ({
  adminName = "Administrator",
  onRefresh,
  onOpenCommandPalette,
  onOpenMobileSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentPage = useMemo(() => {
    const exactPage = pageConfig[location.pathname];
    if (exactPage) return exactPage;

    const matchedRoute = Object.keys(pageConfig).find((route) =>
      location.pathname.startsWith(route)
    );

    return (
      pageConfig[matchedRoute] || {
        title: "Admin Workspace",
        description: "Manage your real estate platform",
      }
    );
  }, [location.pathname]);

  const breadcrumb = useMemo(() => {
    const cleanPath = location.pathname.replace(/^\/+|\/+$/g, "");
    if (!cleanPath) return ["Admin"];

    return [
      "Admin",
      ...cleanPath
        .split("/")
        .map((item) =>
          item
            .replace(/-/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase())
        ),
    ];
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    clearFetchCache();
    navigate("/login", { replace: true });
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      clearFetchCache();
      if (onRefresh) {
        await onRefresh();
      } else {
        window.location.reload();
      }
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <Motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl"
    >
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* BRAND + PAGE INFO */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Open mobile menu"
          >
            <FaBars className="text-sm" />
          </button>

          <Motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            aria-label="Go to dashboard"
            className="relative shrink-0 rounded-2xl focus:outline-none"
          >
            <div className="absolute -inset-1 rounded-2xl bg-red-500/10 blur-md" />
            <img
              src={logo}
              alt="Realestate"
              className="relative h-9 w-9 rounded-2xl border border-white/10 object-cover shadow-xl sm:h-11 sm:w-11"
            />
          </Motion.button>

          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="mb-1 hidden items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:flex">
              {breadcrumb.map((item, index) => (
                <React.Fragment key={`${item}-${index}`}>
                  {index > 0 && <FaChevronRight className="text-[7px] text-slate-700" />}
                  <span className={index === breadcrumb.length - 1 ? "text-red-400" : ""}>
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Title */}
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-bold tracking-tight text-white sm:text-base md:text-lg">
                {currentPage.title}
              </h1>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)] sm:block" />
            </div>

            {/* Description */}
            <p className="hidden max-w-xl truncate text-xs text-slate-400 md:block">
              {currentPage.description}
            </p>
          </div>
        </div>

        {/* ACTION AREA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10 sm:hidden"
            title="Search"
          >
            <FaSearch className="text-xs" />
          </button>

          {/* Quick Command Palette Button for Desktop */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 hover:border-white/20 hover:bg-white/[0.07] hover:text-white transition"
          >
            <FaSearch className="text-xs text-slate-500" />
            <span>Search...</span>
            <kbd className="ml-1.5 rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-300">
              Ctrl+K
            </kbd>
          </button>

          {/* Refresh */}
          <Motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard"
            title="Refresh cache and data"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
          >
            <FaRedo className={`text-xs ${isRefreshing ? "animate-spin text-red-400" : ""}`} />
          </Motion.button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <Motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfile(false);
              }}
              aria-label="Notifications"
              title="Notifications"
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              <FaBell className="text-xs sm:text-sm" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-950" />
              )}
            </Motion.button>

            {/* Notifications Menu */}
            <AnimatePresence>
              {showNotifications && (
                <Motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 sm:w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl z-50"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                    {MOCK_NOTIFICATIONS.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id} className="flex items-start gap-3 p-3.5 hover:bg-white/5 transition cursor-pointer">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                            <Icon className="text-xs" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/10 bg-slate-950/60 p-2 text-center">
                    <button
                      onClick={() => navigate("/tours")}
                      className="text-[11px] font-bold text-red-400 hover:text-red-300 transition"
                    >
                      View Tour Requests & Inbox →
                    </button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-1 hidden h-8 w-px bg-white/10 sm:block" />

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <Motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowProfile((prev) => !prev);
                setShowNotifications(false);
              }}
              aria-expanded={showProfile}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 pr-2 transition hover:border-white/20 hover:bg-white/[0.07] focus:outline-none sm:gap-3 sm:pr-3"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-slate-800 ring-1 ring-white/10">
                <FaUserShield className="text-xs text-red-300" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="max-w-[110px] truncate text-xs font-bold text-white">
                  {adminName}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  <FaClock className="text-[7px]" />
                  Admin
                </p>
              </div>
              <span className="hidden text-[9px] text-slate-500 sm:block">▼</span>
            </Motion.button>

            <AnimatePresence>
              {showProfile && (
                <Motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-60 sm:w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl z-50"
                >
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="text-xs font-bold text-white">{adminName}</p>
                    <p className="mt-1 text-[10px] text-slate-400">System Administrator</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfile(false);
                      navigate("/settings");
                    }}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-300 transition hover:bg-white/5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                      <FaCog className="text-xs" />
                    </span>
                    <span>Account & Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
                      <FaPowerOff className="text-xs" />
                    </span>
                    <span>Sign Out</span>
                  </button>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Motion.header>
  );
};

export default Navbar;