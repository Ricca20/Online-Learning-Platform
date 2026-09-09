import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, BookOpen } from "lucide-react";
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
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">
            <BookOpen size={14} color="white" />
          </span>
          LearnHub
        </Link>

        {/* Nav links */}
        <div className="navbar-links">
          <Link to="/courses" className={isActive("/courses") ? "active" : ""}>
            Courses
          </Link>

          {role === "student" && (
            <Link
              to="/my-enrollments"
              className={isActive("/my-enrollments") ? "active" : ""}
            >
              My Learning
            </Link>
          )}

          {role === "instructor" && (
            <>
              <Link
                to="/instructor/dashboard"
                className={isActive("/instructor/dashboard") ? "active" : ""}
              >
                Dashboard
              </Link>
              <Link
                to="/instructor/courses/new"
                className={isActive("/instructor/courses/new") ? "active" : ""}
              >
                New Course
              </Link>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="navbar-user">
                <span className="avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span style={{ fontWeight: 500 }}>{user?.name}</span>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                id="logout-btn"
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
