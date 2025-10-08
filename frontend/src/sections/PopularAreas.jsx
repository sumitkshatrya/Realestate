import { useDarkMode } from "../components/DarkModeContext";
import area1 from "../assets/images/area1.jpg";
import area2 from "../assets/images/area2.jpg";
import area3 from "../assets/images/area3.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import React from "react";
const PopularAreas = () => {
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
    <section
      className={`w-full m-auto lg:px-40 px-10 py-20 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="w-full grid lg:grid-cols-4 grid-cols-1 gap-8 justify-center items-center">
        {/* Title Section - takes 1 column */}
        <div className="lg:col-span-1">
          <h1
            data-aos="zoom-in"
            className={`text-5xl font-bold leading-tight mb-6 ${
              darkMode ? "text-red-500" : "text-red-600"
            }`}
          >
            Popular Areas
          </h1>
          <h1
            data-aos="zoom-in"
            data-aos-delay="400"
            className={`text-lg font-semibold leading-10 mt-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Explore most <br /> popular areas
          </h1>
        </div>

        {/* Images Section - takes 3 columns */}
        <div className="lg:col-span-3 grid lg:grid-cols-3 grid-cols-1 gap-6">
          <div
            data-aos="zoom-in"
            data-aos-delay="400"
            style={{ backgroundImage: `url(${area1})` }}
            className="h-[400px] bg-cover bg-center rounded-xl"
            role="img"
            aria-label="Modern residential area with luxury apartments"
          ></div>
          <div
            data-aos="zoom-in"
            data-aos-delay="600"
            style={{ backgroundImage: `url(${area2})` }}
            className="h-[400px] bg-cover bg-center rounded-xl"
            role="img"
            aria-label="Urban downtown district with commercial buildings"
          ></div>
          <div
            data-aos="zoom-in"
            data-aos-delay="800"
            style={{ backgroundImage: `url(${area3})` }}
            className="h-[400px] bg-cover bg-center rounded-xl"
            role="img"
            aria-label="Suburban neighborhood with family homes"
          ></div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="w-full grid lg:grid-cols-3 grid-cols-1 lg:justify-center justify-start items-center gap-6 mt-12">
        <div 
          data-aos="slide-up" 
          data-aos-delay="200" 
          className="flex justify-center items-center gap-8 w-full"
        >
          <h1 className={`text-7xl font-semibold ${
            darkMode ? "text-white" : "text-black"
          }`}>
            5K
          </h1>
          <h1 className={darkMode ? "text-white" : "text-black"}>
            ACTIVE<br />LISTINGS
          </h1>
        </div>
        <div 
          data-aos="slide-up" 
          data-aos-delay="200" 
          className="flex justify-center items-center gap-8 w-full"
        >
          <h1 className={`text-7xl font-semibold ${
            darkMode ? "text-white" : "text-black"
          }`}>
            5K
          </h1>
          <h1 className={darkMode ? "text-white" : "text-black"}>
            ACTIVE<br />LISTINGS
          </h1>
        </div>
        <div 
          data-aos="slide-up" 
          data-aos-delay="200" 
          className="flex justify-center items-center gap-8 w-full"
        >
          <h1 className={`text-7xl font-semibold ${
            darkMode ? "text-white" : "text-black"
          }`}>
            5K
          </h1>
          <h1 className={darkMode ? "text-white" : "text-black"}>
            ACTIVE<br />LISTINGS
          </h1>
        </div>
      </div>
    </section>
  );
};

export default PopularAreas;