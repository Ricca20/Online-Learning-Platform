import { Link, Navigate } from "react-router-dom";
import { BookOpen, GraduationCap, Cpu, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { isAuthenticated, role } = useAuth();

  // If already logged in, redirect them to the dashboard or courses
  if (isAuthenticated) {
    if (role === "instructor") return <Navigate to="/instructor/dashboard" replace />;
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="home-page" style={{ paddingBottom: "var(--space-12)" }}>
      {/* Hero Section */}
      <section 
        className="hero-section" 
        style={{ 
          background: "var(--gradient-hero)", 
          padding: "var(--space-16) var(--space-6)",
          textAlign: "center",
          borderBottom: "1px solid var(--color-border)"
        }}
      >
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--color-accent-soft)", color: "var(--color-accent-hover)", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "var(--space-6)" }}>
            <BookOpen size={16} />
            <span>The ultimate learning platform</span>
          </div>
          
          <h1 style={{ fontSize: "var(--font-size-4xl)", fontWeight: 800, marginBottom: "var(--space-4)", lineHeight: 1.15 }}>
            Master New Skills with LearnHub
          </h1>
          
          <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-8)", lineHeight: 1.6 }}>
            Access expert-led courses in programming, design, and business. Whether you are starting a new career or upgrading your current skills, LearnHub provides the tools and guidance you need to succeed.
          </p>
          
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: "12px 32px", fontSize: "1rem" }}>
              Get Started for Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ padding: "12px 32px", fontSize: "1rem" }}>
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: "var(--space-12) var(--space-6)", background: "var(--color-bg-primary)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Why Choose LearnHub?</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>Everything you need to accelerate your learning journey.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
            {/* Feature 1 */}
            <div style={{ background: "var(--color-bg-card)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: "48px", height: "48px", background: "var(--color-accent-soft)", color: "var(--color-accent)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                <GraduationCap size={24} />
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>Expert Instructors</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Learn directly from industry professionals who have real-world experience. Every course is carefully crafted to ensure high-quality education.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ background: "var(--color-bg-card)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: "48px", height: "48px", background: "var(--color-info-soft)", color: "var(--color-info)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>AI Course Advisor</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Not sure where to start? Chat with our intelligent AI advisor to get personalized course recommendations based on your unique career goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ background: "var(--color-bg-card)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: "48px", height: "48px", background: "var(--color-success-soft)", color: "var(--color-success)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>Interactive Learning</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Engage with rich markdown content, track your progress automatically, and build a portfolio of skills that employers actually care about.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
