import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { 
  FaWandMagicSparkles, 
  FaCheck, 
  FaTriangleExclamation, 
  FaXmark,
  FaLocationDot,
  FaBed,
  FaBath,
  FaTag,
  FaArrowRight
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { aiAPI } from "../../api/aiApi";

const AIMatchScoreBadge = ({ property, searchCriteria = {} }) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchScore = async () => {
      if (!property) return;
      setLoading(true);
      try {
        const res = await aiAPI.calculateMatchScore(property, searchCriteria);
        const data = res?.data || res;
        if (isMounted && data) {
          setMatchData(data);
        }
      } catch (err) {
        console.error("Match score error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchScore();
    return () => {
      isMounted = false;
    };
  }, [property, searchCriteria]);

  // Lock body scroll when modal is open and handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowDetails(false);
    };
    if (showDetails) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDetails]);

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-amber-400/30">
        <FaWandMagicSparkles className="animate-spin text-[10px]" />
        Calculating...
      </span>
    );
  }

  if (!matchData) return null;

  const score = matchData.matchScore || 70;
  const scoreColor =
    score >= 85
      ? "bg-emerald-500 text-slate-950 border-emerald-400"
      : score >= 70
      ? "bg-amber-500 text-slate-950 border-amber-400"
      : "bg-blue-600 text-white border-blue-400";

  const scoreBadgeBg =
    score >= 85
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : score >= 70
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : "bg-blue-500/20 text-blue-400 border-blue-500/30";

  const propertyId = property?._id || property?.id;

  return (
    <>
      {/* Badge Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowDetails(true);
        }}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-md transition hover:scale-105 cursor-pointer border ${scoreColor}`}
        title="Click to view full AI match breakdown"
      >
        <FaWandMagicSparkles className="text-[10px]" />
        {score}% Match
      </button>

      {/* Full Screen Portal Modal to avoid any parent overflow clipping */}
      {showDetails &&
        createPortal(
          <AnimatePresence>
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(false);
              }}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-slate-950 text-slate-100 shadow-2xl border border-slate-800 overflow-hidden z-10"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800/80 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg mt-0.5">
                      <FaWandMagicSparkles className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                          AI Match Intelligence
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${scoreBadgeBg}`}>
                          {score}% Compatibility
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white mt-1 leading-snug">
                        {property?.name || "Property Match Breakdown"}
                      </h3>
                      {property?.address && (
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                          <FaLocationDot className="size-3 text-amber-400 shrink-0" />
                          <span className="truncate">{property.address}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition cursor-pointer shrink-0"
                    aria-label="Close"
                  >
                    <FaXmark className="size-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
                  {/* Score Meter Banner */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">Match Confidence Score:</span>
                      <span className="text-base font-black text-white">{score}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          score >= 85
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : score >= 70
                            ? "bg-gradient-to-r from-amber-500 to-orange-400"
                            : "bg-gradient-to-r from-blue-600 to-indigo-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {score >= 85
                        ? "✨ Exceptional Match: This listing closely aligns with your target search criteria, category, and budget."
                        : score >= 70
                        ? "👍 Strong Match: Great fit for your requested preferences with only minor variations to double-check."
                        : "ℹ️ Moderate Match: Shares relevant location or purpose features, but has differences in budget or specifications."}
                    </p>
                  </div>

                  {/* Property Quick Specs */}
                  {property && (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">PRICE</span>
                        <span className="font-extrabold text-amber-400 text-xs mt-0.5 block truncate">
                          {property.price || "N/A"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">LAYOUT</span>
                        <span className="font-bold text-white text-xs mt-0.5 block">
                          {property.bed || 0} Beds • {property.bath || 0} Baths
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block font-semibold">PURPOSE</span>
                        <span className="font-bold text-emerald-400 uppercase text-xs mt-0.5 block">
                          {property.purpose || "Buy"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Why this matches */}
                  {matchData.matchReasons && matchData.matchReasons.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <FaCheck className="size-3.5" /> Why this is a {score}% Match:
                      </h4>
                      <div className="space-y-1.5">
                        {matchData.matchReasons.map((reason, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-slate-200"
                          >
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                              <FaCheck className="size-2.5" />
                            </div>
                            <span className="leading-snug">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Things to verify */}
                  {matchData.considerations && matchData.considerations.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <FaTriangleExclamation className="size-3.5" /> Key Considerations to Verify:
                      </h4>
                      <div className="space-y-1.5">
                        {matchData.considerations.map((note, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 flex items-start gap-2.5 text-xs text-slate-300"
                          >
                            <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                              <FaTriangleExclamation className="size-2.5" />
                            </div>
                            <span className="leading-snug">{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-3">
                  {propertyId ? (
                    <Link
                      to={`/properties/${propertyId}`}
                      onClick={() => setShowDetails(false)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      View Complete Property Details <FaArrowRight className="size-3.5" />
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-5 rounded-2xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default AIMatchScoreBadge;
