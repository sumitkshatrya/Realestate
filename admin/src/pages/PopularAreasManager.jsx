import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaTrash,
  FaCheck,
  FaBuilding,
  FaImage,
} from "react-icons/fa";
import { popularAreaAPI } from "../api/popularAreaApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";
import { useForm } from "react-hook-form";

const defaultForm = {
  name: "",
  propertyCount: "",
  imageUrl: "",
  isActive: true,
};

const PopularAreasManager = () => {
  const [editingArea, setEditingArea] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const confirm = useConfirmationModal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultForm });

  const { data: areas, loading: isLoadingAreas, refetch: fetchAreas } = useFetchData(popularAreaAPI.getAreas);

  const openAddDrawer = () => {
    setEditingArea(null);
    reset(defaultForm);
    setIsDrawerOpen(true);
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    reset({
      name: area.name || "",
      propertyCount: area.propertyCount || "",
      imageUrl: area.imageUrl || "",
      isActive: area.isActive !== false,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingArea(null);
    reset(defaultForm);
  };

  const onSubmit = async (data) => {
    try {
      if (editingArea) {
        await popularAreaAPI.updateArea(editingArea._id, data);
      } else {
        await popularAreaAPI.createArea(data);
      }
      closeDrawer();
      await fetchAreas();
    } catch (error) {
      /* Handled by global interceptor */
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Popular Area?",
      message: "Are you sure you want to delete this popular area? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await popularAreaAPI.deleteArea(id);
          await fetchAreas();
        } catch (error) {
          /* Handled by global interceptor */
        }
      },
    });
  };

  const toggleAreaStatus = async (area) => {
    try {
      await popularAreaAPI.updateArea(area._id, {
        ...area,
        isActive: area.isActive === false,
      });
      await fetchAreas();
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
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Locations & Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Popular Areas & Regions</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage highlighted neighborhoods, location cards, and property counters shown on the site.
          </p>
        </div>

        <button onClick={openAddDrawer} className="btn btn-primary shrink-0">
          <FaPlus className="text-xs" />
          <span>Add Neighborhood</span>
        </button>
      </Motion.div>

      {/* AREA CARDS GRID */}
      {isLoadingAreas ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          Loading popular locations...
        </div>
      ) : (areas || []).length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-16 text-center">
          <FaMapMarkerAlt className="text-3xl text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No Popular Areas Configured</p>
          <p className="text-xs text-slate-400 mt-1">Add featured neighborhoods to highlight top real estate regions.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, idx) => (
            <Motion.article
              key={area._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                {area.imageUrl ? (
                  <img
                    src={area.imageUrl}
                    alt={area.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600 text-xs">
                    <FaImage className="text-2xl mr-2" /> No preview image
                  </div>
                )}
                <span className="absolute bottom-3 left-3 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-cyan-300 border border-white/10 flex items-center gap-1.5">
                  <FaBuilding className="text-[10px]" />
                  {area.propertyCount || "0 Properties"}
                </span>
                <span
                  className={`absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                    area.isActive !== false
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                      : "border-slate-500/30 bg-slate-800 text-slate-400"
                  }`}
                >
                  {area.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FaMapMarkerAlt className="text-cyan-400 text-xs" />
                    {area.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => toggleAreaStatus(area)}
                    className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                      area.isActive !== false
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    }`}
                  >
                    {area.isActive !== false ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(area)}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition"
                    title="Edit Area"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(area._id)}
                    className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition"
                    title="Delete Area"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </Motion.article>
          ))}
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
                  {editingArea ? "Edit Neighborhood" : "New Neighborhood"}
                </h2>
                <button onClick={closeDrawer} className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Neighborhood Name *</label>
                  <input
                    type="text"
                    {...register("name", { required: "Area name is required." })}
                    placeholder="e.g. Bandra West, Mumbai"
                    className="input-field"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Property Count Tag</label>
                  <input
                    type="text"
                    {...register("propertyCount")}
                    placeholder="e.g. 45+ Luxury Properties"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    {...register("imageUrl")}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeDrawer} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    <FaCheck className="text-xs" />
                    {editingArea ? "Save Changes" : "Create Location"}
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

export default PopularAreasManager;
