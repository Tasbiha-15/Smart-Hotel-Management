import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ChevronRight, Eye, EyeOff, Shield } from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const GOLD = '#C6A75E';
const GOLD_LIGHT = '#E2C98A';
const GOLD_DIM = 'rgba(198,167,94,0.15)';
const DARK = '#0F172A';
const DARK_CARD = 'rgba(15,23,42,0.92)';
const GLASS_BG = 'rgba(255,255,255,0.04)';
const GLASS_BDR = 'rgba(255,255,255,0.08)';
const TEXT_MUTED = 'rgba(255,255,255,0.45)';
const TEXT_SUBTLE = 'rgba(255,255,255,0.25)';
const WHITE = '#ffffff';

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } }
};

/*  Ken Burns — slow infinite zoom  */
const kenBurnsVariants = {
    animate: {
        scale: [1, 1.08],
        transition: { duration: 22, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
    }
};

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/* Gold-gradient logo emblem */
const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Emblem circle */}
        <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${GOLD_LIGHT}, ${GOLD} 55%, #8B6914)`,
            boxShadow: `0 0 0 1px rgba(198,167,94,0.35), 0 0 24px rgba(198,167,94,0.25)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.6rem', fontWeight: 700, color: DARK,
                lineHeight: 1, userSelect: 'none',
            }}>S</span>
        </div>
        {/* Brand wordmark */}
        <div>
            <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1rem', fontWeight: 600, letterSpacing: '0.25em',
                background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, #A8842E 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', lineHeight: 1,
            }}>GRAND RESERVE</div>
            <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.5rem', fontWeight: 400, letterSpacing: '0.3em',
                color: TEXT_MUTED, textTransform: 'uppercase', marginTop: '4px',
            }}>Luxury Hotel Management</div>
        </div>
    </div>
);

/* Floating stat pill used on the hero */
const StatPill = ({ value, label, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5, ease: 'backOut' }}
        style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px 20px',
            textAlign: 'center',
        }}
    >
        <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.75rem', fontWeight: 700,
            background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', lineHeight: 1,
        }}>{value}</div>
        <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.6rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: TEXT_MUTED, marginTop: '4px',
        }}>{label}</div>
    </motion.div>
);

/* Decorated divider  */
const Divider = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' }}>
        <div style={{ flex: 1, height: '1px', background: GLASS_BDR }} />
        <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: GOLD, opacity: 0.5,
        }} />
        <div style={{ flex: 1, height: '1px', background: GLASS_BDR }} />
    </div>
);

/* Premium text input with icon and gold focus glow */
const LuxuryInput = ({ icon: Icon, label, type: initialType = 'text', value, onChange, placeholder, required }) => {
    const [focused, setFocused] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const isPassword = initialType === 'password';
    const resolvedType = isPassword ? (showPwd ? 'text' : 'password') : initialType;

    return (
        <div>
            <label style={{
                display: 'block', marginBottom: '6px',
                fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: focused ? GOLD : TEXT_MUTED,
                transition: 'color 0.25s ease',
                fontFamily: "'Inter', sans-serif",
            }}>{label}</label>
            <div style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                background: focused ? 'rgba(198,167,94,0.07)' : GLASS_BG,
                border: `1px solid ${focused ? 'rgba(198,167,94,0.45)' : GLASS_BDR}`,
                borderRadius: '10px',
                boxShadow: focused ? `0 0 0 3px rgba(198,167,94,0.12), 0 0 20px rgba(198,167,94,0.08)` : 'none',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
            }}>
                {/* Left icon */}
                <div style={{
                    padding: '0 14px',
                    color: focused ? GOLD : 'rgba(255,255,255,0.25)',
                    transition: 'color 0.25s ease',
                    display: 'flex', alignItems: 'center', flexShrink: 0,
                }}>
                    <Icon size={15} strokeWidth={1.5} />
                </div>
                <input
                    type={resolvedType}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        flex: 1, padding: '13px 0',
                        background: 'transparent', border: 'none', outline: 'none',
                        color: WHITE, fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.02em',
                    }}
                />
                {/* Password toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        style={{
                            background: 'none', border: 'none', padding: '0 14px',
                            color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = GOLD}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                    >
                        {showPwd ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                    </button>
                )}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('Customer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loadingLocal, setLoadingLocal] = useState(false);

    const { login, register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isLogin && password !== passwordConfirm) {
            setError('Passwords do not match.');
            return;
        }
        setLoadingLocal(true);
        const result = isLogin
            ? await login(email, password)
            : await register({ firstName, lastName, email, password, passwordConfirm, role });
        setLoadingLocal(false);
        if (result.success) navigate('/dashboard');
        else setError(result.message);
    };

    const toggleAuthMode = () => { setIsLogin(!isLogin); setError(''); };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

            {/* ── FULL-BLEED BACKGROUND IMAGE (Ken Burns) ── */}
            <motion.div
                variants={kenBurnsVariants}
                animate="animate"
                style={{
                    position: 'fixed', inset: 0, zIndex: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=85&auto=format&fit=crop')`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transformOrigin: 'center center',
                }}
            />
            {/* Dark veil over the whole page */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(15,23,42,0.72)' }} />

            {/* ── SPLIT LAYOUT: Hero + Form ─────────────── */}
            <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 2 }}>

                {/* ── HERO PANEL (left 60%) ─────────────────── */}
                <div style={{
                    flex: '0 0 60%', position: 'relative', overflow: 'hidden',
                    display: 'none',  /* hidden on very small; overridden via media below */
                }}
                    /* Inline media query workaround: always show on wide screens */
                    className="login-hero"
                >
                    {/* No separate image — uses full-page background */}

                    {/* Radial dark overlay for legibility */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `
            radial-gradient(ellipse at 70% 50%, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.92) 70%),
            linear-gradient(to right, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.2) 100%)
          `,
                    }} />

                    {/* Subtle gold shimmer line at top */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
                        opacity: 0.6,
                    }} />

                    {/* Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                            position: 'relative', zIndex: 1,
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                            height: '100%', padding: '48px 56px',
                        }}
                    >
                        {/* Top: Logo */}
                        <motion.div variants={itemVariants}>
                            <Logo />
                        </motion.div>

                        {/* Middle: Hero copy */}
                        <div>
                            <motion.div variants={itemVariants} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: GOLD_DIM, border: `1px solid rgba(198,167,94,0.2)`,
                                borderRadius: '100px', padding: '6px 14px', marginBottom: '28px',
                            }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, boxShadow: `0 0 8px ${GOLD}` }} />
                                <span style={{
                                    fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                                    color: GOLD, fontFamily: "'Inter', sans-serif", fontWeight: 500,
                                }}>World-Class Hospitality Platform</span>
                            </motion.div>

                            <motion.h1 variants={itemVariants} style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: 'clamp(2.8rem, 4vw, 4rem)', fontWeight: 600,
                                lineHeight: 1.1, color: WHITE,
                                marginBottom: '24px', letterSpacing: '-0.01em',
                            }}>
                                Redefining the<br />
                                <span style={{
                                    fontStyle: 'italic',
                                    background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%)`,
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>Art of Luxury</span>
                            </motion.h1>

                            <motion.p variants={itemVariants} style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '1rem', color: 'rgba(255,255,255,0.55)',
                                lineHeight: 1.75, maxWidth: '420px', marginBottom: '40px',
                            }}>
                                Elevate every guest interaction with intelligent automation, real-time
                                analytics, and a seamless digital experience built for five-star properties.
                            </motion.p>

                            {/* Stat pills */}
                            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '12px' }}>
                                <StatPill value="340+" label="Properties" delay={0.5} />
                                <StatPill value="98%" label="Guest Score" delay={0.65} />
                                <StatPill value="24/7" label="Live Support" delay={0.8} />
                            </motion.div>
                        </div>

                        {/* Bottom: trust badges */}
                        <motion.div variants={itemVariants} style={{
                            display: 'flex', alignItems: 'center', gap: '20px',
                        }}>
                            <Shield size={14} color={GOLD} strokeWidth={1.5} />
                            <span style={{
                                fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                                color: TEXT_MUTED, fontFamily: "'Inter', sans-serif",
                            }}>SOC 2 Certified &nbsp;·&nbsp; GDPR Compliant &nbsp;·&nbsp; ISO 27001</span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── FORM PANEL (right 40%) ───────────────── */}
                <div style={{
                    flex: '1 1 40%',
                    background: 'transparent',
                    display: 'flex', flexDirection: 'column',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Faint top-right glow blob */}
                    <div style={{
                        position: 'absolute', top: '-80px', right: '-80px',
                        width: '280px', height: '280px', borderRadius: '50%',
                        background: `radial-gradient(circle, rgba(198,167,94,0.07) 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-60px', left: '-60px',
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: `radial-gradient(circle, rgba(198,167,94,0.05) 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }} />

                    {/* Scrollable inner */}
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', padding: '48px 44px', overflowY: 'auto',
                        position: 'relative', zIndex: 1,
                    }}>

                        {/* Mobile-only logo */}
                        <div className="login-hero-mobile-logo" style={{ marginBottom: '32px' }}>
                            <Logo />
                        </div>

                        {/* ── Glassmorphism card ── */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                background: GLASS_BG,
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: `1px solid ${GLASS_BDR}`,
                                borderRadius: '20px',
                                padding: '40px 36px',
                                boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
                            }}
                        >
                            {/* Tab switcher */}
                            <motion.div variants={itemVariants} style={{
                                display: 'flex',
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${GLASS_BDR}`,
                                borderRadius: '10px', padding: '4px',
                                marginBottom: '32px',
                            }}>
                                {['Sign In', 'Register'].map((tab, i) => {
                                    const active = (i === 0) === isLogin;
                                    return (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => { setIsLogin(i === 0); setError(''); }}
                                            style={{
                                                flex: 1, padding: '9px 0',
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.03em',
                                                color: active ? DARK : TEXT_MUTED,
                                                background: active
                                                    ? `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`
                                                    : 'transparent',
                                                border: 'none', borderRadius: '7px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: active ? `0 4px 12px rgba(198,167,94,0.3)` : 'none',
                                            }}
                                        >{tab}</button>
                                    );
                                })}
                            </motion.div>

                            {/* Heading */}
                            <motion.div variants={itemVariants} style={{ marginBottom: '28px' }}>
                                <h2 style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: '1.6rem', fontWeight: 600, color: WHITE,
                                    letterSpacing: '-0.01em', marginBottom: '6px',
                                }}>
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.8rem', color: TEXT_MUTED, letterSpacing: '0.01em',
                                }}>
                                    {isLogin
                                        ? 'Sign in to access your Grand Reserve dashboard'
                                        : 'Join the platform trusted by luxury properties worldwide'}
                                </p>
                            </motion.div>

                            <Divider />

                            {/* Error alert */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            background: 'rgba(239,68,68,0.1)',
                                            border: '1px solid rgba(239,68,68,0.25)',
                                            borderRadius: '8px', padding: '10px 14px',
                                            fontSize: '0.8rem',
                                            fontFamily: "'Inter', sans-serif",
                                            color: '#fca5a5', letterSpacing: '0.01em',
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                                <motion.div variants={containerVariants} initial="hidden" animate="visible"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                                >

                                    {/* Registration-only fields */}
                                    <AnimatePresence>
                                        {!isLogin && (
                                            <motion.div
                                                key="reg-fields"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.35 }}
                                                style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}
                                            >
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <LuxuryInput
                                                            icon={User} label="First Name" type="text"
                                                            value={firstName} onChange={e => setFirstName(e.target.value)}
                                                            placeholder="John" required
                                                        />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <LuxuryInput
                                                            icon={User} label="Last Name" type="text"
                                                            value={lastName} onChange={e => setLastName(e.target.value)}
                                                            placeholder="Doe"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Role selector */}
                                                <div>
                                                    <label style={{
                                                        display: 'block', marginBottom: '6px',
                                                        fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.18em',
                                                        textTransform: 'uppercase', color: TEXT_MUTED,
                                                        fontFamily: "'Inter', sans-serif",
                                                    }}>Role</label>
                                                    <select
                                                        value={role}
                                                        onChange={e => setRole(e.target.value)}
                                                        style={{
                                                            width: '100%', padding: '13px 14px',
                                                            background: GLASS_BG,
                                                            border: `1px solid ${GLASS_BDR}`,
                                                            borderRadius: '10px',
                                                            color: WHITE, fontSize: '0.875rem',
                                                            fontFamily: "'Inter', sans-serif",
                                                            outline: 'none', cursor: 'pointer',
                                                            appearance: 'none',
                                                        }}
                                                    >
                                                        {['Customer', 'Receptionist', 'Manager', 'Admin'].map(r => (
                                                            <option key={r} value={r} style={{ background: DARK }}>{r}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Shared fields */}
                                    <motion.div variants={itemVariants}>
                                        <LuxuryInput
                                            icon={Mail} label="Email Address" type="email"
                                            value={email} onChange={e => setEmail(e.target.value)}
                                            placeholder="name@grandreserve.com" required
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <LuxuryInput
                                            icon={Lock} label="Password" type="password"
                                            value={password} onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••" required
                                        />
                                    </motion.div>

                                    <AnimatePresence>
                                        {!isLogin && (
                                            <motion.div
                                                key="confirm-pass"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <LuxuryInput
                                                    icon={Lock} label="Confirm Password" type="password"
                                                    value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                                                    placeholder="••••••••" required
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Forgot password – login only */}
                                    {isLogin && (
                                        <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                                            <a href="#" style={{
                                                fontSize: '0.72rem', color: GOLD, opacity: 0.75,
                                                fontFamily: "'Inter', sans-serif", letterSpacing: '0.03em',
                                                transition: 'opacity 0.2s',
                                            }}
                                                onMouseEnter={e => e.target.style.opacity = 1}
                                                onMouseLeave={e => e.target.style.opacity = 0.75}
                                            >Forgot password?</a>
                                        </div>
                                    )}

                                    {/* CTA button */}
                                    <motion.div variants={itemVariants} style={{ marginTop: '4px' }}>
                                        <button
                                            type="submit"
                                            disabled={loadingLocal}
                                            style={{
                                                width: '100%', padding: '14px',
                                                background: loadingLocal
                                                    ? 'rgba(198,167,94,0.4)'
                                                    : `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, #A8842E 100%)`,
                                                border: 'none', borderRadius: '10px',
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: '0.82rem', fontWeight: 600,
                                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                                color: loadingLocal ? 'rgba(15,23,42,0.6)' : DARK,
                                                cursor: loadingLocal ? 'not-allowed' : 'pointer',
                                                boxShadow: loadingLocal ? 'none' : `0 4px 20px rgba(198,167,94,0.35)`,
                                                transition: 'all 0.3s ease',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            }}
                                            onMouseEnter={e => { if (!loadingLocal) e.currentTarget.style.boxShadow = `0 6px 28px rgba(198,167,94,0.5)`; }}
                                            onMouseLeave={e => { if (!loadingLocal) e.currentTarget.style.boxShadow = `0 4px 20px rgba(198,167,94,0.35)`; }}
                                        >
                                            {loadingLocal ? (
                                                <>
                                                    <span style={{
                                                        display: 'inline-block', width: 14, height: 14,
                                                        border: '2px solid rgba(15,23,42,0.3)',
                                                        borderTopColor: DARK, borderRadius: '50%',
                                                        animation: 'spin 0.7s linear infinite',
                                                    }} />
                                                    {isLogin ? 'Signing In…' : 'Creating Account…'}
                                                </>
                                            ) : (
                                                <>
                                                    {isLogin ? 'Sign In to Dashboard' : 'Create Account'}
                                                    <ChevronRight size={15} strokeWidth={2} />
                                                </>
                                            )}
                                        </button>
                                    </motion.div>

                                    {/* Toggle */}
                                    <motion.div variants={itemVariants} style={{ textAlign: 'center', paddingTop: '4px' }}>
                                        <span style={{
                                            fontSize: '0.75rem', color: TEXT_MUTED,
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={toggleAuthMode}
                                            style={{
                                                background: 'none', border: 'none', padding: 0,
                                                fontSize: '0.75rem', fontWeight: 600,
                                                fontFamily: "'Inter', sans-serif",
                                                color: GOLD, cursor: 'pointer', letterSpacing: '0.02em',
                                                transition: 'opacity 0.2s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            {isLogin ? 'Register Now' : 'Sign In'}
                                        </button>
                                    </motion.div>

                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── FULL-WIDTH FOOTER ────────────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{
                    width: '100%',
                    minHeight: '300px',
                    background: DARK,
                    borderTop: `1px solid ${GLASS_BDR}`,
                    padding: '56px 80px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {/* ── Top columns row ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gap: '48px',
                    alignItems: 'start',
                    paddingBottom: '48px',
                }}>

                    {/* Col 1 – Brand */}
                    <div>
                        {/* Gold emblem row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: '50%',
                                background: `radial-gradient(circle at 35% 35%, ${GOLD_LIGHT}, ${GOLD} 55%, #8B6914)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, color: DARK, lineHeight: 1 }}>S</span>
                            </div>
                            <div style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.15em',
                                background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, #A8842E 100%)`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>GRAND RESERVE</div>
                        </div>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.875rem', color: TEXT_MUTED,
                            letterSpacing: '0.03em', lineHeight: 1.8,
                            maxWidth: '280px',
                        }}>
                            Redefining Luxury in Hospitality.<br />
                            The world's premier platform for five-star hotel management.
                        </p>
                    </div>

                    {/* Col 2 – Quick Links */}
                    <div>
                        <div style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.75rem', fontWeight: 600,
                            letterSpacing: '0.28em', textTransform: 'uppercase',
                            color: WHITE, marginBottom: '20px',
                        }}>Quick Links</div>
                        {['Pricing', 'Services', 'Contact Us'].map(link => (
                            <a key={link} href="#" style={{
                                display: 'block',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.875rem', color: TEXT_MUTED,
                                letterSpacing: '0.04em', lineHeight: 2.4,
                                transition: 'color 0.2s', textDecoration: 'none',
                            }}
                                onMouseEnter={e => e.target.style.color = GOLD}
                                onMouseLeave={e => e.target.style.color = TEXT_MUTED}
                            >{link}</a>
                        ))}
                    </div>

                    {/* Col 3 – Legal */}
                    <div>
                        <div style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.75rem', fontWeight: 600,
                            letterSpacing: '0.28em', textTransform: 'uppercase',
                            color: WHITE, marginBottom: '20px',
                        }}>Legal</div>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                            <a key={link} href="#" style={{
                                display: 'block',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.875rem', color: TEXT_MUTED,
                                letterSpacing: '0.04em', lineHeight: 2.4,
                                transition: 'color 0.2s', textDecoration: 'none',
                            }}
                                onMouseEnter={e => e.target.style.color = GOLD}
                                onMouseLeave={e => e.target.style.color = TEXT_MUTED}
                            >{link}</a>
                        ))}
                    </div>
                </div>

                {/* ── Copyright bar ── */}
                <div style={{
                    borderTop: `1px solid ${GLASS_BDR}`,
                    padding: '20px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.7rem', color: TEXT_SUBTLE,
                        letterSpacing: '0.1em',
                    }}>
                        © 2026 GRAND RESERVE · ALL RIGHTS RESERVED
                    </span>
                    <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.7rem', color: TEXT_SUBTLE,
                        letterSpacing: '0.08em',
                    }}>
                        SOC 2 &nbsp;·&nbsp; GDPR &nbsp;·&nbsp; ISO 27001
                    </span>
                </div>
            </motion.footer>

            {/* ── Spin keyframe + responsive hero visibility ── */}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        /* Show hero panel on wider screens */
        @media (min-width: 768px) {
          .login-hero {
            display: block !important;
          }
          .login-hero-mobile-logo {
            display: none !important;
          }
        }
        /* Mobile: hide hero, show logo inside form panel */
        @media (max-width: 767px) {
          .login-hero {
            display: none !important;
          }
          .login-hero-mobile-logo {
            display: block !important;
          }
        }
        /* Placeholder styling for dark inputs */
        input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        select option {
          background: #0F172A;
          color: #ffffff;
        }
      `}</style>
        </div>
    );
};

export default Login;
