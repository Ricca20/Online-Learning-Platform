import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/register", formData);
      login(data.data.user, data.data.token);
      toast.success("Account created successfully!");
      navigate(data.data.user.role === "instructor" ? "/instructor/dashboard" : "/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <BookOpen size={18} />
          LearnHub
        </div>

        <h1>Create your account</h1>
        <p className="subtitle">Join thousands of learners building real skills.</p>

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text" id="name" name="name"
              className="form-input"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email" id="email" name="email"
              className="form-input"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password" id="password" name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">I want to</label>
            <select
              id="role" name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Learn — I'm a student</option>
              <option value="instructor">Teach — I'm an instructor</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            id="register-submit-btn"
            style={{ marginTop: "var(--space-2)" }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
