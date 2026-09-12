import React, { useState, useEffect } from "react";
import { FaWandMagicSparkles, FaCheck, FaTriangleExclamation, FaMapLocationDot, FaTag, FaShield } from "react-icons/fa6";
import { aiAPI } from "../../api/aiApi";

const AIPropertyInsightsCard = ({ property }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!property) return;

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await aiAPI.getPropertyInsights(property);
        const data = res?.data || res;
        if (isMounted && data) {
          setInsights(data);
        }
      } catch (err) {
        console.error("AI Insights error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInsights();
    return () => {
      isMounted = false;
    };
  }, [property]);

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-3xl p-6 text-white animate-pulse space-y-3 border border-slate-800">
        <div className="h-5 bg-slate-800 rounded w-48" />
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-16 bg-slate-800 rounded-2xl w-full" />
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
            <FaWandMagicSparkles />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">AI Property Intelligence</h3>
            <p className="text-xs text-slate-400">Contextual property fit & location summary</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
          AI Verified Analysis
        </span>
      </div>

      {/* Property Fit Summary */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Property Fit</p>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {insights.fitSummary}
        </p>
      </div>

      {/* Pros & Considerations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Pros */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <FaCheck /> Key Advantages
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            {insights.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Considerations */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <FaTriangleExclamation /> Things to Verify
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            {insights.considerations.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price Position & Estimate */}
      {insights.priceInsight && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              AI Market Price Position (Estimate)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-amber-400">{insights.priceInsight.position}</span>
              <span className="text-slate-400 font-mono">({insights.priceInsight.estimatedRange})</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 italic max-w-xs">{insights.priceInsight.note}</span>
        </div>
      )}

      {/* Location Intelligence */}
      {insights.locationIntelligence && (
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <FaMapLocationDot /> Location & Neighborhood Intelligence
          </p>
          <p className="text-xs text-slate-300">{insights.locationIntelligence.suitability}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {insights.locationIntelligence.amenitiesNearby.map((amenity, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPropertyInsightsCard;

