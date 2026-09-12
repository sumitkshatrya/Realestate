import React, { useState, useEffect } from "react";
import { FaWandMagicSparkles, FaCheck, FaTriangleExclamation, FaXmark } from "react-icons/fa6";
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

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-amber-400/30">
        <FaWandMagicSparkles className="animate-spin text-[10px]" />
        Calculating...
      </span>
    );
  }

  if (!matchData) return null;

  const score = matchData.matchScore || 85;
  const scoreColor =
    score >= 85
      ? "bg-emerald-500 text-slate-950 border-emerald-400"
      : score >= 70
      ? "bg-amber-500 text-slate-950 border-amber-400"
      : "bg-blue-600 text-white border-blue-400";

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowDetails(!showDetails);
        }}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-md transition hover:scale-105 cursor-pointer border ${scoreColor}`}
        title="Click to view AI match breakdown"
      >
        <FaWandMagicSparkles className="text-[10px]" />
        {score}% Match
      </button>

      {/* Popover Breakdown */}
      {showDetails && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-8 right-0 z-50 w-72 rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl p-4 text-left text-slate-200 text-xs animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <FaWandMagicSparkles className="text-amber-400" />
              <span>AI Match Analysis ({score}%)</span>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <FaXmark />
            </button>
          </div>

          {/* Reasons */}
          {matchData.matchReasons && matchData.matchReasons.length > 0 && (
            <div className="space-y-1.5 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Why this matches:</p>
              {matchData.matchReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                  <FaCheck className="text-emerald-400 text-xs shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Considerations */}
          {matchData.considerations && matchData.considerations.length > 0 && (
            <div className="space-y-1.5 border-t border-slate-800 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Things to verify:</p>
              {matchData.considerations.map((note, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-400">
                  <FaTriangleExclamation className="text-amber-400 text-xs shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIMatchScoreBadge;

