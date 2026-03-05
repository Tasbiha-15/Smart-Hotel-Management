import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Registration fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('Customer'); // Default role

    // Shared fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [error, setError] = useState('');
    const [loadingLocal, setLoadingLocal] = useState(false);

    const { login, register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        setLoadingLocal(true);

        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register({
                firstName,
                lastName,
                email,
                password,
                passwordConfirm,
                role
            });
        }

        setLoadingLocal(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>

            {/* Left Side: Landing Content */}
            <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'var(--white)', '@media (max-width: 768px)': { display: 'none' } }}>
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 600, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Experience Smart<br /><span style={{ color: 'var(--primary-color)' }}>Hospitality</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Elevate your hotel operations with intelligent automation, seamless guest management, and a luxury digital experience.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{
                            padding: '0.875rem 1.75rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 500,
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            Explore Features
                        </button>
                        <button style={{
                            padding: '0.875rem 1.75rem',
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid #475569',
                            borderRadius: '6px',
                            fontWeight: 500,
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Card */}
            <div style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                        {isLogin ? 'Enter your details to access your account' : 'Sign up to start managing your property'}
                    </p>

                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            color: 'var(--danger-color)',
                            border: '1px solid #fecaca',
                            padding: '0.75rem 1rem',
                            borderRadius: '6px',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Registration specific fields */}
                        {!isLogin && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        style={inputStyle}
                                        placeholder="John"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div>
                                <label style={labelStyle}>Select Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle}
                                placeholder="••••••••"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    style={inputStyle}
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loadingLocal}
                            style={{
                                background: 'var(--text-dark)',
                                color: 'var(--white)',
                                padding: '0.875rem',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '500',
                                marginTop: '0.5rem',
                                opacity: loadingLocal ? 0.7 : 1,
                                transition: 'background 0.2s',
                                cursor: loadingLocal ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            {loadingLocal ? (isLogin ? 'Signing in...' : 'Registering...') : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                            onClick={toggleAuthMode}
                            type="button"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-light)',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                padding: '0.25rem'
                            }}
                        >
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>
                                {isLogin ? "Register now" : "Sign in"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable inline styles for minimal elegant inputs
const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-dark)'
};
const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    color: 'var(--text-dark)',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s',
};

export default Login;
