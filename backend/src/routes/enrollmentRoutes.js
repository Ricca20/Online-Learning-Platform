const express = require("express");
const router = express.Router();
const { getMyEnrollments } = require("../controllers/enrollmentController");
const { verifyToken, authorise } = require("../middleware/authMiddleware");

// GET /api/v1/enrollments/my — get logged-in student's enrollments
router.get("/my", verifyToken, authorise("student"), getMyEnrollments);

module.exports = router;
