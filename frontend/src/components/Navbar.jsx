import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, LogOut } from "lucide-react";
import toast from "react-hot-toast";

function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">
            <GraduationCap size={18} color="white" />
          </span>
          LearnHub
        </Link>

        <div className="navbar-links">
          <Link to="/courses" className={isActive("/courses") ? "active" : ""}>
            Courses
          </Link>

          {role === "student" && (
            <>
              <Link
                to="/my-enrollments"
                className={isActive("/my-enrollments") ? "active" : ""}
              >
                My Enrollments
              </Link>
              <Link
                to="/ai-recommender"
                className={isActive("/ai-recommender") ? "active" : ""}
              >
                AI Recommender
              </Link>
            </>
          )}

          {role === "instructor" && (
            <>
              <Link
                to="/instructor/dashboard"
                className={isActive("/instructor/dashboard") ? "active" : ""}
              >
                My Courses
              </Link>
              <Link
                to="/instructor/courses/new"
                className={isActive("/instructor/courses/new") ? "active" : ""}
              >
                Add Course
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="navbar-user">
                <span className="avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span>{user?.name}</span>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                id="logout-btn"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
