import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { FaBuilding, FaHouse, FaKey, FaLocationDot } from "react-icons/fa6";
import { scroller } from "react-scroll";
import heroImage from "../assets/images/hero1.webp";

const stats = [
  {
    value: "$1.4B+",
    label: "Property Volume Sold",
  },
  {
    value: "450+",
    label: "Luxury Estates Listed",
  },
  {
    value: "98.5%",
    label: "Satisfied Homeowners",
  },
];

const popularTags = ["Beverly Hills", "Waterfront Villa", "Penthouse", "Modern Apartment"];

const Hero = ({ setSearchCriteria = () => {} }) => {
  const [activeTab, setActiveTab] = useState("sales");
  const [formState, setFormState] = useState({
    q: "",
    type: "sales",
    category: "",
  });

  const handleTabChange = (type) => {
    setActiveTab(type);
    setFormState((prev) => ({ ...prev, type }));
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagClick = (tag) => {
    const updated = { ...formState, q: tag };
    setFormState(updated);
    setSearchCriteria(updated);
    scroller.scrollTo("properties", {
      duration: 800,
      smooth: "easeInOutQuart",
      offset: -80,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchCriteria(formState);
    scroller.scrollTo("properties", {
      duration: 800,
      smooth: "easeInOutQuart",
      offset: -80,
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center pt-28 pb-16"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/50" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column - Main Copy & Value Props */}
          <Motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              The Pinnacle of Real Estate Search
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white tracking-tight">
              Discover Spaces Designed For Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Legacy.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Explore curated luxury residences, architectural penthouses, beachfront villas, and high-yield commercial portfolios across top-tier global markets.
            </p>

            {/* Popular Search Tag Pills */}
            <div className="pt-2">
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2.5">Trending Searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-semibold backdrop-blur-md border border-slate-700 transition duration-200 cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl">
              {stats.map((stat, index) => (
                <Motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  className="space-y-1"
                >
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                    {stat.value}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {stat.label}
                  </p>
                </Motion.div>
              ))}
            </div>
          </Motion.div>

          {/* Right Column - Redesigned Tabbed Search Card */}
          <Motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-white">
              
              {/* Type Switcher Tabs */}
              <div className="flex rounded-2xl bg-slate-950/80 p-1.5 border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => handleTabChange("sales")}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "sales"
                      ? "bg-amber-500 text-slate-950 shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FaHouse className="text-xs" />
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("rentals")}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "rentals"
                      ? "bg-amber-500 text-slate-950 shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FaKey className="text-xs" />
                  Rent
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("commercial")}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "commercial"
                      ? "bg-amber-500 text-slate-950 shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FaBuilding className="text-xs" />
                  Commercial
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">
                Find Your Ideal Property
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Filter through prime locations & curated property types.
              </p>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Location Search Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Location / City
                  </label>
                  <div className="relative">
                    <FaLocationDot className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      name="q"
                      placeholder="e.g. Beverly Hills, New York, Miami"
                      value={formState.q}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Property Category
                  </label>
                  <select
                    name="category"
                    value={formState.category}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 px-4 py-3 text-sm text-white outline-none focus:border-amber-400 transition"
                  >
                    <option value="" className="bg-slate-900">All Categories</option>
                    <option value="apartments" className="bg-slate-900">Luxury Apartment</option>
                    <option value="houses" className="bg-slate-900">Private Villa / House</option>
                    <option value="condos" className="bg-slate-900">Penthouse / Condo</option>
                    <option value="duplexes" className="bg-slate-900">Duplex</option>
                    <option value="townhomes" className="bg-slate-900">Townhome</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl py-3.5 font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <FaSearch className="text-sm" />
                  Explore Properties
                </button>
              </form>
            </div>
          </Motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;