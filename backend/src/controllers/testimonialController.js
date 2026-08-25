import Testimonial from "../models/Testimonial.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import ApiResponse from "../utils/ApiResponse.js";

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createTestimonial = catchAsyncError(async (req, res, next) => {
  const { fullName, email, rating, title, feedback, consent } = req.body;

  const profilePicture = req.files?.profilePicture
    ? `/uploads/${req.files.profilePicture[0].filename}`
    : null;

  const mediaUrl = req.files?.media
    ? `/uploads/${req.files.media[0].filename}`
    : null;

  const testimonial = new Testimonial({
    fullName,
    email,
    rating,
    title,
    feedback,
    consent,
    profilePicture,
    mediaUrl,
  });

  await testimonial.save();

  res.status(201).json(new ApiResponse(testimonial, "Testimonial submitted successfully", 201));
});

// GET - Approved testimonials (Public) with Pagination
export const getApprovedTestimonials = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const total = await Testimonial.countDocuments({ status: "Approved" });
  const testimonials = await Testimonial.find({ status: "Approved" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        testimonials,
      },
      "Approved testimonials fetched successfully",
      200
    )
  );
});

// GET - Rating summary (average & total) for approved testimonials
export const getRatingSummary = catchAsyncError(async (req, res, next) => {
  const stats = await Testimonial.aggregate([
    { $match: { status: "Approved" } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        total: { $sum: 1 },
      },
    },
  ]);

  const summary = stats[0] || { avgRating: 0, total: 0 };
  res.status(200).json(new ApiResponse(summary, "Rating summary fetched successfully", 200));
});

// GET - Testimonial by ID (Public)
export const getTestimonialById = catchAsyncError(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }
  res.status(200).json(new ApiResponse(testimonial, "Testimonial fetched successfully", 200));
});

// GET - All testimonials (Admin) with pagination, search, filter, sort
export const getAllTestimonials = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, sortField, sortOrder } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (search) {
    const escaped = escapeRegex(search);
    filter.$or = [
      { fullName: { $regex: escaped, $options: "i" } },
      { email: { $regex: escaped, $options: "i" } },
      { title: { $regex: escaped, $options: "i" } },
      { feedback: { $regex: escaped, $options: "i" } },
    ];
  }

  const sort = {};
  if (sortField) {
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
  } else {
    sort.createdAt = -1;
  }

  const totalCount = await Testimonial.countDocuments(filter);
  const testimonials = await Testimonial.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse({ data: testimonials, totalCount }, "Testimonials fetched successfully", 200)
  );
});

// POST - Bulk update status (Admin)
export const bulkUpdateStatus = catchAsyncError(async (req, res, next) => {
  const { ids, status, filters } = req.body;

  let query = {};
  if (ids && ids.length > 0) {
    query._id = { $in: ids };
  } else if (filters) {
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      const escaped = escapeRegex(filters.search);
      query.$or = [
        { fullName: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
        { title: { $regex: escaped, $options: "i" } },
        { feedback: { $regex: escaped, $options: "i" } },
      ];
    }
  } else {
    return next(new ErrorHandler("No ids or filters provided", 400));
  }

  const result = await Testimonial.updateMany(query, { status });
  res.status(200).json(
    new ApiResponse(
      { modifiedCount: result.modifiedCount },
      `${result.modifiedCount} testimonials updated`,
      200
    )
  );
});

// POST - Bulk delete (Admin)
export const bulkDelete = catchAsyncError(async (req, res, next) => {
  const { ids, filters } = req.body;

  let query = {};
  if (ids && ids.length > 0) {
    query._id = { $in: ids };
  } else if (filters) {
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      const escaped = escapeRegex(filters.search);
      query.$or = [
        { fullName: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
        { title: { $regex: escaped, $options: "i" } },
        { feedback: { $regex: escaped, $options: "i" } },
      ];
    }
  } else {
    return next(new ErrorHandler("No ids or filters provided", 400));
  }

  const result = await Testimonial.deleteMany(query);
  res.status(200).json(
    new ApiResponse(
      { deletedCount: result.deletedCount },
      `${result.deletedCount} testimonials deleted`,
      200
    )
  );
});

// UPDATE - Approve / Reject (Admin)
export const updateStatus = catchAsyncError(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }

  testimonial.status = req.body.status;
  await testimonial.save();

  res.status(200).json(new ApiResponse(testimonial, "Status updated successfully", 200));
});

// DELETE - Remove testimonial (Admin)
export const deleteTestimonial = catchAsyncError(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }
  res.status(200).json(new ApiResponse(null, "Testimonial deleted successfully", 200));
});

