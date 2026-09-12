import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { FaWandMagicSparkles, FaHouse, FaKey, FaBuilding, FaUser, FaUsers, FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa6";

const AIFindMyHomeWizard = ({ isOpen, onClose, onApplyProfile }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    purpose: "buy",
    userType: "Family",
    priorities: ["Price", "Schools"],
    maxBudget: "80 Lakh",
    location: "",
  });

  const handlePriorityToggle = (item) => {
    setProfile((prev) => {
      const exists = prev.priorities.includes(item);
      const updated = exists ? prev.priorities.filter((p) => p !== item) : [...prev.priorities, item];
      return { ...prev, priorities: updated };
    });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinish = () => {
    const searchParams = {
      purpose: profile.purpose,
      type: profile.purpose,
      q: profile.location,
    };
    if (onApplyProfile) {
      onApplyProfile(searchParams, profile);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Guided 'Find My Home' Discovery" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Step Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-1.5">
            <span>Step {step} of 5</span>
            <span>{step * 20}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${step * 20}%` }} />
          </div>
        </div>

        {/* STEP 1: Purpose */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900">What are you looking to do?</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "buy", label: "Buy a Home", icon: FaHouse },
                { value: "rent", label: "Rent Property", icon: FaKey },
                { value: "commercial", label: "Commercial / Invest", icon: FaBuilding },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setProfile((prev) => ({ ...prev, purpose: opt.value }))}
                    className={`p-4 rounded-2xl border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center gap-2 ${
                      profile.purpose === opt.value
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Buyer Type */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900">Who is this property for?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Myself / Individual", val: "Individual" },
                { label: "Couple / Partner", val: "Couple" },
                { label: "Family", val: "Family" },
                { label: "Business / Commercial", val: "Business" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, userType: opt.val }))}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs transition cursor-pointer ${
                    profile.userType === opt.val
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Top Priorities */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900">What matters most to you?</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {["Price / Budget", "Location", "Space / Sq.Ft", "Nearby Schools", "Allocated Parking", "Good Connectivity"].map(
                (priority) => {
                  const active = profile.priorities.includes(priority);
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handlePriorityToggle(priority)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                        active
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {priority}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Budget */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900">What is your maximum target budget?</h3>
            <div className="space-y-2">
              {["Under ₹50 Lakh", "₹50 Lakh – ₹80 Lakh", "₹80 Lakh – ₹1.5 Crore", "Above ₹1.5 Crore"].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, maxBudget: b }))}
                  className={`w-full p-3.5 rounded-2xl border text-left font-bold text-xs transition cursor-pointer ${
                    profile.maxBudget === b
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Preferred Location & Summary */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900">Where are you looking to find properties?</h3>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Haldwani, Jaipur, Noida, Gurgaon"
              className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 focus:border-blue-600 outline-none"
            />
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1 text-xs">
              <p className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Your Property Profile</p>
              <p>
                Seeking <strong>{profile.purpose.toUpperCase()}</strong> property for <strong>{profile.userType}</strong>. Budget:{" "}
                <strong>{profile.maxBudget}</strong>. Key Priorities: <strong>{profile.priorities.join(", ")}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          {step > 1 ? (
            <Button variant="secondary" onClick={prevStep} icon={FaArrowLeft}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button variant="accent" onClick={nextStep} icon={FaArrowRight} iconPosition="right">
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleFinish} icon={FaWandMagicSparkles} iconPosition="right">
              Find Matching Properties
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AIFindMyHomeWizard;

