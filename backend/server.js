require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Security & Logging Middleware ---------------
app.use(helmet());
app.use(morgan("dev"));

// --------------- CORS ---------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// --------------- Body Parsing ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------- API Routes ---------------
app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/courses", require("./src/routes/courseRoutes"));
app.use("/api/v1/enrollments", require("./src/routes/enrollmentRoutes"));
app.use("/api/v1/ai", require("./src/routes/aiRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Online Learning Platform API is running" });
});

// --------------- Global Error Handler ---------------
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(", ");
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for: ${field}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Don't leak stack traces in production
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
});

// --------------- Start Server ---------------
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
