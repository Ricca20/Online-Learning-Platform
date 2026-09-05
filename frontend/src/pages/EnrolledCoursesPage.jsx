import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import CourseCard from "../components/CourseCard";
import { GraduationCap } from "lucide-react";
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
        console.error(error);
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
        <h1>My Enrollments</h1>
        <p>Keep track of the courses you're learning</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <GraduationCap size={64} />
          <h3>You aren't enrolled in any courses yet</h3>
          <p>Explore our catalog and start learning today!</p>
          <a href="/courses" className="btn btn-primary">Browse Courses</a>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} style={{ position: "relative" }}>
              <div 
                className="badge badge-success" 
                style={{ 
                  position: "absolute", 
                  top: "var(--space-2)", 
                  right: "var(--space-2)", 
                  zIndex: 10,
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {enrollment.status === "active" ? "In Progress" : "Completed"}
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
