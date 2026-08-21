import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const { search, status } = req.query;

  const filter = {};
  if (status === "verified" || status === "unverified") {
    filter.accountVerified = status === "verified";
  }
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password -verificationCode -verificationCodeExpire -resetPassword -resetPasswordExpire")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(users, "Users fetched successfully."));
});

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Admin
export const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const allowedFields = ["username", "email", "phone", "accountVerified"];

  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -verificationCode -verificationCodeExpire -resetPassword -resetPasswordExpire");

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json(new ApiResponse(user, "User updated successfully."));
});

// @desc    Toggle a user's account verification status
// @route   PUT /api/admin/users/:id/status
// @access  Admin
export const toggleUserStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  user.accountVerified = !user.accountVerified;
  await user.save();

  res.status(200).json(
    new ApiResponse(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        accountVerified: user.accountVerified,
      },
      user.accountVerified ? "User verified successfully." : "User unverified successfully."
    )
  );
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  res.status(200).json(new ApiResponse(null, "User deleted successfully."));
});

