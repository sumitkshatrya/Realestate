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
  FaUpload,
  FaLink,
} from "react-icons/fa";
import { popularAreaAPI } from "../api/popularAreaApi";
import { useFetchData, clearFetchCache } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const defaultForm = {
  name: "",
  propertyCount: "",
  imageUrl: "",
  isActive: true,
};

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const backendBase = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/api\/?$/, "");
  return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

const PopularAreasManager = () => {
  const [editingArea, setEditingArea] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [imageMode, setImageMode] = useState("file"); // "file" | "url"
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const confirm = useConfirmationModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultForm });

  const { data: areas, loading: isLoadingAreas, refetch: fetchAreas } = useFetchData(popularAreaAPI.getAreas);

  const urlInput = watch("imageUrl");

  const openAddDrawer = () => {
    setEditingArea(null);
    setSelectedFile(null);
    setFilePreview(null);
    setImageMode("file");
    reset(defaultForm);
    setIsDrawerOpen(true);
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setSelectedFile(null);
    setFilePreview(null);
    const isLocalUpload = area.imageUrl && area.imageUrl.startsWith("/uploads");
    setImageMode(isLocalUpload ? "file" : "url");
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
    setSelectedFile(null);
    setFilePreview(null);
    reset(defaultForm);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file must be under 10MB.");
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append("image", selectedFile);
        payload.append("name", data.name);
        payload.append("propertyCount", data.propertyCount);
        payload.append("isActive", data.isActive);
      } else {
        payload = {
          name: data.name,
          propertyCount: data.propertyCount,
          imageUrl: data.imageUrl,
          isActive: data.isActive,
        };
      }

      if (editingArea) {
        await popularAreaAPI.updateArea(editingArea._id, payload);
        toast.success("Neighborhood updated successfully!");
      } else {
        await popularAreaAPI.createArea(payload);
        toast.success("New neighborhood added successfully!");
      }
      closeDrawer();
      clearFetchCache();
      await fetchAreas();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save location.");
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Popular Area?",
      message: "Are you sure you want to delete this popular area? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await popularAreaAPI.deleteArea(id);
          toast.success("Neighborhood deleted successfully.");
          clearFetchCache();
          await fetchAreas();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete neighborhood.");
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
      toast.info(`Location ${area.isActive !== false ? "deactivated" : "activated"}.`);
      clearFetchCache();
      await fetchAreas();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
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

        <button onClick={openAddDrawer} className="btn btn-primary shrink-0 cursor-pointer">
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
          <FaMapMarkerAlt className="text-4xl text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No Popular Areas Configured</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Add featured neighborhoods to highlight top real estate regions.</p>
          <button onClick={openAddDrawer} className="btn btn-primary inline-flex items-center gap-2 cursor-pointer">
            <FaPlus className="text-xs" />
            <span>Add First Neighborhood</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, idx) => {
            const displayImage = getImageUrl(area.imageUrl);

            return (
              <Motion.article
                key={area._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between"
              >
                {/* Image Preview */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={area.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
                      }}
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
                      className={`flex-1 rounded-xl border py-2 text-xs font-bold transition cursor-pointer ${
                        area.isActive !== false
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      }`}
                    >
                      {area.isActive !== false ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleEdit(area)}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition cursor-pointer"
                      title="Edit Area"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDelete(area._id)}
                      className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                      title="Delete Area"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
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
                  {editingArea ? "Edit Neighborhood" : "New Neighborhood"}
                </h2>
                <button onClick={closeDrawer} className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white cursor-pointer">
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Property Count Tag *</label>
                  <input
                    type="text"
                    {...register("propertyCount", { required: "Property count tag is required." })}
                    placeholder="e.g. 45+ Luxury Properties"
                    className="input-field"
                  />
                  {errors.propertyCount && <p className="mt-1 text-xs text-red-400">{errors.propertyCount.message}</p>}
                </div>

                {/* DUAL IMAGE INPUT OPTIONS */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Cover Image Source</label>
                  
                  {/* Mode Tabs */}
                  <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        imageMode === "file" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <FaUpload className="text-[10px]" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        imageMode === "url" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <FaLink className="text-[10px]" />
                      <span>Image URL</span>
                    </button>
                  </div>

                  {/* Mode A: File Upload */}
                  {imageMode === "file" && (
                    <div>
                      {filePreview || (editingArea?.imageUrl && editingArea.imageUrl.startsWith("/uploads")) ? (
                        <div className="relative h-32 rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-950">
                          <img
                            src={filePreview || getImageUrl(editingArea?.imageUrl)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFilePreview(null);
                              setValue("imageUrl", "");
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 hover:text-white transition cursor-pointer"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 rounded-xl bg-slate-950/60 hover:border-cyan-400/50 cursor-pointer transition text-center">
                          <FaUpload className="text-cyan-400 text-xl mb-2" />
                          <span className="text-xs font-semibold text-slate-300">Click to upload cover image</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Mode B: Direct URL Input */}
                  {imageMode === "url" && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        {...register("imageUrl")}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="input-field"
                      />
                      {urlInput && (
                        <div className="h-28 rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                          <img
                            src={getImageUrl(urlInput)}
                            alt="URL Preview"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveArea"
                    {...register("isActive")}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                  />
                  <label htmlFor="isActiveArea" className="text-xs font-medium text-slate-300 cursor-pointer">
                    Display Neighborhood on Website (Active)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeDrawer} className="btn btn-secondary cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary cursor-pointer">
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
