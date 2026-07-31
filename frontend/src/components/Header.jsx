// // src/components/Header.js
// import { useState } from 'react';
// import { Link } from 'react-scroll';
// import { FaXmark, FaBars } from 'react-icons/fa6';
// import logo from '../assets/images/logo.png';
// import { useDarkMode } from './DarkModeContext';
// import { useAuth } from '../context/AuthContext';
// import LoginForm from './LoginForm';
// import SignupForm from './SignupForm';
// import TestimonialCard from "./components/TestimonialCard";
// import AdminLogin from "../src/pages/AdminLogin"
// import AdminPanel from "../src/pages/AdminPanel";
// import TestimonialsList from "./components/TestimonialsList";
// const Header = () => {
//   const { darkMode } = useDarkMode();
//   const { user, logout } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
  
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   }

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   }

//   const handleLoginClick = () => {
//     setShowLogin(true);
//     setShowSignup(false);
//     closeMenu();
//   };

//   const handleSignupClick = () => {
//     setShowSignup(true);
//     setShowLogin(false);
//     closeMenu();
//   };

//   const handleLogout = () => {
//     logout();
//     closeMenu();
//   };

//   const switchToSignup = () => {
//     setShowLogin(false);
//     setShowSignup(true);
//   };

//   const switchToLogin = () => {
//     setShowSignup(false);
//     setShowLogin(true);
//   };

//   const closeModals = () => {
//     setShowLogin(false);
//     setShowSignup(false);
//   };

//   const navItems = [
//     { link: 'Home', path: 'home' },
//     { link: 'About', path: 'about' },
//     { link: 'Properties', path: 'properties' },
//     { link: 'Services', path: 'services' },
//     { link: 'Testimonials', path: 'testimonials' },
//     { link: 'Contact', path: 'contact' },
//   ];

//   return (
//     <>
//       <nav className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-white"} flex justify-between items-center gap-4 lg:px-20 px-4 py-3 sticky top-0 z-50 shadow-md`}>
        
//         {/* Logo */}
//         <div id="logo">
//           <img 
//             src={logo} 
//             alt='company logo'  
//             className={`lg:w-[150px] w-[120px] ${darkMode ? 'filter brightness-0 invert' : ''}`}
//           />
//         </div>

//         {/* Desktop Navigation */}
//         <ul className='lg:flex justify-center items-center gap-4 hidden'>
//           {navItems.map(({link, path}) => (
//             <Link 
//               key={path} 
//               className={`text-[15px] uppercase font-semibold cursor-pointer px-3 py-2 rounded-lg transition-colors duration-300 ${
//                 darkMode 
//                   ? 'text-white hover:bg-red-600 hover:text-white' 
//                   : 'text-black hover:bg-red-600 hover:text-white'
//               }`} 
//               to={path} 
//               spy={true} 
//               offset={-100}
//               smooth={true}
//             >
//               {link}
//             </Link>
//           ))}
//         </ul>

//         {/* Right Side Buttons */}
//         <div className='flex items-center gap-4'>
//           {user ? (
//             // User is logged in - show user info and logout
//             <div className="flex items-center gap-4">
//               <span className={`hidden md:block ${darkMode ? 'text-white' : 'text-black'}`}>
//                 Welcome, {user.name}
//               </span>
//               <button 
//                 onClick={handleLogout}
//                 className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
//                   darkMode 
//                     ? 'bg-gray-700 hover:bg-red-600 text-white' 
//                     : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
//                 }`}
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             // User is not logged in - show login/signup buttons
//             <>
//               <button 
//                 onClick={handleLoginClick}
//                 className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
//                   darkMode 
//                     ? 'bg-gray-700 hover:bg-red-600 text-white' 
//                     : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
//                 }`}
//               >
//                 Login
//               </button>

//               <button 
//                 onClick={handleSignupClick}
//                 className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
//                   darkMode 
//                     ? 'bg-red-600 hover:bg-red-700 text-white' 
//                     : 'bg-red-600 hover:bg-red-700 text-white'
//                 }`}
//               >
//                 Signup
//               </button>
//             </>
//           )}

//           {/* Mobile Menu Button */}
//           <button 
//             onClick={toggleMenu}
//             className='lg:hidden p-2 rounded-lg focus:outline-none'
//           >
//             {isMenuOpen ? (
//               <FaXmark className={`size-6 ${darkMode ? 'text-white' : 'text-black'}`} />
//             ) : (
//               <FaBars className={`size-6 ${darkMode ? 'text-white' : 'text-black'}`} />
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className={`lg:hidden absolute top-full left-0 w-full ${
//             darkMode ? 'bg-gray-900' : 'bg-white'
//           } shadow-lg`}>
//             <ul className='flex flex-col items-center py-4'>
//               {navItems.map(({link, path}) => (
//                 <Link 
//                   key={path} 
//                   className={`w-full text-center py-3 text-[15px] uppercase font-semibold cursor-pointer transition-colors duration-300 ${
//                     darkMode 
//                       ? 'text-white hover:bg-red-600' 
//                       : 'text-black hover:bg-red-600 hover:text-white'
//                   }`} 
//                   to={path} 
//                   spy={true} 
//                   offset={-100}
//                   smooth={true}
//                   onClick={closeMenu}
//                 >
//                   {link}
//                 </Link>
//               ))}
              
//               {/* Mobile Login/Signup Buttons */}
//               {user ? (
//                 <div className="flex flex-col gap-4 mt-4 w-full px-4">
//                   <div className={`text-center py-2 ${darkMode ? 'text-white' : 'text-black'}`}>
//                     Welcome, {user.name}
//                   </div>
//                   <button 
//                     onClick={handleLogout}
//                     className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
//                       darkMode 
//                         ? 'bg-gray-700 hover:bg-red-600 text-white' 
//                         : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
//                     }`}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className='flex gap-4 mt-4'>
//                   <button 
//                     onClick={handleLoginClick}
//                     className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
//                       darkMode 
//                         ? 'bg-gray-700 hover:bg-red-600 text-white' 
//                         : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
//                     }`}
//                   >
//                     Login
//                   </button>
//                   <button 
//                     onClick={handleSignupClick}
//                     className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
//                       darkMode 
//                         ? 'bg-red-600 hover:bg-red-700 text-white' 
//                         : 'bg-red-600 hover:bg-red-700 text-white'
//                     }`}
//                   >
//                     Signup
//                   </button>
//                 </div>
//               )}
//             </ul>
//           </div>
//         )}
//       </nav>

//       {/* Login Modal */}
//       {showLogin && (
//         <LoginForm 
//           onClose={closeModals} 
//           switchToSignup={switchToSignup}
//         />
//       )}

//       {/* Signup Modal */}
//       {showSignup && (
//         <SignupForm 
//           onClose={closeModals} 
//           switchToLogin={switchToLogin}
//         />
//       )}
//     </>
//   );
// }

// export default Header;
// src/components/Header.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaBars, FaXmark } from "react-icons/fa6";
import logo from "../assets/images/logo.png";
import { useDarkMode } from "./useDarkMode";
import { useAuth } from "../context/useAuth";
import React from "react";

const Header = () => {
  const { darkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        darkMode
          ? "border-white/10 bg-slate-950/80 text-white"
          : "border-orange-100/80 bg-white/80 text-slate-900"
      }`}
    >
      <nav
        className="section-shell flex items-center justify-center gap-4 py-5 pl-6 lg:pl-0"
      >
        <button
          id="logo"
          onClick={handleLogoClick}
          type="button"
          className="flex items-center gap-4"
        >
          <img src={logo} alt="company logo" className="h-12 w-12 rounded-2xl object-cover" />
          <div className="text-left">
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${
                darkMode ? "text-orange-200/70" : "text-orange-600/70"
              }`}
            >
              Realestate
            </p>
            <p className="text-sm font-semibold">Modern Living, Curated Well</p>
          </div>
        </button>

        <ul className="hidden items-center gap-2 lg:flex">
          {navItems.map(({ link, path }) => (
            <ScrollLink
              key={path}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                darkMode
                  ? "text-slate-200 hover:bg-white/10 hover:text-white"
                  : "text-slate-700 hover:bg-orange-100 hover:text-orange-700"
              }`}
              to={path}
              spy={true}
              offset={-90}
              smooth={true}
              duration={500}
            >
              {link}
            </ScrollLink>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span
                className={`hidden rounded-full px-4 py-2 text-sm md:block ${
                  darkMode ? "bg-white/5 text-white" : "bg-orange-50 text-slate-800"
                }`}
              >
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  darkMode
                    ? "bg-white/10 hover:bg-red-600 text-white"
                    : "bg-slate-900 hover:bg-orange-600 text-white"
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <button
                onClick={handleLoginClick}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  darkMode
                    ? "bg-white/10 hover:bg-white/15 text-white"
                    : "bg-orange-50 hover:bg-orange-100 text-slate-800"
                }`}
              >
                Login
              </button>

              <button
                onClick={handleSignupClick}
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-700"
              >
                Signup
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          )}

          <button
            onClick={toggleMenu}
            className={`rounded-full p-2.5 lg:hidden ${
              darkMode ? "bg-white/10" : "bg-orange-50"
            }`}
          >
            {isMenuOpen ? (
              <FaXmark className={`size-5 ${darkMode ? "text-white" : "text-black"}`} />
            ) : (
              <FaBars className={`size-5 ${darkMode ? "text-white" : "text-black"}`} />
            )}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`border-t lg:hidden ${
              darkMode
                ? "border-white/10 bg-slate-950/95"
                : "border-orange-100 bg-white/95"
            }`}
          >
            <div className="section-shell py-4">
              <ul className="flex flex-col gap-2">
                {navItems.map(({ link, path }) => (
                  <ScrollLink
                    key={path}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-wide ${
                      darkMode
                        ? "text-white hover:bg-white/10"
                        : "text-slate-800 hover:bg-orange-50"
                    }`}
                    to={path}
                    spy={true}
                    offset={-90}
                    smooth={true}
                    duration={500}
                    onClick={closeMenu}
                  >
                    {link}
                  </ScrollLink>
                ))}
              </ul>

              {!user ? (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleLoginClick}
                    className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      darkMode ? "bg-white/10 text-white" : "bg-orange-50 text-slate-800"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignupClick}
                    className="flex-1 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Signup
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.header>
  );
};

export default Header;
