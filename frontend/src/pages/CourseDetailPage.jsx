import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { ArrowLeft, Users, Calendar } from "lucide-react";
import { parseMarkdown } from "../utils/markdownParser";

function CourseDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, role, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [instructorEnrollments, setInstructorEnrollments] = useState([]);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        const { data: courseData } = await axiosInstance.get(`/courses/${id}`);
        setCourse(courseData.data.course);

        if (isAuthenticated && role === "student") {
          const { data: enrollmentData } = await axiosInstance.get("/enrollments/my");
          const enrollment = enrollmentData.data.enrollments.find(
            (e) => e.course._id === id
          );
          if (enrollment) {
            setIsEnrolled(true);
            setEnrollmentStatus(enrollment.status);
          }
        } else if (isAuthenticated && role === "instructor" && courseData.data.course.instructor._id === user?._id) {
          const { data: enrollmentData } = await axiosInstance.get(`/courses/${id}/enrollments`);
          setInstructorEnrollments(enrollmentData.data.enrolledStudents);
        }
      } catch (error) {
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [id, isAuthenticated, role, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to enroll");
      return;
    }
    setEnrolling(true);
    try {
      await axiosInstance.post(`/courses/${id}/enroll`);
      toast.success("Enrolled successfully!");
      setIsEnrolled(true);
      setEnrollmentStatus("active");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await axiosInstance.put(`/enrollments/${id}/complete`);
      toast.success("Congratulations! You completed this course.");
      setEnrollmentStatus("completed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as completed");
    } finally {
      setCompleting(false);
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
          <h3>Course not found</h3>
          <p>This course may have been removed or the link is incorrect.</p>
          <Link to="/courses" className="btn btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      {/* Back nav */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Link to="/courses" className="btn btn-ghost" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} /> All Courses
        </Link>
      </div>

      <div className="course-detail">
        <div className="course-detail-header">
          {course.category && (
            <span className="badge badge-accent" style={{ marginBottom: "var(--space-3)" }}>
              {course.category}
            </span>
          )}
          <h1>{course.title}</h1>

          <div className="course-detail-meta">
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              By <strong style={{ color: "var(--color-text-primary)", marginLeft: "4px" }}>
                {course.instructor?._id ? (
                  <Link to={`/instructor-profile/${course.instructor._id}`} style={{ color: "inherit" }}>
                    {course.instructor.name}
                  </Link>
                ) : (
                  "Unknown Instructor"
                )}
              </strong>
            </span>
            <span style={{ color: "var(--color-border-hover)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Users size={13} />
              {course.enrolledCount || 0} enrolled
            </span>
            <span style={{ color: "var(--color-border-hover)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={13} />
              Updated {new Date(course.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
            {course.duration && (
              <>
                <span style={{ color: "var(--color-border-hover)" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-secondary)" }}>
                  {course.duration}
                </span>
              </>
            )}
            {course.level && (
              <>
                <span style={{ color: "var(--color-border-hover)" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-secondary)" }}>
                  {course.level}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3" style={{ gap: "var(--space-8)", alignItems: "start" }}>
          {/* Main content */}
          <div className="course-detail-content" style={{ gridColumn: "span 2" }}>
            <h2>About this course</h2>
            <p>{course.description}</p>

            {course.content && (
              <>
                <h2>Course content</h2>
                <div 
                  className="markdown-content" 
                  dangerouslySetInnerHTML={parseMarkdown(course.content)} 
                />
              </>
            )}

            {/* Instructor View: Show Enrolled Students Table */}
            {role === "instructor" && user?._id === course.instructor?._id && (
              <div style={{ marginTop: "var(--space-8)" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Users size={20} /> Enrolled Students
                </h2>
                {instructorEnrollments.length === 0 ? (
                  <div style={{ padding: "var(--space-4)", background: "var(--color-bg-elevated)", borderRadius: "var(--radius-md)", color: "var(--color-text-muted)" }}>
                    No students have enrolled yet.
                  </div>
                ) : (
                  <div className="table-container" style={{ marginTop: "var(--space-4)" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Enrolled Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instructorEnrollments.map((student, index) => (
                          <tr key={student.email}>
                            <td style={{ color: "var(--color-text-muted)" }}>{index + 1}</td>
                            <td style={{ fontWeight: 500 }}>{student.name}</td>
                            <td>{student.email}</td>
                            <td>
                              <span className={`badge ${student.status === "active" ? "badge-success" : "badge-info"}`}>
                                {student.status}
                              </span>
                            </td>
                            <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enroll sidebar */}
          <div>
            <div className="enroll-card">
              <h3>Ready to start?</h3>

              {!isAuthenticated ? (
                <Link to="/login" className="btn btn-primary btn-block btn-lg">
                  Log in to Enroll
                </Link>
              ) : role === "student" ? (
                isEnrolled ? (
                  enrollmentStatus === "completed" ? (
                    <button
                      className="btn btn-block btn-lg"
                      disabled
                      style={{
                        background: "var(--color-success-soft)",
                        color: "var(--color-success)",
                        border: "1.5px solid var(--color-success)",
                      }}
                    >
                      Course Completed
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-block btn-lg"
                      onClick={handleComplete}
                      disabled={completing}
                      style={{
                        background: "var(--color-success)",
                        borderColor: "var(--color-success)",
                      }}
                    >
                      {completing ? "Updating…" : "Mark as Completed"}
                    </button>
                  )
                ) : (
                  <button
                    className="btn btn-primary btn-block btn-lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? "Enrolling…" : "Enroll Now — Free"}
                  </button>
                )
              ) : (
                <div
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    background: "var(--color-warning-soft)",
                    border: "1.5px solid var(--color-warning)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-warning)",
                  }}
                >
                  Instructors cannot enroll in courses
                </div>
              )}

              <div
                className="divider"
                style={{ margin: "var(--space-5) 0" }}
              />
              <ul
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-secondary)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}
              >
                <li>Full lifetime access</li>
                <li>Access on all devices</li>
                <li>Certificate upon completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
