import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import EnrolledCoursesPage from "./pages/EnrolledCoursesPage";
import InstructorDashboardPage from "./pages/InstructorDashboardPage";
import ManageCoursePage from "./pages/ManageCoursePage";
import CourseEnrollmentsPage from "./pages/CourseEnrollmentsPage";
import InstructorProfilePage from "./pages/InstructorProfilePage";

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
              background: "#ffffff",
              color: "#111827",
              border: "1.5px solid #e2e5ed",
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(17,24,39,0.08)",
              fontSize: "0.875rem",
            },
            success: { iconTheme: { primary: "#059669", secondary: "#ffffff" } },
            error:   { iconTheme: { primary: "#dc2626", secondary: "#ffffff" } },
          }}
        />
        <ChatBot />
        <Routes>
          {/* Public routes without navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* All routes with navbar */}
          <Route element={<LayoutWithNavbar />}>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/instructor-profile/:id" element={<InstructorProfilePage />} />

            {/* Student protected */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/my-enrollments" element={<EnrolledCoursesPage />} />
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
