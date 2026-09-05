import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

function CourseDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, role } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        // Fetch course details
        const { data: courseData } = await axiosInstance.get(`/courses/${id}`);
        setCourse(courseData.data.course);

        // If user is a student, check if they are already enrolled
        if (isAuthenticated && role === "student") {
          const { data: enrollmentData } = await axiosInstance.get("/enrollments/my");
          const enrollments = enrollmentData.data.enrollments;
          const enrolled = enrollments.some((e) => e.course._id === id);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        toast.error("Failed to load course details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [id, isAuthenticated, role]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to enroll in courses");
      return;
    }
    
    setEnrolling(true);
    try {
      await axiosInstance.post(`/courses/${id}/enroll`);
      toast.success("Successfully enrolled!");
      setIsEnrolled(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="page container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h3>Course Not Found</h3>
          <p>The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
        </div>
      </div>
    );
  }

  const placeholderImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&size=800&background=7c58ff&color=fff&font-size=0.15`;

  return (
    <div className="page container">
      <div className="course-detail">
        <div className="course-detail-header">
          {course.category && (
            <span className="badge badge-accent" style={{ marginBottom: "var(--space-3)" }}>
              {course.category}
            </span>
          )}
          <h1>{course.title}</h1>
          <div className="course-detail-meta">
            <span>By {course.instructor?.name || "Unknown Instructor"}</span>
            <span>•</span>
            <span>{course.enrolledCount || 0} students enrolled</span>
            <span>•</span>
            <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <img
          src={course.thumbnailUrl || placeholderImg}
          alt={course.title}
          style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)", marginBottom: "var(--space-8)", background: "var(--color-bg-elevated)" }}
          onError={(e) => { e.target.src = placeholderImg; }}
        />

        <div className="grid grid-cols-3" style={{ gap: "var(--space-8)" }}>
          <div className="course-detail-content" style={{ gridColumn: "span 2" }}>
            <h2>About this course</h2>
            <p>{course.description}</p>
            
            {course.content && (
              <>
                <h2>Course Content</h2>
                {/* For production, use a markdown renderer like react-markdown. For now, we'll preserve whitespace. */}
                <div style={{ whiteSpace: "pre-wrap", color: "var(--color-text-secondary)" }}>
                  {course.content}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="card" style={{ position: "sticky", top: "calc(var(--navbar-height) + var(--space-6))" }}>
              <h3 style={{ marginBottom: "var(--space-4)" }}>Ready to start learning?</h3>
              
              {!isAuthenticated ? (
                <Link to="/login" className="btn btn-primary btn-block btn-lg">
                  Login to Enroll
                </Link>
              ) : role === "student" ? (
                isEnrolled ? (
                  <button className="btn btn-success btn-block btn-lg" disabled style={{ background: "var(--color-success)", color: "white" }}>
                    Enrolled ✓
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary btn-block btn-lg" 
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                )
              ) : (
                <div className="badge badge-warning" style={{ display: "block", textAlign: "center", padding: "var(--space-3)" }}>
                  Instructors cannot enroll in courses
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
