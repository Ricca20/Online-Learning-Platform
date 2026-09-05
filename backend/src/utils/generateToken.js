const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT for the given user ID.
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
