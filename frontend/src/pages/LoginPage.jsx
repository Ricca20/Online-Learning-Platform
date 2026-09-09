import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      login(data.data.user, data.data.token);
      toast.success("Welcome back!");
      navigate(data.data.user.role === "instructor" ? "/instructor/dashboard" : "/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
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

        <h1>Sign in to LearnHub</h1>
        <p className="subtitle">Continue where you left off.</p>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              type="email" id="login-email" name="email"
              className="form-input"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              type="password" id="login-password" name="password"
              className="form-input"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            id="login-submit-btn"
            style={{ marginTop: "var(--space-2)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          New to LearnHub?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
