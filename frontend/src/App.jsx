import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import EnrolledCoursesPage from "./pages/EnrolledCoursesPage";
import InstructorDashboardPage from "./pages/InstructorDashboardPage";
import ManageCoursePage from "./pages/ManageCoursePage";
import CourseEnrollmentsPage from "./pages/CourseEnrollmentsPage";
import AIRecommenderPage from "./pages/AIRecommenderPage";

function UnauthorizedPage() {
  return (
    <div className="unauthorized-page">
      <div>
        <h1>403</h1>
        <p>You don&apos;t have permission to access this page.</p>
        <a href="/courses" className="btn btn-primary">
          Go to Courses
        </a>
      </div>
    </div>
  );
}

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a26",
              color: "#f0f0f5",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            },
            success: { iconTheme: { primary: "#34d399", secondary: "#1a1a26" } },
            error: { iconTheme: { primary: "#f87171", secondary: "#1a1a26" } },
          }}
        />
        <Routes>
          {/* Public routes without navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* All routes with navbar */}
          <Route element={<LayoutWithNavbar />}>
            {/* Public */}
            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />

            {/* Student protected */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/my-enrollments" element={<EnrolledCoursesPage />} />
              <Route path="/ai-recommender" element={<AIRecommenderPage />} />
            </Route>

            {/* Instructor protected */}
            <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
              <Route path="/instructor/courses/new" element={<ManageCoursePage />} />
              <Route path="/instructor/courses/:id/edit" element={<ManageCoursePage />} />
              <Route path="/instructor/courses/:id/enrollments" element={<CourseEnrollmentsPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
