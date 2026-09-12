import React, { useState } from "react";
import { FaWandMagicSparkles, FaArrowRight, FaRotate } from "react-icons/fa6";
import { aiAPI } from "../../api/aiApi";
import toast from "react-hot-toast";

const samplePrompts = [
  "3 BHK under 80 lakh in Haldwani with parking",
  "Luxury Villa for sale with 4 bedrooms",
  "Modern apartment for rent under 35k",
  "Commercial office space in city center",
];

const AINaturalSearchBar = ({ onApplySearch, className = "" }) => {
  const [naturalQuery, setNaturalQuery] = useState("");
  const [parsing, setParsing] = useState(false);

  const handleParse = async (e) => {
    e.preventDefault();
    if (!naturalQuery.trim()) {
      toast.error("Please enter what you are looking for.");
      return;
    }

    setParsing(true);
    try {
      const res = await aiAPI.parseQuery(naturalQuery);
      const structured = res?.data?.structured || res?.structured;
      if (structured && onApplySearch) {
        onApplySearch(structured);
        toast.success(`✨ AI interpreted search criteria!`);
      }
    } catch (err) {
      console.error("AI Query parse failed:", err);
      // Fallback search
      if (onApplySearch) {
        onApplySearch({ q: naturalQuery });
      }
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className={`w-full space-y-2.5 ${className}`}>
      <form onSubmit={handleParse} className="relative flex items-center">
        <div className="absolute left-4 text-amber-400 text-sm flex items-center gap-1">
          <FaWandMagicSparkles className="animate-pulse" />
        </div>

        <input
          type="text"
          value={naturalQuery}
          onChange={(e) => setNaturalQuery(e.target.value)}
          placeholder='Ask AI: e.g. "3 BHK villa under 90L in Haldwani with parking"'
          className="w-full rounded-2xl bg-slate-950/90 border border-amber-500/40 pl-11 pr-28 py-3.5 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 shadow-xl transition"
        />

        <button
          type="submit"
          disabled={parsing}
          className="absolute right-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {parsing ? (
            <>
              <FaRotate className="animate-spin text-xs" />
              Parsing...
            </>
          ) : (
            <>
              Find Match <FaArrowRight className="text-[10px]" />
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">AI Prompts:</span>
        {samplePrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setNaturalQuery(prompt);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60 transition cursor-pointer"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
};

export default AINaturalSearchBar;

