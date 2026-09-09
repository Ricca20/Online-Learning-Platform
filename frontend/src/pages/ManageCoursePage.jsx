import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

function ManageCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    level: "All Levels",
    thumbnailUrl: "",
    content: "",
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const { data } = await axiosInstance.get(`/courses/${id}`);
          const course = data.data.course;
          setFormData({
            title: course.title || "",
            description: course.description || "",
            category: course.category || "",
            duration: course.duration || "",
            level: course.level || "All Levels",
            thumbnailUrl: course.thumbnailUrl || "",
            content: course.content || "",
          });
        } catch (error) {
          toast.error("Failed to load course details");
          navigate("/instructor/dashboard");
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditMode) {
        await axiosInstance.put(`/courses/${id}`, formData);
        toast.success("Course updated successfully");
      } else {
        await axiosInstance.post("/courses", formData);
        toast.success("Course created successfully");
      }
      navigate("/instructor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save course");
    } finally {
      setSaving(false);
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

  return (
    <div className="page container" style={{ maxWidth: "800px" }}>
      <div className="page-header">
        <h1>{isEditMode ? "Edit Course" : "Create New Course"}</h1>
        <p>{isEditMode ? "Update your course details" : "Fill out the details to create a new course"}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Course Title <span style={{color: "var(--color-danger)"}}>*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              placeholder="e.g. Complete Web Development Bootcamp"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-3" style={{ gap: "var(--space-4)" }}>
            <div className="form-group" style={{ gridColumn: "span 1" }}>
              <label className="form-label" htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                placeholder="e.g. Web Development"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ gridColumn: "span 1" }}>
              <label className="form-label" htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                className="form-input"
                placeholder="e.g. 4 Weeks, 10 Hours"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ gridColumn: "span 1" }}>
              <label className="form-label" htmlFor="level">Level</label>
              <select
                id="level"
                name="level"
                className="form-select"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="thumbnailUrl">Thumbnail URL</label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnailUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Short Description <span style={{color: "var(--color-danger)"}}>*</span></label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Provide a brief overview of what students will learn..."
              value={formData.description}
              onChange={handleChange}
              required
              style={{ minHeight: "100px" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="content">
              Detailed Content
              <span style={{ fontWeight: "normal", color: "var(--color-text-muted)", marginLeft: "8px", fontSize: "0.8em" }}>
                (Markdown supported)
              </span>
            </label>
            <textarea
              id="content"
              name="content"
              className="form-textarea"
              placeholder="Provide detailed course content, modules, syllabus..."
              value={formData.content}
              onChange={handleChange}
              style={{ minHeight: "250px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate("/instructor/dashboard")}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
              style={{ flex: 2 }}
            >
              {saving ? "Saving..." : (isEditMode ? "Update Course" : "Create Course")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageCoursePage;
