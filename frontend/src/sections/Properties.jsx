import React from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBath,
  FaBed,
  FaHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { Link as ScrollLink } from "react-scroll";
import { property } from "../components/export";
import { useDarkMode } from "../components/useDarkMode";

const Properties = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      id="properties"
      className={`section-shell ${darkMode ? "text-white" : "text-slate-900"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="space-y-4">
          <span
            className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] ${
              darkMode
                ? "border-white/10 bg-white/5 text-amber-200"
                : "border-amber-200 bg-white/80 text-amber-700"
            }`}
          >
            Featured Collection
          </span>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Homes selected for design quality, light, and livability.
          </h2>
          <p
            className={`max-w-2xl text-base leading-7 sm:text-lg ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Browse standout listings curated to give you a sharper starting
            point, whether you are buying your first home or upgrading into a
            more ambitious neighborhood.
          </p>
        </div>

        <ScrollLink
          to="contact"
          smooth
          offset={-90}
          className={`inline-flex cursor-pointer items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ${
            darkMode
              ? "bg-white text-slate-900 hover:bg-amber-100"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          Book a private consultation
          <FaArrowRight />
        </ScrollLink>
      </motion.div>

      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {property.map((item, index) => (
          <motion.article
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className={`group overflow-hidden rounded-[30px] border ${
              darkMode
                ? "border-white/10 bg-slate-950/70"
                : "border-white/70 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
            }`}
          >
            <div
              className="relative h-72 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.images})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                  Signature Home
                </span>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition duration-300 hover:scale-105"
                  aria-label={`Save ${item.name}`}
                >
                  <FaHeart />
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 text-xs backdrop-blur-sm">
                  <FaMapMarkerAlt />
                  {item.address}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      {item.about}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-2xl font-semibold">
                    {item.price}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <FaBed />, value: item.bed, label: "Beds" },
                  { icon: <FaBath />, value: item.bath, label: "Baths" },
                  {
                    icon: <MdSpaceDashboard />,
                    value: item.area,
                    label: "Area",
                  },
                ].map((detail) => (
                  <div
                    key={detail.label}
                    className={`rounded-2xl border px-4 py-4 text-center ${
                      darkMode
                        ? "border-white/10 bg-white/5"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                      {detail.icon}
                    </div>
                    <p className="text-sm font-semibold">{detail.value}</p>
                    <p
                      className={`text-xs uppercase tracking-[0.22em] ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {detail.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.24em] ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Listed with
                  </p>
                  <p className="mt-1 text-base font-semibold">{item.owner}</p>
                </div>

                <ScrollLink
                  to="contact"
                  smooth
                  offset={-90}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition duration-300 ${
                    darkMode
                      ? "bg-white text-slate-900 hover:bg-amber-100"
                      : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                >
                  Schedule tour
                  <FaArrowRight className="text-xs" />
                </ScrollLink>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Properties;
