import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
            {/* Global Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main style={{ minHeight: 'calc(100vh - 72px)' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes (Authentication Required) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Fallback to dashboard if authenticated */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>

                    {/* Protected Routes (Role-Specific Example) */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
                        {/* Example: <Route path="/admin/settings" element={<Settings />} /> */}
                    </Route>

                    {/* Catch-all Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
