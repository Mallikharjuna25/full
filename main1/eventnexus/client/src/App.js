import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { StudentRoute, CoordinatorRoute, StudentGuestRoute, CoordinatorGuestRoute } from "./components/ProtectedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import CalendarPage from "./pages/CalendarPage";

// Student Portal Pages
import StudentLogin from "./pages/student/StudentLogin";
import StudentSignup from "./pages/student/StudentSignup";
import StudentHome from "./pages/student/StudentHome";
import StudentProfile from "./pages/student/StudentProfile";
import StudentMyEvents from "./pages/student/StudentMyEvents";

// Coordinator Portal Pages
import CoordinatorLogin from "./pages/coordinator/CoordinatorLogin";
import CoordinatorSignup from "./pages/coordinator/CoordinatorSignup";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import CoordinatorProfile from "./pages/coordinator/CoordinatorProfile";
import HostEvent from "./pages/coordinator/HostEvent";
import CoordinatorMyEvents from "./pages/coordinator/CoordinatorMyEvents";
import EventAnalytics from "./pages/coordinator/EventAnalytics";

const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />

                    {/* Student guest routes */}
                    <Route element={<StudentGuestRoute />}>
                        <Route path="/student-login" element={<StudentLogin />} />
                        <Route path="/student-signup" element={<StudentSignup />} />
                    </Route>

                    {/* Coordinator guest routes */}
                    <Route element={<CoordinatorGuestRoute />}>
                        <Route path="/coordinator-login" element={<CoordinatorLogin />} />
                        <Route path="/coordinator-signup" element={<CoordinatorSignup />} />
                    </Route>

                    {/* Student protected routes */}
                    <Route element={<StudentRoute />}>
                        <Route path="/student/home" element={<StudentHome />} />
                        <Route path="/student/calendar" element={<CalendarPage />} />
                        <Route path="/student/my-events" element={<StudentMyEvents />} />
                        <Route path="/student/profile" element={<StudentProfile />} />
                    </Route>

                    {/* Coordinator protected routes */}
                    <Route element={<CoordinatorRoute />}>
                        <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
                        <Route path="/coordinator/host-event" element={<HostEvent />} />
                        <Route path="/coordinator/my-events" element={<CoordinatorMyEvents />} />
                        <Route path="/coordinator/analytics" element={<EventAnalytics />} />
                        <Route path="/coordinator/profile" element={<CoordinatorProfile />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
