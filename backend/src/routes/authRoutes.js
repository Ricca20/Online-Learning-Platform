const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/v1/auth/register
router.post("/register", register);

// POST /api/v1/auth/login
router.post("/login", login);

// GET /api/v1/auth/me (protected)
router.get("/me", verifyToken, getMe);

module.exports = router;
