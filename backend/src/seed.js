require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("./models/User");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log("🗑️  Cleared existing collections");

    // Create instructor
    const instructor = await User.create({
      name: "Jane Doe",
      email: "instructor@demo.com",
      password: "password123",
      role: "instructor",
    });

    // Create student
    const student = await User.create({
      name: "John Smith",
      email: "student@demo.com",
      password: "password123",
      role: "student",
    });

    // Create 5 courses across categories
    const courses = await Course.insertMany([
      {
        title: "Full-Stack Web Development with React & Node.js",
        description:
          "Master modern web development from front to back. Learn React for building dynamic user interfaces and Node.js with Express for creating robust APIs. This comprehensive course covers component architecture, state management, RESTful API design, authentication, and deployment.",
        instructor: instructor._id,
        content:
          "## Module 1: HTML, CSS & JavaScript Foundations\nReview core web technologies and ES6+ features.\n\n## Module 2: React Fundamentals\nComponents, props, state, hooks, and routing with React Router.\n\n## Module 3: Backend with Node.js & Express\nBuilding RESTful APIs, middleware, error handling.\n\n## Module 4: MongoDB & Mongoose\nDatabase design, CRUD operations, data validation.\n\n## Module 5: Authentication & Deployment\nJWT auth, RBAC, deploying to Render and Vercel.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
      },
      {
        title: "Data Science & Machine Learning with Python",
        description:
          "Dive into the world of data science. Learn Python for data analysis, visualisation with Matplotlib and Seaborn, and machine learning with scikit-learn. Work with real-world datasets to build predictive models and gain actionable insights.",
        instructor: instructor._id,
        content:
          "## Module 1: Python for Data Science\nNumPy, Pandas, and data manipulation.\n\n## Module 2: Data Visualisation\nMatplotlib, Seaborn, and storytelling with data.\n\n## Module 3: Statistical Analysis\nHypothesis testing, regression, probability.\n\n## Module 4: Machine Learning\nSupervised and unsupervised learning with scikit-learn.\n\n## Module 5: Capstone Project\nEnd-to-end ML project with real data.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      },
      {
        title: "Mobile App Development with React Native",
        description:
          "Build cross-platform mobile applications using React Native. Learn to create beautiful, performant iOS and Android apps from a single codebase. Covers navigation, native modules, state management, and app store deployment.",
        instructor: instructor._id,
        content:
          "## Module 1: React Native Basics\nSetting up the development environment, core components.\n\n## Module 2: Navigation & Routing\nReact Navigation, stack and tab navigators.\n\n## Module 3: State Management\nContext API, Redux Toolkit for complex state.\n\n## Module 4: Native Features\nCamera, geolocation, push notifications.\n\n## Module 5: Publishing\nBuilding for production, App Store & Play Store submission.",
        category: "Mobile Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      },
      {
        title: "DevOps Engineering: CI/CD, Docker & Kubernetes",
        description:
          "Learn modern DevOps practices to streamline software delivery. Master Docker containerisation, Kubernetes orchestration, CI/CD pipelines with GitHub Actions, infrastructure as code with Terraform, and cloud deployment on AWS.",
        instructor: instructor._id,
        content:
          "## Module 1: Linux & Networking Fundamentals\nCommand line, SSH, networking basics for DevOps.\n\n## Module 2: Docker\nContainerisation, Dockerfiles, Docker Compose.\n\n## Module 3: CI/CD Pipelines\nGitHub Actions, automated testing and deployment.\n\n## Module 4: Kubernetes\nPods, services, deployments, scaling.\n\n## Module 5: Cloud & IaC\nAWS essentials, Terraform, monitoring with Prometheus & Grafana.",
        category: "DevOps",
        thumbnailUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800",
      },
      {
        title: "UI/UX Design: From Research to Prototype",
        description:
          "Master the design thinking process. Learn user research methods, wireframing, prototyping with Figma, interaction design, and usability testing. Create stunning, user-centred designs that solve real problems and delight users.",
        instructor: instructor._id,
        content:
          "## Module 1: Design Thinking\nEmpathise, define, ideate, prototype, test.\n\n## Module 2: User Research\nInterviews, surveys, personas, journey maps.\n\n## Module 3: Wireframing & Information Architecture\nLow-fi wireframes, site maps, user flows.\n\n## Module 4: Visual Design & Figma\nTypography, colour theory, component libraries in Figma.\n\n## Module 5: Prototyping & Testing\nInteractive prototypes, usability testing, iteration.",
        category: "UI/UX Design",
        thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      },
    ]);

    console.log(`📚 Created ${courses.length} courses`);

    console.log("\n========================================");
    console.log("✅ Seed completed successfully!");
    console.log("========================================");
    console.log("\n📧 Demo Credentials:");
    console.log("────────────────────────────────────────");
    console.log("Instructor:  instructor@demo.com / password123");
    console.log("Student:     student@demo.com / password123");
    console.log("────────────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedData();
