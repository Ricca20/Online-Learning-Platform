import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Deterministic teal shade based on course title — no AI images
const THUMB_COLORS = [
  ["#0d9488","#0891b2"],
  ["#0f766e","#0369a1"],
  ["#115e59","#075985"],
  ["#134e4a","#0c4a6e"],
  ["#0e7490","#0f766e"],
];

function getThumbColors(title = "") {
  const idx = title.charCodeAt(0) % THUMB_COLORS.length;
  return THUMB_COLORS[idx];
}

function CourseCard({ course }) {
  const [c1, c2] = getThumbColors(course.title);

  return (
    <div className="course-card" id={`course-card-${course._id}`}>
      {course.thumbnailUrl ? (
        <img
          className="course-card-thumbnail"
          src={course.thumbnailUrl}
          alt={course.title}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="course-card-thumb-placeholder"
        style={{
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
          display: course.thumbnailUrl ? "none" : "flex",
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
