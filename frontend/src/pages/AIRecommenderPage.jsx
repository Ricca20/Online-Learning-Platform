import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

function AIRecommenderPage() {
  const [prompt, setPrompt] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setRecommendation(""); // Clear previous results

    try {
      const { data } = await axiosInstance.post("/ai/recommend", { prompt });
      setRecommendation(data.data.recommendation);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container" style={{ maxWidth: "800px" }}>
      <div className="page-header" style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
          <div 
            style={{ 
              background: "var(--gradient-primary)", 
              width: "64px", 
              height: "64px", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "var(--shadow-glow)"
            }}
          >
            <Sparkles size={32} color="white" />
          </div>
        </div>
        <h1>AI Course Recommender</h1>
        <p>Tell us your career goal and we'll suggest the best courses for you.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="e.g. I want to become a software engineer. What courses should I take?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ fontSize: "var(--font-size-lg)", minHeight: "120px" }}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-lg"
            disabled={loading || !prompt.trim()}
          >
            {loading ? "Generating Recommendations..." : "Get Recommendations"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}

      {recommendation && !loading && (
        <div style={{ animation: "slideUp 0.5s ease" }}>
          <div className="ai-result">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)", color: "var(--color-accent)", fontWeight: 700 }}>
              <Sparkles size={18} /> AI Suggestion
            </div>
            {recommendation}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
            <Link to="/courses" className="btn btn-ghost" style={{ fontSize: "var(--font-size-sm)" }}>
              Browse All Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIRecommenderPage;
