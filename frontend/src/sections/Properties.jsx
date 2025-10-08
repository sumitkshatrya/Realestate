import React from "react";
import { useEffect } from "react";
import { useDarkMode } from "../components/DarkModeContext";
import { property } from "../components/export";
import {
  FaBath,
  FaBed,
  FaShareAlt,
  FaUserCircle,
  FaPlus,
  FaMapMarkerAlt,
  FaVideo,
  FaCamera,
  FaHeart,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const Properties = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  const { darkMode } = useDarkMode();

  return (
    <div
      className={`w-full min-h-screen flex justify-center items-center m-auto lg:px-40 px-10 py-20 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <section
        id="properties"
        className="lg:w-[90%] w-full max-w-7xl flex flex-col justify-center items-center gap-10"
      >
        
        <div className="flex flex-col justify-center items-center gap-4 text-center">
          <h1
            data-aos="zoom-in"
            className={`font-bold text-5xl ${
              darkMode ? "text-red-700" : "text-red-600"
            }`}
          >
            PROPERTIES
          </h1>
          <h1
            data-aos="zoom-in"
            className={`font-semibold text-4xl ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Explore the latest properties
          </h1>
        </div>

        {/* Properties Grid - Centered */}
        <div className="w-full grid lg:grid-cols-3 grid-cols-1 gap-8 justify-center items-center">
          {property.map((item, index) => (
            <div
              data-aos="zoom-in"
              data-aos-delay={index * 200}
              key={index}
              className={`${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } rounded-xl w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300 mx-auto`}
            >
              {/* Image Section */}
              <div
                className="bg-cover bg-center h-[250px] rounded-t-xl p-4 flex flex-col justify-between items-end relative"
                style={{ backgroundImage: `url(${item.images})` }}
              >
                <div className="absolute inset-0 bg-opacity-30 rounded-t-xl"></div>
                
                {/* Top Buttons */}
                <div className="flex justify-between items-center w-full z-10">
                  <div>
                    <button className="px-3 py-1 bg-red-600 hover:bg-white hover:text-black text-white rounded-full text-[13px] transition-colors duration-300">
                      Featured
                    </button>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <button className="px-3 py-1 bg-red-600 hover:bg-white hover:text-black text-white rounded-full text-[13px] transition-colors duration-300">
                      Sales
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-white hover:text-black text-white rounded-full text-[13px] transition-colors duration-300">
                      Active
                    </button>
                  </div>
                </div>
                
                {/* Bottom Info */}
                <div className="flex justify-between items-center w-full z-10">
                  <div className="flex justify-start items-center gap-2">
                    <FaMapMarkerAlt className="size-4 text-white" />
                    <h1 className="text-white text-sm">{item.address}</h1>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <FaVideo className="size-4 text-white cursor-pointer hover:text-red-300 transition-colors duration-300" />
                    <FaCamera className="size-4 text-white cursor-pointer hover:text-red-300 transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-6 py-6 flex flex-col justify-center items-center gap-4 w-full text-center">
                <div className="w-full">
                  <h1 className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-black"
                  }`}>
                    {item.name}
                  </h1>
                  <h1 className={`text-xl font-semibold mt-2 ${
                    darkMode ? "text-red-400" : "text-red-600"
                  }`}>
                    {item.price}
                  </h1>
                </div>
                
                <p className={`w-full ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {item.about}
                </p>

                {/* Icons Section */}
                <div className="flex justify-center items-center gap-6 w-full">
                  <div className="flex justify-center items-center gap-2">
                    <FaBath className="size-5 text-red-400" />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>
                      {item.bath}
                    </span>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <FaBed className="size-5 text-red-400" />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>
                      {item.bed}
                    </span>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <MdSpaceDashboard className="size-5 text-red-400" />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>
                      {item.area}
                    </span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-200 mt-4"></div>
                
                {/* Owner Info */}
                <div className="flex justify-between items-center w-full mt-4">
                  <div className="flex justify-center items-center gap-2">
                    <FaUserCircle className="size-5 text-red-400" />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>
                      {item.owner}
                    </span>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <div className="p-2 border-2 border-gray-200 hover:bg-red-600 cursor-pointer transform hover:scale-110 transition-all duration-300 rounded">
                      <FaShareAlt className="size-4 text-red-400 hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="p-2 border-2 border-gray-200 hover:bg-red-600 cursor-pointer transform hover:scale-110 transition-all duration-300 rounded">
                      <FaHeart className="size-4 text-red-400 hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="p-2 border-2 border-gray-200 hover:bg-red-600 cursor-pointer transform hover:scale-110 transition-all duration-300 rounded">
                      <FaPlus className="size-4 text-red-400 hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Properties;