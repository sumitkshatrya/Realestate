import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { scroller } from "react-scroll";
import heroImage from "../assets/images/hero1.webp";

const stats = [
  {
    value: "18+",
    label: "Years shaping communities",
  },
  {
    value: "240+",
    label: "Homes sold last year",
  },
  {
    value: "96%",
    label: "Client satisfaction",
  },
];

const Hero = ({ setSearchCriteria = () => {} }) => {
  const [formState, setFormState] = useState({
    q: "",
    type: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
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
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left Side */}
          <Motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white border border-white/20">
              Curated Luxury Living
            </span>

            <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white">
              Spaces That Feel
              <span className="block text-yellow-400">
                Already Yours.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-200">
              Discover premium homes, luxury apartments, villas, and
              investment-ready properties with expert guidance and
              personalized service.
            </p>

            {/* Stats */}
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <Motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                  }}
                  className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-5 text-center"
                >
                  <h2 className="text-3xl font-bold text-yellow-400">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-sm text-gray-200">
                    {stat.label}
                  </p>
                </Motion.div>
              ))}
            </div>
          </Motion.div>

          {/* Search Card */}
          <Motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl bg-white/95 backdrop-blur-lg shadow-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Find Your Dream Home
            </h2>

            <p className="text-center text-gray-500 mt-2">
              Search properties by location and category.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 space-y-6"
            >
              {/* Location */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  name="q"
                  placeholder="Enter city or locality"
                  value={formState.q}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Property Type
                </label>

                <select
                  name="type"
                  value={formState.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Type</option>
                  <option value="rentals">Rent</option>
                  <option value="sales">Buy</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formState.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Category</option>
                  <option value="apartments">Apartment</option>
                  <option value="houses">House</option>
                  <option value="condos">Condo</option>
                  <option value="duplexes">Duplex</option>
                  <option value="townhomes">Townhome</option>
                </select>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white rounded-lg py-4 font-semibold flex items-center justify-center gap-3"
              >
                <FaSearch />
                Search Properties
              </button>
            </form>
          </Motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;