import React from "react";
import { motion as Motion } from "framer-motion";

import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const statusStyles = {
  Approved: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Rejected: "bg-rose-500/15 text-rose-300 border-rose-400/30",
  Pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
};

const SortableHeader = ({ field, currentSortField, currentSortOrder, onSortChange, children }) => {
  const isCurrentField = currentSortField === field;
  const Icon = isCurrentField
    ? (currentSortOrder === "asc" ? FaSortUp : FaSortDown)
    : FaSort;

  return (
    <th className="px-5 py-4 cursor-pointer" onClick={() => onSortChange(field)}>
      <div className="flex items-center gap-1">
        {children}
        <Icon className={`text-xs ${isCurrentField ? 'text-white' : 'text-slate-500'}`} />
      </div>
    </th>
  );
};

const AdminTable = ({ testimonials, onStatusChange, onDelete, isActionLoading, sortField, sortOrder, onSortChange, selectedIds, onSelectOne, onSelectAll }) => {
  if (testimonials.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center">
        <p className="font-semibold text-white">No Testimonials Found</p>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/40">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-5 py-4"><input type="checkbox" onChange={onSelectAll} checked={testimonials.length > 0 && selectedIds.length === testimonials.length} className="h-4 w-4 rounded border-gray-300 bg-slate-800 text-red-600 focus:ring-red-500" /></th>
              <SortableHeader field="fullName" currentSortField={sortField} currentSortOrder={sortOrder} onSortChange={onSortChange}>Name</SortableHeader>
              <SortableHeader field="title" currentSortField={sortField} currentSortOrder={sortOrder} onSortChange={onSortChange}>Title</SortableHeader>
              <SortableHeader field="rating" currentSortField={sortField} currentSortOrder={sortOrder} onSortChange={onSortChange}>Rating</SortableHeader>
              <SortableHeader field="status" currentSortField={sortField} currentSortOrder={sortOrder} onSortChange={onSortChange}>Status</SortableHeader>
              <th className="px-5 py-4">Media</th>
              <SortableHeader field="createdAt" currentSortField={sortField} currentSortOrder={sortOrder} onSortChange={onSortChange}>Date</SortableHeader>
              <th className="px-5 py-4">Actions</th> {/* Actions column is not sortable */}
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial, index) => (
              <Motion.tr
                key={testimonial._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.24 }}
                className="border-t border-white/6 align-top"
              >
                <td className="px-5 py-4">
                  <input type="checkbox" checked={selectedIds.includes(testimonial._id)} onChange={() => onSelectOne(testimonial._id)} className="h-4 w-4 rounded border-gray-300 bg-slate-800 text-red-600 focus:ring-red-500" />
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{testimonial.fullName}</p>
                  <p className="mt-1 text-xs text-slate-400">{testimonial.email}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-100">{testimonial.title}</p>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-slate-400">
                    {testimonial.feedback}
                  </p>
                </td>
                <td className="px-5 py-4 text-amber-300">
                  {"★".repeat(testimonial.rating || 0)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusStyles[testimonial.status] || statusStyles.Pending
                    }`}
                  >
                    {testimonial.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {testimonial.mediaUrl ? (
                    testimonial.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img
                        src={`${BASE_URL}${testimonial.mediaUrl}`}
                        alt="testimonial media"
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <a
                        href={`${BASE_URL}${testimonial.mediaUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-red-300 underline-offset-4 hover:underline"
                      >
                        View media
                      </a>
                    )
                  ) : (
                    <span className="text-xs text-slate-500">No media</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onStatusChange(testimonial._id, "Approved")}
                      disabled={isActionLoading}
                      className="rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onStatusChange(testimonial._id, "Rejected")}
                      disabled={isActionLoading}
                      className="rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onDelete(testimonial._id)}
                      disabled={isActionLoading}
                      className="rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </Motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
