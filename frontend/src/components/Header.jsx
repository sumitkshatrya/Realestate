import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaBars, FaXmark } from "react-icons/fa6";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/useAuth";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500 ${
        scrolled
          ? "bg-white/90 shadow-2xl backdrop-blur-xl rounded-2xl border border-white/30"
          : "bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      }`}
      style={{ backdropFilter: "blur(18px)" }}
    >
      <nav className="container mx-auto flex items-center justify-between gap-4 py-3 px-4">
        <button
          id="logo"
          onClick={handleLogoClick}
          type="button"
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <img src={logo} className="h-7" alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide">
                REAL<span className="text-blue-600">ESTATE</span>
              </h1>
              <p className="text-xs text-gray-500">Luxury Living</p>
            </div>
          </div>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ link, path }) => (
            <Motion.div
              key={path}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            > 
              {location.pathname === "/" ? (
                <ScrollLink
                  className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:bg-[var(--neutral-100)] hover:text-[var(--text-primary)]"
                  to={path}
                  spy={true}
                  offset={-100}
                  smooth={true}
                  duration={500}
                >
                  {link}
                </ScrollLink>
              ) : (
                <RouterLink
                  className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:bg-[var(--neutral-100)] hover:text-[var(--text-primary)]"
                  to={`/#${path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/#${path}`);
                  }}
                >
                  {link}
                </RouterLink>
              )}
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Motion.div>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <RouterLink
                to="/my-favorites"
                className="hidden rounded-md px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:bg-[var(--neutral-100)] hover:text-[var(--text-primary)] md:block"
              >
                My Favorites
              </RouterLink>
              <RouterLink
                to="/profile"
                className="hidden rounded-md px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:bg-[var(--neutral-100)] hover:text-[var(--text-primary)] md:block"
              >
                My Profile
              </RouterLink>
              
              {/* Enhanced User Profile Section */}
              <div className="hidden md:flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Welcome Back</p>
                  <p className="font-semibold">{user.username}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="px-5 py-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                Login
              </Motion.button>
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignupClick}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-lg hover:scale-105 transition duration-300 flex items-center gap-2"
              >
                Signup
                <FaArrowRight className="text-xs" />
              </Motion.button>
            </div>
          )}

          {/* Enhanced Mobile Menu Button */}
          <Motion.button
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-lg shadow-lg flex items-center justify-center transition duration-300 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <FaXmark className="size-5" /> : <FaBars className="size-5" />}
          </Motion.button>
        </div>
      </nav>
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