import Tour from "../models/Tour.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import ApiResponse from "../utils/ApiResponse.js";

// @desc    Schedule a tour
// @route   POST /api/tours/schedule
// @access  Public (with auth)
export const scheduleTour = catchAsyncError(async (req, res, next) => {
  const { propertyId, propertyName, name, email, phone, preferredDate, message } = req.body;

  if (!propertyId || !name || !email || !preferredDate) {
    return next(new ErrorHandler("Property, name, email, and preferred date are required", 400));
  }

  const tour = await Tour.create({
    propertyId,
    propertyName,
    name,
    email,
    phone,
    preferredDate,
    message,
  });

  res.status(201).json(new ApiResponse(tour, "Tour scheduled successfully", 201));
});

// @desc    Get all tour requests (Admin)
// @route   GET /api/tours
// @access  Admin
export const getAllTours = catchAsyncError(async (req, res, next) => {
  const tours = await Tour.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(tours, "Tours fetched successfully", 200));
});

// @desc    Update tour status (Admin)
// @route   PUT /api/tours/:id/status
// @access  Admin
export const updateTourStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const tour = await Tour.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!tour) {
    return next(new ErrorHandler("Tour not found", 404));
  }

  res.status(200).json(new ApiResponse(tour, "Tour status updated", 200));
});

// @desc    Delete a tour request (Admin)
// @route   DELETE /api/tours/:id
// @access  Admin
export const deleteTour = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new ErrorHandler("Tour not found", 404));
  }

  res.status(200).json(new ApiResponse(null, "Tour deleted successfully", 200));
});

