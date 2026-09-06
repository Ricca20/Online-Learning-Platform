import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Users, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function CourseEnrollmentsPage() {
  const { id } = useParams();
  const [data, setData] = useState({ courseTitle: "", enrolledStudents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${id}/enrollments`);
        setData(response.data.data);
      } catch (error) {
        toast.error("Failed to load course enrollments");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [id]);

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
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Link to="/instructor/dashboard" className="btn btn-ghost" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>

      <div className="page-header">
        <h1>Course Enrollments</h1>
        <p>Students enrolled in <strong style={{ color: "var(--color-accent)" }}>{data.courseTitle}</strong></p>
      </div>

      {data.enrolledStudents.length === 0 ? (
        <div className="empty-state">
          <Users size={64} />
          <h3>No students enrolled yet</h3>
          <p>Share your course link to attract students.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Student Name</th>
                <th>Email Address</th>
                <th>Status</th>
                <th>Enrolled Date</th>
              </tr>
            </thead>
            <tbody>
              {data.enrolledStudents.map((student, index) => (
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
  );
}

export default CourseEnrollmentsPage;
