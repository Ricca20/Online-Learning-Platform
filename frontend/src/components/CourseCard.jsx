import { Link } from "react-router-dom";

function CourseCard({ course }) {
  const placeholderImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&size=400&background=7c58ff&color=fff&font-size=0.25`;

  return (
    <div className="course-card" id={`course-card-${course._id}`}>
      <img
        className="course-card-thumbnail"
        src={course.thumbnailUrl || placeholderImg}
        alt={course.title}
        onError={(e) => { e.target.src = placeholderImg; }}
      />
      <div className="course-card-body">
        <h3>{course.title}</h3>
        <p className="instructor">
          by {course.instructor?.name || "Unknown Instructor"}
        </p>
        <p className="description">
          {course.description?.length > 100
            ? course.description.substring(0, 100) + "..."
            : course.description}
        </p>
      </div>
      <div className="course-card-footer">
        {course.category && (
          <span className="badge badge-accent">{course.category}</span>
        )}
        <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
