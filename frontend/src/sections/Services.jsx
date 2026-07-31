import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import {
  FaArrowRight,
  FaBuilding,
  FaChartLine,
  FaCity,
  FaClipboardList,
  FaHandshake,
  FaHome,
  FaKey,
  FaMapMarkerAlt,
  FaSearchDollar,
  FaSyncAlt,
  FaTools,
} from "react-icons/fa";
import { useDarkMode } from "../components/useDarkMode";
import { servicesAPI } from "../api/servicesApi";

const iconMap = {
  FaHome,
  FaKey,
  FaMapMarkerAlt,
  FaChartLine,
  FaBuilding,
  FaTools,
  FaHandshake,
  FaCity,
  FaSearchDollar,
  FaClipboardList,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const servicesData = await servicesAPI.getServices();
      const validatedServices = servicesData
        .filter((service) => service?.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((service) => ({
          ...service,
          title: service.title || "Untitled Service",
          description: service.description || "No description available.",
          icon: service.icon in iconMap ? service.icon : "FaBuilding",
        }));

      setServices(validatedServices);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Unable to load services right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading) {
    return (
      <section className="section-shell">
        <div
          className={`rounded-[36px] border p-8 sm:p-10 ${
            darkMode
              ? "border-white/10 bg-slate-950/70 text-white"
              : "border-white/80 bg-white/90 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
          }`}
        >
          <div className="mb-10 flex items-center gap-4">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
            <div>
              <p className="text-lg font-semibold">Loading our services</p>
              <p className={darkMode ? "text-slate-300" : "text-slate-600"}>
                Preparing the latest offerings for you.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`animate-pulse rounded-[28px] border p-6 ${
                  darkMode
                    ? "border-white/10 bg-white/5"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <div className="mb-5 h-14 w-14 rounded-2xl bg-rose-200/60" />
                <div className="mb-3 h-5 w-32 rounded-full bg-slate-200/70" />
                <div className="mb-2 h-4 w-full rounded-full bg-slate-200/60" />
                <div className="h-4 w-4/5 rounded-full bg-slate-200/60" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-shell">
        <div
          className={`mx-auto max-w-2xl rounded-[36px] border p-10 text-center ${
            darkMode
              ? "border-white/10 bg-slate-950/70 text-white"
              : "border-white/80 bg-white/90 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
          }`}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <FaSyncAlt className="text-xl" />
          </div>
          <h3 className="font-serif text-3xl">Services unavailable</h3>
          <p
            className={`mx-auto mt-3 max-w-lg text-base leading-7 ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {error}
          </p>
          <button
            onClick={fetchServices}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-rose-700"
          >
            Reload services
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
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
                ? "border-white/10 bg-white/5 text-emerald-200"
                : "border-emerald-200 bg-white/80 text-emerald-700"
            }`}
          >
            Concierge Services
          </span>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Practical support across search, purchase, selling, and aftercare.
          </h2>
          <p
            className={`max-w-2xl text-base leading-7 sm:text-lg ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            From valuation and strategy to legal coordination and relocation
            planning, our team keeps the process calm, clear, and efficient.
          </p>
        </div>

        <ScrollLink
          to="contact"
          smooth
          offset={-90}
          className={`inline-flex cursor-pointer items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ${
            darkMode
              ? "bg-white text-slate-900 hover:bg-emerald-100"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          Talk with an advisor
          <FaArrowRight />
        </ScrollLink>
      </motion.div>

      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {services.length > 0 ? (
          services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || FaBuilding;

            return (
              <motion.article
                key={service._id || index}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className={`group overflow-hidden rounded-[30px] border p-7 ${
                  darkMode
                    ? "border-white/10 bg-slate-950/70"
                    : "border-white/80 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
                }`}
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-rose-500 to-amber-500 text-2xl text-white shadow-lg">
                    <IconComponent />
                  </div>
                  <span
                    className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${
                      darkMode
                        ? "bg-white/5 text-slate-300"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-serif text-2xl">{service.title}</h3>
                <p
                  className={`mt-4 min-h-24 text-base leading-7 ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {service.description}
                </p>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <RouterLink
                    to={`/services/${service.slug || service._id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-rose-500 transition duration-300 hover:text-rose-600"
                  >
                    Explore service
                    <FaArrowRight className="text-xs transition duration-300 group-hover:translate-x-1" />
                  </RouterLink>
                  <div
                    className={`h-px flex-1 ${
                      darkMode ? "bg-white/10" : "bg-slate-200"
                    }`}
                  />
                </div>
              </motion.article>
            );
          })
        ) : (
          <div className="col-span-full">
            <div
              className={`rounded-[32px] border p-10 text-center ${
                darkMode
                  ? "border-white/10 bg-slate-950/70"
                  : "border-white/80 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
              }`}
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <FaTools className="text-xl" />
              </div>
              <h3 className="font-serif text-3xl">New services are on the way</h3>
              <p
                className={`mx-auto mt-3 max-w-xl text-base leading-7 ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                We are refreshing this section with new advisory and property
                support options. Check back shortly or contact us directly.
              </p>
              <ScrollLink
                to="contact"
                smooth
                offset={-90}
                className="mt-8 inline-flex cursor-pointer items-center gap-3 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-rose-700"
              >
                Contact our team
                <FaArrowRight className="text-xs" />
              </ScrollLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
