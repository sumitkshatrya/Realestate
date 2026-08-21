import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { tourAPI } from "../api/tourApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";

const statusStyles = {
  Pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Confirmed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Cancelled: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

const ToursManager = () => {
  const { data: tours, loading, refetch } = useFetchData(tourAPI.getTours);
  const confirm = useConfirmationModal();
  const [isActionLoading, setIsActionLoading] = useState(false);

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
      message: "Are you sure you want to delete this tour request? This action cannot be undone.",
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

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Tour Requests</h2>
        <p className="mt-2 text-sm text-slate-300">
          Manage property viewing requests. Confirm, cancel, or remove scheduled
          tours submitted by prospective clients.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading tour requests...
        </div>
      ) : tours.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center">
          <p className="font-semibold text-white">No Tour Requests</p>
          <p className="mt-1 text-sm text-slate-400">
            Tour requests submitted through the schedule tour form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tours.map((tour, index) => (
            <Motion.article
              key={tour._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.24 }}
              className="rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {tour.name} — {tour.propertyName}
                    </h3>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusStyles[tour.status] || statusStyles.Pending
                      }`}
                    >
                      {tour.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <FaEnvelope className="text-red-300" />
                      {tour.email}
                    </span>
                    {tour.phone && (
                      <span className="inline-flex items-center gap-2">
                        <FaPhone className="text-red-300" />
                        {tour.phone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2">
                      <FaCalendarAlt className="text-red-300" />
                      {new Date(tour.preferredDate).toLocaleDateString()}
                    </span>
                    <span className="text-slate-500">
                      Requested: {new Date(tour.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {tour.message && (
                    <p className="mt-4 rounded-2xl border border-white/5 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                      {tour.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 self-start">
                  <button
                    onClick={() => handleStatusChange(tour._id, "Confirmed")}
                    disabled={isActionLoading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaCheckCircle />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(tour._id, "Cancelled")}
                    disabled={isActionLoading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaTimesCircle />
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    disabled={isActionLoading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </Motion.article>
          ))}
        </div>
      )}
    </Motion.section>
  );
};

export default ToursManager;
