import React, { useMemo } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const DOTS = "dots";

const PaginationControls = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isDisabled = false,

  totalItems,
  itemsPerPage,

  showSummary = true,
  siblingCount = 1,
}) => {
  const safeTotalPages = Math.max(
    1,
    Number(totalPages) || 1
  );

  const safeCurrentPage = Math.min(
    Math.max(1, Number(currentPage) || 1),
    safeTotalPages
  );

  const safeItemsPerPage = Math.max(
    1,
    Number(itemsPerPage) || 10
  );

  /* ---------------------------------------------------------------------- */
  /* PAGE RANGE                                                              */
  /* ---------------------------------------------------------------------- */

  const pageRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    /*
     * Small number of pages:
     * 1 2 3 4 5
     */

    if (safeTotalPages <= totalPageNumbers) {
      return Array.from(
        { length: safeTotalPages },
        (_, index) => index + 1
      );
    }

    const leftSiblingIndex = Math.max(
      safeCurrentPage - siblingCount,
      1
    );

    const rightSiblingIndex = Math.min(
      safeCurrentPage + siblingCount,
      safeTotalPages
    );

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots =
      rightSiblingIndex < safeTotalPages - 1;

    /*
     * Near beginning:
     *
     * 1 2 3 4 ... 50
     */

    if (!showLeftDots && showRightDots) {
      return [
        ...Array.from(
          { length: 3 + siblingCount * 2 },
          (_, index) => index + 1
        ),
        DOTS,
        safeTotalPages,
      ];
    }

    /*
     * Near end:
     *
     * 1 ... 47 48 49 50
     */

    if (showLeftDots && !showRightDots) {
      return [
        1,
        DOTS,
        ...Array.from(
          {
            length: 3 + siblingCount * 2,
          },
          (_, index) =>
            safeTotalPages -
            (2 + siblingCount * 2) +
            index
        ),
      ];
    }

    /*
     * Middle:
     *
     * 1 ... 24 25 26 ... 50
     */

    return [
      1,
      DOTS,
      ...Array.from(
        {
          length: siblingCount * 2 + 1,
        },
        (_, index) =>
          leftSiblingIndex + index
      ),
      DOTS,
      safeTotalPages,
    ];
  }, [
    safeCurrentPage,
    safeTotalPages,
    siblingCount,
  ]);

  /* ---------------------------------------------------------------------- */
  /* SUMMARY                                                                 */
  /* ---------------------------------------------------------------------- */

  const summary = useMemo(() => {
    if (
      !showSummary ||
      !totalItems ||
      totalItems <= 0
    ) {
      return null;
    }

    const start =
      (safeCurrentPage - 1) * safeItemsPerPage + 1;

    const end = Math.min(
      safeCurrentPage * safeItemsPerPage,
      totalItems
    );

    return {
      start,
      end,
      total: totalItems,
    };
  }, [
    showSummary,
    totalItems,
    safeCurrentPage,
    safeItemsPerPage,
  ]);

  /* ---------------------------------------------------------------------- */
  /* PAGE CHANGE                                                             */
  /* ---------------------------------------------------------------------- */

  const changePage = (page) => {
    if (isDisabled) return;

    const nextPage = Math.min(
      Math.max(1, page),
      safeTotalPages
    );

    if (nextPage === safeCurrentPage) return;

    onPageChange?.(nextPage);
  };

  /* ---------------------------------------------------------------------- */
  /* NO PAGINATION                                                           */
  /* ---------------------------------------------------------------------- */

  if (safeTotalPages <= 1) {
    if (!summary) return null;

    return (
      <div className="mt-5 flex justify-center text-xs text-slate-500">
        Showing{" "}
        <span className="mx-1 font-semibold text-slate-300">
          {summary.start}-{summary.end}
        </span>{" "}
        of{" "}
        <span className="ml-1 font-semibold text-slate-300">
          {summary.total}
        </span>
      </div>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-3 shadow-xl backdrop-blur-xl sm:p-4"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ================================================================ */}
        {/* SUMMARY                                                          */}
        {/* ================================================================ */}

        <div className="order-2 text-center lg:order-1 lg:text-left">
          {summary ? (
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-300">
                {summary.start}
              </span>
              {" – "}
              <span className="font-bold text-slate-300">
                {summary.end}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-300">
                {summary.total}
              </span>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Page{" "}
              <span className="font-bold text-slate-300">
                {safeCurrentPage}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-300">
                {safeTotalPages}
              </span>
            </p>
          )}
        </div>

        {/* ================================================================ */}
        {/* CONTROLS                                                         */}
        {/* ================================================================ */}

        <div className="order-1 flex items-center justify-center gap-1.5 lg:order-2">
          {/* First */}

          <Motion.button
            type="button"
            whileHover={!isDisabled ? { scale: 1.04 } : undefined}
            whileTap={!isDisabled ? { scale: 0.96 } : undefined}
            onClick={() => changePage(1)}
            disabled={
              safeCurrentPage === 1 ||
              isDisabled
            }
            aria-label="First page"
            title="First page"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-500 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
          >
            <FaAngleDoubleLeft className="text-[10px]" />
          </Motion.button>

          {/* Previous */}

          <Motion.button
            type="button"
            whileHover={!isDisabled ? { scale: 1.04 } : undefined}
            whileTap={!isDisabled ? { scale: 0.96 } : undefined}
            onClick={() =>
              changePage(safeCurrentPage - 1)
            }
            disabled={
              safeCurrentPage === 1 ||
              isDisabled
            }
            aria-label="Previous page"
            className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FaChevronLeft className="text-[9px]" />

            <span className="hidden sm:inline">
              Previous
            </span>
          </Motion.button>

          {/* Page numbers */}

          <div className="flex items-center gap-1">
            {pageRange.map((page, index) => {
              if (page === DOTS) {
                return (
                  <span
                    key={`dots-${index}`}
                    className="flex h-9 w-8 items-center justify-center text-xs font-bold text-slate-700"
                    aria-hidden="true"
                  >
                    •••
                  </span>
                );
              }

              const isActive =
                page === safeCurrentPage;

              return (
                <Motion.button
                  key={page}
                  type="button"
                  whileHover={
                    !isDisabled && !isActive
                      ? { scale: 1.05 }
                      : undefined
                  }
                  whileTap={
                    !isDisabled && !isActive
                      ? { scale: 0.95 }
                      : undefined
                  }
                  onClick={() => changePage(page)}
                  disabled={isDisabled || isActive}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  aria-label={`Page ${page}`}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-bold transition ${
                    isActive
                      ? "border-red-400/30 bg-red-500 text-white shadow-lg shadow-red-950/30"
                      : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  } disabled:cursor-default disabled:opacity-100`}
                >
                  {page}
                </Motion.button>
              );
            })}
          </div>

          {/* Next */}

          <Motion.button
            type="button"
            whileHover={!isDisabled ? { scale: 1.04 } : undefined}
            whileTap={!isDisabled ? { scale: 0.96 } : undefined}
            onClick={() =>
              changePage(safeCurrentPage + 1)
            }
            disabled={
              safeCurrentPage === safeTotalPages ||
              isDisabled
            }
            aria-label="Next page"
            className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span className="hidden sm:inline">
              Next
            </span>

            <FaChevronRight className="text-[9px]" />
          </Motion.button>

          {/* Last */}

          <Motion.button
            type="button"
            whileHover={!isDisabled ? { scale: 1.04 } : undefined}
            whileTap={!isDisabled ? { scale: 0.96 } : undefined}
            onClick={() =>
              changePage(safeTotalPages)
            }
            disabled={
              safeCurrentPage === safeTotalPages ||
              isDisabled
            }
            aria-label="Last page"
            title="Last page"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-500 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
          >
            <FaAngleDoubleRight className="text-[10px]" />
          </Motion.button>
        </div>
      </div>
    </nav>
  );
};

export default PaginationControls;