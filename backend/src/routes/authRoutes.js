const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

// POST /api/v1/auth/register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["student", "instructor"]).withMessage("Invalid role"),
  ],
  validate,
  register
);

// POST /api/v1/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// GET /api/v1/auth/me (protected)
router.get("/me", verifyToken, getMe);

module.exports = router;
