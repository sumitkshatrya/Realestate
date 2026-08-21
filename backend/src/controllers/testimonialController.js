 import Testimonial from "../models/Testimonial.js";

export const createTestimonial = async (req, res) => {
  try {
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

    res.status(201).json({
      message: "Testimonial submitted successfully",
      testimonial,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET - Approved testimonials (Public) with Pagination
export const getApprovedTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Testimonial.countDocuments({ status: "Approved" });
    const testimonials = await Testimonial.find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      testimonials,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET - Rating summary (average & total) for approved testimonials
export const getRatingSummary = async (req, res) => {
  try {
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

    res.json(stats[0] || { avgRating: 0, total: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET - Testimonial by ID (Public)
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET - All testimonials (Admin) with pagination, search, filter, sort
export const getAllTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, sortField, sortOrder } = req.query;

    // Build filter
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { feedback: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
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

    res.json({ data: testimonials, totalCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST - Bulk update status (Admin)
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status, filters } = req.body;

    let query = {};
    if (ids && ids.length > 0) {
      query._id = { $in: ids };
    } else if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.search) {
        query.$or = [
          { fullName: { $regex: filters.search, $options: "i" } },
          { email: { $regex: filters.search, $options: "i" } },
          { title: { $regex: filters.search, $options: "i" } },
          { feedback: { $regex: filters.search, $options: "i" } },
        ];
      }
    } else {
      return res.status(400).json({ error: "No ids or filters provided" });
    }

    const result = await Testimonial.updateMany(query, { status });
    res.json({ message: `${result.modifiedCount} testimonials updated`, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST - Bulk delete (Admin)
export const bulkDelete = async (req, res) => {
  try {
    const { ids, filters } = req.body;

    let query = {};
    if (ids && ids.length > 0) {
      query._id = { $in: ids };
    } else if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.search) {
        query.$or = [
          { fullName: { $regex: filters.search, $options: "i" } },
          { email: { $regex: filters.search, $options: "i" } },
          { title: { $regex: filters.search, $options: "i" } },
          { feedback: { $regex: filters.search, $options: "i" } },
        ];
      }
    } else {
      return res.status(400).json({ error: "No ids or filters provided" });
    }

    const result = await Testimonial.deleteMany(query);
    res.json({ message: `${result.deletedCount} testimonials deleted`, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Approve / Reject (Admin)
export const updateStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    testimonial.status = req.body.status;
    await testimonial.save();

    res.json({ message: "Status updated", testimonial });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove testimonial (Admin)
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
