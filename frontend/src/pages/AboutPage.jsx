import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { contentAPI } from "../api/contentApi";
import aboutImage from "../assets/images/about.jpg";
import { FaBullseye, FaRocket, FaRegLightbulb } from "react-icons/fa";

const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await contentAPI.getAboutContent();
        setContent(response.data);
      } catch (err) {
        setError("Failed to load our story. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  if (!content) {
    return <div className="text-center py-20 text-xl">Content not available.</div>;
  }

  return (
    <div className="section-shell py-12 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider text-rose-600">
            {content.subtitle}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
        </div>

        <div className="max-w-5xl mx-auto">
          <img
            src={aboutImage}
            alt="Company workspace"
            className="rounded-2xl shadow-xl mb-12 w-full h-auto max-h-[500px] object-cover"
          />

          <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700">
            <h2>{content.storyTitle}</h2>
            <p>{content.storyContent}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <FaBullseye className="text-3xl text-rose-500" />
                <h3 className="text-2xl font-bold text-slate-800">Our Mission</h3>
              </div>
              <p className="text-slate-600">{content.missionStatement}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <FaRocket className="text-3xl text-rose-500" />
                <h3 className="text-2xl font-bold text-slate-800">Our Vision</h3>
              </div>
              <p className="text-slate-600">{content.visionStatement}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;