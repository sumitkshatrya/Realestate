// src/models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    icon: {
      type: String,
      required: [true, "Service icon is required"],
      enum: [
        "FaHome",
        "FaKey",
        "FaMapMarkerAlt",
        "FaChartLine",
        "FaHardHat",
        "FaShieldAlt",
        "FaBuilding",
        "FaSearchDollar",
        "FaHandshake",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive : {type : Boolean
      
    }
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
serviceSchema.index({ title: "text", description: "text" });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
