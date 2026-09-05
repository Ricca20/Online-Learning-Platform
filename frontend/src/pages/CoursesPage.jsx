import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import CourseCard from "../components/CourseCard";
import { BookOpen } from "lucide-react";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosInstance.get("/courses");
        setCourses(data.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
        <h1>Explore Courses</h1>
        <p>Discover courses taught by industry experts</p>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={64} />
          <h3>No courses available yet</h3>
          <p>Check back later for new courses!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesPage;
