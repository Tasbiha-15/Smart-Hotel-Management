import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Hotel, User, LogOut } from 'lucide-react';

const GOLD = '#C6A75E';
const DARK = '#0F172A';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /* ── Theme tokens based on current route ── */
    const navBg = isLoginPage ? DARK : 'var(--white)';
    const navShadow = isLoginPage ? 'none' : 'var(--box-shadow)';
    const navBorder = isLoginPage ? `1px solid rgba(255,255,255,0.07)` : 'none';
    const logoColor = GOLD;   /* always gold — looks great on both themes */
    const linkColor = isLoginPage ? 'rgba(255,255,255,0.65)' : 'var(--primary-color)';
    const userColor = isLoginPage ? 'rgba(255,255,255,0.45)' : 'var(--text-light)';
    const dividerColor = isLoginPage ? 'rgba(255,255,255,0.1)' : '#e2e8f0';

    return (
        <nav style={{
            background: navBg,
            padding: '1rem',
            boxShadow: navShadow,
            borderBottom: navBorder,
            position: 'sticky',
            top: 0,
            zIndex: 200,
            transition: 'background 0.3s ease, border-color 0.3s ease',
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Link to="/" style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontWeight: 'bold', fontSize: '1.25rem', color: logoColor,
                    letterSpacing: isLoginPage ? '0.04em' : 'normal',
                    fontFamily: isLoginPage ? "'Playfair Display', Georgia, serif" : 'inherit',
                    textDecoration: 'none',
                }}>
                    <Hotel size={20} /> Smart Hotel
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ color: linkColor, textDecoration: 'none', fontSize: '0.875rem' }}>Dashboard</Link>
                            <Link to="/rooms" style={{ color: linkColor, textDecoration: 'none', fontSize: '0.875rem' }}>Rooms</Link>

                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                borderLeft: `1px solid ${dividerColor}`, paddingLeft: '1.5rem',
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: userColor, fontSize: '0.875rem' }}>
                                    <User size={16} /> {user.firstName} ({user.role})
                                </span>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'none', border: 'none',
                                        color: 'var(--danger-color)',
                                        display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" style={{
                            color: isLoginPage ? GOLD : 'var(--primary-color)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            letterSpacing: isLoginPage ? '0.06em' : 'normal',
                            textTransform: isLoginPage ? 'uppercase' : 'none',
                        }}>Login</Link>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
