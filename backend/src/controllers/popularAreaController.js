import PopularArea from "../models/PopularArea.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// @desc    Get all active popular areas (or all for admin if includeInactive=true)
// @route   GET /api/popular-areas
// @access  Public
export const getPopularAreas = catchAsyncError(async (req, res, next) => {
  const { includeInactive } = req.query;
  const filter = includeInactive === "true" ? {} : { isActive: true };
  const areas = await PopularArea.find(filter).sort({ name: 1 });
  res.status(200).json(new ApiResponse(areas, "Popular areas fetched successfully."));
});

// @desc    Create a popular area
// @route   POST /api/popular-areas
// @access  Admin
export const createPopularArea = catchAsyncError(async (req, res, next) => {
  const { name, propertyCount, imageUrl } = req.body;
  const area = await PopularArea.create({ name, propertyCount, imageUrl });
  res.status(201).json(new ApiResponse(area, "Popular area created successfully."));
});

// @desc    Update a popular area
// @route   PUT /api/popular-areas/:id
// @access  Admin
export const updatePopularArea = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedArea = await PopularArea.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedArea) {
    return next(new ErrorHandler("Area not found.", 404));
  }

  res.status(200).json(new ApiResponse(updatedArea, "Popular area updated successfully."));
});

// @desc    Delete a popular area
// @route   DELETE /api/popular-areas/:id
// @access  Admin
export const deletePopularArea = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const area = await PopularArea.findByIdAndDelete(id);

  if (!area) {
    return next(new ErrorHandler("Area not found.", 404));
  }

  res.status(200).json(new ApiResponse(null, "Popular area deleted successfully."));
});