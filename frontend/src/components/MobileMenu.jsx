import React, { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaXmark,
  FaHouse,
  FaCircleInfo,
  FaBuilding,
  FaHandshake,
  FaComment,
  FaEnvelope,
  FaHeart,
  FaUser,
  FaRightToBracket,
  FaUserPlus,
  FaArrowRightFromBracket,
  FaChevronRight,
} from "react-icons/fa6";
import { useFocusTrap } from "../hooks/useFocusTrap";

const MobileMenu = ({
  isOpen,
  user,
  navItems,
  isAuthenticated,
  onClose,
  onLogin,
  onSignup,
  onLogout,
}) => {
  const menuRef = useFocusTrap(isOpen, onClose);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const icons = {
    home: <FaHouse />,
    about: <FaCircleInfo />,
    properties: <FaBuilding />,
    services: <FaHandshake />,
    testimonials: <FaComment />,
    contact: <FaEnvelope />,
  };

  // Animation variants
  const menuVariants = {
    hidden: { 
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      }
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 220,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    },
    exit: { 
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: 40,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200,
      }
    },
    hover: {
      scale: 1.05,
      x: 8,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 250,
      }
    },
    tap: {
      scale: 0.95,
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
          />

          {/* Menu */}
          <Motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 z-50 h-screen w-[85%] max-w-sm overflow-y-auto bg-white shadow-2xl lg:hidden"
          >
            {/* Header */}
            <Motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 backdrop-blur-sm px-6 py-5"
            >
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RealEstate
                </h2>
                <p className="text-sm text-gray-500">
                  Luxury Living
                </p>
              </div>

              <Motion.button
                whileHover={{ 
                  rotate: 90,
                  scale: 1.1,
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition-colors"
              >
                <FaXmark size={22} />
              </Motion.button>
            </Motion.div>

            {/* Navigation */}
            <div className="px-6 py-6">
              <ul className="space-y-2">
                {navItems.map(({ link, path }, index) => (
                  <Motion.li
                    key={path}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={index}
                  >
                    <Motion.div
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {location.pathname === "/" ? (
                        <ScrollLink
                          to={path}
                          smooth
                          duration={500}
                          offset={-90}
                          onClick={onClose}
                          className="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xl transition-colors group-hover:text-white">
                              {icons[path.toLowerCase()]}
                            </span>
                            <span>{link}</span>
                          </div>
                          <Motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <FaChevronRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Motion.div>
                        </ScrollLink>
                      ) : (
                        <RouterLink
                          to={`/#${path}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/#${path}`);
                            onClose();
                          }}
                          className="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xl transition-colors group-hover:text-white">
                              {icons[path.toLowerCase()]}
                            </span>
                            <span>{link}</span>
                          </div>
                          <Motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <FaChevronRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Motion.div>
                        </RouterLink>
                      )}
                    </Motion.div>
                  </Motion.li>
                ))}
              </ul>

              {/* Divider */}
              <Motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.4 }}
                className="my-8 border-t border-gray-200"
              />

              {/* Auth */}
              <Motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 0.3,
                      staggerChildren: 0.1,
                    }
                  }
                }}
                className="space-y-3"
              >
                {isAuthenticated ? (
                  <>
                    {/* User Profile Card */}
                    <Motion.div
                      whileHover={{ scale: 1.02 }}
                      className="mb-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Welcome Back</p>
                          <p className="font-semibold text-gray-800">
                            {user?.username || 'User'}
                          </p>
                        </div>
                      </div>
                    </Motion.div>

                    <Motion.div variants={itemVariants}>
                      <RouterLink
                        to="/my-favorites"
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-xl px-4 py-4 font-semibold text-gray-700 transition-all hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-600"
                      >
                        <Motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className="text-pink-500"
                        >
                          <FaHeart />
                        </Motion.div>
                        My Favorites
                      </RouterLink>
                    </Motion.div>

                    <Motion.div variants={itemVariants}>
                      <RouterLink
                        to="/profile"
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-xl px-4 py-4 font-semibold text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600"
                      >
                        <Motion.div
                          whileHover={{ scale: 1.2 }}
                          className="text-blue-500"
                        >
                          <FaUser />
                        </Motion.div>
                        My Profile
                      </RouterLink>
                    </Motion.div>

                    <Motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={onLogout}
                        className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                      >
                        <Motion.div
                          animate={isOpen ? { 
                            x: [0, -5, 5, -5, 5, 0],
                            transition: { duration: 0.5 }
                          } : {}}
                        >
                          <FaArrowRightFromBracket />
                        </Motion.div>
                        Logout
                      </button>
                    </Motion.div>
                  </>
                ) : (
                  <>
                    <Motion.div variants={itemVariants}>
                      <button
                        onClick={onLogin}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 px-5 py-4 font-semibold transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <FaRightToBracket />
                        Login
                      </button>
                    </Motion.div>

                    <Motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={onSignup}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 font-semibold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
                      >
                        <Motion.div
                          animate={isOpen ? {
                            rotate: [0, 10, -10, 10, 0],
                            transition: { duration: 0.5, delay: 0.5 }
                          } : {}}
                        >
                          <FaUserPlus />
                        </Motion.div>
                        Create Account
                      </button>
                    </Motion.div>
                  </>
                )}
              </Motion.div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;