import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaBath,
  FaBed,
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { propertyAPI } from "../api/propertyApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";
import { useForm } from "react-hook-form";

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
  const [editingProperty, setEditingProperty] = useState(null);
  const confirm = useConfirmationModal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultForm });

  const { data: properties, loading: isLoadingProperties, refetch: fetchProperties } = useFetchData(propertyAPI.getProperties);

  const resetForm = () => {
    reset(defaultForm);
    setEditingProperty(null);
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
      resetForm();
      await fetchProperties();
    } catch (error) {
      /* Errors are handled by the global axios interceptor */
    }
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Property?",
      message: "Are you sure you want to delete this property? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await propertyAPI.deleteProperty(id);
          await fetchProperties();
        } catch (error) {
          /* Errors are handled by the global axios interceptor */
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
        <h2 className="text-2xl font-semibold text-white">Properties</h2>
        <p className="mt-2 text-sm text-slate-300">
          Create, edit, deactivate, and remove property listings shown on the
          public site.
        </p>
      </Motion.section>

      {isLoadingProperties ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading properties...
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
                  {editingProperty ? "Edit Property" : "Add Property"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Keep the properties section synced from this admin app.
                </p>
              </div>
              {editingProperty && (
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
                  {...register("name", { required: "Property name is required." })}
                  placeholder="Property name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div>
                <input
                  type="text"
                  {...register("price", { required: "Price is required." })}
                  placeholder="Price (e.g. $350,000)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
                {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
              </div>
              <div>
                <input
                  type="text"
                  {...register("slug")}
                  placeholder="Slug (optional)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
              <div>
                <input
                  type="text"
                  {...register("address", { required: "Address is required." })}
                  placeholder="Address"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
                {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address.message}</p>}
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  {...register("bed")}
                  placeholder="Beds"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  {...register("bath")}
                  placeholder="Baths"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
              <div>
                <input
                  type="text"
                  {...register("area")}
                  placeholder="Area (e.g. 1,200 sqft)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
              <div>
                <input
                  type="number"
                  step="any"
                  {...register("latitude")}
                  placeholder="Latitude"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
              <div>
                <input
                  type="number"
                  step="any"
                  {...register("longitude")}
                  placeholder="Longitude"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  {...register("images")}
                  rows="2"
                  placeholder="Image URLs (one per line)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  {...register("description")}
                  rows="3"
                  placeholder="Description"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
                />
              </div>
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
              {editingProperty ? "Update Property" : "Create Property"}
            </Motion.button>
          </Motion.form>

          <div className="space-y-4">
            {properties.map((property, index) => (
              <Motion.article
                key={property._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.24 }}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-950/70">
                    {Array.isArray(property.images) && property.images.length > 0 ? (
                      <img src={property.images[0]} alt={property.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <FaMapMarkerAlt />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{property.name}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          property.isActive === false
                            ? "bg-slate-700 text-slate-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {property.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-red-300">{property.price}</p>
                    <p className="mt-1 max-w-xl text-sm text-slate-400">
                      <FaMapMarkerAlt className="mr-1 inline text-red-300" />
                      {property.address}
                    </p>
                    <div className="mt-2 flex gap-4 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1"><FaBed className="text-red-300" />{property.bed}</span>
                      <span className="inline-flex items-center gap-1"><FaBath className="text-red-300" />{property.bath}</span>
                      {property.area && <span>{property.area}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => togglePropertyStatus(property)}
                    className="rounded-2xl bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-500/25"
                  >
                    {property.isActive === false ? "Activate" : "Deactivate"}
                  </button>
                  <button
                    onClick={() => handleEdit(property)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/25"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
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

export default PropertiesManager;
