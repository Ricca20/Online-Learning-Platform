import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Book, Users, Edit, Trash2, Plus, Eye } from "lucide-react";
import toast from "react-hot-toast";

function InstructorDashboardPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchMyCourses(); }, []);

  const fetchMyCourses = async () => {
    try {
      const { data } = await axiosInstance.get("/courses/my");
      setCourses(data.data.courses);
    } catch (error) {
      toast.error("Failed to load your courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`/courses/${deleteId}`);
      toast.success("Course deleted");
      setCourses(courses.filter((c) => c._id !== deleteId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleteId(null);
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

  const totalEnrollments = courses.reduce(
    (sum, c) => sum + (c.enrolledStudents?.length || 0),
    0
  );

  return (
    <div className="page container">
      {/* Header strip */}
      <div className="dashboard-header">
        <div>
          <h1>Instructor Dashboard</h1>
          <p>Manage your courses and track student progress</p>
        </div>
        <Link to="/instructor/courses/new" className="btn btn-sm" style={{ background: "white", color: "var(--color-accent)", border: "none" }}>
          <Plus size={15} /> New Course
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2" style={{ marginBottom: "var(--space-8)", maxWidth: "480px" }}>
        <div className="stat-card">
          <Book size={24} style={{ margin: "0 auto var(--space-2)", color: "var(--color-accent)" }} />
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label">Courses Published</div>
        </div>
        <div className="stat-card">
          <Users size={24} style={{ margin: "0 auto var(--space-2)", color: "var(--color-success)" }} />
          <div className="stat-value">{totalEnrollments}</div>
          <div className="stat-label">Total Students</div>
        </div>
      </div>

      <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
        Your Courses
      </h2>

      {courses.length === 0 ? (
        <div className="empty-state" style={{ marginTop: "var(--space-6)" }}>
          <Book size={52} />
          <h3>No courses yet</h3>
          <p>Create your first course and start sharing your expertise.</p>
          <Link to="/instructor/courses/new" className="btn btn-primary">
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Students</th>
                <th>Published</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td style={{ fontWeight: 600 }}>{course.title}</td>
                  <td>
                    {course.category ? (
                      <span className="badge badge-accent">{course.category}</span>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/instructor/courses/${course._id}/enrollments`}
                      style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-info)", fontWeight: 500 }}
                    >
                      <Users size={13} /> {course.enrolledStudents?.length || 0}
                    </Link>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
                    {new Date(course.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-1)" }}>
                      <Link to={`/courses/${course._id}`} className="btn btn-ghost btn-sm" title="Preview">
                        <Eye size={14} />
                      </Link>
                      <Link to={`/instructor/courses/${course._id}/edit`} className="btn btn-ghost btn-sm" title="Edit">
                        <Edit size={14} />
                      </Link>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--color-danger)" }}
                        onClick={() => setDeleteId(course._id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>Delete this course?</h3>
            <p>
              This will permanently remove the course and all student enrollments.
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboardPage;
