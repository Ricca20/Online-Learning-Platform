import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import CourseCard from "../components/CourseCard";
import { User, BookOpen, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function InstructorProfilePage() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const [userRes, coursesRes] = await Promise.all([
          axiosInstance.get(`/users/${id}`),
          axiosInstance.get(`/courses/instructor/${id}`)
        ]);
        
        setInstructor(userRes.data.data.user);
        setCourses(coursesRes.data.data.courses);
      } catch (error) {
        toast.error("Failed to load instructor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
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

  if (!instructor) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h3>Instructor not found</h3>
          <p>This profile may not exist.</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <div style={{ marginBottom: "var(--space-6)" }}>
        <Link to="/courses" className="btn btn-ghost" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} /> All Courses
        </Link>
      </div>

      <div className="dashboard-header" style={{ background: "var(--color-bg-card)", border: "1.5px solid var(--color-border)", color: "var(--color-text-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "var(--color-accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-accent)",
          }}>
            <User size={40} />
          </div>
          <div>
            <p className="section-label" style={{ marginBottom: "var(--space-1)" }}>Instructor</p>
            <h1 style={{ color: "var(--color-text-primary)" }}>{instructor.name}</h1>
            <p style={{ color: "var(--color-text-secondary)" }}>Member since {new Date(instructor.createdAt).getFullYear()}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-text-secondary)", fontWeight: 500 }}>
            <BookOpen size={18} />
            {courses.length} Published Course{courses.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-8)" }}>
        <h2 style={{ fontSize: "var(--font-size-xl)", marginBottom: "var(--space-5)", color: "var(--color-text-primary)" }}>
          Courses by {instructor.name}
        </h2>

        {courses.length === 0 ? (
          <div className="empty-state" style={{ padding: "var(--space-8)" }}>
            <BookOpen size={48} />
            <h3>No courses yet</h3>
            <p>This instructor hasn't published any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorProfilePage;
