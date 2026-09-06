const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
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
const validate = require("../middleware/validate");

const courseValidation = [
  body("title").notEmpty().withMessage("Course title is required").isLength({ max: 100 }).withMessage("Title must be under 100 characters").trim(),
  body("description").notEmpty().withMessage("Course description is required"),
];

// ──────── Public Routes ────────
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// ──────── Instructor Routes ────────
// NOTE: /my must be defined BEFORE /:id to prevent "my" being treated as an id param
router.get("/my", verifyToken, authorise("instructor"), getInstructorCourses);
router.post("/", verifyToken, authorise("instructor"), courseValidation, validate, createCourse);
router.put("/:id", verifyToken, authorise("instructor"), courseValidation, validate, updateCourse);
router.delete("/:id", verifyToken, authorise("instructor"), deleteCourse);
router.get("/:id/enrollments", verifyToken, authorise("instructor"), getCourseEnrollments);

// ──────── Student Routes ────────
router.post("/:id/enroll", verifyToken, authorise("student"), enrollInCourse);

module.exports = router;
