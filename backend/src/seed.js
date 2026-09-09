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

    // Seed 20 Courses
    const courseTemplates = [
      { t: "Mastering React 18", d: "Learn the latest features of React 18, including concurrent rendering and server components.", c: "Web Development", l: "Intermediate", i: inst1Id },
      { t: "Introduction to UI/UX Design", d: "A comprehensive guide to designing beautiful and functional user interfaces.", c: "Design", l: "Beginner", i: inst2Id },
      { t: "Advanced Node.js Architecture", d: "Scale your backend applications using microservices and advanced Node.js patterns.", c: "Backend", l: "Advanced", i: inst1Id },
      { t: "Python for Data Science", d: "Master Pandas, NumPy, and Matplotlib to analyze complex datasets.", c: "Data Science", l: "Intermediate", i: inst2Id },
      { t: "Figma Prototyping Masterclass", d: "Create interactive, high-fidelity prototypes like a senior product designer.", c: "Design", l: "Intermediate", i: inst2Id },
      { t: "Full-Stack Next.js 14", d: "Build production-ready applications with the App Router and Server Actions.", c: "Web Development", l: "Advanced", i: inst1Id },
      { t: "Machine Learning Basics", d: "An introduction to predictive models and neural networks using Scikit-Learn.", c: "Data Science", l: "Beginner", i: inst2Id },
      { t: "The Complete SQL Bootcamp", d: "Learn PostgreSQL from scratch and write complex analytical queries.", c: "Backend", l: "Beginner", i: inst1Id },
      { t: "DevOps with Docker and Kubernetes", d: "Containerize your applications and orchestrate them efficiently.", c: "Backend", l: "Advanced", i: inst1Id },
      { t: "Graphic Design Fundamentals", d: "Understand composition, color theory, and typography essentials.", c: "Design", l: "Beginner", i: inst2Id },
      { t: "JavaScript: The Hard Parts", d: "Deep dive into closures, the prototype chain, and the event loop.", c: "Web Development", l: "Advanced", i: inst1Id },
      { t: "Building RESTful APIs with Express", d: "Design and implement scalable APIs using Express.js and MongoDB.", c: "Backend", l: "Intermediate", i: inst1Id },
      { t: "CSS Animation Secrets", d: "Bring your UI to life with smooth, performant CSS animations and transitions.", c: "Web Development", l: "Intermediate", i: inst2Id },
      { t: "Product Management 101", d: "Learn how to define product strategy, write specs, and lead teams.", c: "Business", l: "Beginner", i: inst2Id },
      { t: "Advanced System Design", d: "Prepare for system design interviews by analyzing real-world architectures.", c: "Backend", l: "Advanced", i: inst1Id },
      { t: "Deep Learning with PyTorch", d: "Train state-of-the-art neural networks for computer vision and NLP tasks.", c: "Data Science", l: "Advanced", i: inst2Id },
      { t: "Digital Marketing Strategy", d: "Grow your audience using SEO, content marketing, and paid ads.", c: "Business", l: "Beginner", i: inst2Id },
      { t: "React Native Mobile Apps", d: "Build cross-platform mobile applications using your existing React skills.", c: "Web Development", l: "Intermediate", i: inst1Id },
      { t: "Agile Scrum Mastery", d: "Master the Scrum framework to deliver software faster and more reliably.", c: "Business", l: "Intermediate", i: inst2Id },
      { t: "Cybersecurity Basics", d: "Protect web applications against common vulnerabilities like XSS and CSRF.", c: "Backend", l: "Beginner", i: inst1Id },
    ];

    const mappedCourses = courseTemplates.map(ct => ({
      title: ct.t,
      description: ct.d,
      content: `## ${ct.t}\n\nWelcome to this comprehensive course! We are going to cover everything you need to know about **${ct.c}**.\n\n### What you will learn:\n- Core concepts\n- Best practices\n- Real-world applications\n\nLet's get started on your journey.`,
      category: ct.c,
      level: ct.l,
      instructor: ct.i,
      duration: "4 weeks"
    }));

    const courses = await Course.insertMany(mappedCourses);
    console.log(`Seeded ${courses.length} courses...`);

    // Seed Enrollments
    await Enrollment.insertMany([
      { student: stu1Id, course: courses[0]._id, status: "completed", enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { student: stu1Id, course: courses[1]._id, status: "active" },
    ]);

    await User.findByIdAndUpdate(stu1Id, { $push: { enrolledCourses: { $each: [courses[0]._id, courses[1]._id] } } });
    await Course.findByIdAndUpdate(courses[0]._id, { $push: { enrolledStudents: stu1Id } });
    await Course.findByIdAndUpdate(courses[1]._id, { $push: { enrolledStudents: stu1Id } });

    console.log("Enrollments seeded...");
    console.log("Seeding complete! You can log in with student1@gmail.com or instructor1@gmail.com (pw: password123)");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
