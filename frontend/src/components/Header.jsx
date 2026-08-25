import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaBars, FaXmark, FaHeart, FaUser, FaRightFromBracket, FaBuildingCircleCheck } from "react-icons/fa6";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/useAuth";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const favoritesCount = user?.favorites?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLoginClick = () => {
    navigate("/login");
    closeMenu();
  };

  const handleSignupClick = () => {
    navigate("/signup");
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    closeMenu();
  };

  const handleLogoClick = () => {
    navigate("/");
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { link: "Home", path: "home" },
    { link: "About", path: "about" },
    { link: "Properties", path: "properties" },
    { link: "Services", path: "services" },
    { link: "Testimonials", path: "testimonials" },
    { link: "Contact", path: "contact" },
  ];

  return (
    <Motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/90 text-white shadow-2xl backdrop-blur-xl rounded-2xl border border-slate-700/50 py-2.5"
          : "bg-slate-900/80 text-white backdrop-blur-md rounded-2xl border border-white/10 py-3.5"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <button
          id="logo"
          onClick={handleLogoClick}
          type="button"
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <img src={logo} className="h-6 w-auto" alt="RealEstate Logo" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              LUX<span className="text-amber-400 font-light">ESTATE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Prime Living</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map(({ link, path }) => (
            <li key={path} className="relative">
              {location.pathname === "/" ? (
                <ScrollLink
                  className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 block"
                  to={path}
                  spy={true}
                  offset={-90}
                  smooth={true}
                  duration={500}
                >
                  {link}
                </ScrollLink>
              ) : (
                <RouterLink
                  className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 block"
                  to={`/#${path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/#${path}`);
                  }}
                >
                  {link}
                </RouterLink>
              )}
            </li>
          ))}
        </ul>

        {/* Action Buttons & User Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Favorites Quick Button */}
              <RouterLink
                to="/my-favorites"
                className="relative flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-sm font-semibold text-white transition duration-200 border border-white/10"
                title="Saved Homes"
              >
                <FaHeart className="text-red-400 text-base" />
                <span className="hidden sm:inline">Saved</span>
                {favoritesCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-slate-950">
                    {favoritesCount}
                  </span>
                )}
              </RouterLink>

              {/* User Dropdown Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-3.5 py-2 text-white font-semibold text-sm shadow-md transition duration-200 border border-blue-400/20"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold uppercase">
                    {user?.username?.charAt(0) || "U"}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user?.username}</span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <Motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-slate-200"
                    >
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user?.email || user?.username}</p>
                      </div>
                      <RouterLink
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white transition"
                      >
                        <FaUser className="text-slate-400" />
                        My Profile
                      </RouterLink>
                      <RouterLink
                        to="/my-favorites"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white transition"
                      >
                        <FaHeart className="text-red-400" />
                        Favorites ({favoritesCount})
                      </RouterLink>
                      <div className="border-t border-slate-800 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition text-left"
                      >
                        <FaRightFromBracket />
                        Sign Out
                      </button>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-white/10 text-sm font-semibold transition"
              >
                Sign In
              </button>
              <button
                onClick={handleSignupClick}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition flex items-center gap-1.5"
              >
                Get Started
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition lg:hidden text-white border border-white/10"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <FaXmark className="size-5" /> : <FaBars className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMenuOpen}
        navItems={navItems}
        isAuthenticated={isAuthenticated}
        onClose={closeMenu}
        onLogin={handleLoginClick}
        onSignup={handleSignupClick}
        onLogout={handleLogout}
      />
    </Motion.header>
  );
};

export default Header;