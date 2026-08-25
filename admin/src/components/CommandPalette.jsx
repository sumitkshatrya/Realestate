import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaBuilding,
  FaChartPie,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaHandshake,
  FaEnvelope,
  FaCommentDots,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaPlusCircle,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

const COMMAND_ITEMS = [
  { id: "dash", title: "Dashboard Overview", category: "Navigation", path: "/dashboard", icon: FaChartPie },
  { id: "props", title: "Properties Inventory", category: "Navigation", path: "/properties", icon: FaBuilding },
  { id: "new-prop", title: "Add New Property", category: "Actions", path: "/properties?action=new", icon: FaPlusCircle },
  { id: "prop-map", title: "Geographic Property Map", category: "Navigation", path: "/property-map", icon: FaMapMarkedAlt },
  { id: "areas", title: "Popular Areas & Locations", category: "Navigation", path: "/popular-areas", icon: FaMapMarkerAlt },
  { id: "services", title: "Platform Services", category: "Navigation", path: "/services", icon: FaLayerGroup },
  { id: "tours", title: "Tour Booking Requests", category: "Navigation", path: "/tours", icon: FaHandshake },
  { id: "contacts", title: "Customer Enquiries & Contacts", category: "Navigation", path: "/contacts", icon: FaEnvelope },
  { id: "reviews", title: "Customer Testimonials", category: "Navigation", path: "/testimonials", icon: FaCommentDots },
  { id: "users", title: "Registered User Accounts", category: "Navigation", path: "/users", icon: FaUsers },
  { id: "about", title: "About Us & Content Manager", category: "Navigation", path: "/about-content", icon: FaFileAlt },
  { id: "settings", title: "Platform Settings & Security", category: "Navigation", path: "/settings", icon: FaCog },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent key handler or trigger
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems]);

  const handleSelect = (item) => {
    onClose();
    setQuery("");
    navigate(item.path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/80"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-white/10 px-5 py-4">
              <FaSearch className="text-slate-400 text-lg mr-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search workspace... (e.g. Properties, Users)"
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
                autoFocus
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-500 hover:text-white p-1 rounded-lg"
                >
                  <FaTimes />
                </button>
              ) : (
                <span className="hidden sm:inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                  ESC to exit
                </span>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-3 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-500 text-sm">
                  No commands or pages matching &quot;<span className="text-white">{query}</span>&quot;
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all ${
                        isSelected
                          ? "bg-red-500/15 border border-red-500/25 text-white"
                          : "text-slate-300 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                            isSelected
                              ? "bg-red-500/20 text-red-400"
                              : "bg-white/5 text-slate-400"
                          }`}
                        >
                          <Icon className="text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{item.title}</p>
                          <p className="truncate text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            {item.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="text-xs">Go</span>
                        <FaArrowRight className="text-xs" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/60 px-5 py-3 text-[11px] text-slate-500">
              <div className="flex items-center gap-4">
                <span><kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono">↑↓</kbd> to navigate</span>
                <span><kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono">↵</kbd> to select</span>
              </div>
              <span className="font-semibold text-red-400/80">Real Estate Admin Console</span>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;

