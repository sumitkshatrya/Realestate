import { useEffect } from "react";
import { useDarkMode } from "../components/DarkModeContext";
import heroimg from "../assets/images/hero1.webp";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  const { darkMode} = useDarkMode();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
     
      {/* Hero Section */}
      <section
        id="hero"
        className="w-full rounded-xl h-[600px] m-auto bg-cover bg-center flex justify-center flex-col items-start lg:px-28 px-4 gap-7 z-20"
        style={{ backgroundImage: `url(${heroimg})` }}
      >
        <h1
          data-aos="zoom-in"
          className="text-6xl font-semibold text-white lg:pr-[500px] pr-0 lg:leading-[70px] leading-[60px]"
        >
          Discover your dream home, in any place you choose.
        </h1>
        <p
          data-aos="zoom-in"
          className="text-white text-xl lg:pr-[500px] pr-0"
        >
          Transform your vision into exceptional properties with our expertise
          in development, construction, and design. Creating spaces that
          inspire and endure.
        </p>
      </section>

      {/* Form Section */}
      <div className="w-full flex items-center">
        <div
          data-aos="zoom-in"
          className={`rounded-xl m-auto grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-6 p-8 -mt-14 shadow-xl ${
            darkMode 
              ? "bg-gray-800 text-white" 
              : "bg-white text-gray-900"
          }`}
        >
          {/* Location Input */}
          <div className="w-full">
            <label htmlFor="location" className="font-semibold block mb-2">
              LOCATION
            </label>
            <input
              id="location"
              type="text"
              placeholder="Enter an address, state, city or pincode"
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Type Select */}
          <div className="w-full">
            <label htmlFor="type" className="font-semibold block mb-2">
              TYPE
            </label>
            <select
              id="type"
              name="type"
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              defaultValue=""
            >
              <option value="" disabled className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Select Property
              </option>
              <option value="rentals">Rentals</option>
              <option value="sales">Sales</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Category Select */}
          <div className="w-full">
            <label htmlFor="category" className="font-semibold block mb-2">
              CATEGORY
            </label>
            <select
              id="category"
              name="category"
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              defaultValue=""
            >
              <option value="" disabled className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Property Category
              </option>
              <option value="apartments">Apartments</option>
              <option value="duplexes">Duplexes</option>
              <option value="condos">Condos</option>
              <option value="houses">Houses</option>
              <option value="townhomes">Townhomes</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="w-full">
            <label className="block mb-2 invisible">Search</label>
            <button className={`w-full p-3 rounded-lg font-semibold cursor-pointer transition-all duration-500 bg-size-200 bg-pos-0 hover:pos-105 ${
              darkMode 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-blue-600 hover:bg-blue-800 text-white"
            }`}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;