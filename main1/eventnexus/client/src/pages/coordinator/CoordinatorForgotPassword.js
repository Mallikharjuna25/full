import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Sparkles, Building2, ArrowRight, CheckCircle, KeyRound } from 'lucide-react';
import { authAPI } from '../../services/api';
import OTPInput from '../../components/OTPInput';
import toast from 'react-hot-toast';

const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{
            position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
        }}>
            <Icon size={20} />
        </div>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
                width: '100%', padding: '14px 15px 14px 45px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none',
                transition: 'all 0.3s'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#22D3EE'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
            required
        />
    </div>
);

const CoordinatorForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: otp + new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            return setError('Please enter your email address');
        }

        try {
            setLoading(true);
            const response = await authAPI.requestForgotPasswordOTP(email, 'coordinator');
            toast.success(response.data.message || 'OTP sent to your email!');
            setStep(2);
            setCountdown(60);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || !newPassword || !confirmPassword) {
            return setError('Please fill in all fields');
        }

        if (otp.length !== 6) {
            return setError('Please enter complete 6-digit OTP');
        }

        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setLoading(true);
            const response = await authAPI.resetPasswordWithOTP(email, otp, newPassword, 'coordinator');
            toast.success(response.data.message || 'Password reset successful!');
            setTimeout(() => navigate('/coordinator-login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', background: '#0F172A', overflow: 'hidden'
        }}>
            <div className="noise" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none',
                opacity: 0.05, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
            }} />
            <div className="orb1" style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: '#22D3EE', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, animation: 'float 6s ease-in-out infinite' }} />
            <div className="orb2" style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', background: '#06B6D4', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, animation: 'float 8s ease-in-out infinite reverse' }} />

            <div className="glass animate-fade-up" style={{
                position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', margin: '20px',
                padding: '40px', borderRadius: '24px', backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '24px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #22D3EE, #06B6D4)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={18} color="white" />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white', fontFamily: '"Syne", sans-serif' }}>
                            Event<span style={{ background: 'linear-gradient(135deg, #22D3EE, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nexus</span>
                        </h2>
                    </Link>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 211, 238, 0.15)', color: '#67E8F9', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(34, 211, 238, 0.3)', marginBottom: '16px' }}>
                        <KeyRound size={16} /> Reset Password
                    </div>

                    <h1 style={{ fontSize: '1.8rem', fontFamily: '"Syne", sans-serif', color: 'white', marginBottom: '8px' }}>
                        Forgot your password?
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {step === 1 ? "We'll send you an OTP to reset it" : "Enter OTP and set new password"}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#FCA5A5', padding: '12px 16px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP}>
                        <InputField
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.2)', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                            <p style={{ color: '#22D3EE', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span>Enter your registered email and we'll send you a 6-digit OTP to reset your password.</span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                                border: 'none', borderRadius: '12px', color: 'white',
                                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s', opacity: loading ? 0.7 : 1, marginBottom: '20px'
                            }}
                            onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
                        >
                            {loading ? (
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>Send OTP <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
                            OTP sent to <strong style={{ color: '#22D3EE' }}>{email}</strong>
                        </p>

                        <OTPInput length={6} value={otp} onChange={setOtp} />

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            {countdown > 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    Resend OTP in <span style={{ color: '#22D3EE', fontWeight: 600 }}>{countdown}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleRequestOTP}
                                    disabled={loading}
                                    style={{
                                        background: 'none', border: 'none', color: '#22D3EE',
                                        cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline'
                                    }}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <InputField
                            icon={Lock}
                            type="password"
                            placeholder="New Password (min 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <InputField
                            icon={Lock}
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            style={{
                                width: '100%', padding: '14px', fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                                border: 'none', borderRadius: '12px', color: 'white',
                                fontWeight: 600, cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s', opacity: (loading || otp.length !== 6) ? 0.7 : 1, marginBottom: '16px'
                            }}
                            onMouseEnter={(e) => { if (!loading && otp.length === 6) e.target.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
                        >
                            {loading ? (
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>Reset Password <ArrowRight size={18} /></>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep(1); setOtp(''); setError(''); }}
                            style={{
                                width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)', borderRadius: '12px',
                                color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem'
                            }}
                        >
                            Change Email
                        </button>
                    </form>
                )}

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <Link to="/coordinator-login" style={{ color: '#22D3EE', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorForgotPassword;
