import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaBuilding, FaMobile, FaArrowUp, FaPaperPlane } from 'react-icons/fa6';
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { IoMdMail } from 'react-icons/io';
import toast from 'react-hot-toast';
import prop7 from '../assets/images/prop7.jpg';
import prop8 from '../assets/images/prop8.jpg';
import logo from "../assets/images/logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  const handleScrollToHomeTop = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to our luxury updates!");
    setEmail("");
  };

  return (
    <>
      <footer className="bg-slate-950 text-slate-300 pt-20 pb-12 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                <img src={logo} alt="LuxEstate Logo" className="h-6 w-auto" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                LUX<span className="text-amber-400 font-light">ESTATE</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Elevating real estate search with curated luxury listings, transparent valuation metrics, and bespoke agent guidance across premier locations worldwide.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 hover:text-amber-400 transition">
                <FaFacebookF size={14} />
              </a>
              <a href="#" aria-label="Instagram" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 hover:text-amber-400 transition">
                <FaInstagram size={14} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 hover:text-amber-400 transition">
                <FaTwitter size={14} />
              </a>
              <a href="#" aria-label="YouTube" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 hover:text-amber-400 transition">
                <FaYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-amber-400">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li><ScrollLink to="home" smooth={true} offset={-90} className="hover:text-amber-400 transition cursor-pointer">Home & Hero Search</ScrollLink></li>
              <li><ScrollLink to="about" smooth={true} offset={-90} className="hover:text-amber-400 transition cursor-pointer">About Our Brand</ScrollLink></li>
              <li><ScrollLink to="properties" smooth={true} offset={-90} className="hover:text-amber-400 transition cursor-pointer">Featured Listings</ScrollLink></li>
              <li><ScrollLink to="services" smooth={true} offset={-90} className="hover:text-amber-400 transition cursor-pointer">VIP Advisory Services</ScrollLink></li>
              <li><RouterLink to="/my-favorites" className="hover:text-amber-400 transition">Saved Properties</RouterLink></li>
              <li><ScrollLink to="contact" smooth={true} offset={-90} className="hover:text-amber-400 transition cursor-pointer">Contact Advisory</ScrollLink></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-amber-400">Headquarters</h3>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <FaBuilding className="size-4 mt-1 text-amber-400 shrink-0" />
              <span>108 Griffith Peak Dr, Suite 500, Las Vegas, NV 89135</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <FaMobile className="size-4 text-amber-400 shrink-0" />
              <span>+1 (800) 458-9000</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <IoMdMail className="size-4 text-amber-400 shrink-0" />
              <span>advisory@luxestate.com</span>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-amber-400">VIP Newsletter</h3>
            <p className="text-sm text-slate-400">
              Subscribe to get exclusive first look access to private off-market listings and market insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <FaPaperPlane className="text-xs" />
                  Join
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-16 border-t border-slate-800/80 pt-8 text-center text-xs text-slate-500 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} LUXESTATE Real Estate Inc. All rights reserved.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </footer>

      {/* Floating Scroll-to-top button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleScrollToHomeTop}
          aria-label="Scroll to top"
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 p-3.5 rounded-full text-white cursor-pointer transition-all duration-300 shadow-xl border border-blue-400/30 hover:scale-110"
        >
          <FaArrowUp className="size-4" />
        </button>
      </div>
    </>
  );
};

export default Footer;

