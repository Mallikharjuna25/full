import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    return <Outlet />;
};

export const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;

    return <Outlet />;
};
