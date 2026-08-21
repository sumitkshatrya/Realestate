import Service from "../models/Service.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// @desc    Get all active services
// @route   GET /api/services
// @access  Public (with ?includeInactive=true for admin)
export const getServices = catchAsyncError(async (req, res, next) => {
  const { includeInactive } = req.query;
  const filter = includeInactive === "true" ? {} : { isActive: true };
  const services = await Service.find(filter).sort({ order: 1 });
  res.status(200).json(new ApiResponse(services, "Services fetched successfully."));
});

// @desc    Get a single service by id
// @route   GET /api/services/:id
// @access  Public
export const getService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    return next(new ErrorHandler("Service not found.", 404));
  }

  res.status(200).json(new ApiResponse(service, "Service fetched successfully."));
});

// @desc    Search services by query
// @route   GET /api/services/search
// @access  Public
export const searchServices = catchAsyncError(async (req, res, next) => {
  const { q } = req.query;
  const query = q
    ? {
        isActive: true,
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      }
    : { isActive: true };

  const services = await Service.find(query).sort({ order: 1 });
  res.status(200).json(new ApiResponse(services, "Services search results fetched successfully."));
});

// @desc    Get all services (for admin)
// @route   GET /api/services/all
// @access  Admin
export const getAllServicesForAdmin = catchAsyncError(async (req, res, next) => {
  const services = await Service.find({}).sort({ order: 1 });
  res.status(200).json(new ApiResponse(services, "All services fetched for admin."));
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
export const createService = catchAsyncError(async (req, res, next) => {
  const service = await Service.create(req.body);
  res.status(201).json(new ApiResponse(service, "Service created successfully."));
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Admin
export const updateService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedService = await Service.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedService) {
    return next(new ErrorHandler("Service not found.", 404));
  }

  res.status(200).json(new ApiResponse(updatedService, "Service updated successfully."));
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Admin
export const deleteService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const service = await Service.findByIdAndDelete(id);

  if (!service) {
    return next(new ErrorHandler("Service not found.", 404));
  }

  res.status(200).json(new ApiResponse(null, "Service deleted successfully."));
});