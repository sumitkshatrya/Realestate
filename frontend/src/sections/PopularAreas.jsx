import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import area1 from "../assets/images/area1.jpg";
import area2 from "../assets/images/area2.jpg";
import area3 from "../assets/images/area3.jpg";

const areas = [
  {
    image: area1,
    city: "Downtown Residences",
    tagline: "Skyline homes with walkable retail and nightlife.",
    stat: "320",
    label: "active homes",
  },
  {
    image: area2,
    city: "Central Business District",
    tagline: "High-demand apartments near offices and transit.",
    stat: "92%",
    label: "occupancy rate",
  },
  {
    image: area3,
    city: "Harbor Family Quarter",
    tagline: "Quiet streets, schools, and larger living spaces.",
    stat: "18m",
    label: "average close time",
  },
];

const PopularAreas = () => {
  return (
    <section
      className="section-shell overflow-hidden text-slate-900"
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1.95fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-rose-600">
            City Intelligence
          </span>

          <div className="space-y-4">
            <h2 className="max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
              Explore neighborhoods that match your pace and priorities.
            </h2>
            <p className="max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              We curate locations by lifestyle, demand, and long-term value so
              your search starts with the right environment, not just the right
              floor plan.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            >
              <p className="text-3xl font-semibold">12+</p>
              <p className="text-slate-600">
                districts actively tracked by our advisors
              </p>
            </div>
            <div
              className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            >
              <p className="text-3xl font-semibold">24/7</p>
              <p className="text-slate-600">
                local insight for buyers, renters, and investors
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((area, index) => (
            <motion.article
              key={area.city}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
            >
              <div
                className="relative h-80 bg-cover bg-center"
                style={{ backgroundImage: `url(${area.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                  <FaMapMarkerAlt className="text-[11px]" />
                  Handpicked zone
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.28em] text-white/70">
                    {area.label}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl">{area.city}</h3>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">
                        {area.tagline}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-xl font-semibold backdrop-blur-md">
                      {area.stat}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6">
                <p className="text-sm text-slate-600">
                  Market profile and lifestyle guidance included
                </p>
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition duration-300 group-hover:translate-x-1"
                  aria-label={`Explore ${area.city}`}
                >
                  <FaArrowRight />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularAreas;
