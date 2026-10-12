import React, { useState } from "react";
import { FaWandMagicSparkles, FaArrowRight, FaRotate } from "react-icons/fa6";
import { aiAPI } from "../../api/aiApi";
import toast from "react-hot-toast";


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
          placeholder='Ask AI: e.g. "3 BHK villa in Haldwani"'
          className="w-full rounded-2xl bg-slate-950/90 border border-amber-500/40 pl-10 sm:pl-11 pr-24 sm:pr-32 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 shadow-xl transition"
        />

        <button
          type="submit"
          disabled={parsing}
          className="absolute right-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {parsing ? (
            <>
              <FaRotate className="animate-spin text-xs" />
              <span className="hidden sm:inline">Parsing...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Find Match</span>
              <span className="sm:hidden">Match</span>
              <FaArrowRight className="text-[10px]" />
            </>
          )}
        </button>
            </>
          ) : (
            <>
              Find Match <FaArrowRight className="text-[10px]" />
            </>
          )}
        </button>
      </form>

    </div>
  );
};

export default AINaturalSearchBar;

