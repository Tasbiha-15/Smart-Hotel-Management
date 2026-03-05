import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);

    // Example of fetching protected data on load
    useEffect(() => {
        // You would replace this with actual backend statistics routes
        const fetchDashboardStats = async () => {
            try {
                // e.g. const res = await api.get('/analytics/dashboard');
                // setStats(res.data.data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        if (user?.role === 'Admin' || user?.role === 'Manager') {
            fetchDashboardStats();
        }
    }, [user]);

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.firstName}!</h1>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                You are logged in into the <strong>{user?.role}</strong> portal.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Placeholder Stat Card */}
                <div className="card">
                    <h3 style={{ color: 'var(--text-light)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {user?.role === 'Customer' ? 'My Bookings' : 'Total Active Bookings'}
                    </h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-color)', margin: '0.5rem 0' }}>
                        {user?.role === 'Customer' ? '3' : '1,204'}
                    </p>
                    <a href="#" style={{ fontSize: '0.875rem', fontWeight: '500' }}>View details &rarr;</a>
                </div>

                {/* Dashboard Actions differ by Role */}
                <div className="card" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Quick Actions</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

                        {user?.role === 'Customer' && (
                            <>
                                <button style={btnStyle}>Book a New Room</button>
                                <button style={btnStyleSecondary}>Leave a Review</button>
                            </>
                        )}

                        {(user?.role === 'Admin' || user?.role === 'Manager') && (
                            <>
                                <button style={btnStyle}>Manage Rooms</button>
                                <button style={btnStyleSecondary}>View Revenue Analytics</button>
                                <button style={btnStyleSecondary}>Generate Reports</button>
                            </>
                        )}

                        {user?.role === 'Receptionist' && (
                            <>
                                <button style={btnStyle}>Check-In Guest</button>
                                <button style={btnStyleSecondary}>Update Room Status</button>
                            </>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

// Extracted styles to keep JSX clean
const btnStyle = {
    background: 'var(--primary-color)', color: 'var(--white)',
    padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px',
    fontWeight: '500', transition: 'background 0.2s ease'
};

const btnStyleSecondary = {
    ...btnStyle,
    background: '#e2e8f0', color: 'var(--text-dark)',
};

export default Dashboard;
