import React, { useState } from "react";
import { FaWandMagicSparkles, FaCopy, FaCheck, FaRotate, FaClipboardCheck } from "react-icons/fa6";
import { aiAPI } from "../../api/aiApi";
import toast from "react-hot-toast";

const AIListingAssist = ({ formData, onApplyDescription }) => {
  const [descriptions, setDescriptions] = useState(null);
  const [qualityData, setQualityData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("marketing");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const [descRes, scoreRes] = await Promise.all([
        aiAPI.generateDescription(formData),
        aiAPI.calculateListingScore(formData),
      ]);
      setDescriptions(descRes?.data || descRes);
      setQualityData(scoreRes?.data || scoreRes);
      toast.success("✨ AI Generated marketing copy and checked listing quality score!");
    } catch (err) {
      console.error("AI Listing assist error:", err);
      toast.error("Failed to generate AI listing suggestions.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyText = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FaWandMagicSparkles className="text-amber-400 text-lg" />
          <div>
            <h4 className="text-base font-bold text-white">AI Listing Assistant</h4>
            <p className="text-xs text-slate-400">Generate high-converting description variations & quality score</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {generating ? <FaRotate className="animate-spin" /> : <FaWandMagicSparkles />}
          {generating ? "Generating..." : "Generate AI Copy"}
        </button>
      </div>

      {/* Listing Quality Score Badge */}
      {qualityData && (
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Listing Quality Score</span>
            <span className="text-sm font-extrabold text-amber-400">{qualityData.score} / 100 ({qualityData.grade})</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                qualityData.score >= 80 ? "bg-emerald-500" : qualityData.score >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${qualityData.score}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {qualityData.checklist?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                {item.passed ? <FaCheck className="text-emerald-400 text-xs shrink-0" /> : <span className="text-amber-400">•</span>}
                <span className={item.passed ? "text-slate-200" : "text-amber-400"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Descriptions Tabs */}
      {descriptions && (
        <div className="space-y-3">
          <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-800">
            {[
              { id: "marketing", label: "Marketing Copy" },
              { id: "detailed", label: "Detailed" },
              { id: "short", label: "Short" },
              { id: "social", label: "Social Media" },
              { id: "whatsapp", label: "WhatsApp" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="relative p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs leading-relaxed text-slate-200">
            <p className="whitespace-pre-wrap">{descriptions[activeTab]}</p>
            <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleCopyText(descriptions[activeTab])}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
              >
                <FaCopy />
                {copied ? "Copied!" : "Copy Text"}
              </button>
              {onApplyDescription && (
                <button
                  type="button"
                  onClick={() => onApplyDescription(descriptions[activeTab])}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                >
                  <FaClipboardCheck />
                  Use Description
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIListingAssist;

