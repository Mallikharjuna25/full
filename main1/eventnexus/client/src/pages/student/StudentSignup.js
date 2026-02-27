import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Building2, ShieldCheck, Eye, EyeOff, AlertCircle, Sparkles, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

const InputField = ({ icon: Icon, type, placeholder, value, onChange, isPassword, showPassword, togglePassword, hint, required }) => (
    <div style={{ position: 'relative', marginBottom: hint ? '8px' : '20px' }}>
        <div style={{
            position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
        }}>
            <Icon size={20} />
        </div>
        <input
            type={isPassword && !showPassword ? 'password' : type}
            placeholder={placeholder + (required ? ' *' : '')}
            value={value}
            onChange={onChange}
            autoComplete={isPassword ? 'new-password' : ''}
            style={{
                width: '100%', padding: '14px 15px 14px 45px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none',
                transition: 'all 0.3s'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
            required={required}
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
        {hint && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px', marginLeft: '5px' }}>{hint}</p>}
    </div>
);

const PasswordStrengthMeter = ({ password }) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length > 10) score++;

    const maxScore = 5;
    const boundedScore = Math.min(Math.max(score, 0), maxScore);

    const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#22D3EE'];
    const activeColor = boundedScore > 0 ? colors[boundedScore - 1] : '#334155';

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '10px' }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                        flex: 1, borderRadius: '2px', transition: 'all 0.3s',
                        background: i < boundedScore ? activeColor : 'rgba(255,255,255,0.1)'
                    }} />
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color={password.length >= 6 ? '#10B981' : 'var(--text-muted)'} /> At least 6 characters
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color={/[0-9]/.test(password) ? '#10B981' : 'var(--text-muted)'} /> Contains at least one number
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color={/[A-Z]/.test(password) ? '#10B981' : 'var(--text-muted)'} /> Contains an uppercase letter
                </div>
            </div>
        </div>
    );
};

const SuccessState = () => (
    <div className="animate-fade-up" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{
            width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}>
            <CheckCircle2 size={40} color="#10B981" />
        </div>
        <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '16px', fontFamily: '"Syne", sans-serif' }}>Account Created!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>Redirecting to your dashboard...</p>
        <div style={{ width: '32px', height: '32px', margin: '0 auto', borderRadius: '50%', border: '3px solid rgba(124,58,237,0.2)', borderTopColor: 'var(--violet)', animation: 'spin 1s linear infinite' }} />
        <style>{`
            @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
    </div>
);

const StudentSignup = () => {
    const { registerStudent, authError, clearError } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', college: '', password: '', confirmPassword: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (formData.password !== formData.confirmPassword) {
            return setLocalError("Passwords do not match");
        }
        if (formData.password.length < 6 || !/[0-9]/.test(formData.password)) {
            return setLocalError("Password requirements not met");
        }
        if (!termsAccepted) {
            return setLocalError("You must agree to the Terms of Service");
        }

        try {
            setLoading(true);
            await registerStudent(formData);
            setLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/student/home', { replace: true });
            }, 1800);
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#0F172A', overflow: 'hidden', padding: '40px 0' }}>

            <div className="noise" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.05, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
            <div className="orb1" style={{ position: 'absolute', top: '10%', right: '20%', width: '400px', height: '400px', background: 'var(--violet)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, animation: 'float 7s ease-in-out infinite' }} />

            <div className="glass animate-fade-up" style={{
                position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px', margin: '20px',
                padding: '40px', borderRadius: '24px', backdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>

                {isSuccess ? <SuccessState /> : (
                    <>
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
                                    <GraduationCap size={16} /> Student Registration
                                </div>
                            </div>

                            <h1 style={{ fontSize: '1.8rem', fontFamily: '"Syne", sans-serif', color: 'white', marginBottom: '8px' }}>
                                Create Student Account
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join 50,000+ students discovering events</p>
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

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <InputField icon={User} type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} name="name" required />
                            <InputField icon={Mail} type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} name="email" required />

                            <div style={{ marginBottom: '20px' }}>
                                <InputField icon={Building2} type="text" placeholder="College / University (optional)" value={formData.college} onChange={handleChange} name="college" hint="You can fill this in your profile later" />
                            </div>

                            <InputField icon={Lock} type="password" placeholder="Password" value={formData.password} onChange={handleChange} name="password" required isPassword showPassword={showPassword} togglePassword={() => setShowPassword(!showPassword)} />

                            {formData.password.length > 0 && <PasswordStrengthMeter password={formData.password} />}

                            <InputField icon={ShieldCheck} type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} name="confirmPassword" required isPassword showPassword={showConfirm} togglePassword={() => setShowConfirm(!showConfirm)} />

                            {/* Terms checkbox */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px', marginTop: '4px' }}>
                                <div
                                    onClick={() => setTermsAccepted(!termsAccepted)}
                                    style={{
                                        width: '20px', height: '20px', borderRadius: '6px',
                                        border: `2px solid ${termsAccepted ? 'var(--violet)' : 'var(--border)'}`,
                                        background: termsAccepted ? 'var(--violet)' : 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, marginTop: '2px'
                                    }}
                                >
                                    {termsAccepted && <CheckCircle2 size={14} color="white" />}
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', cursor: 'pointer' }} onClick={() => setTermsAccepted(!termsAccepted)}>
                                    I agree to EventNexus's Terms of Service and Privacy Policy
                                </span>
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
                                    <><div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} /> Creating account...</>
                                ) : (
                                    <><Sparkles size={18} /> Create Student Account <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div style={{ marginTop: '32px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                                Already have an account?{' '}
                                <Link to="/student-login" style={{ color: 'var(--violet)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                            </p>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

                            <Link to="/coordinator-signup" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500, padding: '8px 16px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                                Are you a coordinator? →
                            </Link>

                            <div>
                                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    ← Back to EventNexus
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentSignup;
