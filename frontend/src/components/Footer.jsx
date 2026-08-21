import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaBuilding, FaMobile, FaFax, FaArrowUp } from 'react-icons/fa';
import { Link } from "react-scroll";
import { IoMdMail } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import prop7 from '../assets/images/prop7.jpg';
import prop8 from '../assets/images/prop8.jpg';
import React from "react";
import logo from "../assets/images/logo.png";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleScrollToHomeTop = () => {
        if (location.pathname === '/') {
            // If on homepage, just scroll to top
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            // If on another page, navigate to homepage and then scroll
            navigate('/');
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        }
    };
    return (
        <>
            <footer className="bg-[var(--footer-background)] text-[var(--footer-text)] py-20">
                <div className="container mx-auto px-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-12">
                    
                    {/* About Us Section */}
                    <div className='flex flex-col gap-5 col-span-1 md:col-span-2 lg:col-span-1'>
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="company logo" className="h-10 w-10 rounded-lg bg-white p-1" />
                            <span className="text-xl font-bold">Realestate</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Our mission is to help you find a home that you'll love. We are dedicated to providing the best service and expertise in the market.
                        </p>
                        <div id="social-icons" className='flex gap-3 mt-2'>
                            <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <FaInstagram size={16} />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <FaTwitter size={16} />
                            </a>
                            <a href="#" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <FaYoutube size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className='flex flex-col gap-5'>
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="home" smooth={true} offset={-100} className="text-sm text-[var(--text-secondary)] hover:text-white cursor-pointer">Home</Link></li>
                            <li><Link to="about" smooth={true} offset={-100} className="text-sm text-[var(--text-secondary)] hover:text-white cursor-pointer">About</Link></li>
                            <li><Link to="properties" smooth={true} offset={-100} className="text-sm text-[var(--text-secondary)] hover:text-white cursor-pointer">Properties</Link></li>
                            <li><Link to="services" smooth={true} offset={-100} className="text-sm text-[var(--text-secondary)] hover:text-white cursor-pointer">Services</Link></li>
                            <li><Link to="contact" smooth={true} offset={-100} className="text-sm text-[var(--text-secondary)] hover:text-white cursor-pointer">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us Section */}
                    <div className='flex flex-col gap-5'>
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <div className='flex items-start gap-3'>
                            <FaBuilding className="size-4 mt-1 text-[var(--primary-color)]"/>
                            <p className="text-sm text-[var(--text-secondary)]">108 Griffith Peak Dr, Las Vegas, NV 89135</p>
                        </div>
                        <div className='flex items-start gap-3'>
                            <FaMobile className="size-4 mt-1 text-[var(--primary-color)]"/>
                            <p className="text-sm text-[var(--text-secondary)]">+1 (555) 123-4567</p>
                        </div>
                        <div className='flex items-start gap-3'>
                            <IoMdMail className="size-4 mt-1 text-[var(--primary-color)]"/>
                            <p className="text-sm text-[var(--text-secondary)]">hello@realestate.com</p>
                        </div>
                    </div>

                    {/* Latest Properties Section */}
                    <div className='flex flex-col gap-5'>
                        <h3 className="text-lg font-semibold">Latest Properties</h3>
                        <div className='flex items-center gap-4'>
                            <img src={prop7} alt='Villa with amazing view' className='w-24 h-16 object-cover rounded-md' />
                            <div>
                                <h4 className="text-sm font-semibold hover:text-white transition-colors">Villa with amazing view</h4>
                                <p className="text-sm text-[var(--primary-color)] font-bold">$287,000</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <img src={prop8} alt='Smart view from beach' className='w-24 h-16 object-cover rounded-md' />
                            <div>
                                <h4 className="text-sm font-semibold hover:text-white transition-colors">Smart view from beach</h4>
                                <p className="text-sm text-[var(--primary-color)] font-bold">$587,000</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-[var(--text-secondary)]">
                    <p>&copy; {new Date().getFullYear()} Realestate. All Rights Reserved.</p>
                </div>
            </footer>

            {/* Scroll-to-top button */}
            <div className='fixed lg:bottom-8 bottom-6 right-6 z-50'>
                <button onClick={handleScrollToHomeTop} className='flex items-center justify-center bg-[var(--primary-color)] p-3 rounded-full text-white hover:bg-opacity-90 cursor-pointer transition-all duration-300 shadow-lg'>
                    <FaArrowUp className='size-5' />
                </button>
            </div>
        </>
    );
}

export default Footer;
