import { useDarkMode } from '../components/DarkModeContext';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaBuilding, FaMobile, FaFax, FaArrowUp, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from "react-scroll";
import { IoMdMail } from 'react-icons/io';
import prop7 from '../assets/images/prop7.jpg';
import prop8 from '../assets/images/prop8.jpg';
import React from "react";
const Footer = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <>
            <footer className={`w-full justify-center items-start m-auto lg:px-20 px-10 py-20 grid lg:grid-cols-3 grid-cols-1 lg:gap-20 gap-10 ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}>
                
                {/* About Us Section */}
                <div className='flex flex-col justify-center items-start gap-5'>
                    <h1 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>About Us</h1>
                    <p className={`text-justify ${darkMode ? "text-slate-200" : "text-gray-600"}`}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt voluptate magni ipsum fugiat laborum possimus ex voluptatem sint? Consequuntur, corporis?
                    </p>
                    <div id="social-icons" className='flex justify-start items-center gap-4 mt-4'>
                        <div className={`p-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 ${
                            darkMode ? "bg-gray-700 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700"
                        }`}>
                            <FaFacebookF size={18} />
                        </div>
                        <div className={`p-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 ${
                            darkMode ? "bg-gray-700 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700"
                        }`}>
                            <FaInstagram size={18} />
                        </div>
                        <div className={`p-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 ${
                            darkMode ? "bg-gray-700 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700"
                        }`}>
                            <FaTwitter size={18} />
                        </div>
                        <div className={`p-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 ${
                            darkMode ? "bg-gray-700 hover:bg-red-600 text-white" : "bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700"
                        }`}>
                            <FaYoutube size={18} />
                        </div>
                    </div>
                    <h1 className={`mt-8 ${darkMode ? "text-slate-200" : "text-gray-600"}`}>Copyright Real Estate, All Rights Reserved</h1>
                </div>

                {/* Contact Us Section */}
                <div className='flex flex-col justify-center items-start gap-5'>
                    <h1 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>Contact Us</h1>
                    <div className='flex justify-start items-center gap-3'>
                        <FaBuilding className={`size-5 ${darkMode ? "text-red-500" : "text-red-600"}`}/>
                        <p className={`${darkMode ? "text-slate-200" : "text-gray-600"}`}>108 Griffith Peak Dr, Las Vegas, NV 89135</p>
                    </div>
                    <div className='flex justify-start items-center gap-3'>
                        <FaMobile className={`size-5 ${darkMode ? "text-red-500" : "text-red-600"}`}/>
                        <p className={`${darkMode ? "text-slate-200" : "text-gray-600"}`}>+956 3620 5692</p>
                    </div>
                    <div className='flex justify-start items-center gap-3'>
                        <FaFax className={`size-5 ${darkMode ? "text-red-500" : "text-red-600"}`}/>
                        <p className={`${darkMode ? "text-slate-200" : "text-gray-600"}`}>95288 65099</p>
                    </div>
                    <div className='flex justify-start items-center gap-3'>
                        <IoMdMail className={`size-5 ${darkMode ? "text-red-500" : "text-red-600"}`}/>
                        <p className={`${darkMode ? "text-slate-200" : "text-gray-600"}`}>roboyz952o@gmail.com</p>
                    </div>
                </div>

                {/* Latest Properties Section */}
                <div className='flex flex-col justify-center items-start gap-5'>
                    <h1 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>Latest Properties</h1>
                    <div className='flex justify-start items-center gap-4'>
                        <img src={prop7} alt='Villa with amazing view' className='w-[120px] h-[80px] object-cover rounded-lg transform hover:scale-110 cursor-pointer transition-transform duration-300' />
                        <div>
                            <h1 className={`text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>Villa with amazing view</h1>
                            <p className={`${darkMode ? "text-slate-400" : "text-gray-600"}`}>$ 287.98</p>
                        </div>
                    </div>
                    <div className='flex justify-start items-center gap-4'>
                        <img src={prop8} alt='Smart view from beach' className='w-[120px] h-[80px] object-cover rounded-lg transform hover:scale-110 cursor-pointer transition-transform duration-300' />
                        <div>
                            <h1 className={`text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>Smart view from beach</h1>
                            <p className={`${darkMode ? "text-slate-400" : "text-gray-600"}`}>$ 587.98</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll-to-top button */}
            <div className='bg-red-600 p-3 rounded-full hover:bg-black cursor-pointer transition-colors duration-300 fixed lg:bottom-12 bottom-6 right-6 z-50'>
                <Link to="hero" spy={true} offset={-100} smooth={true} className='flex items-center justify-center'>
                    <FaArrowUp className='text-white size-5' />
                </Link>
            </div>

            {/* Dark mode toggle button - FIXED */}
            <button 
                onClick={toggleDarkMode} 
                className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 fixed lg:top-6 right-6 top-4 z-50 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-500 hover:bg-orange-600'
                }`}
            >
                {darkMode ? (
                    <FaMoon size={20} className='text-white' />
                ) : (
                    <FaSun size={20} className='text-white' />
                )}
            </button>
        </>
    );
}

export default Footer;