import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaBuilding,
  FaChartLine,
  FaCity,
  FaClipboardList,
  FaEdit,
  FaHandshake,
  FaHome,
  FaKey,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaPlus,
  FaSearchDollar,
  FaTools,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { servicesAPI } from "../api/servicesApi";

const iconOptions = [
  { value: "FaHome", label: "Home", icon: FaHome },
  { value: "FaKey", label: "Key", icon: FaKey },
  { value: "FaMapMarkerAlt", label: "Location", icon: FaMapMarkerAlt },
  { value: "FaChartLine", label: "Chart", icon: FaChartLine },
  { value: "FaBuilding", label: "Building", icon: FaBuilding },
  { value: "FaTools", label: "Tools", icon: FaTools },
  { value: "FaHandshake", label: "Handshake", icon: FaHandshake },
  { value: "FaCity", label: "City", icon: FaCity },
  { value: "FaSearchDollar", label: "Search Dollar", icon: FaSearchDollar },
  { value: "FaClipboardList", label: "Clipboard", icon: FaClipboardList },
  { value: "FaLayerGroup", label: "Services", icon: FaLayerGroup },
];

const defaultForm = {
  title: "",
  description: "",
  icon: "FaHome",
  order: 0,
  isActive: true,
};

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServices();
      setServices(response || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingService(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    setLoading(true);

    try {
      if (editingService) {
        await servicesAPI.updateService(editingService._id, formData);
      } else {
        await servicesAPI.createService(formData);
      }

      resetForm();
      await fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "FaHome",
      order: service.order || 0,
      isActive: service.isActive !== false,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      await servicesAPI.deleteService(id);
      await fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (service) => {
    try {
      await servicesAPI.updateService(service._id, {
        ...service,
        isActive: service.isActive === false,
      });
      await fetchServices();
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-2xl font-semibold text-white">Services</h2>
        <p className="mt-2 text-sm text-slate-300">
          Create, edit, deactivate, and remove the service cards shown on the
          public site.
        </p>
      </Motion.section>

      <Motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {editingService ? "Edit Service" : "Add Service"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Keep the public services section synced from this admin app.
            </p>
          </div>

          {editingService && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              <FaTimes />
              Cancel
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={formData.title}
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
            placeholder="Service title"
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
            required
          />
          <select
            value={formData.icon}
            onChange={(event) =>
              setFormData({ ...formData, icon: event.target.value })
            }
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
          >
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
          placeholder="Describe the service"
          className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
          required
        />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            type="number"
            min="0"
            value={formData.order}
            onChange={(event) =>
              setFormData({
                ...formData,
                order: Number.parseInt(event.target.value, 10) || 0,
              })
            }
            placeholder="Display order"
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
          />

          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
            Active
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(event) =>
                setFormData({ ...formData, isActive: event.target.checked })
              }
              className="h-4 w-4"
            />
          </label>
        </div>

        <Motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500 disabled:opacity-70"
        >
          <FaPlus />
          {editingService ? "Update Service" : "Create Service"}
        </Motion.button>
      </Motion.form>

      <div className="space-y-4">
        {services.map((service, index) => {
          const IconComponent =
            iconOptions.find((option) => option.value === service.icon)?.icon ||
            FaBuilding;

          return (
            <Motion.article
              key={service._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.24 }}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-red-500/15 p-4 text-red-300">
                  <IconComponent className="text-lg" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {service.title}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.isActive === false
                          ? "bg-slate-700 text-slate-300"
                          : "bg-emerald-500/15 text-emerald-300"
                      }`}
                    >
                      {service.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                    {service.icon} | Order {service.order || 0}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleServiceStatus(service)}
                  className="rounded-2xl bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-500/25"
                >
                  {service.isActive === false ? "Activate" : "Deactivate"}
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/25"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/25"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </Motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesManager;
