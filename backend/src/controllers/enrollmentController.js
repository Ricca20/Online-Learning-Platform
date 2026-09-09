const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * @desc    Enroll student in a course
 * @route   POST /api/v1/courses/:id/enroll
 * @access  Private (student only)
 */
const enrollInCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.user._id;

  // Check course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingEnrollment) {
    throw new ApiError(409, "You are already enrolled in this course");
  }

  // Create enrollment record
  await Enrollment.create({ student: studentId, course: courseId });

  // Push course to user's enrolledCourses
  await User.findByIdAndUpdate(studentId, {
    $addToSet: { enrolledCourses: courseId },
  });

  // Push student to course's enrolledStudents
  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { enrolledStudents: studentId },
  });

  ApiResponse.created(res, "Successfully enrolled in course!");
});

/**
 * @desc    Get all enrollments for the logged-in student
 * @route   GET /api/v1/enrollments/my
 * @access  Private (student only)
 */
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: "course",
      populate: { path: "instructor", select: "name email" },
    })
    .sort({ enrolledAt: -1 });

  ApiResponse.success(res, "Enrollments retrieved", { enrollments });
});

/**
 * @desc    Mark a course as completed
 * @route   PUT /api/v1/enrollments/:courseId/complete
 * @access  Private (student only)
 */
const markCourseCompleted = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  if (enrollment.status === "completed") {
    throw new ApiError(400, "Course is already marked as completed");
  }

  enrollment.status = "completed";
  await enrollment.save();

  ApiResponse.success(res, "Course marked as completed", { enrollment });
});

module.exports = { enrollInCourse, getMyEnrollments, markCourseCompleted };
