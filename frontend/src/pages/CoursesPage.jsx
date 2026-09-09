import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import CourseCard from "../components/CourseCard";
import { Search } from "lucide-react";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [levelFilter, setLevelFilter] = useState("All Levels");
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
      courses.filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q);
        const matchesCategory =
          categoryFilter === "All Categories" || c.category === categoryFilter;
        const matchesLevel =
          levelFilter === "All Levels" || c.level === levelFilter;
        
        return matchesSearch && matchesCategory && matchesLevel;
      })
    );
  }, [search, categoryFilter, levelFilter, courses]);

  // Compute unique categories
  const categories = ["All Categories", ...new Set(courses.map(c => c.category).filter(Boolean))];

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
      <div className="page-header" style={{ padding: "var(--space-8) var(--space-6)", border: "2px solid var(--color-border)", background: "var(--color-accent-soft)", marginBottom: "var(--space-8)", boxShadow: "var(--shadow-md)" }}>
        <p className="section-label" style={{ color: "var(--color-border)" }}>Catalog</p>
        <h1 style={{ fontWeight: 800, fontSize: "var(--font-size-4xl)", letterSpacing: "-0.03em" }}>Acquire production-ready skills.</h1>
        <p style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>Master React, Node.js, and System Design through comprehensive, instructor-led courses.</p>
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
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <select 
            className="form-select" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            className="form-select" 
            value={levelFilter} 
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="All Levels">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <span className="course-count" style={{ marginLeft: "auto" }}>
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
