// import React, { useEffect, useState } from "react";
// import TestimonialCard from "../components/TestimonialCard";
// import { fetchApprovedTestimonials } from "../api/testimonialApi"; // updated API service

// export default function Home() {
//   const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadTestimonials = async () => {
//       try {
//         setLoading(true);
//         const response = await fetchApprovedTestimonials();
//         setTestimonials(Array.isArray(response.data) ? response.data : []);
//       } catch (err) {
//         setError(err.message || "Error fetching testimonials");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTestimonials();
//   }, []);

//   if (loading)
//     return (
//       <p className="p-4 text-center text-gray-500 text-lg">
//         Loading testimonials...
//       </p>
//     );

//   if (error)
//     return (
//       <p className="p-4 text-center text-red-500 text-lg">{error}</p>
//     );

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">Testimonials</h1>

//       {testimonials.length === 0 ? (
//         <p className="text-center text-gray-600">No testimonials yet.</p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {testimonials.map((t) => (
//             <TestimonialCard key={t._id} testimonial={t} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// import React from "react";
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center px-6">
//       {/* Hero Section */}
//       <h1 className="text-4xl font-bold text-blue-600 mb-4">
//         Welcome to TestimonialApp 🎉
//       </h1>
//       <p className="text-gray-600 max-w-xl mb-8">
//         Share your experiences and read what others have to say.  
//         Submit your feedback, explore testimonials, and build trust together.
//       </p>

//       {/* CTA Buttons */}
//       <div className="flex gap-4">
//         <Link
//           to="/testimonials"
//           className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           View Testimonials
//         </Link>
//         <Link
//           to="/submit"
//           className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition"
//         >
//           Submit Your Feedback
//         </Link>
//       </div>

//       {/* Quick Preview of Latest Testimonials */}
//       <div className="mt-12 w-full max-w-4xl">
//         <h2 className="text-2xl font-semibold mb-6">Latest Testimonials</h2>
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* You can map real testimonials here */}
//           <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
//             <p className="text-gray-700 italic">
//               "This platform helped me showcase client feedback easily!"
//             </p>
//             <p className="mt-2 text-sm text-gray-500">— John Doe, Designer ⭐⭐⭐⭐⭐</p>
//           </div>
//           <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
//             <p className="text-gray-700 italic">
//               "I love how simple it is to add and approve testimonials."
//             </p>
//             <p className="mt-2 text-sm text-gray-500">— Sarah Smith, Developer ⭐⭐⭐⭐</p>
//           </div>
//         </div>
//         <div className="mt-6">
//           <Link
//             to="/testimonials"
//             className="text-blue-600 font-medium hover:underline"
//           >
//             See all testimonials →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
//////////////////////////////////
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TestimonialCard from "../components/TestimonialCard";
import SubmitTestimonial from "../pages/SubmitTestimonial";

export default function Client() {
  const [testimonials, setTestimonials] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ avgRating: 0, total: 0 });

  const limit = 3;

  // Fetch paginated testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8080/api/testimonials/approved?page=${page}&limit=${limit}`
        );
        const data = await res.json();
        setTestimonials(data?.testimonials || []);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        setError(err.message || "Error fetching testimonials");
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, [page]);

<<<<<<< HEAD
  // Fetch rating summary
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/testimonials/summary"
        );
        const data = await res.json();
        setSummary(data || { avgRating: 0, total: 0 });
      } catch (err) {
        console.error("Error fetching summary", err);
        setSummary({ avgRating: 0, total: 0 });
      }
    };
    loadSummary();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-8 text-gray-500 text-lg">Loading...</p>
    );
  if (error)
    return (
      <p className="text-center mt-8 text-red-500 text-lg">{error}</p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">
        Customer Testimonials
      </h1>

      {/* Rating Summary */}
      <div className="bg-yellow-100 p-6 rounded-2xl text-center shadow-lg mb-8 transform hover:scale-105 transition">
        <h3 className="text-2xl font-bold">Customer Satisfaction</h3>
        <p className="mt-2 text-xl">
          ⭐ {summary?.avgRating?.toFixed(1) || 0} / 5 ({summary?.total || 0}{" "}
          reviews)
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TestimonialCard testimonial={t} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-4 py-2 rounded-lg font-medium transition 
              ${
                num === page
                  ? "bg-red-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {num}
          </button>
        ))}
      </div>
=======
 
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

        <div className="flex justify-center items-center w-full mt-8">
          <button className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
            darkMode 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-red-500 hover:bg-red-600 text-white"
          } transform hover:scale-105`}>
            View All Testimonials
          </button>
        </div>
      </section>
    </div>
  )
}
>>>>>>> f67b8454b9e83c5bc2dd0b32c8513d0535a050b5

      {/* Add Review Button */}
      <div className="mt-10 flex justify-center">
        <Link to="/SubmitTestimonial">
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition"
          >
            Add Your Review
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
