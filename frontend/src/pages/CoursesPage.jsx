import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import CourseCard from "../components/CourseCard";
import { Search } from "lucide-react";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosInstance.get("/courses");
        setCourses(data.data.courses);
        setFiltered(data.data.courses);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      )
    );
  }, [search, courses]);

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
        <p className="section-label">All Courses</p>
        <h1>Browse the catalog</h1>
        <p>Expert-led courses in programming, design, business, and more.</p>
      </div>

      {/* Search / filter bar */}
      <div className="filter-bar">
        <div style={{ position: "relative", flex: "1", maxWidth: "360px" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="search"
            className="form-input"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "36px" }}
          />
        </div>
        <span className="course-count">
          {filtered.length} course{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={52} />
          <h3>No courses found</h3>
          <p>
            {search
              ? `No results for "${search}". Try a different keyword.`
              : "No courses have been published yet. Check back soon."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesPage;
