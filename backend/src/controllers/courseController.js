const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * @desc    Create a new course
 * @route   POST /api/v1/courses
 * @access  Private (instructor only)
 */
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, content, category, thumbnailUrl } = req.body;

  const course = await Course.create({
    title,
    description,
    content,
    category,
    thumbnailUrl,
    instructor: req.user._id,
  });

  ApiResponse.created(res, "Course created successfully", { course });
});

/**
 * @desc    Get all courses
 * @route   GET /api/v1/courses
 * @access  Public
 */
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("instructor", "name email")
    .sort({ createdAt: -1 });

  ApiResponse.success(res, "Courses retrieved", { courses });
});

/**
 * @desc    Get single course by ID
 * @route   GET /api/v1/courses/:id
 * @access  Public
 */
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("instructor", "name email");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Return enrolled count instead of full array for privacy
  const courseData = course.toObject();
  courseData.enrolledCount = course.enrolledStudents.length;
  delete courseData.enrolledStudents;

  ApiResponse.success(res, "Course retrieved", { course: courseData });
});

/**
 * @desc    Update a course
 * @route   PUT /api/v1/courses/:id
 * @access  Private (instructor, own course only)
 */
const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Ownership check
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own courses");
  }

  const allowedUpdates = ["title", "description", "content", "category", "thumbnailUrl"];
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  course = await Course.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("instructor", "name email");

  ApiResponse.success(res, "Course updated successfully", { course });
});

/**
 * @desc    Delete a course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private (instructor, own course only)
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Ownership check
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own courses");
  }

  // Cascade delete: remove all enrollments for this course
  await Enrollment.deleteMany({ course: course._id });

  await Course.findByIdAndDelete(req.params.id);

  ApiResponse.success(res, "Course deleted successfully");
});

/**
 * @desc    Get all courses by the logged-in instructor
 * @route   GET /api/v1/courses/my
 * @access  Private (instructor only)
 */
const getInstructorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

  ApiResponse.success(res, "Instructor courses retrieved", { courses });
});

/**
 * @desc    Get enrolled students for a specific course
 * @route   GET /api/v1/courses/:id/enrollments
 * @access  Private (instructor, own course only)
 */
const getCourseEnrollments = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Ownership check
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only view enrollments for your own courses");
  }

  const enrollments = await Enrollment.find({ course: req.params.id })
    .populate("student", "name email")
    .sort({ enrolledAt: -1 });

  // Format as table-friendly array
  const enrolledStudents = enrollments.map((enrollment) => ({
    name: enrollment.student.name,
    email: enrollment.student.email,
    enrolledAt: enrollment.enrolledAt,
    status: enrollment.status,
  }));

  ApiResponse.success(res, "Course enrollments retrieved", {
    courseTitle: course.title,
    totalEnrolled: enrolledStudents.length,
    enrolledStudents,
  });
});

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCourseEnrollments,
};
