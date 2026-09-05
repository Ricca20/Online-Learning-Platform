const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

/**
 * Verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access denied. No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

/**
 * Role-based access control middleware.
 * Checks if req.user.role is in the allowed roles list.
 * Must be used AFTER verifyToken.
 *
 * @param  {...string} roles - Allowed roles (e.g. 'instructor', 'student')
 */
const authorise = (...roles) => {
  return async (req, res, next) => {
    // verifyToken only sets id, so we need to look up the full user
    const User = require("../models/User");
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!roles.includes(user.role)) {
      throw new ApiError(403, `Role '${user.role}' is not authorised to access this resource`);
    }

    // Attach full user object to req.user for downstream use
    req.user = user;
    next();
  };
};

module.exports = { verifyToken, authorise };
