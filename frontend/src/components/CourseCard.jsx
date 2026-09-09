import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Solid bold colors for Neo-Brutalist design
const THUMB_COLORS = [
  "#f97316", // Orange
  "#2563eb", // Blue
  "#16a34a", // Green
  "#dc2626", // Red
  "#8b5cf6", // Violet (wait, user said no purple, I will use yellow)
];

// Re-defining THUMB_COLORS without purple
const BOLD_COLORS = [
  "#f97316", // Orange
  "#2563eb", // Blue
  "#16a34a", // Green
  "#dc2626", // Red
  "#eab308", // Yellow
];

function getThumbColors(title = "") {
  const idx = title.charCodeAt(0) % BOLD_COLORS.length;
  return BOLD_COLORS[idx];
}

function CourseCard({ course }) {
  const bgColor = getThumbColors(course.title);

  return (
    <div className="course-card" id={`course-card-${course._id}`} style={{ border: "2px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
      {course.thumbnailUrl ? (
        <img
          className="course-card-thumbnail"
          src={course.thumbnailUrl}
          alt={course.title}
          style={{ borderBottom: "2px solid var(--color-border)" }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="course-card-thumb-placeholder"
        style={{
          background: bgColor,
          borderBottom: "2px solid var(--color-border)",
          color: "#fff",
          display: course.thumbnailUrl ? "none" : "flex",
          fontWeight: 800,
          fontSize: "1.2rem",
          letterSpacing: "-0.02em"
        }}
      >
        {course.title?.substring(0, 32)}
      </div>

      <div className="course-card-body">
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          {course.category && (
            <span className="badge badge-accent">
              {course.category}
            </span>
          )}
          {course.level && course.level !== "All Levels" && (
            <span className="badge" style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)" }}>
              {course.level}
            </span>
          )}
          {course.duration && (
            <span className="badge" style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)" }}>
              {course.duration}
            </span>
          )}
        </div>
        <h3>{course.title}</h3>
        <p className="instructor">
          by{" "}
          {course.instructor?._id ? (
            <Link to={`/instructor-profile/${course.instructor._id}`} style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {course.instructor.name}
            </Link>
          ) : (
            "Unknown Instructor"
          )}
        </p>
        <p className="description">
          {course.description?.length > 100
            ? course.description.substring(0, 100) + "…"
            : course.description}
        </p>
      </div>

      <div className="course-card-footer">
        <Link
          to={`/courses/${course._id}`}
          className="btn btn-outline btn-sm"
          style={{ gap: "var(--space-1)" }}
        >
          View Course <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
