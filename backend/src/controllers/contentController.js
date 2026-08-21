import AboutContent from "../models/AboutContent.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// @desc    Get the about page content
// @route   GET /api/content/about
// @access  Public
export const getAboutContent = catchAsyncError(async (req, res, next) => {
  let content = await AboutContent.findOne({ singleton: "about" });

  // If no content exists, create and return the default document
  if (!content) {
    content = await AboutContent.create({});
  }

  res.status(200).json(new ApiResponse(content, "About content fetched successfully."));
});

// @desc    Update the about page content
// @route   PUT /api/content/about
// @access  Admin
export const updateAboutContent = catchAsyncError(async (req, res, next) => {
  const content = await AboutContent.findOneAndUpdate({ singleton: "about" }, req.body, {
    new: true,
    upsert: true, // Create the document if it doesn't exist
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(content, "About content updated successfully."));
});