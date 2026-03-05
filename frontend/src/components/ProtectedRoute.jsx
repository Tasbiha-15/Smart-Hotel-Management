import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    // 1. Not logged in -> Redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Logged in, but lacks required role -> Redirect home or unauthorized
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or to a dedicated "Forbidden" view
    }

    // 3. Authorized -> Render children routes
    return <Outlet />;
};

export default ProtectedRoute;
