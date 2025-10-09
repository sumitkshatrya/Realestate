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

// GET - All testimonials (Admin)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
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
