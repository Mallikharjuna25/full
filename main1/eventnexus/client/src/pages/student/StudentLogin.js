import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, GraduationCap, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { authAPI } from '../../services/api';
import OTPInput from '../../components/OTPInput';
import toast from 'react-hot-toast';

const InputField = ({ icon: Icon, type, placeholder, value, onChange, isPassword, showPassword, togglePassword }) => (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{
            position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
        }}>
            <Icon size={20} />
        </div>
        <input
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={isPassword ? 'current-password' : ''}
            style={{
                width: '100%', padding: '14px 15px 14px 45px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none',
                transition: 'all 0.3s'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
            required
        />
        {isPassword && (
            <button
                type="button"
                onClick={togglePassword}
                style={{
                    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', padding: '5px'
                }}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        )}
    </div>
);

const StudentLogin = () => {
    const { loginStudent, authError, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [localError, setLocalError] = useState('');
    const [countdown, setCountdown] = useState(0);

    const from = location.state?.from?.pathname || '/student/home';

    // Countdown timer for resend OTP
    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!email || !password) {
            return setLocalError('Please fill in all fields');
        }

        try {
            setLoading(true);
            await loginStudent(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setLoading(false);
        }
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!email) {
            return setLocalError('Please enter your email address');
        }

        try {
            setLoading(true);
            const response = await authAPI.requestLoginOTP(email, 'student');
            toast.success(response.data.message || 'OTP sent to your email!');
            setOtpSent(true);
            setCountdown(60);
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!email || !otp) {
            return setLocalError('Please enter email and OTP');
        }

        if (otp.length !== 6) {
            return setLocalError('Please enter complete 6-digit OTP');
        }

        try {
            setLoading(true);
            const response = await authAPI.verifyLoginOTP(email, otp, 'student');
            
            // Store token and user data
            localStorage.setItem('en_token', response.data.token);
            localStorage.setItem('en_user', JSON.stringify(response.data.user));
            
            toast.success('Login successful!');
            window.location.href = from;
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const toggleLoginMode = () => {
        setLoginMode(loginMode === 'password' ? 'otp' : 'password');
        setLocalError('');
        setOtpSent(false);
        setOtp('');
        clearError();
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            background: '#0F172A', overflow: 'hidden'
        }}>

            {/* Background elements */}
            <div className="noise" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none',
                opacity: 0.05, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
            }} />
            <div className="orb1" style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: 'var(--violet)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, animation: 'float 6s ease-in-out infinite' }} />
            <div className="orb2" style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', background: '#3B82F6', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, animation: 'float 8s ease-in-out infinite reverse' }} />

            <div className="glass animate-fade-up" style={{
                position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', margin: '20px',
                padding: '40px', borderRadius: '24px', backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '24px' }}>
                        <div style={{ background: 'var(--violet)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={18} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white', fontFamily: '"Syne", sans-serif' }}>
                            Event<span className="grad-text">Nexus</span>
                        </h2>
                    </Link>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                            <GraduationCap size={16} /> Student Portal
                        </div>
                    </div>

                    <h1 style={{ fontSize: '1.8rem', fontFamily: '"Syne", sans-serif', color: 'white', marginBottom: '8px' }}>
                        Welcome back, Student
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to discover and register for events</p>
                </div>

                {/* Error Banner */}
                {(localError || authError) && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#FCA5A5', padding: '12px 16px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} />
                        <span>{localError || authError}</span>
                    </div>
                )}

                {/* Login Mode Toggle */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <button
                        type="button"
                        onClick={() => setLoginMode('password')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: loginMode === 'password' ? 'var(--violet)' : 'transparent',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Lock size={16} /> Password
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginMode('otp')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: loginMode === 'otp' ? 'var(--violet)' : 'transparent',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Shield size={16} /> OTP
                    </button>
                </div>

                {/* Password Login Form */}
                {loginMode === 'password' && (
                    <form onSubmit={handlePasswordLogin}>
                        <InputField
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputField
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isPassword
                            showPassword={showPassword}
                            togglePassword={() => setShowPassword(!showPassword)}
                        />

                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <Link to="/student/forgot-password" style={{ color: 'var(--violet)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%', padding: '14px', fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                )}

                {/* OTP Login Form */}
                {loginMode === 'otp' && (
                    <>
                        {!otpSent ? (
                            <form onSubmit={handleRequestOTP}>
                                <InputField
                                    icon={Mail}
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.2)', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                                    <p style={{ color: 'var(--cyan)', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                        <span>We'll send a 6-digit OTP to your registered email address for secure login.</span>
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{
                                        width: '100%', padding: '14px', fontSize: '1rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? (
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} />
                                    ) : (
                                        <>Send OTP <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP}>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
                                        Enter the 6-digit OTP sent to<br />
                                        <strong style={{ color: 'var(--violet)' }}>{email}</strong>
                                    </p>
                                    
                                    <OTPInput
                                        length={6}
                                        value={otp}
                                        onChange={setOtp}
                                    />

                                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                        {countdown > 0 ? (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                Resend OTP in <span style={{ color: 'var(--violet)', fontWeight: 600 }}>{countdown}s</span>
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleRequestOTP}
                                                disabled={loading}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--violet)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="btn-primary"
                                    style={{
                                        width: '100%', padding: '14px', fontSize: '1rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        opacity: (loading || otp.length !== 6) ? 0.7 : 1,
                                        cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                                        marginBottom: '16px'
                                    }}
                                >
                                    {loading ? (
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} />
                                    ) : (
                                        <>Verify & Login <ArrowRight size={18} /></>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setOtpSent(false); setOtp(''); }}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Change Email
                                </button>
                            </form>
                        )}
                    </>
                )}

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                {/* Footer Links */}
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <Link to="/student-forgot-password" style={{ color: 'var(--violet)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'inline-block', marginBottom: '20px' }}>
                        Forgot Password?
                    </Link>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                        Don't have a student account?{' '}
                        <Link to="/student-signup" style={{ color: 'var(--violet)', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
                    </p>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

                    <Link to="/coordinator-login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500, padding: '8px 16px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                        Are you a coordinator? →
                    </Link>

                    <div>
                        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ← Back to EventNexus
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentLogin;
