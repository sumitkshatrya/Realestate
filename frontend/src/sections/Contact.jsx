import { useDarkMode } from '../components/DarkModeContext'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react';

const Contact = () => {

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
    <div className={`${darkMode ? "bg-gray-900" : "bg-white"} pb-20`}>
      <section id='contact' className={`${darkMode ? "bg-gray-900" : "bg-red-100"} lg:w-[95%] w-full h-fit m-auto rounded-xl grid lg:grid-cols-2 grid-cols-1 justify-center items-center lg:px-36 px-6 py-20 gap-10`}>
        
        {/* Contact Form Column */}
        <div data-aos="zoom-in" className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} p-10 flex flex-col justify-center items-center gap-6 rounded-xl w-full text-center`}>
          <h1 className={`${darkMode ? "text-white" : "text-black"} text-3xl font-bold mb-4`}>Send a message today</h1>
          
          <div className="w-full space-y-4">
            <input 
              type='text' 
              placeholder='Enter your full name here'
              className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-start focus:outline-none focus:border-blue-500'
            />
            <input 
              type='email' 
              placeholder='Enter your valid email'
              className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-start focus:outline-none focus:border-blue-500'
            />
            <input 
              type='number' 
              placeholder='Enter your valid mobile number'
              className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-start focus:outline-none focus:border-blue-500'
            />
            <textarea 
              placeholder='Enter your message here....' 
              className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-start resize-none focus:outline-none focus:border-blue-500'
              rows="5"
            ></textarea>
          </div>
          
          <button className={`w-full text-lg py-4 px-8 rounded-xl font-semibold cursor-pointer transition-colors mt-4 ${
            darkMode ? "bg-red-600 hover:bg-black text-white" : "bg-blue-500 hover:bg-black text-white"
          }`}>
            SEND EMAIL
          </button>
        </div>

        {/* Information Column */}
        <div className='flex flex-col justify-center items-start gap-8 lg:p-10 p-6'>
          <h1 data-aos="zoom-in" data-aos-delay="200" className={`text-2xl font-bold ${darkMode ? "text-red-500" : "text-red-600"}`}>
            REACH US
          </h1>
          <h1 data-aos="zoom-in" data-aos-delay="200" className={`text-4xl font-semibold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            Get in touch with us today and our team will assist you 
          </h1>
          <p data-aos="zoom-in" data-aos-delay="200" className={`text-xl  leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            Our experts and developers would love to contribute their expertise and insights and help you today. Contact us to help you plan your next transaction, either buying or selling a home.
          </p>
           <button className={`text-md py-3 px-8 rounded-xl font-semibold cursor-pointer  ${
            darkMode ? "bg-red-600 hover:bg-black text-white" : "bg-blue-500 hover:bg-black text-white"
          }`}>
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}

export default Contact