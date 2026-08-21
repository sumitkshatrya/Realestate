import mongoose from "mongoose";

const popularAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Area name is required."],
      trim: true,
    },
    propertyCount: {
      type: String,
      required: [true, "Property count is required."],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PopularArea", popularAreaSchema);