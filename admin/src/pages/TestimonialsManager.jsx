import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import AdminTable from "../components/AdminTable";
import {
  adminFetchAll,
  bulkDelete,
  bulkUpdateStatus,
  deleteTestimonial,
  updateTestimonialStatus,
} from "../api/testimonialApi";
import { useFetchData } from "../api/useFetchData";
import { useConfirmationModal } from "./ModalContext";
import { useDebounce } from "../components/useDebounce";
import PaginationControls from "../components/PaginationControls";

const TestimonialsManager = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'Approved', 'Rejected', 'Pending'
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [sortField, setSortField] = useState("createdAt"); // Default sort field
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectAllMode, setIsSelectAllMode] = useState(false);

  const { data: testimonials, totalCount, loading, refetch, setParams } = useFetchData(adminFetchAll, { page: currentPage, limit: itemsPerPage, sortField, sortOrder });
  const confirm = useConfirmationModal();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleStatusChange = async (id, status) => {
    setIsActionLoading(true);
    try {
      await updateTestimonialStatus(id, status);
      await refetch();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Delete Testimonial?",
      message: "Are you sure you want to delete this testimonial? This action cannot be undone.",
      onConfirm: async () => {
        setIsActionLoading(true);
        try {
          await deleteTestimonial(id);
          await refetch();
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(testimonials.map((t) => t._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkAction = async (action) => {
    const actionText = action.toLowerCase();
    const payload = isSelectAllMode
      ? {
          filters: {
            search: debouncedSearchTerm || undefined,
            status: filterStatus === "all" ? undefined : filterStatus,
          },
        }
      : { ids: selectedIds };

    const onConfirm = async () => {
      setIsActionLoading(true);
      try {
        if (actionText === "delete") {
          await bulkDelete(payload);
        } else {
          // 'approve' or 'reject'
          const status = actionText.charAt(0).toUpperCase() + actionText.slice(1);
          await bulkUpdateStatus({ ...payload, status });
        }
        // Reset selection state
        setSelectedIds([]);
        setIsSelectAllMode(false);
        await refetch();
      } finally {
        setIsActionLoading(false);
      }
    };

    if (actionText === "delete") {
      const count = isSelectAllMode ? totalCount : selectedIds.length;
      confirm({
        title: `Delete ${count} Testimonials?`,
        message: `Are you sure you want to delete all ${count} selected testimonials? This action cannot be undone.`,
        onConfirm,
      });
    } else {
      // For approve/reject, confirm without the scary modal if desired, or use it for consistency.
      // Here we'll use the modal for all bulk actions.
      const status = actionText.charAt(0).toUpperCase() + actionText.slice(1);
      confirm({
        title: `${status} ${isSelectAllMode ? totalCount : selectedIds.length} Testimonials?`,
        message: `Are you sure you want to ${actionText} all ${isSelectAllMode ? totalCount : selectedIds.length
          } selected testimonials?`,
        onConfirm,
      });
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Function to update all parameters and trigger a fetch
  const updateAllParams = (newPage, newSearchTerm, newFilterStatus, newSortField, newSortOrder) => {
    setParams({
      page: newPage,
      limit: itemsPerPage,
      search: newSearchTerm || undefined, // Send undefined if search is empty
      status: newFilterStatus === 'all' ? undefined : newFilterStatus,
      sortField: newSortField,
      sortOrder: newSortOrder,
    });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      updateAllParams(pageNumber, debouncedSearchTerm, filterStatus, sortField, sortOrder);
    }
  };

  // Effect to reset page and trigger fetch when search term or filter status changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page
    setSelectedIds([]);
    setIsSelectAllMode(false);
    updateAllParams(1, debouncedSearchTerm, filterStatus, sortField, sortOrder);
  }, [debouncedSearchTerm, filterStatus, sortField, sortOrder, itemsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps
  // The `updateAllParams` function is stable, so it doesn't need to be in the dependency array. `itemsPerPage` is also stable.

  const handleSortChange = (field) => {
    if (sortField === field) {
      // If clicking the same field, toggle sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new field, set it as the sort field and default to ascending
      setSortField(field);
      setSortOrder("asc");
    }
    // The useEffect above will handle the refetch due to sortField/sortOrder change
  };

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Testimonials</h2>
        <p className="mt-2 text-sm text-slate-300">
          Review submissions, approve valid reviews, reject bad ones, and remove
          anything you do not want to publish.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search testimonials by name, title, or feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400 md:w-1/2"
        />
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="statusFilter" className="text-sm text-slate-300">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <label htmlFor="itemsPerPage" className="text-sm text-slate-300">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-red-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-slate-900/75 p-4 md:flex-row"
        >
          <p className="text-sm font-medium text-white">{selectedIds.length} testimonials selected</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleBulkAction("Approve")} disabled={isActionLoading} className="rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50">Approve Selected</button>
            <button onClick={() => handleBulkAction("Reject")} disabled={isActionLoading} className="rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50">Reject Selected</button>
            <button onClick={() => handleBulkAction("Delete")} disabled={isActionLoading} className="rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50">Delete Selected</button>
            <button onClick={() => setSelectedIds([])} disabled={isActionLoading} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">Clear Selection</button>
          </div>
        </Motion.div>
      )}

      {isSelectAllMode && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[2rem] border border-blue-400/30 bg-blue-500/10 p-4 text-center text-sm"
        >
          <span className="font-semibold text-blue-200">All {totalCount} testimonials are selected.</span>
          <button onClick={() => { setSelectedIds([]); setIsSelectAllMode(false); }} className="ml-2 font-semibold text-slate-300 underline-offset-2 hover:underline">Clear selection</button>
        </Motion.div>
      )}

      {selectedIds.length === testimonials.length && testimonials.length > 0 && !isSelectAllMode && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-4 text-center text-sm"
        >
          <span className="text-slate-300">All {selectedIds.length} testimonials on this page are selected.</span>
          <button onClick={() => setIsSelectAllMode(true)} className="ml-2 font-semibold text-red-300 underline-offset-2 hover:underline">Select all {totalCount} testimonials</button>
        </Motion.div>
      )}

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-sm text-slate-300">
          Loading testimonials...
        </div>
      ) : testimonials && (
        <AdminTable
          testimonials={testimonials}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          isActionLoading={isActionLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          selectedIds={selectedIds}
          onSelectOne={handleSelectOne}
          onSelectAll={handleSelectAll}
        />
      )}

      {!loading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isDisabled={isActionLoading}
        />
      )}
    </Motion.section>
  );
};

export default TestimonialsManager;
