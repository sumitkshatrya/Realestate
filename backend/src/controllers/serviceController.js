// src/controllers/serviceController.js
import Service from "../models/Services.js";
import asyncHandler from "express-async-handler";
import multer from "../middleware/multer.js";

const upload = multer.single("image");
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .select("-__v");

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
export const createService = asyncHandler(async (req, res) => {
  const { title, description, icon, order, isActive } = req.body;

  const service = await Service.create({
    title,
    description,
    icon,
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    data: service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  // Soft delete by setting isActive to false
  service.isActive = false;
  await service.save();

  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
  });
});

// @desc    Get services by search
// @route   GET /api/services/search
// @access  Public
export const searchServices = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    res.status(400);
    throw new Error("Please provide a search query");
  }

  const services = await Service.find({
    isActive: true,
    $text: { $search: q },
  }).sort({ score: { $meta: "textScore" } });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});
