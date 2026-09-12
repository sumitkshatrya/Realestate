import React, { useState } from "react";
import Modal from "./common/Modal";
import Input from "./common/Input";
import Button from "./common/Button";
import { contactAPI } from "../api/contactApi";
import toast from "react-hot-toast";
import { FaBuilding, FaLocationDot, FaBed, FaBath, FaIndianRupeeSign, FaCheck, FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import AIListingAssist from "./ai/AIListingAssist";

const SellPropertyWizardModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    purpose: "buy",
    category: "Luxury Apartment",
    name: "",
    address: "",
    price: "",
    bed: "3",
    bath: "2",
    area: "1450 sq.ft",
    description: "",
    images: "",
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.name) {
      toast.error("Please enter a title or property name.");
      return;
    }
    if (step === 2 && (!formData.address || !formData.price)) {
      toast.error("Please fill in location address and expected price.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sellerName || !formData.sellerEmail || !formData.sellerPhone) {
      toast.error("Please enter your contact details so our team can contact you.");
      return;
    }

    setSubmitting(true);
    try {
      const messageContent = `[SELL / LISTING REQUEST]
Property Name: ${formData.name}
Purpose: ${formData.purpose}
Category: ${formData.category}
Address: ${formData.address}
Price: ${formData.price}
Specs: ${formData.bed} Beds | ${formData.bath} Baths | Area: ${formData.area}
Images: ${formData.images || "N/A"}
Description: ${formData.description || "N/A"}
Seller Name: ${formData.sellerName}
Phone: ${formData.sellerPhone}
Email: ${formData.sellerEmail}`;

      await contactAPI.submitContactForm({
        name: formData.sellerName,
        email: formData.sellerEmail,
        phone: formData.sellerPhone,
        subject: `Property Listing Request: ${formData.name}`,
        message: messageContent,
      });

      setSubmitted(true);
      toast.success("Listing request submitted! Our real estate specialist will verify details shortly.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit property listing request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSubmitted(false);
    setFormData({
      purpose: "buy",
      category: "Luxury Apartment",
      name: "",
      address: "",
      price: "",
      bed: "3",
      bath: "2",
      area: "1450 sq.ft",
      description: "",
      images: "",
      sellerName: "",
      sellerPhone: "",
      sellerEmail: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="List Your Property for Sale / Rent" maxWidth="max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase mb-2">
          <span>Step {step} of 4: {step === 1 ? "Property Intent" : step === 2 ? "Location & Price" : step === 3 ? "Details & Media" : "Contact & Review"}</span>
          <span>{step * 25}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${step * 25}%` }} />
        </div>
      </div>

      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            <FaCheck />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Property Submitted Successfully!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Thank you for listing with PropsEstate. Our certified valuation agent will review your property details and contact you within 24 hours.
          </p>
          <Button variant="primary" onClick={handleResetAndClose} className="mt-4">
            Done & Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">What do you want to do?</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "buy", label: "Sell Property" },
                  { value: "rent", label: "Rent Out Property" },
                  { value: "commercial", label: "Sell Commercial" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setFormData((prev) => ({ ...prev, purpose: opt.value }))}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold uppercase transition text-center cursor-pointer ${
                      formData.purpose === opt.value
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <Input
                label="Property Name / Headline"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Modern 3 BHK Villa in Green Park"
                icon={FaBuilding}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none"
                >
                  <option value="Luxury Apartment">Luxury Apartment</option>
                  <option value="Private Villa / House">Private Villa / House</option>
                  <option value="Penthouse / Condo">Penthouse / Condo</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Townhome">Townhome</option>
                  <option value="Commercial Space">Commercial Space</option>
                  <option value="Office">Office</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <Input
                label="Full Address & City"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 102 Park Avenue, Haldwani, Uttarakhand"
                icon={FaLocationDot}
                required
              />

              <Input
                label="Expected Price / Rental Amount"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. ₹85 Lakh or ₹35,000/month"
                icon={FaIndianRupeeSign}
                required
              />
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-3 gap-3">
                <Input label="Bedrooms" name="bed" type="number" value={formData.bed} onChange={handleChange} icon={FaBed} />
                <Input label="Bathrooms" name="bath" type="number" value={formData.bath} onChange={handleChange} icon={FaBath} />
                <Input label="Total Area" name="area" value={formData.area} onChange={handleChange} placeholder="1450 sq.ft" />
              </div>

              <Input
                label="Image URL (Comma-separated for multiple)"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                helperText="Provide direct image link URLs"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Description / Highlights</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property highlights, nearby landmarks, parking, and furnishing status..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none resize-none"
                />
              </div>

              {/* AI Listing Copy Assistant & Score */}
              <AIListingAssist
                formData={formData}
                onApplyDescription={(generatedText) => {
                  setFormData((prev) => ({ ...prev, description: generatedText }));
                  toast.success("Applied AI description to your listing!");
                }}
              />
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Contact Information</h4>
              <Input label="Full Name" name="sellerName" value={formData.sellerName} onChange={handleChange} placeholder="John Doe" required />
              <Input label="Phone Number" name="sellerPhone" value={formData.sellerPhone} onChange={handleChange} placeholder="+91 98765 43210" required />
              <Input label="Email Address" name="sellerEmail" type="email" value={formData.sellerEmail} onChange={handleChange} placeholder="john@example.com" required />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
            {step > 1 ? (
              <Button variant="secondary" onClick={prevStep} icon={FaArrowLeft}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button variant="accent" onClick={nextStep} icon={FaArrowRight} iconPosition="right">
                Continue
              </Button>
            ) : (
              <Button type="submit" variant="primary" isLoading={submitting} icon={FaCheck} iconPosition="right">
                Submit Listing
              </Button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
};

export default SellPropertyWizardModal;
