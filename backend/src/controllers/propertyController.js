import Property from "../models/Property.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import {
  emitPropertyCreated,
  emitPropertyUpdated,
  emitPropertyDeleted,
} from "../socket.js";
import { initialPropertyDataset } from "../data/propertyDataset.js";

// @desc    Get all active properties
// @route   GET /api/properties
// @access  Public
export const getProperties = catchAsyncError(async (req, res, next) => {
  const { purpose, category, status } = req.query;
  const filter = { isActive: true };
  if (purpose) filter.purpose = purpose;
  if (category) filter.category = category;
  if (status) filter.status = status;

  const properties = await Property.find(filter).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(properties, "Properties fetched successfully."));
});

// @desc    Get all properties for admin (including inactive)
// @route   GET /api/properties/admin/all
// @access  Admin
export const getAllPropertiesAdmin = catchAsyncError(async (req, res, next) => {
  const properties = await Property.find({}).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(properties, "All properties fetched for admin."));
});

// Helper to process property images from body (URLs) and req.files (uploaded files)
const processPropertyPayload = (req) => {
  let urlImages = [];

  if (req.body.images) {
    if (Array.isArray(req.body.images)) {
      urlImages = req.body.images;
    } else if (typeof req.body.images === "string") {
      try {
        const parsed = JSON.parse(req.body.images);
        if (Array.isArray(parsed)) {
          urlImages = parsed;
        } else {
          urlImages = [req.body.images];
        }
      } catch {
        urlImages = req.body.images
          .split(/[\n,]/)
          .map((i) => i.trim())
          .filter(Boolean);
      }
    }
  }

  const uploadedFiles = req.files && Array.isArray(req.files) ? req.files : [];
  const uploadedPaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);

  const combinedImages = [...urlImages, ...uploadedPaths];

  const payload = {
    ...req.body,
    images: combinedImages,
  };

  if (payload.bed !== undefined) payload.bed = Number(payload.bed) || 0;
  if (payload.bath !== undefined) payload.bath = Number(payload.bath) || 0;
  if (payload.latitude !== undefined) {
    payload.latitude = payload.latitude === "" || payload.latitude === "null" || payload.latitude === "undefined" ? undefined : Number(payload.latitude);
  }
  if (payload.longitude !== undefined) {
    payload.longitude = payload.longitude === "" || payload.longitude === "null" || payload.longitude === "undefined" ? undefined : Number(payload.longitude);
  }
  if (payload.isActive !== undefined) {
    payload.isActive = payload.isActive === true || payload.isActive === "true";
  }
  if (payload.purpose) payload.purpose = String(payload.purpose).toLowerCase();
  if (payload.status) payload.status = String(payload.status).toLowerCase();

  return payload;
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Admin
export const createProperty = catchAsyncError(async (req, res, next) => {
  const payload = processPropertyPayload(req);
  const property = await Property.create(payload);
  emitPropertyCreated(property);
  res.status(201).json(new ApiResponse(property, "Property created successfully."));
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Admin
export const updateProperty = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const payload = processPropertyPayload(req);
  const updatedProperty = await Property.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedProperty) {
    return next(new ErrorHandler("Property not found.", 404));
  }
  emitPropertyUpdated(updatedProperty);
  res.status(200).json(new ApiResponse(updatedProperty, "Property updated successfully."));
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Admin
export const deleteProperty = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const property = await Property.findByIdAndDelete(id);
  if (!property) {
    return next(new ErrorHandler("Property not found.", 404));
  }
  emitPropertyDeleted(id);
  res.status(200).json(new ApiResponse(null, "Property deleted successfully."));
});

// @desc    Search active properties
// @route   GET /api/properties/search
// @access  Public
export const searchProperties = catchAsyncError(async (req, res, next) => {
  const { q, purpose, category, status, type } = req.query;

  const query = { isActive: true };

  if (purpose) {
    query.purpose = purpose.toLowerCase();
  } else if (type && ["buy", "rent", "commercial"].includes(type.toLowerCase())) {
    query.purpose = type.toLowerCase();
  }

  if (category) {
    const escapedCat = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.category = { $regex: new RegExp(escapedCat, "i") };
  }

  if (status) {
    query.status = status.toLowerCase();
  }

  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { address: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } },
      { category: { $regex: escaped, $options: "i" } },
      { purpose: { $regex: escaped, $options: "i" } },
    ];
  }

  const properties = await Property.find(query).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(properties, "Property search results fetched successfully."));
});

// @desc    Get a property by id
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return next(new ErrorHandler("Property not found.", 404));
  }

  res.status(200).json(new ApiResponse(property, "Property fetched successfully."));
});

// @desc    Seed 30 properties dynamically into database
// @route   POST /api/properties/admin/seed
// @access  Admin
export const seedProperties = catchAsyncError(async (req, res, next) => {
  const createdProperties = await Property.insertMany(initialPropertyDataset);
  createdProperties.forEach((p) => emitPropertyCreated(p));
  res.status(201).json(new ApiResponse(createdProperties, `${createdProperties.length} properties seeded dynamically into database.`));
});
