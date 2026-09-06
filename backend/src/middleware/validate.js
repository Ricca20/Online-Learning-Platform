const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

/**
 * Middleware to run validationResult and throw ApiError if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get the first error message
    const message = errors.array()[0].msg;
    throw new ApiError(400, message);
  }
  next();
};

module.exports = validate;
