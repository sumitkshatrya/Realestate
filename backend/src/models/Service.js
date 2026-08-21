import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required."],
    },
    icon: {
      type: String,
      required: [true, "An icon name is required."],
      // You can add an enum to restrict to valid icon names from your iconMap
      // enum: ['FaHome', 'FaKey', 'FaMapMarkerAlt', ...],
    },
    slug: {
      type: String,
      unique: true,
      // A slug can be auto-generated from the title in a pre-save hook if desired
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);