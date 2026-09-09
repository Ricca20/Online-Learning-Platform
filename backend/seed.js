const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Enrollment = require("./src/models/Enrollment");

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional, but good for consistent seeding)
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();

    console.log("Cleared existing data.");

    // Create instructors
    const instructor1 = await User.create({
      name: "Instructor One",
      email: "instructor1@gmail.com",
      password: "password123", 
      role: "instructor",
    });

    const instructor2 = await User.create({
      name: "Instructor Two",
      email: "instructor2@gmail.com",
      password: "password123",
      role: "instructor",
    });

    // Create students
    const student1 = await User.create({
      name: "Student One",
      email: "student1@gmail.com",
      password: "password123",
      role: "student",
    });

    const student2 = await User.create({
      name: "Student Two",
      email: "student2@gmail.com",
      password: "password123",
      role: "student",
    });

    console.log("Seeded Users.");

    // Create courses
    const course1 = await Course.create({
      title: "Advanced React Patterns",
      description: "Learn advanced React concepts including hooks, context, and performance optimization.",
      instructor: instructor1._id,
      content: "Module 1: Custom Hooks\nModule 2: Context API\nModule 3: useMemo & useCallback",
      category: "Web Development",
      enrolledStudents: [student1._id, student2._id],
    });

    const course2 = await Course.create({
      title: "Data Science with Python",
      description: "A comprehensive guide to data science using Python, Pandas, and Scikit-Learn.",
      instructor: instructor2._id,
      content: "Module 1: Pandas basics\nModule 2: Data Visualization\nModule 3: Machine Learning",
      category: "Data Science",
      enrolledStudents: [student1._id],
    });
    
    const course3 = await Course.create({
      title: "UI/UX Design Masterclass",
      description: "Master the art of designing beautiful and functional user interfaces using Figma.",
      instructor: instructor1._id,
      content: "Module 1: Figma Basics\nModule 2: Typography & Color\nModule 3: Prototyping",
      category: "Design",
      enrolledStudents: [student2._id],
    });

    console.log("Seeded Courses.");

    // Add courses to student's enrolledCourses
    student1.enrolledCourses.push(course1._id, course2._id);
    await student1.save({ validateBeforeSave: false });

    student2.enrolledCourses.push(course1._id, course3._id);
    await student2.save({ validateBeforeSave: false });

    // Create enrollments
    await Enrollment.create([
      { student: student1._id, course: course1._id, status: "active" },
      { student: student1._id, course: course2._id, status: "completed" },
      { student: student2._id, course: course1._id, status: "active" },
      { student: student2._id, course: course3._id, status: "active" },
    ]);

    console.log("Seeded Enrollments.");
    console.log("✅ Seeding complete!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
