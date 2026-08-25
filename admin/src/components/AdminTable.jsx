import React, { useEffect, useMemo, useRef } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaCheck,
  FaChevronDown,
  FaClock,
  FaExternalLinkAlt,
  FaImage,
  FaPlay,
  FaRegStar,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaTimes,
  FaTrash,
  FaUser,
  FaVideo,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "";

const statusConfig = {
  Approved: {
    label: "Approved",
    icon: FaCheck,
    wrapper:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },

  Rejected: {
    label: "Rejected",
    icon: FaTimes,
    wrapper:
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
    dot: "bg-rose-400",
  },

  Pending: {
    label: "Pending",
    icon: FaClock,
    wrapper:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
};

const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return "";

  if (
    mediaUrl.startsWith("http://") ||
    mediaUrl.startsWith("https://")
  ) {
    return mediaUrl;
  }

  return `${BASE_URL}${mediaUrl}`;
};

const isImage = (url = "") =>
  /\.(jpeg|jpg|gif|png|webp|svg|avif)$/i.test(url.split("?")[0]);

const isVideo = (url = "") =>
  /\.(mp4|webm|mov|m4v|avi)$/i.test(url.split("?")[0]);

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

/* -------------------------------------------------------------------------- */
/* SORTABLE HEADER                                                            */
/* -------------------------------------------------------------------------- */

const SortableHeader = ({
  field,
  currentSortField,
  currentSortOrder,
  onSortChange,
  children,
  align = "left",
}) => {
  const isCurrentField = currentSortField === field;

  const Icon = !isCurrentField
    ? FaSort
    : currentSortOrder === "asc"
      ? FaSortUp
      : FaSortDown;

  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-5 py-4 text-${align}`}
    >
      <button
        type="button"
        onClick={() => onSortChange(field)}
        className="group inline-flex items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
        aria-label={`Sort by ${children}`}
      >
        <span>{children}</span>

        <Icon
          className={`text-[10px] transition ${
            isCurrentField
              ? "text-white"
              : "text-slate-600 group-hover:text-slate-300"
          }`}
        />
      </button>
    </th>
  );
};

/* -------------------------------------------------------------------------- */
/* AVATAR                                                                     */
/* -------------------------------------------------------------------------- */

const UserAvatar = ({ name }) => {
  const initials = getInitials(name);

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 shadow-inner">
      {initials ? (
        <span className="text-xs font-bold text-white">
          {initials}
        </span>
      ) : (
        <FaUser className="text-xs text-slate-500" />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* RATING                                                                     */
/* -------------------------------------------------------------------------- */

const Rating = ({ value }) => {
  const rating = Math.min(Math.max(Number(value) || 0, 0), 5);

  return (
    <div
      className="flex items-center gap-2"
      aria-label={`${rating} out of 5 stars`}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= rating
                ? "text-amber-400"
                : "text-slate-700"
            }
          >
            {star <= rating ? "★" : "☆"}
          </span>
        ))}
      </div>

      <span className="text-xs font-semibold text-slate-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wide ${config.wrapper}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />

      <Icon className="text-[9px]" />

      {config.label}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* MEDIA PREVIEW                                                              */
/* -------------------------------------------------------------------------- */

const MediaPreview = ({ mediaUrl }) => {
  const url = getMediaUrl(mediaUrl);

  if (!url) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <FaImage />
        No media
      </div>
    );
  }

  if (isImage(url)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group relative block h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-slate-950"
        title="Open image"
      >
        <img
          src={url}
          alt="Testimonial media"
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
          <FaExternalLinkAlt className="scale-75 text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
        </div>
      </a>
    );
  }

  if (isVideo(url)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950"
        title="Open video"
      >
        <FaVideo className="text-slate-400 transition group-hover:scale-110 group-hover:text-white" />

        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-bold text-white">
          VIDEO
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
    >
      <FaPlay className="text-[9px]" />
      View media
    </a>
  );
};

/* -------------------------------------------------------------------------- */
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

const EmptyState = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 px-6 py-16 text-center shadow-2xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <FaUser className="text-xl text-slate-600" />
      </div>

      <h3 className="mt-5 text-base font-bold text-white">
        No testimonials found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        There are no testimonials matching your current search,
        filter, or status criteria.
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN TABLE                                                                 */
/* -------------------------------------------------------------------------- */

const AdminTable = ({
  testimonials = [],
  onStatusChange,
  onDelete,
  isActionLoading = false,

  sortField,
  sortOrder,
  onSortChange,

  selectedIds = [],
  onSelectOne,
  onSelectAll,

  onBulkStatusChange,
  onBulkDelete,
}) => {
  const selectAllRef = useRef(null);

  const allSelected =
    testimonials.length > 0 &&
    selectedIds.length === testimonials.length;

  const partiallySelected =
    selectedIds.length > 0 &&
    selectedIds.length < testimonials.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  const selectedCount = selectedIds.length;

  const stats = useMemo(() => {
    return {
      total: testimonials.length,
      approved: testimonials.filter(
        (item) => item.status === "Approved"
      ).length,
      pending: testimonials.filter(
        (item) => item.status === "Pending"
      ).length,
      rejected: testimonials.filter(
        (item) => item.status === "Rejected"
      ).length,
    };
  }, [testimonials]);

  if (testimonials.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* TABLE TOOLBAR                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white">
              Testimonials
            </h2>

            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-400">
              {stats.total} RECORDS
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wider">
            <span className="text-emerald-400">
              {stats.approved} approved
            </span>

            <span className="text-amber-400">
              {stats.pending} pending
            </span>

            <span className="text-rose-400">
              {stats.rejected} rejected
            </span>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/5 p-2">
            <span className="px-2 text-xs font-semibold text-red-300">
              {selectedCount} selected
            </span>

            {onBulkStatusChange && (
              <>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() =>
                    onBulkStatusChange("Approved")
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaCheck />
                  Approve
                </button>

                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() =>
                    onBulkStatusChange("Rejected")
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaTimes />
                  Reject
                </button>
              </>
            )}

            {onBulkDelete && (
              <button
                type="button"
                disabled={isActionLoading}
                onClick={onBulkDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaTrash />
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TABLE CARD                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse text-left">
            {/* ------------------------------------------------------------ */}
            {/* HEADER                                                        */}
            {/* ------------------------------------------------------------ */}

            <thead className="border-b border-white/10 bg-white/[0.025]">
              <tr className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-slate-950 px-5 py-4"
                >
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    aria-label="Select all testimonials"
                    className="h-4 w-4 cursor-pointer rounded border-slate-600 bg-slate-900 text-red-500 accent-red-500 focus:ring-2 focus:ring-red-500/30"
                  />
                </th>

                <SortableHeader
                  field="fullName"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSortChange={onSortChange}
                >
                  Customer
                </SortableHeader>

                <SortableHeader
                  field="title"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSortChange={onSortChange}
                >
                  Testimonial
                </SortableHeader>

                <SortableHeader
                  field="rating"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSortChange={onSortChange}
                >
                  Rating
                </SortableHeader>

                <SortableHeader
                  field="status"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSortChange={onSortChange}
                >
                  Status
                </SortableHeader>

                <th
                  scope="col"
                  className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"
                >
                  Media
                </th>

                <SortableHeader
                  field="createdAt"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSortChange={onSortChange}
                >
                  Submitted
                </SortableHeader>

                <th
                  scope="col"
                  className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"
                >
                  Actions
                </th>
              </tr>
            </thead>

            {/* ------------------------------------------------------------ */}
            {/* BODY                                                          */}
            {/* ------------------------------------------------------------ */}

            <tbody className="divide-y divide-white/[0.06]">
              {testimonials.map((testimonial, index) => {
                const isSelected = selectedIds.includes(
                  testimonial._id
                );

                return (
                  <Motion.tr
                    key={testimonial._id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.025,
                      duration: 0.2,
                    }}
                    className={`group transition-colors ${
                      isSelected
                        ? "bg-red-500/[0.045]"
                        : "hover:bg-white/[0.025]"
                    }`}
                  >
                    {/* -------------------------------------------------- */}
                    {/* SELECT                                               */}
                    {/* -------------------------------------------------- */}

                    <td className="sticky left-0 z-10 bg-slate-950 px-5 py-5 group-hover:bg-slate-900">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          onSelectOne(testimonial._id)
                        }
                        aria-label={`Select ${testimonial.fullName}`}
                        className="h-4 w-4 cursor-pointer rounded border-slate-600 bg-slate-900 text-red-500 accent-red-500 focus:ring-2 focus:ring-red-500/30"
                      />
                    </td>

                    {/* -------------------------------------------------- */}
                    {/* CUSTOMER                                             */}
                    {/* -------------------------------------------------- */}

                    <td className="px-5 py-5 align-top">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <UserAvatar
                          name={testimonial.fullName}
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">
                            {testimonial.fullName || "Unknown user"}
                          </p>

                          <p className="mt-1 max-w-[190px] truncate text-xs text-slate-500">
                            {testimonial.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* -------------------------------------------------- */}
                    {/* TESTIMONIAL                                          */}
                    {/* -------------------------------------------------- */}

                    <td className="px-5 py-5 align-top">
                      <div className="max-w-[360px]">
                        <p className="truncate text-sm font-semibold text-slate-100">
                          {testimonial.title || "Untitled testimonial"}
                        </p>

                        <p
                          title={testimonial.feedback}
                          className="mt-2 line-clamp-3 text-xs leading-6 text-slate-500"
                        >
                          {testimonial.feedback ||
                            "No feedback provided."}
                        </p>
                      </div>
                    </td>

                    {/* -------------------------------------------------- */}
                    {/* RATING                                               */}
                    {/* -------------------------------------------------- */}

                    <td className="px-5 py-5 align-top">
                      <Rating value={testimonial.rating} />
                    </td>

                    {/* -------------------------------------------------- */}
                    {/* STATUS                                               */}
                    {/* -------------------------------------------------- */}

                    <td className="px-5 py-5 align-top">
                      <StatusBadge
                        status={testimonial.status}
                      />
                    </td>

                    {/* -------------------------------------------------- */}
                    {/* MEDIA                                                */}
                    {/* -------------------------------------------------- */}

                    <td className="px-5 py-5 align-top">
                      <MediaPreview
                        mediaUrl={testimonial.mediaUrl}
                      />
                    </td>

                    {/* -------------------------------------------------- */}
                    {/* DATE                                                 */}
                    {/* -------------------------------------------------- */}

                    <td className="px-5 py-5 align-top">
                      <div className="min-w-[120px]">
                        <p className="text-xs font-semibold text-slate-300">
                          {formatDate(testimonial.createdAt)}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {formatTime(testimonial.createdAt)}
                        </p>
                      </div>
                    </td>

                    {/* -------------------------------------------------- */}
                    {/* ACTIONS                                              */}
                    {/* -------------------------------------------------- */}

                    <td className="px-5 py-5 align-top">
                      <div className="flex min-w-[210px] flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onStatusChange(
                              testimonial._id,
                              "Approved"
                            )
                          }
                          disabled={
                            isActionLoading ||
                            testimonial.status === "Approved"
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-300 transition hover:border-emerald-400/20 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaCheck />
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onStatusChange(
                              testimonial._id,
                              "Rejected"
                            )
                          }
                          disabled={
                            isActionLoading ||
                            testimonial.status === "Rejected"
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/10 bg-amber-500/10 px-3 py-2 text-[11px] font-bold text-amber-300 transition hover:border-amber-400/20 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaTimes />
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(testimonial._id)
                          }
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/10 bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-300 transition hover:border-rose-400/20 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </Motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* FOOTER                                                         */}
        {/* -------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-300">
              {testimonials.length}
            </span>{" "}
            testimonial{testimonials.length !== 1 ? "s" : ""}
          </p>

          {selectedCount > 0 && (
            <p className="text-xs font-semibold text-red-300">
              {selectedCount} item
              {selectedCount !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTable;