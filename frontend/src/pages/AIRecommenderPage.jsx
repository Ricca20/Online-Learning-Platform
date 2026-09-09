import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { ArrowRight, Cpu } from "lucide-react";
import toast from "react-hot-toast";

function AIRecommenderPage() {
  const [prompt, setPrompt] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setRecommendation("");

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
    <div className="page container" style={{ maxWidth: "760px" }}>
      <div className="page-header">
        <p className="section-label">AI Advisor</p>
        <h1>Find the right course for your goal</h1>
        <p>
          Describe what you want to achieve and our AI will match you to the
          most relevant courses in the catalog.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "var(--space-4)" }}>
            <label className="form-label" htmlFor="ai-prompt">
              What do you want to learn or achieve?
            </label>
            <textarea
              id="ai-prompt"
              className="form-textarea"
              placeholder="e.g. I want to become a backend developer and learn Node.js and databases."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ minHeight: "110px", fontSize: "var(--font-size-base)" }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !prompt.trim()}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            <Cpu size={15} />
            {loading ? "Analysing…" : "Get Recommendations"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}

      {recommendation && !loading && (
        <div className="ai-result">
          <div className="ai-result-header">
            <Cpu size={14} /> AI Suggestion
          </div>
          {recommendation}

          <div style={{ marginTop: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
            <Link
              to="/courses"
              className="btn btn-outline btn-sm"
              style={{ gap: "var(--space-1)" }}
            >
              Browse all courses <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIRecommenderPage;
