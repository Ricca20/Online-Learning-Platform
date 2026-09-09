import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import CourseCard from "../components/CourseCard";
import { BookOpen } from "lucide-react";
import toast from "react-hot-toast";

function EnrolledCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await axiosInstance.get("/enrollments/my");
        setEnrollments(data.data.enrollments);
      } catch (error) {
        toast.error("Failed to load your enrollments");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="page container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <div className="page-header">
        <p className="section-label">My Learning</p>
        <h1>Your enrolled courses</h1>
        <p>
          {enrollments.filter(e => e.status === "active").length} in progress 
          <span style={{ margin: "0 8px", color: "var(--color-border)" }}>|</span> 
          {enrollments.filter(e => e.status === "completed").length} completed
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={52} />
          <h3>No enrollments yet</h3>
          <p>Browse the catalog and enroll in a course to get started.</p>
          <a href="/courses" className="btn btn-primary">Browse Courses</a>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "var(--space-2)",
                  right: "var(--space-2)",
                  zIndex: 10,
                }}
              >
                <span
                  className={`badge ${
                    enrollment.status === "active" ? "badge-success" : "badge-info"
                  }`}
                  style={{ boxShadow: "var(--shadow-xs)" }}
                >
                  {enrollment.status === "active" ? "In Progress" : "Completed"}
                </span>
              </div>
              <CourseCard course={enrollment.course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrolledCoursesPage;
