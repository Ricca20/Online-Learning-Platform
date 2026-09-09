const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/learnhub";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log("Cleared existing data...");

    const passwordHash = await bcrypt.hash("password123", 10);

    // Seed Users
    const users = await User.insertMany([
      { name: "Student One", email: "student1@gmail.com", password: passwordHash, role: "student" },
      { name: "Student Two", email: "student2@gmail.com", password: passwordHash, role: "student" },
      { name: "Instructor One", email: "instructor1@gmail.com", password: passwordHash, role: "instructor" },
      { name: "Instructor Two", email: "instructor2@gmail.com", password: passwordHash, role: "instructor" },
    ]);
    console.log("Users seeded...");

    const inst1Id = users[2]._id;
    const inst2Id = users[3]._id;
    const stu1Id = users[0]._id;
    const stu2Id = users[1]._id;

    // Seed Courses
    const courses = await Course.insertMany([
      {
        title: "Mastering React 18",
        description: "Learn the latest features of React 18, including concurrent rendering and server components.",
        content: "## Welcome to React 18\n\nReact 18 introduces **Concurrent Features** that fundamentally change how React renders UI.\n\n### Key Topics:\n- Automatic Batching\n- Transitions\n- Suspense on the Server\n\nLet's get started!",
        category: "Web Development",
        level: "Intermediate",
        instructor: inst1Id,
      },
      {
        title: "Introduction to UI/UX Design",
        description: "A comprehensive guide to designing beautiful and functional user interfaces.",
        content: "## UI/UX Fundamentals\n\nDesign is not just what it looks like and feels like. **Design is how it works.**\n\n### What we will cover:\n- Color Theory\n- Typography\n- Wireframing\n- Prototyping",
        category: "Design",
        level: "Beginner",
        instructor: inst2Id,
      },
      {
        title: "Advanced Node.js Architecture",
        description: "Scale your backend applications using microservices and advanced Node.js patterns.",
        content: "## Advanced Node\n\nWe will explore deep architectural patterns.\n\n### Modules:\n- Event Loop Deep Dive\n- Worker Threads\n- Microservices architecture",
        category: "Backend",
        level: "Advanced",
        instructor: inst1Id,
      },
    ]);
    console.log("Courses seeded with Markdown content and levels...");

    // Seed Enrollments
    await Enrollment.insertMany([
      {
        student: stu1Id,
        course: courses[0]._id,
        status: "completed",
        enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
      },
      {
        student: stu1Id,
        course: courses[1]._id,
        status: "active",
      },
      {
        student: stu2Id,
        course: courses[0]._id,
        status: "active",
      }
    ]);

    // Update user/course counters to reflect enrollments
    await User.findByIdAndUpdate(stu1Id, { $push: { enrolledCourses: { $each: [courses[0]._id, courses[1]._id] } } });
    await User.findByIdAndUpdate(stu2Id, { $push: { enrolledCourses: courses[0]._id } });
    await Course.findByIdAndUpdate(courses[0]._id, { $push: { enrolledStudents: { $each: [stu1Id, stu2Id] } } });
    await Course.findByIdAndUpdate(courses[1]._id, { $push: { enrolledStudents: stu1Id } });

    console.log("Enrollments seeded (including completed courses)...");
    
    console.log("Seeding complete! You can log in with student1@gmail.com or instructor1@gmail.com (pw: password123)");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
