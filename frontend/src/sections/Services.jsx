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
import { servicesAPI } from "../api/servicesApi.js";

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

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await servicesAPI.getServices();
      const validatedServices = (response.data || [])
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
      <section className="py-24 bg-[var(--background-color)]">
        <div className="container mx-auto px-4">
            <div className="text-center">
                <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent" />
                <h3 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Loading Services</h3>
                <p className="text-[var(--text-secondary)]">Preparing the latest offerings for you.</p>
            </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-[var(--neutral-100)]">
        <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                <FaSyncAlt className="text-2xl" />
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)]">Services Unavailable</h3>
            <p className="mx-auto mt-3 max-w-lg text-lg leading-7 text-[var(--text-secondary)]">{error}</p>
            <button onClick={fetchServices} className="btn btn-primary mt-8">
                Reload Services
            </button>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-[var(--background-color)]">
      <div className="container mx-auto px-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="mb-12 text-center"
        >
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)]">
                Our Services
            </span>
            <h2 className="mt-4 text-4xl font-bold text-[var(--text-primary)] lg:text-5xl">
                Support Across Your Journey
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg leading-8 text-[var(--text-secondary)]">
                From valuation and strategy to legal coordination and relocation planning, our team keeps the process calm, clear, and efficient.
            </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.length > 0 ? (
            services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || FaBuilding;

                return (
                <motion.article
                    key={service._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group overflow-hidden rounded-2xl border border-[var(--neutral-200)] bg-[var(--background-color)] p-8 text-center shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2"
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] text-3xl text-white shadow-lg">
                        <IconComponent />
                    </div>

                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{service.title}</h3>
                    <p className="mt-2 min-h-24 text-base leading-7 text-[var(--text-secondary)]">
                        {service.description}
                    </p>

                    <RouterLink
                        to={`/services/${service.slug || service._id}`}
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--primary-color)] transition group-hover:text-[var(--accent-color)]"
                    >
                        Explore Service
                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                    </RouterLink>
                </motion.article>
                );
            })
            ) : (
            <div className="col-span-full text-center p-10 rounded-2xl bg-[var(--neutral-100)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                    <FaTools className="text-2xl" />
                </div>
                <h3 className="text-3xl font-bold text-[var(--text-primary)]">New Services Coming Soon</h3>
                <p className="mx-auto mt-3 max-w-xl text-lg leading-7 text-[var(--text-secondary)]">
                    We're refreshing this section with new advisory and support options. Check back shortly or contact us directly.
                </p>
                <ScrollLink
                    to="contact"
                    smooth
                    offset={-90}
                    className="btn btn-primary mt-8"
                >
                    Contact Our Team
                </ScrollLink>
            </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default Services;
