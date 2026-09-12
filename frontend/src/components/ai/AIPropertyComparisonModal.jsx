import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { aiAPI } from "../../api/aiApi";
import { FaScaleUnbalanced, FaCheck, FaBuilding, FaBed, FaBath, FaIndianRupeeSign, FaCircleInfo, FaWandMagicSparkles } from "react-icons/fa6";

const AIPropertyComparisonModal = ({ isOpen, onClose, selectedProperties = [] }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || selectedProperties.length < 2) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await aiAPI.compareProperties(selectedProperties);
        setComparisonData(res?.data || res);
      } catch (err) {
        console.error("Comparison error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [isOpen, selectedProperties]);

  if (selectedProperties.length < 2) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Compare Properties with AI" maxWidth="max-w-xl">
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            <FaScaleUnbalanced />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Select Properties to Compare</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Please check the compare checkbox on at least 2 property cards to view a side-by-side comparison.
          </p>
          <Button variant="primary" onClick={onClose}>
            Close & Select Properties
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Multi-Property Comparison" maxWidth="max-w-5xl">
      <div className="space-y-6">
        {/* Legend for Fact vs Estimate vs Recommendation */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Data Classification Legend:</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full text-[10px]">
              FACT (Verified Record)
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full text-[10px]">
              ESTIMATE (AI Calculation)
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
              RECOMMENDATION (Preference Fit)
            </span>
          </div>
        </div>

        {/* AI Recommendation Box */}
        {comparisonData?.recommendation && (
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <FaWandMagicSparkles />
              AI Recommendation Summary
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {comparisonData.recommendation.summary}
            </p>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] w-44">Attribute</th>
                {selectedProperties.map((prop, idx) => (
                  <th key={prop._id || idx} className="p-3.5 font-bold text-sm min-w-[200px]">
                    <div className="line-clamp-1">{prop.name}</div>
                    <span className="text-[10px] font-normal text-amber-400 block mt-0.5">{prop.address}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Row: Price */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50">
                  Asking Price <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">FACT</span>
                </td>
                {selectedProperties.map((prop) => (
                  <td key={prop._id} className="p-3.5 font-black text-slate-900 text-sm">
                    {prop.price || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Row: Purpose */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50">
                  Purpose / Intent <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">FACT</span>
                </td>
                {selectedProperties.map((prop) => (
                  <td key={prop._id} className="p-3.5 font-bold uppercase text-blue-600">
                    {prop.purpose || "buy"}
                  </td>
                ))}
              </tr>

              {/* Row: Category */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50">
                  Category <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">FACT</span>
                </td>
                {selectedProperties.map((prop) => (
                  <td key={prop._id} className="p-3.5 text-slate-800 font-semibold">
                    {prop.category || "Luxury Apartment"}
                  </td>
                ))}
              </tr>

              {/* Row: Bedrooms & Bathrooms */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50">
                  Bedrooms / Bathrooms <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">FACT</span>
                </td>
                {selectedProperties.map((prop) => (
                  <td key={prop._id} className="p-3.5 font-semibold text-slate-800">
                    {prop.bed || 0} Beds / {prop.bath || 0} Baths
                  </td>
                ))}
              </tr>

              {/* Row: Total Floor Area */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50">
                  Floor Area <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">FACT</span>
                </td>
                {selectedProperties.map((prop) => (
                  <td key={prop._id} className="p-3.5 text-slate-800">
                    {prop.area || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Row: Availability Status */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50">
                  Status <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">FACT</span>
                </td>
                {selectedProperties.map((prop) => (
                  <td key={prop._id} className="p-3.5 font-extrabold uppercase text-emerald-600">
                    {prop.status || "available"}
                  </td>
                ))}
              </tr>

              {/* Row: AI Value Assessment */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50">
                  AI Value Rating <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">ESTIMATE</span>
                </td>
                {selectedProperties.map((prop) => (
                  <td key={prop._id} className="p-3.5 text-slate-700 font-medium">
                    Competitive Market Positioning
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default AIPropertyComparisonModal;

