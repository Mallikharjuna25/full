import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const FullPageSpinner = () => (
    <div
        style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0F172A",
        }}
    >
        <div
            style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.1)",
                borderTopColor: "#7C3AED",
                animation: "spin 1s linear infinite",
                marginBottom: "16px",
            }}
        />
        <p style={{ color: "#64748B", fontFamily: "DM Sans, sans-serif" }}>Verifying session…</p>
        <style>
            {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
        </style>
    </div>
);

export const StudentRoute = () => {
    const { isAuthenticated, loading, role, isStudent } = useAuth();
    const location = useLocation();

    if (loading) return <FullPageSpinner />;

    if (!isAuthenticated) {
        return <Navigate to="/student-login" state={{ from: location }} replace />;
    }

    if (!isStudent) {
        return <Navigate to="/coordinator/dashboard" replace />;
    }

    return <Outlet />;
};

export const CoordinatorRoute = () => {
    const { isAuthenticated, loading, role, isCoordinator } = useAuth();
    const location = useLocation();

    if (loading) return <FullPageSpinner />;

    if (!isAuthenticated) {
        return <Navigate to="/coordinator-login" state={{ from: location }} replace />;
    }

    if (!isCoordinator) {
        return <Navigate to="/student/home" replace />;
    }

    return <Outlet />;
};

export const StudentGuestRoute = () => {
    const { isAuthenticated, loading, isStudent, isCoordinator } = useAuth();

    if (loading) return <FullPageSpinner />;

    if (isAuthenticated && isStudent) {
        return <Navigate to="/student/home" replace />;
    }

    if (isAuthenticated && isCoordinator) {
        return <Navigate to="/coordinator/dashboard" replace />;
    }

    return <Outlet />;
};

export const CoordinatorGuestRoute = () => {
    const { isAuthenticated, loading, isStudent, isCoordinator } = useAuth();

    if (loading) return <FullPageSpinner />;

    if (isAuthenticated && isCoordinator) {
        return <Navigate to="/coordinator/dashboard" replace />;
    }

    if (isAuthenticated && isStudent) {
        return <Navigate to="/student/home" replace />;
    }

    return <Outlet />;
};
