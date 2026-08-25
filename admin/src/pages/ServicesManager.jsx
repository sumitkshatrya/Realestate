import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
  FaCheck,
} from "react-icons/fa";
import { servicesAPI } from "../api/servicesApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";
import { useForm } from "react-hook-form";

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
  FaLayerGroup,
};

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
  const [editingService, setEditingService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const confirm = useConfirmationModal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultForm });

  const { data: services, loading: isLoadingServices, refetch: fetchServices } = useFetchData(servicesAPI.getServices);

  const openAddDrawer = () => {
    setEditingService(null);
    reset(defaultForm);
    setIsDrawerOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    reset({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "FaHome",
      order: service.order || 0,
      isActive: service.isActive !== false,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingService(null);
    reset(defaultForm);
  };

  const onSubmit = async (data) => {
    try {
      if (editingService) {
        await servicesAPI.updateService(editingService._id, data);
      } else {
        await servicesAPI.createService(data);
      }
      closeDrawer();
      await fetchServices();
    } catch (error) {
      /* Handled by global interceptor */
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Service?",
      message: "Are you sure you want to delete this service? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await servicesAPI.deleteService(id);
          await fetchServices();
        } catch (error) {
          /* Handled by global interceptor */
        }
      },
    });
  };

  const toggleServiceStatus = async (service) => {
    try {
      await servicesAPI.updateService(service._id, {
        ...service,
        isActive: service.isActive === false,
      });
      await fetchServices();
    } catch (error) {
      /* Handled by global interceptor */
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <Motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Offerings & Solutions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Platform Services</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage real estate services, consulting offerings, and platform features.
          </p>
        </div>

        <button onClick={openAddDrawer} className="btn btn-primary shrink-0">
          <FaPlus className="text-xs" />
          <span>Add New Service</span>
        </button>
      </Motion.div>

      {/* SERVICES GRID */}
      {isLoadingServices ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          Loading platform services...
        </div>
      ) : (services || []).length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-16 text-center">
          <FaLayerGroup className="text-3xl text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No Services Found</p>
          <p className="text-xs text-slate-400 mt-1">Add client offerings and services to display on the public application.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const IconComp = iconMap[service.icon] || FaLayerGroup;

            return (
              <Motion.article
                key={service._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl hover:border-rose-500/30 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/20">
                      <IconComp className="text-xl" />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                        service.isActive !== false
                          ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                          : "border-slate-500/30 bg-slate-800 text-slate-400"
                      }`}
                    >
                      {service.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => toggleServiceStatus(service)}
                    className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                      service.isActive !== false
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    }`}
                  >
                    {service.isActive !== false ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition"
                    title="Edit Service"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition"
                    title="Delete Service"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </Motion.article>
            );
          })}
        </div>
      )}

      {/* DRAWER MODAL */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <Motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-md bg-slate-900 border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white">
                  {editingService ? "Edit Platform Service" : "New Platform Service"}
                </h2>
                <button onClick={closeDrawer} className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Service Title *</label>
                  <input
                    type="text"
                    {...register("title", { required: "Title is required." })}
                    placeholder="e.g. Property Valuation & Advisory"
                    className="input-field"
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Style</label>
                  <select {...register("icon")} className="input-field">
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Service Description *</label>
                  <textarea
                    rows={4}
                    {...register("description", { required: "Description is required." })}
                    placeholder="Describe key benefits and features offered..."
                    className="input-field text-xs"
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeDrawer} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    <FaCheck className="text-xs" />
                    {editingService ? "Save Changes" : "Create Service"}
                  </button>
                </div>
              </form>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesManager;
