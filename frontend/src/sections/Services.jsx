import { useDarkMode } from "../components/DarkModeContext";
import { service } from '../components/export';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import React from "react";
const Services = () => {
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
    <div className={`${darkMode ? "bg-gray-900" : "bg-white"} pb-20 min-h-screen`}>
      <section id="services" className="lg:w-[95%] w-full h-fit m-auto flex flex-col justify-center items-center lg:px-20 px-6 py-20 gap-10">
        {/* Header Section - Centered */}
        <div className="flex flex-col justify-center items-center gap-4 text-center"> 
          <h1 data-aos="zoom-in" className={`text-5xl font-bold ${darkMode ? "text-red-500" : "text-red-600"}`}>
            OUR SERVICES
          </h1>
          <h1 data-aos="zoom-in" className={`text-4xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>
            Top real estate <br /> services available
          </h1>
        </div>

        {/* Services Grid - Centered */}
        <div className="grid lg:grid-cols-3 grid-cols-1 justify-center items-center gap-8 w-full max-w-6xl">
          {service.map((item, index) => (
            <div 
              data-aos="zoom-in" 
              data-aos-delay={index * 200}
              key={index}
              className={`h-[350px] px-8 py-16 flex flex-col justify-center items-center gap-4 rounded-xl border-b-[5px] border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-300 text-center ${
                darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white"
              }`}
            >
              {/* Icon */}
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                <item.icon className="text-red-600 dark:text-red-400 size-8 transform hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Title */}
              <h1 className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {item.title}
              </h1>
              
              {/* Description */}
              <p className={`text-base leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {item.desc}
              </p>
              
              {/* Read More Button */}
              <button className={`border-b-2 border-red-600 font-semibold pb-1 transition-all duration-300 hover:border-red-700 ${
                darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
              }`}>
                READ MORE
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;