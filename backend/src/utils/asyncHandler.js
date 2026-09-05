/**
 * Wraps an async route handler to catch errors and forward them to Express error handler.
 * In Express 5, async errors are natively caught, but this wrapper provides
 * explicit error forwarding for consistency and clarity.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
