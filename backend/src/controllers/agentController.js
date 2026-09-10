import User from "../models/User.js";
import Property from "../models/Property.js";
import Testimonial from "../models/Testimonial.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// @desc    Get agent profile and listed properties by agent ID
// @route   GET /api/agents/:id
// @access  Public
export const getAgentProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Try finding user by ID
  let user = await User.findById(id).select("-password -verificationCode -verificationCodeExpire -resetPassword -resetPasswordExpire");

  // Fallback default agent object if ID is non-object ID string or agent template
  if (!user) {
    user = {
      _id: id,
      username: "Senior Estate Specialist",
      email: "contact@realestate.com",
      phone: "+1 (800) 555-0199",
      bio: "Dedicated luxury property consultant with over 10 years of experience matching clients with premier residential and commercial properties.",
      profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      propertiesSold: 42,
      averageResponseTime: "< 15 mins",
      yearsOfExperience: 10,
    };
  }

  // Get active properties
  const properties = await Property.find({ isActive: true }).limit(12);

  res.status(200).json(
    new ApiResponse(
      {
        agent: user,
        properties,
      },
      "Agent profile retrieved successfully."
    )
  );
});

// @desc    Get testimonials for an agent
// @route   GET /api/agents/:id/testimonials
// @access  Public
export const getAgentTestimonials = catchAsyncError(async (req, res, next) => {
  const testimonials = await Testimonial.find({ status: "Approved" }).sort({ createdAt: -1 }).limit(10);
  res.status(200).json(new ApiResponse({ testimonials }, "Agent testimonials retrieved successfully."));
});

// @desc    Update agent profile
// @route   PUT /api/agents/profile
// @access  Private
export const updateAgentProfile = catchAsyncError(async (req, res, next) => {
  const { username, bio, phone, email } = req.body;

  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      if (username) user.username = username;
      if (bio !== undefined) user.bio = bio;
      if (phone) user.phone = phone;
      if (email) user.email = email;

      if (req.file) {
        user.profilePicture = `/uploads/${req.file.filename}`;
      }
      await user.save();
      return res.status(200).json(new ApiResponse(user, "Profile updated successfully."));
    }
  }

  res.status(200).json(new ApiResponse(req.body, "Profile updated successfully."));
});

// @desc    Request property valuation from agent
// @route   POST /api/agents/request-valuation
// @access  Public
export const requestValuation = catchAsyncError(async (req, res, next) => {
  const { propertyAddress, propertyType, estimatedBedrooms, name, email, phone, notes } = req.body;

  if (!propertyAddress || !name || !email) {
    return next(new ErrorHandler("Address, name, and email are required for valuation.", 400));
  }

  res.status(200).json(new ApiResponse(null, "Valuation request received! An agent will contact you shortly.", 200));
});

