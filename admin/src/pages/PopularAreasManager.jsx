import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaTrash,
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
  const confirm = useConfirmationModal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultForm });

  const { data: areas, loading: isLoadingAreas, refetch: fetchAreas } = useFetchData(popularAreaAPI.getAreas);

  const resetForm = () => {
    reset(defaultForm);
    setEditingArea(null);
  };

  const onSubmit = async (data) => {
    try {
      if (editingArea) {
        await popularAreaAPI.updateArea(editingArea._id, data);
      } else {
        await popularAreaAPI.createArea(data);
      }
      resetForm();
      await fetchAreas();
    } catch (error) {
      /* Errors are handled by the global axios interceptor */
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    reset({
      name: area.name || "",
      propertyCount: area.propertyCount || "",
      imageUrl: area.imageUrl || "",
      isActive: area.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Area?",
      message: "Are you sure you want to delete this popular area? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await popularAreaAPI.deleteArea(id);
          await fetchAreas();
        } catch (error) {
          /* Errors are handled by the global axios interceptor */
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
      /* Errors are handled by the global axios interceptor */
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
        <h2 className="text-2xl font-semibold text-white">Popular Areas</h2>
        <p className="mt-2 text-sm text-slate-300">
          Create, edit, deactivate, and remove the neighborhood cards shown on
          the public site.
        </p>
      </Motion.section>

      {isLoadingAreas ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading popular areas...
        </div>
      ) : (
        <>
          <Motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {editingArea ? "Edit Area" : "Add Area"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Keep the popular areas section synced from this admin app.
                </p>
              </div>
              {editingArea && (
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
              <div>
                <input
                  type="text"
                  {...register("name", { required: "Area name is required." })}
                  placeholder="Area name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div>
                <input
                  type="text"
                  {...register("propertyCount", { required: "Property count is required." })}
                  placeholder="Property count (e.g. 320)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
                {errors.propertyCount && <p className="mt-1 text-xs text-red-400">{errors.propertyCount.message}</p>}
              </div>
            </div>

            <div className="mt-4">
              <input
                type="text"
                {...register("imageUrl", { required: "Image URL is required." })}
                placeholder="Image URL"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
              />
              {errors.imageUrl && <p className="mt-1 text-xs text-red-400">{errors.imageUrl.message}</p>}
            </div>

            <label className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
              Active
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4"
              />
            </label>

            <Motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500 disabled:opacity-70"
            >
              <FaPlus />
              {editingArea ? "Update Area" : "Create Area"}
            </Motion.button>
          </Motion.form>

          <div className="space-y-4">
            {areas.map((area, index) => (
              <Motion.article
                key={area._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.24 }}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-950/70">
                    {area.imageUrl ? (
                      <img src={area.imageUrl} alt={area.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <FaMapMarkerAlt />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{area.name}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          area.isActive === false
                            ? "bg-slate-700 text-slate-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {area.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {area.propertyCount} properties
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleAreaStatus(area)}
                    className="rounded-2xl bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-500/25"
                  >
                    {area.isActive === false ? "Activate" : "Deactivate"}
                  </button>
                  <button
                    onClick={() => handleEdit(area)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/25"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(area._id)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/25"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </Motion.article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PopularAreasManager;
