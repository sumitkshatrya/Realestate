import { useDarkMode } from "../components/DarkModeContext"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from "react"
import { client } from "../components/export"
import { FaStar } from "react-icons/fa"

const Client = () => {

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);
  
  const { darkMode } = useDarkMode();

  // Function to render stars based on rating - FIXED SYNTAX
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={`size-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      <section 
        id='testimonials' 
        className='lg:w-[95%] w-full h-fit m-auto rounded-xl flex justify-center flex-col lg:px-20 px-6 py-20 gap-20'
      >
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center gap-6 w-full">
          <h1 
            data-aos="zoom-in" 
            className={`text-4xl font-bold ${darkMode ? "text-white" : "text-red-500"}`}
          >
            OUR CLIENTS
          </h1>
          <h1 className={`text-3xl lg:text-[40px] font-semibold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            What our clients are saying about us
          </h1>
          <div className={`w-20 h-1 rounded-full ${darkMode ? "bg-red-500" : "bg-red-500"}`}></div>
        </div>

        {/* Testimonials Grid */}
        <div id="clients-box" className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center items-stretch gap-8 w-full">
          {client.map((item, index) => (
            <div 
              data-aos="zoom-in" 
              data-aos-delay={index * 100} 
              key={index} 
              className={`group relative overflow-hidden ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-750" 
                  : "bg-white hover:bg-red-50"
              } cursor-pointer p-8 flex flex-col gap-6 rounded-xl w-full transition-all duration-300 shadow-lg hover:shadow-xl border ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } hover:-translate-y-2`}
            >
              {/* Quote Icon */}
              <div className={`absolute top-4 right-4 text-6xl opacity-10 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}>&quot;</div>

              {/* Client Info */}
              <div className="flex justify-start items-center gap-4 z-10">
                <img 
                  src={item.image} 
                  alt={item.name || "Client"} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-500 transform group-hover:scale-110 transition-transform duration-300" 
                /> 
                <div className="flex flex-col justify-center items-start gap-1">
                  <h1 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {item.name}
                  </h1>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {item.text}
                  </p>
                </div>
              </div>
              
              {/* Feedback */}
              <p className={`text-justify leading-relaxed z-10 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                &quot;{item.feedback}&quot;
              </p>

              {/* Rating Stars */}
              <div className="flex justify-start items-center gap-2 w-full z-10">
                {item.rating ? renderStars(item.rating) : renderStars(5)}
                <span className={`text-sm ml-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {item.rating || 5}/5
                </span>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-300 ${
                darkMode ? "bg-red-500" : "bg-red-500"
              }`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action
        <div className="flex justify-center items-center w-full mt-8">
          <button className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
            darkMode 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-red-500 hover:bg-red-600 text-white"
          } transform hover:scale-105`}>
            View All Testimonials
          </button>
        </div> */}
      </section>
    </div>
  )
}

export default Client