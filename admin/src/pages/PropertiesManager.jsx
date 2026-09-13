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
  FaUpload,
  FaLink,
  FaExclamationTriangle,
  FaCheckSquare,
  FaSquare,
  FaDatabase,
} from "react-icons/fa";
import { propertyAPI } from "../api/propertyApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { getSocket } from "../api/socketClient";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "";
import { getImageUrl } from "../utils/backendUrl";

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
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
  purpose: "buy",
  category: "Luxury Apartment",
  status: "available",
  images: "",
  description: "",
  isActive: true,
};

const PropertiesManager = () => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [searchQuery, setSearchQuery] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("all"); // "all" | "buy" | "rent" | "commercial"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "available" | "booked" | "rented" | "sold" | "inactive"
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Property Image Management Choice state
  const [imageInputMode, setImageInputMode] = useState("url"); // "url" | "upload"
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [failedImageUrls, setFailedImageUrls] = useState({});

  const confirm = useConfirmationModal();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultForm });

  const imagesText = watch("images");

  const {
    data: properties,
    loading: isLoadingProperties,
    refetch: fetchProperties,
  } = useFetchData(propertyAPI.getProperties);

  // Real-time WebSocket listener for live admin sync
  React.useEffect(() => {
    const socket = getSocket();

    const handleSocketChange = () => {
      fetchProperties();
    };

    socket.on("property:created", handleSocketChange);
    socket.on("property:updated", handleSocketChange);
    socket.on("property:deleted", handleSocketChange);

    return () => {
      socket.off("property:created", handleSocketChange);
      socket.off("property:updated", handleSocketChange);
      socket.off("property:deleted", handleSocketChange);
    };
  }, [fetchProperties]);

  // Parsed text URLs from textarea
  const textUrls = useMemo(() => {
    if (!imagesText) return [];
    return imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }, [imagesText]);

  // Combined list of all gallery items (Existing DB URLs + Typed Text URLs + Selected File Uploads)
  const allGalleryItems = useMemo(() => {
    const items = [];

    // Existing images from DB
    existingImages.forEach((url, idx) => {
      items.push({
        id: `existing-${idx}-${url}`,
        type: "existing",
        index: idx,
        url,
        displayUrl: getImageUrl(url),
        isUploaded: url.startsWith("/uploads/"),
      });
    });

    // Typed URLs from textarea (not already in existingImages)
    textUrls.forEach((url, idx) => {
      if (!existingImages.includes(url)) {
        items.push({
          id: `texturl-${idx}-${url}`,
          type: "textUrl",
          index: idx,
          url,
          displayUrl: getImageUrl(url),
          isUploaded: false,
        });
      }
    });

    // Local file uploads
    selectedFiles.forEach((file, idx) => {
      items.push({
        id: `file-${idx}-${file.name}`,
        type: "file",
        index: idx,
        file,
        displayUrl: URL.createObjectURL(file),
        isUploaded: true,
      });
    });

    return items;
  }, [existingImages, textUrls, selectedFiles]);

  const openAddDrawer = () => {
    setEditingProperty(null);
    setExistingImages([]);
    setSelectedFiles([]);
    setSelectedImageIds([]);
    setFailedImageUrls({});
    setImageInputMode("url");
    reset(defaultForm);
    setIsDrawerOpen(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    const imgs = Array.isArray(property.images) ? property.images : [];
    setExistingImages(imgs);
    setSelectedFiles([]);
    setSelectedImageIds([]);
    setFailedImageUrls({});

    const hasUploaded = imgs.some((i) => i.startsWith("/uploads/"));
    setImageInputMode(hasUploaded ? "upload" : "url");

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
      purpose: property.purpose || "buy",
      category: property.category || "Luxury Apartment",
      status: property.status || "available",
      images: imgs
        .filter((i) => !i.startsWith("/uploads/"))
        .join("\n"),
      description: property.description || "",
      isActive: property.isActive !== false,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProperty(null);
    setExistingImages([]);
    setSelectedFiles([]);
    setSelectedImageIds([]);
    setFailedImageUrls({});
    reset(defaultForm);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const toggleSelectImage = (id) => {
    setSelectedImageIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedImageIds.length === allGalleryItems.length) {
      setSelectedImageIds([]);
    } else {
      setSelectedImageIds(allGalleryItems.map((item) => item.id));
    }
  };

  const deleteSingleItem = (item) => {
    if (item.type === "existing") {
      const targetUrl = item.url;
      setExistingImages((prev) => prev.filter((_, i) => i !== item.index));
      const updatedText = textUrls.filter((u) => u !== targetUrl).join("\n");
      setValue("images", updatedText);
    } else if (item.type === "textUrl") {
      const targetUrl = item.url;
      const updatedText = textUrls.filter((u) => u !== targetUrl).join("\n");
      setValue("images", updatedText);
    } else if (item.type === "file") {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== item.index));
    }
    setSelectedImageIds((prev) => prev.filter((id) => id !== item.id));
  };

  const deleteSelectedItems = () => {
    const itemsToDelete = allGalleryItems.filter((item) =>
      selectedImageIds.includes(item.id)
    );

    let updatedExisting = [...existingImages];
    let updatedTextUrls = [...textUrls];
    let updatedFiles = [...selectedFiles];

    itemsToDelete.forEach((item) => {
      if (item.type === "existing") {
        updatedExisting = updatedExisting.filter((u) => u !== item.url);
        updatedTextUrls = updatedTextUrls.filter((u) => u !== item.url);
      } else if (item.type === "textUrl") {
        updatedTextUrls = updatedTextUrls.filter((u) => u !== item.url);
      } else if (item.type === "file") {
        updatedFiles = updatedFiles.filter((_, i) => i !== item.index);
      }
    });

    setExistingImages(updatedExisting);
    setValue("images", updatedTextUrls.join("\n"));
    setSelectedFiles(updatedFiles);
    setSelectedImageIds([]);
  };

  const onSubmit = async (data) => {
    try {
      // Gather active URLs from allGalleryItems
      const activeUrls = allGalleryItems
        .filter((item) => item.type === "existing" || item.type === "textUrl")
        .map((item) => item.url);

      const activeFiles = allGalleryItems
        .filter((item) => item.type === "file")
        .map((item) => item.file);

      if (activeFiles.length > 0) {
        // Send multipart FormData when new files are selected
        const formData = new FormData();
        formData.append("name", data.name || "");
        formData.append("price", data.price || "");
        formData.append("slug", data.slug || "");
        formData.append("address", data.address || "");
        formData.append("bed", String(Number(data.bed) || 0));
        formData.append("bath", String(Number(data.bath) || 0));
        formData.append("area", data.area || "");
        if (data.latitude !== "" && data.latitude !== undefined) {
          formData.append("latitude", String(data.latitude));
        }
        if (data.longitude !== "" && data.longitude !== undefined) {
          formData.append("longitude", String(data.longitude));
        }
        formData.append("purpose", data.purpose || "buy");
        formData.append("category", data.category || "Luxury Apartment");
        formData.append("status", data.status || "available");
        formData.append("description", data.description || "");
        formData.append("isActive", String(data.isActive !== false));

        // Append image URLs array
        formData.append("images", JSON.stringify(activeUrls));

        // Append file uploads
        activeFiles.forEach((file) => {
          formData.append("imageFiles", file);
        });

        if (editingProperty) {
          await propertyAPI.updateProperty(editingProperty._id, formData);
        } else {
          await propertyAPI.createProperty(formData);
        }
      } else {
        // Send JSON when no files are selected
        const payload = {
          ...data,
          bed: Number(data.bed) || 0,
          bath: Number(data.bath) || 0,
          latitude: data.latitude === "" ? undefined : Number(data.latitude),
          longitude: data.longitude === "" ? undefined : Number(data.longitude),
          purpose: data.purpose || "buy",
          category: data.category || "Luxury Apartment",
          status: data.status || "available",
          images: activeUrls,
        };

        if (editingProperty) {
          await propertyAPI.updateProperty(editingProperty._id, payload);
        } else {
          await propertyAPI.createProperty(payload);
        }
      }

      closeDrawer();
      await fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const openMapLocation = (e, prop) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!prop) return;
    const { latitude, longitude, address } = prop;
    let url = "";
    if (typeof latitude === "number" && typeof longitude === "number" && !isNaN(latitude) && !isNaN(longitude)) {
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } else if (address) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
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
          console.error(error);
        }
      },
    });
  };

  const updatePropertyStatus = async (property, newStatus) => {
    try {
      await propertyAPI.updateProperty(property._id, {
        ...property,
        status: newStatus,
      });
      await fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const togglePropertyStatus = async (property) => {
    try {
      await propertyAPI.updateProperty(property._id, {
        ...property,
        isActive: property.isActive === false,
      });
      await fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return (properties || []).filter((prop) => {
      const matchesSearch =
        (prop.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.address || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.category || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPurpose =
        purposeFilter === "all" ||
        (prop.purpose || "buy").toLowerCase() === purposeFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "inactive" && prop.isActive === false) ||
        (statusFilter !== "inactive" && (prop.status || "available").toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesPurpose && matchesStatus;
    });
  }, [properties, searchQuery, purposeFilter, statusFilter]);

  const handleSeedProperties = async () => {
    confirm({
      title: "Load 30 Property Dataset?",
      message: "This will dynamically insert the 30 real estate properties (Jaipur, Noida, Gurugram, Bengaluru, Mumbai, Goa, etc.) into your database.",
      onConfirm: async () => {
        try {
          const res = await propertyAPI.seedProperties();
          toast.success(res?.message || "Successfully seeded 30 properties dynamically!");
          await fetchProperties();
        } catch (error) {
          console.error(error);
        }
      },
    });
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
            <span className="flex h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Inventory Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Property Listings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage real estate properties, pricing models, spatial tags, and status visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleSeedProperties}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs border border-blue-500/30 shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <FaDatabase className="text-xs" />
            <span>Load 30 Properties Dataset</span>
          </button>
          <button
            onClick={openAddDrawer}
            className="btn btn-primary shadow-lg shrink-0"
          >
            <FaPlus className="text-xs" />
            <span>New Property Listing</span>
          </button>
        </div>
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
              placeholder="Search by title, location, category..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Purpose Filter */}
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="input-field w-auto text-xs py-2 bg-slate-900 text-slate-200"
          >
            <option value="all">All Purpose (Buy/Rent/Commercial)</option>
            <option value="buy">For Sale (Buy)</option>
            <option value="rent">For Rent</option>
            <option value="commercial">Commercial</option>
          </select>

          {/* Availability Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto text-xs py-2 bg-slate-900 text-slate-200"
          >
            <option value="all">All Availability Statuses</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="rented">Rented</option>
            <option value="sold">Sold</option>
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
            const currentStatus = (property.status || "available").toLowerCase();
            const currentPurpose = (property.purpose || "buy").toLowerCase();

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

                  {/* Purpose & Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        currentPurpose === "rent"
                          ? "bg-blue-600 text-white"
                          : currentPurpose === "commercial"
                          ? "bg-purple-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {currentPurpose === "rent"
                        ? "For Rent"
                        : currentPurpose === "commercial"
                        ? "Commercial"
                        : "For Sale"}
                    </span>

                    {property.category && (
                      <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-white/10">
                        {property.category}
                      </span>
                    )}
                  </div>

                  {/* Availability Status Tag */}
                  <span
                    className={`absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      currentStatus === "sold"
                        ? "border-rose-500/50 bg-rose-500/20 text-rose-300"
                        : currentStatus === "rented"
                        ? "border-blue-500/50 bg-blue-500/20 text-blue-300"
                        : currentStatus === "booked"
                        ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                        : "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {currentStatus.toUpperCase()}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-red-400 transition">
                      {property.name}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => openMapLocation(e, property)}
                      className="text-xs text-slate-400 hover:text-blue-400 hover:underline mt-1 flex items-center gap-1.5 line-clamp-1 cursor-pointer text-left font-medium"
                      title="Click to view location on map"
                    >
                      <FaMapMarkerAlt className="text-red-400 text-[10px] shrink-0" />
                      {property.address || "Location unspecified"}
                    </button>
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

                  {/* Availability Status Quick Change Select */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-semibold text-slate-400">Set Availability:</span>
                    <select
                      value={currentStatus}
                      onChange={(e) => updatePropertyStatus(property, e.target.value)}
                      className="bg-slate-950 border border-white/10 text-white rounded-lg text-[11px] px-2 py-1 focus:outline-none focus:border-red-500"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="rented">Rented</option>
                      <option value="sold">Sold</option>
                    </select>
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
                  <th className="p-4">Purpose & Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Availability Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredProperties.map((prop) => {
                  const currentStatus = (prop.status || "available").toLowerCase();
                  const currentPurpose = (prop.purpose || "buy").toLowerCase();

                  return (
                    <tr key={prop._id} className="hover:bg-white/[0.02] transition">
                      <td className="p-4 font-bold text-white">
                        <div>{prop.name}</div>
                        <button
                          type="button"
                          onClick={(e) => openMapLocation(e, prop)}
                          className="text-[11px] font-normal text-slate-400 hover:text-blue-400 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer text-left"
                          title="Click to view location on map"
                        >
                          <FaMapMarkerAlt className="text-red-400 text-[10px]" />
                          <span>{prop.address || "N/A"}</span>
                        </button>
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="capitalize font-bold text-blue-400">{currentPurpose}</span> • {prop.category || "Luxury Apartment"}
                      </td>
                      <td className="p-4 font-bold text-red-400">{prop.price || "N/A"}</td>
                      <td className="p-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => updatePropertyStatus(prop, e.target.value)}
                          className="bg-slate-950 border border-white/10 text-white rounded-lg text-xs px-2 py-1"
                        >
                          <option value="available">Available</option>
                          <option value="booked">Booked</option>
                          <option value="rented">Rented</option>
                          <option value="sold">Sold</option>
                        </select>
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
                  );
                })}
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

                {/* Purpose, Category, Availability Status */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Purpose *
                    </label>
                    <select {...register("purpose")} className="input-field bg-slate-950 text-xs">
                      <option value="buy">For Sale (Buy)</option>
                      <option value="rent">For Rent</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category *
                    </label>
                    <select {...register("category")} className="input-field bg-slate-950 text-xs">
                      <option value="Luxury Apartment">Luxury Apartment</option>
                      <option value="Private Villa / House">Private Villa / House</option>
                      <option value="Penthouse / Condo">Penthouse / Condo</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Townhome">Townhome</option>
                      <option value="Commercial Space">Commercial Space</option>
                      <option value="Office">Office</option>
                      <option value="Retail">Retail</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Status *
                    </label>
                    <select {...register("status")} className="input-field bg-slate-950 text-xs">
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="rented">Rented</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
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

                {/* PROPERTY IMAGES CHOICE: URL VS FILE UPLOAD & MULTI-SELECT DELETION */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      PROPERTY IMAGES
                    </label>

                    {/* Mode Toggle Switch */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageInputMode("url")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                          imageInputMode === "url"
                            ? "bg-red-500 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <FaLink className="text-[10px]" />
                        <span>Image URLs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageInputMode("upload")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                          imageInputMode === "upload"
                            ? "bg-red-500 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <FaUpload className="text-[10px]" />
                        <span>Upload Files</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Image URLs input */}
                  {imageInputMode === "url" && (
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1.5">
                        Paste public image URLs (one direct link per line):
                      </p>
                      <textarea
                        rows={4}
                        {...register("images")}
                        placeholder="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
                        className="input-field font-mono text-xs"
                      />
                    </div>
                  )}

                  {/* Mode 2: Multi-File Upload input */}
                  {imageInputMode === "upload" && (
                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-400">
                        Upload multi image files directly from your computer (JPG, PNG, WEBP):
                      </p>

                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-red-500/50 rounded-2xl cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition text-center group">
                        <FaUpload className="text-2xl text-slate-500 group-hover:text-red-400 transition mb-2" />
                        <span className="text-xs font-bold text-slate-200">
                          Click to select or drag & drop multiple image files
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          You can select multiple photos at once
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Combined Image Gallery Preview & Multi-Select Deletion */}
                  {allGalleryItems.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">
                          Current Gallery ({allGalleryItems.length} images)
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Select All Toggle */}
                          <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition"
                          >
                            {selectedImageIds.length === allGalleryItems.length ? (
                              <>
                                <FaCheckSquare className="text-red-400 text-xs" />
                                <span>Deselect All</span>
                              </>
                            ) : (
                              <>
                                <FaSquare className="text-slate-500 text-xs" />
                                <span>Select All</span>
                              </>
                            )}
                          </button>

                          {/* Delete Selected Button */}
                          {selectedImageIds.length > 0 && (
                            <button
                              type="button"
                              onClick={deleteSelectedItems}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-[11px] font-bold transition shadow-sm"
                            >
                              <FaTrash className="text-[10px]" />
                              <span>Delete Selected ({selectedImageIds.length})</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Thumbnails Grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                        {allGalleryItems.map((item) => {
                          const isSelected = selectedImageIds.includes(item.id);
                          const isFailed = failedImageUrls[item.id];

                          return (
                            <div
                              key={item.id}
                              className={`relative group rounded-xl overflow-hidden aspect-square border transition-all ${
                                isSelected
                                  ? "border-red-500 ring-2 ring-red-500/40 bg-red-950/20"
                                  : isFailed
                                  ? "border-rose-500/50 bg-rose-950/20"
                                  : "border-white/10 bg-slate-950 hover:border-white/30"
                              }`}
                            >
                              {/* Selection Checkbox */}
                              <button
                                type="button"
                                onClick={() => toggleSelectImage(item.id)}
                                className="absolute top-1.5 left-1.5 z-20 p-1 rounded bg-slate-950/80 text-white border border-white/20 hover:border-white transition"
                                title="Select to delete"
                              >
                                {isSelected ? (
                                  <FaCheckSquare className="text-red-400 text-xs" />
                                ) : (
                                  <FaSquare className="text-slate-500 text-xs" />
                                )}
                              </button>

                              {/* Prominent Direct Delete Button */}
                              <button
                                type="button"
                                onClick={() => deleteSingleItem(item)}
                                className="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition"
                                title="Delete image"
                              >
                                <FaTrash className="text-[10px]" />
                              </button>

                              {/* Image or Broken Link Fallback */}
                              {isFailed ? (
                                <div className="flex flex-col items-center justify-center p-2 text-center h-full bg-slate-950 text-rose-400 text-[10px] space-y-1">
                                  <FaExclamationTriangle className="text-lg text-rose-500" />
                                  <span className="font-bold leading-tight">Invalid Link</span>
                                  <button
                                    type="button"
                                    onClick={() => deleteSingleItem(item)}
                                    className="px-2 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded hover:bg-rose-600 transition mt-1"
                                  >
                                    Delete Link
                                  </button>
                                </div>
                              ) : (
                                <img
                                  src={item.displayUrl}
                                  alt="Property asset"
                                  onError={() =>
                                    setFailedImageUrls((prev) => ({
                                      ...prev,
                                      [item.id]: true,
                                    }))
                                  }
                                  className="w-full h-full object-cover"
                                />
                              )}

                              {/* Bottom Type Badge */}
                              <span
                                className={`absolute bottom-1 left-1 z-10 px-1.5 py-0.5 text-[9px] font-bold rounded ${
                                  item.type === "file"
                                    ? "bg-blue-600 text-white"
                                    : item.type === "existing"
                                    ? "bg-slate-950/80 text-slate-300 border border-white/10"
                                    : "bg-amber-600/90 text-white"
                                }`}
                              >
                                {item.type === "file"
                                  ? "File"
                                  : item.type === "existing"
                                  ? "Existing"
                                  : "URL"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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

