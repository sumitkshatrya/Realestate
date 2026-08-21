import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyName: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    preferredDate: { type: Date, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
