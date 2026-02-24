import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Please fill all fields');

        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login successful!');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginBottom: '15px', outline: 'none', transition: 'border 0.3s'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div className="orb1"></div>
            <div className="orb2"></div>

            <div className="glass reveal visible" style={{ width: '100%', maxWidth: '450px', padding: '40px', position: 'relative', zIndex: 1, borderRadius: '24px' }}>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ background: 'var(--violet)', width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 15px' }}>
                        ✨
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to manage your events</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            placeholder="you@college.edu"
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '15px', top: '42px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 'bold' }}>Sign up</Link>
                    <div style={{ marginTop: '15px' }}>
                        <Link to="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Admin Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
