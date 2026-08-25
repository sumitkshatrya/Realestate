import React, { useState, useMemo } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaTimesCircle,
  FaTrash,
  FaSearch,
  FaHandshake,
  FaBuilding,
} from "react-icons/fa";
import { tourAPI } from "../api/tourApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";

const statusStyles = {
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Confirmed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const ToursManager = () => {
  const { data: tours, loading, refetch } = useFetchData(tourAPI.getTours);
  const confirm = useConfirmationModal();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "Pending" | "Confirmed" | "Cancelled"

  const handleStatusChange = async (id, status) => {
    setIsActionLoading(true);
    try {
      await tourAPI.updateTourStatus(id, status);
      await refetch();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Tour Request?",
      message: "Are you sure you want to delete this property tour request? This action cannot be undone.",
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          await tourAPI.deleteTour(id);
          await refetch();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const filteredTours = useMemo(() => {
    return (tours || []).filter((t) => {
      const name = (t.name || t.fullName || "").toLowerCase();
      const prop = (t.propertyName || t.propertyTitle || "").toLowerCase();
      const email = (t.email || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || prop.includes(query) || email.includes(query);
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tours, searchQuery, statusFilter]);

  const pendingCount = (tours || []).filter((t) => t.status === "Pending").length;
  const confirmedCount = (tours || []).filter((t) => t.status === "Confirmed").length;
  const cancelledCount = (tours || []).filter((t) => t.status === "Cancelled").length;

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
            <span className="flex h-2 w-2 rounded-full bg-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Leads & Viewings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Property Tour Requests</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and schedule private property viewings requested by potential buyers.
          </p>
        </div>

        {/* Stats Summary Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
            <span className="block text-[9px] font-bold text-amber-400 uppercase">Pending</span>
            <span className="text-base font-extrabold text-white">{pendingCount}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
            <span className="block text-[9px] font-bold text-emerald-400 uppercase">Confirmed</span>
            <span className="text-base font-extrabold text-white">{confirmedCount}</span>
          </div>
        </div>
      </Motion.div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, property, email..."
            className="input-field pl-10"
          />
        </div>

        {/* Status Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Requests" },
            { id: "Pending", label: `Pending (${pendingCount})` },
            { id: "Confirmed", label: `Confirmed (${confirmedCount})` },
            { id: "Cancelled", label: `Cancelled (${cancelledCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                statusFilter === tab.id
                  ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* REQUESTS LIST */}
      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          Loading property tour bookings...
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-16 text-center">
          <FaHandshake className="text-3xl text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white">No Tour Requests</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No booking request matches your current filter. Incoming client tour bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTours.map((tour, index) => (
            <Motion.article
              key={tour._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4 hover:border-white/20 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {tour.name}
                    </h3>
                    <span className="text-slate-500">•</span>
                    <span className="text-sm font-semibold text-red-400 flex items-center gap-1">
                      <FaBuilding className="text-xs" />
                      {tour.propertyName || "Property Listing"}
                    </span>

                    <span
                      className={`inline-flex rounded-full border px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        statusStyles[tour.status] || statusStyles.Pending
                      }`}
                    >
                      {tour.status}
                    </span>
                  </div>

                  {/* Contact Info Pills */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <a
                      href={`mailto:${tour.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-white transition"
                    >
                      <FaEnvelope className="text-red-400 text-xs" />
                      {tour.email}
                    </a>
                    {tour.phone && (
                      <a
                        href={`tel:${tour.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-white transition"
                      >
                        <FaPhone className="text-red-400 text-xs" />
                        {tour.phone}
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
                      <FaCalendarAlt className="text-xs" />
                      Preferred: {new Date(tour.preferredDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Message Note */}
                  {tour.message && (
                    <p className="mt-2 rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-300 italic">
                      &quot;{tour.message}&quot;
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start pt-2 lg:pt-0">
                  <button
                    onClick={() => handleStatusChange(tour._id, "Confirmed")}
                    disabled={isActionLoading || tour.status === "Confirmed"}
                    className="btn btn-secondary text-xs py-2 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 disabled:opacity-40"
                  >
                    <FaCheckCircle className="text-xs" />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(tour._id, "Cancelled")}
                    disabled={isActionLoading || tour.status === "Cancelled"}
                    className="btn btn-secondary text-xs py-2 text-amber-400 hover:bg-amber-500/20 border-amber-500/20 disabled:opacity-40"
                  >
                    <FaTimesCircle className="text-xs" />
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    disabled={isActionLoading}
                    className="btn btn-danger text-xs py-2 px-3"
                    title="Delete Request"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </Motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToursManager;
