import aboutimg from '../assets/images/about.jpg';
import { motion as Motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { contentAPI } from '../api/contentApi';
import { Link } from 'react-router-dom';

const About = () => {
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
        setError("Failed to load content.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <section
      id="about"
      className="bg-[var(--background-color)] py-24"
    >
      <div className="container mx-auto grid items-center gap-12 lg:grid-cols-2 px-4">
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[var(--primary-color)]/20 blur-3xl" />
          <img
            src={aboutimg}
            alt="A modern, minimalist building exterior"
            className="relative z-10 h-auto max-h-[560px] w-full rounded-2xl object-cover shadow-2xl"
          />
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {loading && <p>Loading content...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {content && (
            <>
              <span className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)]">
                {content.subtitle}
              </span>
              <h2 className="mt-4 text-4xl font-bold leading-tight text-[var(--text-primary)] lg:text-5xl">
                {content.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)]">
                {content.paragraph}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {content.features.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg bg-[var(--neutral-100)] p-4"
                  >
                    <FaChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--primary-color)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <Link to="/about-us">
            <button className="btn btn-primary mt-10 inline-flex items-center gap-2">
              Discover Our Story
              <FaChevronRight />
            </button>
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default About;
