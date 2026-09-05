const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCourseEnrollments,
} = require("../controllers/courseController");
const { enrollInCourse, getMyEnrollments } = require("../controllers/enrollmentController");
const { verifyToken, authorise } = require("../middleware/authMiddleware");

// ──────── Public Routes ────────
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// ──────── Instructor Routes ────────
// NOTE: /my must be defined BEFORE /:id to prevent "my" being treated as an id param
router.get("/my", verifyToken, authorise("instructor"), getInstructorCourses);
router.post("/", verifyToken, authorise("instructor"), createCourse);
router.put("/:id", verifyToken, authorise("instructor"), updateCourse);
router.delete("/:id", verifyToken, authorise("instructor"), deleteCourse);
router.get("/:id/enrollments", verifyToken, authorise("instructor"), getCourseEnrollments);

// ──────── Student Routes ────────
router.post("/:id/enroll", verifyToken, authorise("student"), enrollInCourse);

module.exports = router;
