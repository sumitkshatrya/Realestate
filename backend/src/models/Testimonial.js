import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String },
    companyName: { type: String },
    profilePicture: { type: String }, // for profile photo
    mediaUrl: { type: String }, // for testimonial media
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, required: true },
    feedback: { type: String, required: true },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
