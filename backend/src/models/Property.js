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
    purpose: {
      type: String,
      enum: ["buy", "rent", "commercial"],
      default: "buy",
    },
    category: {
      type: String,
      enum: [
        "Luxury Apartment",
        "Private Villa / House",
        "Penthouse / Condo",
        "Duplex",
        "Townhome",
        "Commercial Space",
        "Office",
        "Retail",
        "Other",
      ],
      default: "Luxury Apartment",
    },
    status: {
      type: String,
      enum: ["available", "booked", "rented", "sold"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);
