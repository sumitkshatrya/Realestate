import { useState } from "react";
import React from "react";
import { submitTestimonial } from "../api/testimonialApi";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["User Info", "Rating", "Content", "Consent"];

export default function SubmitTestimonial() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    designation: "",
    companyName: "",
    rating: 0,
    title: "",
    feedback: "",
    consent: false,
  });
  const [profileFile, setProfileFile] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const next = () => step < steps.length - 1 && setStep(step + 1);
  const back = () => step > 0 && setStep(step - 1);

  const handleSubmit = async () => {
    if (!form.consent) {
      alert("Please give consent to submit your testimonial.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      if (profileFile) formData.append("profilePicture", profileFile);
      if (mediaFile) formData.append("media", mediaFile);

      await submitTestimonial(formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setForm({
        fullName: "",
        email: "",
        designation: "",
        companyName: "",
        rating: 0,
        title: "",
        feedback: "",
        consent: false,
      });
      setProfileFile(null);
      setMediaFile(null);
      setStep(0);
    } catch (err) {
      console.error(err);
      alert("❌ Submission failed!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 relative">
      <h2 className="text-3xl font-bold mb-4 text-center text-red-600">
        Submit Your Testimonial
      </h2>

      {/* Progress Bar */}
      <div className="flex items-center mb-6">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <div className="relative">
              <div
                className={`w-full h-2 rounded-full ${
                  i <= step ? "bg-red-500" : "bg-gray-300"
                } transition-all duration-300`}
              />
              <span
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= step
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {i + 1}
              </span>
            </div>
            <p className="text-center mt-2 text-sm font-medium">{s}</p>
          </div>
        ))}
      </div>

      {/* Step Form */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1 - User Info */}
        {step === 0 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
            <input
              type="email"
              placeholder="Email *"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <input
              type="text"
              placeholder="Designation"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
            />
            <input
              type="text"
              placeholder="Company Name"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
            <label className="block font-medium">Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              className="border p-2 w-full rounded-lg"
              onChange={(e) => setProfileFile(e.target.files[0])}
            />
            {profileFile && (
              <p className="text-sm text-gray-600">
                Selected: {profileFile.name}
              </p>
            )}
          </div>
        )}

        {/* Step 2 - Rating */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block font-medium">Rating:</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleChange("rating", star)}
                  className={`cursor-pointer text-4xl ${
                    form.rating >= star ? "text-yellow-400" : "text-gray-300"
                  } transition transform hover:scale-110`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Selected: {form.rating} star{form.rating > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Step 3 - Content */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title *"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <textarea
              placeholder="Detailed Feedback *"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              rows={4}
              value={form.feedback}
              onChange={(e) => handleChange("feedback", e.target.value)}
            />
            <label className="block font-medium">Attach Media:</label>
            <input
              type="file"
              accept="image/*,video/*"
              className="border p-2 w-full rounded-lg"
              onChange={(e) => setMediaFile(e.target.files[0])}
            />
            {mediaFile && (
              <p className="text-sm text-gray-600">
                Selected: {mediaFile.name}
              </p>
            )}
          </div>
        )}

        {/* Step 4 - Consent */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => handleChange("consent", e.target.checked)}
                className="w-5 h-5 accent-red-500"
              />
              <span className="text-gray-700 font-medium">
                I consent to my testimonial being published.
              </span>
            </label>
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button
            onClick={back}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            onClick={next}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            Submit
          </button>
        )}
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <div className="text-green-500 text-6xl mb-4 animate-bounce">
                ✔️
              </div>
              <h3 className="text-3xl font-bold mb-2 text-center text-gray-800">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Your testimonial has been submitted successfully.
              </p>
              <motion.div
                className="text-green-500 text-6xl animate-bounce"
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                ⬇️
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
