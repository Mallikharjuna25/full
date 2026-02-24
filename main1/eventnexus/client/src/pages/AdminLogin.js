import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(false);

    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !secretKey) return toast.error('Please fill all fields');

        setLoading(true);
        try {
            await adminLogin(email.trim(), secretKey.trim());
            toast.success('Admin access granted');
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Access denied');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', marginBottom: '15px', outline: 'none'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden', background: 'var(--navy)' }}>
            {/* Background patterns specific to admin */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(45deg, var(--navy) 25%, transparent 25%, transparent 75%, var(--navy) 75%, var(--navy)), linear-gradient(45deg, var(--navy) 25%, transparent 25%, transparent 75%, var(--navy) 75%, var(--navy))', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px', opacity: 0.1 }}></div>

            <div className="glass reveal visible" style={{ width: '100%', maxWidth: '450px', padding: '40px', position: 'relative', zIndex: 1, borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: '#EF4444' }}>
                        <ShieldAlert size={32} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Admin Portal</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Restricted Access Zone</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            placeholder="admin@eventnexus.com"
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Secret Key</label>
                        <input
                            type={showKey ? "text" : "password"}
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            style={inputStyle}
                            placeholder="Enter system secret key"
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            style={{ position: 'absolute', right: '15px', top: '42px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: '#EF4444', color: 'white' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Authenticate'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AdminLogin;
