const express = require("express");
const router = express.Router();
const { getMyEnrollments, markCourseCompleted } = require("../controllers/enrollmentController");
const { verifyToken, authorise } = require("../middleware/authMiddleware");

// GET /api/v1/enrollments/my — get logged-in student's enrollments
router.get("/my", verifyToken, authorise("student"), getMyEnrollments);

// PUT /api/v1/enrollments/:courseId/complete — mark course as completed
router.put("/:courseId/complete", verifyToken, authorise("student"), markCourseCompleted);

module.exports = router;
