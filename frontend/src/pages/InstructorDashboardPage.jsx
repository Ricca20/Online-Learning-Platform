import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Book, Users, Edit, Trash2, Plus, Eye } from "lucide-react";
import toast from "react-hot-toast";

function InstructorDashboardPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

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
      toast.success("Course deleted successfully");
      setCourses(courses.filter(c => c._id !== deleteId));
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

  // Calculate total enrollments across all courses
  const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0);

  return (
    <div className="page container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Instructor Dashboard</h1>
          <p>Manage your courses and track student enrollments</p>
        </div>
        <Link to="/instructor/courses/new" className="btn btn-primary">
          <Plus size={18} /> Create New Course
        </Link>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: "var(--space-8)" }}>
        <div className="stat-card">
          <Book size={32} style={{ margin: "0 auto var(--space-3)", color: "var(--color-accent)" }} />
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label">Total Courses Created</div>
        </div>
        <div className="stat-card">
          <Users size={32} style={{ margin: "0 auto var(--space-3)", color: "var(--color-success)" }} />
          <div className="stat-value">{totalEnrollments}</div>
          <div className="stat-label">Total Student Enrollments</div>
        </div>
      </div>

      <h2>Your Courses</h2>
      
      {courses.length === 0 ? (
        <div className="empty-state" style={{ marginTop: "var(--space-6)" }}>
          <Book size={64} />
          <h3>You haven't created any courses yet</h3>
          <p>Share your knowledge by creating your first course.</p>
          <Link to="/instructor/courses/new" className="btn btn-primary">Create Course</Link>
        </div>
      ) : (
        <div className="table-container" style={{ marginTop: "var(--space-6)" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Category</th>
                <th>Students</th>
                <th>Created Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td style={{ fontWeight: 500 }}>{course.title}</td>
                  <td>
                    {course.category ? (
                      <span className="badge badge-accent">{course.category}</span>
                    ) : "-"}
                  </td>
                  <td>
                    <Link 
                      to={`/instructor/courses/${course._id}/enrollments`} 
                      style={{ color: "var(--color-info)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}
                    >
                      <Users size={14} /> {course.enrolledStudents?.length || 0}
                    </Link>
                  </td>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }}>
                      <Link to={`/courses/${course._id}`} className="btn btn-ghost btn-sm" title="View Course">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/instructor/courses/${course._id}/edit`} className="btn btn-ghost btn-sm" title="Edit Course">
                        <Edit size={16} />
                      </Link>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ color: "var(--color-danger)" }}
                        onClick={() => setDeleteId(course._id)}
                        title="Delete Course"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>Delete Course?</h3>
            <p>Are you sure you want to delete this course? This action cannot be undone and will remove all student enrollments.</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboardPage;
