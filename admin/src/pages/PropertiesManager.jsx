import React, { useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaBath,
  FaBed,
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaTrash,
  FaSearch,
  FaThLarge,
  FaList,
  FaCheck,
  FaEye,
  FaBuilding,
  FaImage,
} from "react-icons/fa";
import { propertyAPI } from "../api/propertyApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";
import { useForm } from "react-hook-form";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "";

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
};

const defaultForm = {
  name: "",
  slug: "",
  address: "",
  price: "",
  bed: 0,
  bath: 0,
  area: "",
  latitude: "",
  longitude: "",
  images: "",
  description: "",
  isActive: true,
};

const PropertiesManager = () => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const confirm = useConfirmationModal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultForm });

  const {
    data: properties,
    loading: isLoadingProperties,
    refetch: fetchProperties,
  } = useFetchData(propertyAPI.getProperties);

  const openAddDrawer = () => {
    setEditingProperty(null);
    reset(defaultForm);
    setIsDrawerOpen(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    reset({
      name: property.name || "",
      slug: property.slug || "",
      address: property.address || "",
      price: property.price || "",
      bed: property.bed || 0,
      bath: property.bath || 0,
      area: property.area || "",
      latitude: property.latitude ?? "",
      longitude: property.longitude ?? "",
      images: Array.isArray(property.images) ? property.images.join("\n") : "",
      description: property.description || "",
      isActive: property.isActive !== false,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProperty(null);
    reset(defaultForm);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        bed: Number(data.bed) || 0,
        bath: Number(data.bath) || 0,
        latitude: data.latitude === "" ? undefined : Number(data.latitude),
        longitude: data.longitude === "" ? undefined : Number(data.longitude),
        images: data.images
          ? data.images.split("\n").map((i) => i.trim()).filter(Boolean)
          : [],
      };

      if (editingProperty) {
        await propertyAPI.updateProperty(editingProperty._id, payload);
      } else {
        await propertyAPI.createProperty(payload);
      }
      closeDrawer();
      await fetchProperties();
    } catch (error) {
      /* Handled by global interceptor */
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Property Listing?",
      message: "Are you sure you want to delete this property? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await propertyAPI.deleteProperty(id);
          await fetchProperties();
        } catch (error) {
          /* Handled by global interceptor */
        }
      },
    });
  };

  const togglePropertyStatus = async (property) => {
    try {
      await propertyAPI.updateProperty(property._id, {
        ...property,
        isActive: property.isActive === false,
      });
      await fetchProperties();
    } catch (error) {
      /* Handled by global interceptor */
    }
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return (properties || []).filter((prop) => {
      const matchesSearch =
        (prop.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.address || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && prop.isActive !== false) ||
        (statusFilter === "inactive" && prop.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [properties, searchQuery, statusFilter]);

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
            <span className="flex h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Inventory Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Property Listings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage real estate properties, pricing models, spatial tags, and status visibility.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="btn btn-primary shadow-lg shrink-0"
        >
          <FaPlus className="text-xs" />
          <span>New Property Listing</span>
        </button>
      </Motion.div>

      {/* SEARCH & CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, address..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto text-xs py-2"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs transition ${
                viewMode === "grid" ? "bg-red-500 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-xs transition ${
                viewMode === "table" ? "bg-red-500 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Table View"
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT LISTINGS */}
      {isLoadingProperties ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          Loading property catalog...
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-16 text-center">
          <FaBuilding className="text-3xl text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No Properties Found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No listing matches your search criteria or filter. Try clearing your filters or create a new property listing.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property, idx) => {
            const firstImage = Array.isArray(property.images) && property.images.length > 0 ? getImageUrl(property.images[0]) : "";

            return (
              <Motion.article
                key={property._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/5 flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={property.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600 text-xs">
                      <FaImage className="text-2xl mr-2" /> No image uploaded
                    </div>
                  )}

                  {/* Price Tag */}
                  <span className="absolute bottom-3 left-3 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-black text-white border border-white/10">
                    {property.price || "Contact for price"}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      property.isActive !== false
                        ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                        : "border-slate-500/30 bg-slate-800 text-slate-400"
                    }`}
                  >
                    {property.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-red-400 transition">
                      {property.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 line-clamp-1">
                      <FaMapMarkerAlt className="text-red-400 text-[10px] shrink-0" />
                      {property.address || "Location unspecified"}
                    </p>
                  </div>

                  {/* Specs Pill */}
                  <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center text-xs text-slate-300">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 uppercase">Beds</span>
                      <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <FaBed className="text-slate-400 text-[10px]" /> {property.bed || 0}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 uppercase">Baths</span>
                      <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <FaBath className="text-slate-400 text-[10px]" /> {property.bath || 0}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 uppercase">Area</span>
                      <span className="font-bold text-white text-[11px] mt-0.5 block truncate">
                        {property.area || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => togglePropertyStatus(property)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                        property.isActive !== false
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      }`}
                    >
                      {property.isActive !== false ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition"
                      title="Edit Property"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition"
                      title="Delete Property"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </Motion.article>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Specs</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredProperties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 font-bold text-white">{prop.name}</td>
                    <td className="p-4 text-slate-400">{prop.address || "N/A"}</td>
                    <td className="p-4 font-bold text-red-400">{prop.price || "N/A"}</td>
                    <td className="p-4 text-slate-300">
                      {prop.bed} Bed • {prop.bath} Bath • {prop.area || "N/A"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          prop.isActive !== false
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {prop.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(prop)}
                          className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(prop._id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DRAWER FOR ADD/EDIT PROPERTY */}
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
              className="relative w-full max-w-xl bg-slate-900 border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingProperty ? "Edit Property Listing" : "New Property Listing"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure public details, spatial maps, specs, and media assets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Property name is required." })}
                    placeholder="e.g. Modern Sunset Luxury Villa"
                    className="input-field"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      {...register("price", { required: "Price is required." })}
                      placeholder="e.g. $750,000"
                      className="input-field"
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      {...register("slug")}
                      placeholder="e.g. sunset-luxury-villa"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    {...register("address", { required: "Address is required." })}
                    placeholder="e.g. 124 Palm Avenue, Beverly Hills, CA"
                    className="input-field"
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Beds</label>
                    <input type="number" min="0" {...register("bed")} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Baths</label>
                    <input type="number" min="0" {...register("bath")} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Area</label>
                    <input type="text" {...register("area")} placeholder="e.g. 2,400 sqft" className="input-field" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
                    <input type="number" step="any" {...register("latitude")} placeholder="19.0760" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
                    <input type="number" step="any" {...register("longitude")} placeholder="72.8777" className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Image URLs (One URL per line)
                  </label>
                  <textarea
                    rows={4}
                    {...register("images")}
                    placeholder="https://images.unsplash.com/photo-1512917774080-9991f1c4c750&#10;https://images.unsplash.com/photo-1613977257363-707ba9348227"
                    className="input-field font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Property Description
                  </label>
                  <textarea
                    rows={4}
                    {...register("description")}
                    placeholder="Describe property features, community amenities..."
                    className="input-field text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={closeDrawer} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    <FaCheck className="text-xs" />
                    {editingProperty ? "Save Changes" : "Create Listing"}
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

export default PropertiesManager;
