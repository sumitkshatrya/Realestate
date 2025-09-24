import aboutimg from '../assets/images/about.jpg';
import { useDarkMode } from '../components/DarkModeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    AOS.init({ 
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  const { darkMode } = useDarkMode(); // Removed toggleDarkMode since it's not used

  return (
    <section
      id="about"
      className={`w-full m-auto lg:px-40 px-10 py-20 grid lg:grid-cols-2 grid-cols-1 justify-center items-center gap-10 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div>
        <img
          data-aos="zoom-in"
          src={aboutimg}
          alt="About our company"
          className="rounded-2xl lg:w-[500px] lg:h-[600px] w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center items-start gap-8">
        <h1 data-aos="zoom-in" className="text-5xl font-bold leading-tight">
          Excellence in Every Project
        </h1>
        <p
          data-aos="zoom-in"
          data-aos-delay="400"
          className="text-2xl text-justify"
        >
          With over two decades of experience in real estate development, we've
          established ourselves as industry leaders. Our commitment to
          excellence, innovation, and customer satisfaction has earned us a
          reputation for delivering exceptional properties that stand the test of
          time.
        </p>
        <button className="bg-red-700 text-white hover:bg-blue-800 text-lg p-4 rounded-lg mt-6 font-semibold cursor-pointer transition-colors duration-300">
          Read More
        </button>
      </div>
    </section>
  );
};

export default About;