import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { FaWandMagicSparkles, FaRobot, FaArrowRight, FaRotate, FaComments } from "react-icons/fa6";
import { aiAPI } from "../../api/aiApi";
import toast from "react-hot-toast";

const sampleConversations = [
  "I need a 3 BHK under 80 lakh in Haldwani with parking near schools.",
  "Show me modern 2 BHK apartments for rent under 35,000.",
  "Looking for luxury 4 BHK private villa with garden.",
  "Commercial office space for lease in city center.",
];

const AIConciergeModal = ({ isOpen, onClose, onApplySearch }) => {
  const [promptInput, setPromptInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) {
      toast.error("Please describe your property requirements.");
      return;
    }

    setAnalyzing(true);
    try {
      const res = await aiAPI.parseQuery(promptInput);
      const data = res?.data?.structured || res?.structured;
      setParsedResult(data);
      toast.success("AI interpreted your preferences successfully!");
    } catch (err) {
      console.error(err);
      toast.error("AI service is busy. Using direct keyword match.");
      setParsedResult({ q: promptInput, intent: "buy" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyFilter = () => {
    if (parsedResult && onApplySearch) {
      onApplySearch(parsedResult);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Property Concierge" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Concierge Intro Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <FaWandMagicSparkles />
            Contextual Property Assistant
          </div>
          <p className="text-sm font-semibold text-white">
            Tell me what you're looking for in your own words, and I'll narrow down the matching real estate portfolio.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-3">
          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder='e.g. "I need a 3 BHK apartment under ₹85 lakh near green park with parking and 24/7 security."'
            className="w-full rounded-2xl border border-slate-300 p-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 resize-none font-medium"
          />

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {sampleConversations.slice(0, 2).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPromptInput(s)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 transition cursor-pointer"
                >
                  "{s.slice(0, 35)}..."
                </button>
              ))}
            </div>

            <Button type="submit" variant="accent" size="sm" isLoading={analyzing} icon={FaWandMagicSparkles}>
              Interpret Requirements
            </Button>
          </div>
        </form>

        {/* Parsed Result Display */}
        {parsedResult && (
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3 animate-fade-in">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900">Extracted Search Criteria:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
              <div>
                <span className="text-slate-500 font-medium">Intent:</span>{" "}
                <span className="font-bold uppercase text-blue-700">{parsedResult.intent || "BUY"}</span>
              </div>
              {parsedResult.bed && (
                <div>
                  <span className="text-slate-500 font-medium">Bedrooms:</span>{" "}
                  <span className="font-bold">{parsedResult.bed} Beds</span>
                </div>
              )}
              {parsedResult.maxPrice && (
                <div>
                  <span className="text-slate-500 font-medium">Max Price:</span>{" "}
                  <span className="font-bold">₹{(parsedResult.maxPrice / 100000).toFixed(1)} Lakh</span>
                </div>
              )}
              {parsedResult.category && (
                <div>
                  <span className="text-slate-500 font-medium">Category:</span>{" "}
                  <span className="font-bold">{parsedResult.category}</span>
                </div>
              )}
              {parsedResult.q && (
                <div className="col-span-2">
                  <span className="text-slate-500 font-medium">Keywords / Location:</span>{" "}
                  <span className="font-bold text-slate-900">{parsedResult.q}</span>
                </div>
              )}
            </div>

            <Button variant="primary" onClick={handleApplyFilter} icon={FaArrowRight} iconPosition="right" className="w-full mt-2">
              Apply Filters & View Matches
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIConciergeModal;

