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
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Change import
import { FaXmark, FaBars } from 'react-icons/fa6';
import logo from '../assets/images/logo.png';
import { useDarkMode } from './DarkModeContext';
import { useAuth } from '../context/AuthContext';
import React from "react";

const Header = () => {
  const { darkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Add this hook

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Remove these states since we're using routes
  // const [showLogin, setShowLogin] = useState(false);
  // const [showSignup, setShowSignup] = useState(false);

  // Toggle Mobile Menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Auth handlers - use navigation instead of modal state
  const handleLoginClick = () => {
    navigate('/login');
    closeMenu();
  };

  const handleSignupClick = () => {
    navigate('/signup');
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navItems = [
    { link: 'Home', path: 'home' },
    { link: 'About', path: 'about' },
    { link: 'Properties', path: 'properties' },
    { link: 'Services', path: 'services' },
    { link: 'Testimonial', path: 'client' },
    { link: 'Contact', path: 'contact' },
  ];

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
        } flex justify-between items-center gap-4 lg:px-20 px-4 py-3 sticky top-0 z-50 shadow-md`}
      >
        {/* Logo */}
        <div id="logo">
          <img
            src={logo}
            alt="company logo"
            className={`lg:w-[150px] w-[120px] ${
              darkMode ? 'filter brightness-0 invert' : ''
            }`}
          />
        </div>

        {/* Desktop Menu */}
        <ul className="lg:flex justify-center items-center gap-4 hidden">
          {navItems.map(({ link, path }) => (
            <Link
              key={path}
              className={`text-[15px] uppercase font-semibold cursor-pointer px-3 py-2 rounded-lg transition-colors duration-300 ${
                darkMode
                  ? 'text-white hover:bg-red-600 hover:text-white'
                  : 'text-black hover:bg-red-600 hover:text-white'
              }`}
              to={path}
              spy={true}
              offset={-100}
              smooth={true}
            >
              {link}
            </Link>
          ))}
        </ul>

        {/* Right Side (Login/Logout + Mobile Menu) */}
        <div className="flex items-center gap-4">
          {user ? (
            // If logged in
            <div className="flex items-center gap-4">
              <span
                className={`hidden md:block ${
                  darkMode ? 'text-white' : 'text-black'
                }`}
              >
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            // If not logged in
            <>
              <button
                onClick={handleLoginClick}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
                }`}
              >
                Login
              </button>

              <button
                onClick={handleSignupClick}
                className="px-4 py-2 rounded-lg font-semibold transition-colors duration-300 bg-red-600 hover:bg-red-700 text-white"
              >
                Signup
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg focus:outline-none"
          >
            {isMenuOpen ? (
              <FaXmark
                className={`size-6 ${darkMode ? 'text-white' : 'text-black'}`}
              />
            ) : (
              <FaBars
                className={`size-6 ${darkMode ? 'text-white' : 'text-black'}`}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`lg:hidden absolute top-full left-0 w-full ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            } shadow-lg`}
          >
            <ul className="flex flex-col items-center py-4">
              {navItems.map(({ link, path }) => (
                <Link
                  key={path}
                  className={`w-full text-center py-3 text-[15px] uppercase font-semibold cursor-pointer transition-colors duration-300 ${
                    darkMode
                      ? 'text-white hover:bg-red-600'
                      : 'text-black hover:bg-red-600 hover:text-white'
                  }`}
                  to={path}
                  spy={true}
                  offset={-100}
                  smooth={true}
                  onClick={closeMenu}
                >
                  {link}
                </Link>
              ))}

              {/* Mobile Login/Logout */}
              {user ? (
                <div className="flex flex-col gap-4 mt-4 w-full px-4">
                  <div
                    className={`text-center py-2 ${
                      darkMode ? 'text-white' : 'text-black'
                    }`}
                  >
                    Welcome, {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-red-600 text-white'
                        : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleLoginClick}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-red-600 text-white'
                        : 'bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignupClick}
                    className="px-4 py-2 rounded-lg font-semibold transition-colors duration-300 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Signup
                  </button>
                </div>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;