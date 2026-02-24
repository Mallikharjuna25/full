import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        college: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [terms, setTerms] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const getPasswordStrength = () => {
        const p = formData.password;
        if (!p) return 0;
        let strength = 0;
        if (p.length >= 6) strength += 1;
        if (p.length >= 10) strength += 1;
        if (/[A-Z]/.test(p) && /[0-9]/.test(p)) strength += 1;
        return strength; // 0-3
    };

    const strength = getPasswordStrength();
    const strengthColors = ['var(--border)', '#EF4444', '#F59E0B', '#10B981'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.college || !formData.password) {
            return toast.error('Please fill all required fields');
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        if (!terms) {
            return toast.error('You must agree to the terms');
        }

        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                college: formData.college,
                password: formData.password
            });
            toast.success('Account created! Complete your profile.');
            navigate('/profile');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginBottom: '15px', outline: 'none'
    };

    const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px', position: 'relative', overflow: 'hidden' }}>
            <div className="orb2"></div>

            <div className="glass reveal visible" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', zIndex: 1, borderRadius: '24px' }}>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join EventNexus to manage your college events</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="John Doe" />
                    </div>

                    <div>
                        <label style={labelStyle}>Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="john@college.edu" />
                    </div>

                    <div>
                        <label style={labelStyle}>College Name *</label>
                        <input type="text" name="college" value={formData.college} onChange={handleChange} style={inputStyle} placeholder="Stanford University" />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={labelStyle}>Password *</label>
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '35px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '-5px', marginBottom: '15px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: '4px', flex: 1, borderRadius: '2px', background: i <= strength ? strengthColors[strength] : 'var(--border)', transition: 'background 0.3s' }}></div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Confirm Password *</label>
                        <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <input type="checkbox" id="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                        <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            I agree to the Terms of Service and Privacy Policy
                        </label>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 'bold' }}>Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
