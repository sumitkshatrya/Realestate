import aboutimg from '../assets/images/about.jpg';
import { motion as Motion } from "framer-motion";
import { useDarkMode } from "../components/useDarkMode";
import React from "react";

const About = () => {
  const { darkMode } = useDarkMode(); 

  return (
    <section
      id="about"
      className={`py-24 ${
        darkMode ? "bg-slate-950 text-white" : "bg-transparent text-slate-900"
      }`}
    >
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <Motion.div
          initial={{ opacity: 0, x: -22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="relative"
        >
          <div className="absolute -left-5 -top-5 h-24 w-24 rounded-3xl bg-orange-500/20 blur-2xl" />
          <img
            src={aboutimg}
            alt="About our company"
            className="relative z-10 h-[520px] w-full rounded-[2rem] object-cover shadow-2xl"
          />
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className={`rounded-[2rem] border p-8 lg:p-10 ${
            darkMode
              ? "border-white/10 bg-white/5"
              : "border-orange-100 bg-white/80 shadow-xl shadow-orange-100/50"
          }`}
        >
          <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${
            darkMode ? "text-orange-200/70" : "text-orange-600/70"
          }`}>
            About us
          </p>
          <h2 className={`mt-4 text-4xl font-semibold leading-tight lg:text-5xl ${
            darkMode ? "text-white" : "text-slate-900"
          }`}>
            Development expertise with the calm of a private advisor.
          </h2>
          <p className={`mt-6 text-lg leading-8 ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}>
            For more than two decades, we have shaped residential experiences
            that balance architecture, neighborhood character, and long-term
            value. Every recommendation is filtered through how people actually
            want to live, invest, and grow.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Design-forward developments",
              "Transparent acquisition guidance",
              "End-to-end transaction support",
              "Long-term value strategy",
            ].map((item) => (
              <div
                key={item}
                className={`rounded-2xl px-4 py-4 text-sm font-medium ${
                  darkMode ? "bg-white/5 text-slate-200" : "bg-orange-50 text-slate-700"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <button className="mt-8 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
            Discover Our Story
          </button>
        </Motion.div>
      </div>
    </section>
  );
};

export default About;
