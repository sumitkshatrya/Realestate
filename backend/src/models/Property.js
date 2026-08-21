import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Property name is required."],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, "Property address is required."],
    },
    price: {
      type: String,
      required: [true, "Property price is required."],
    },
    bed: {
      type: Number,
      default: 0,
    },
    bath: {
      type: Number,
      default: 0,
    },
    area: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);
