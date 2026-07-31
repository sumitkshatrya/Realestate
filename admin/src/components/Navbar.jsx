import React from "react";
import { motion as Motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const pageTitle = {
  "/dashboard": "Dashboard Overview",
  "/testimonials": "Testimonial Control",
  "/services": "Service Management",
  "/property-map": "Property Map",
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <Motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur"
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Realestate logo" className="h-11 w-11 rounded-2xl" />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-red-300/70">
              Realestate
            </p>
            <h1 className="text-lg font-semibold text-white">
              {pageTitle[location.pathname] || "Admin Workspace"}
            </h1>
          </div>
        </div>

        <Motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-red-400/50 hover:bg-red-500/10"
        >
          Logout
        </Motion.button>
      </div>
    </Motion.header>
  );
};

export default Navbar;
