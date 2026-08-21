import Property from "../models/Property.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// @desc    Get all active properties
// @route   GET /api/properties
// @access  Public
export const getProperties = catchAsyncError(async (req, res, next) => {
  const properties = await Property.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(properties, "Properties fetched successfully."));
});

// @desc    Get all properties for admin (including inactive)
// @route   GET /api/properties/admin/all
// @access  Admin
export const getAllPropertiesAdmin = catchAsyncError(async (req, res, next) => {
  const properties = await Property.find({}).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(properties, "All properties fetched for admin."));
});

// @desc    Create a new property
// @route   POST /api/properties
// @access  Admin
export const createProperty = catchAsyncError(async (req, res, next) => {
  const property = await Property.create(req.body);
  res.status(201).json(new ApiResponse(property, "Property created successfully."));
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Admin
export const updateProperty = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedProperty) {
    return next(new ErrorHandler("Property not found.", 404));
  }
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
  res.status(200).json(new ApiResponse(null, "Property deleted successfully."));
});

// @desc    Search active properties
// @route   GET /api/properties/search
// @access  Public
export const searchProperties = catchAsyncError(async (req, res, next) => {
  const { q } = req.query;
  const query = q
    ? {
        isActive: true,
        $or: [
          { name: { $regex: q, $options: "i" } },
          { address: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      }
    : { isActive: true };

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
