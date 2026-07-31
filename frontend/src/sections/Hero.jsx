import { useDarkMode } from "../components/useDarkMode";
import { motion as Motion } from "framer-motion";
import heroimg from "../assets/images/hero1.webp";
import React from "react";

const stats = [
  { value: "18+", label: "Years shaping communities" },
  { value: "240+", label: "Homes sold last year" },
  { value: "96%", label: "Client satisfaction score" },
];

const Hero = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      id="home"
      className={`overflow-hidden pt-10 pb-24 ${
        darkMode ? "bg-slate-950 text-white" : "bg-transparent text-slate-900"
      }`}
    >
      <div className="section-shell">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-cover bg-center px-6 py-16 shadow-2xl lg:px-12 lg:py-20"
          style={{ backgroundImage: `url(${heroimg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/62 to-slate-950/30" />
          <div className="absolute -right-20 top-10 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">
                Curated city living
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
                Spaces that feel
                <span className="block text-orange-300">already yours.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                Find refined homes, investment-ready properties, and high-touch
                advisory from a team that treats design, location, and long-term
                value as one conversation.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <Motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.35 }}
                    className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{stat.label}</p>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="rounded-[1.75rem] border border-white/12 bg-white/10 p-6 backdrop-blur-xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">
                Quick Search
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Start with the lifestyle you want
              </h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-100">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    placeholder="Downtown, waterfront, gated community..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="type" className="mb-2 block text-sm font-medium text-slate-100">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      defaultValue=""
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="rentals">Rentals</option>
                      <option value="sales">Sales</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-100">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      defaultValue=""
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="" disabled>
                        Property style
                      </option>
                      <option value="apartments">Apartments</option>
                      <option value="duplexes">Duplexes</option>
                      <option value="condos">Condos</option>
                      <option value="houses">Houses</option>
                      <option value="townhomes">Townhomes</option>
                    </select>
                  </div>
                </div>

                <button className="w-full rounded-2xl bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700">
                  Explore Properties
                </button>
              </div>
            </Motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
