const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * @desc    Get public user profile
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("name email role createdAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  ApiResponse.success(res, "User profile retrieved", { user });
});

module.exports = { getUserProfile };
