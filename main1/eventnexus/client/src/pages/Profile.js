import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { Camera, Edit3, X, Save, Lock, Mail, Phone, Building, Calendar, Hash } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [avatarFile, setAvatarFile] = useState(null);

    const [formData, setFormData] = useState({
        name: user.name || '',
        college: user.college || '',
        department: user.department || '',
        phone: user.phone || '',
        year: user.year || '',
        bio: user.bio || ''
    });

    const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwdLoading, setPwdLoading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: 2097152, // 2MB
        onDrop: accepted => {
            setAvatarFile(accepted[0]);
            setAvatarPreview(URL.createObjectURL(accepted[0]));
        }
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePwdChange = (e) => setPwdData({ ...pwdData, [e.target.name]: e.target.value });

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (avatarFile) data.append('avatar', avatarFile);

            const res = await authAPI.updateProfile(data);
            updateUser(res.data.user);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwdData.newPassword !== pwdData.confirmPassword) return toast.error('Passwords do not match');
        setPwdLoading(true);
        try {
            await authAPI.changePassword({ currentPassword: pwdData.currentPassword, newPassword: pwdData.newPassword });
            toast.success('Password changed successfully');
            setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password update failed');
        } finally {
            setPwdLoading(false);
        }
    };

    const getCompletionPercent = () => {
        const keys = ['name', 'college', 'department', 'phone', 'year'];
        const filled = keys.filter(k => !!user[k]).length;
        return Math.round((filled / keys.length) * 100);
    };

    const percent = getCompletionPercent();

    const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', outline: 'none', marginBottom: '15px' };

    if (!user) return <LoadingSpinner />;

    return (
        <div style={{ padding: '100px 5% 60px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>

            {/* Left Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass reveal visible" style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '24px', position: 'relative' }}>

                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
                        {isEditing ? (
                            <div {...getRootProps()} style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--navy2)', border: '2px dashed var(--cyan)', cursor: 'pointer', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <input {...getInputProps()} />
                                {avatarPreview ? <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={32} color="var(--cyan)" />}
                                <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.6)', padding: '5px', fontSize: '12px', color: 'white' }}>Upload</div>
                            </div>
                        ) : (
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--grad)', fontSize: '2.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                                {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <h2 style={{ margin: '0 0 5px 0' }}>{user.name}</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{user.college || 'College not provided'}</p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '20px', display: 'inline-block', margin: '15px 0 0', fontSize: '0.8rem', color: 'var(--cyan)' }}>
                        {user.role.toUpperCase()}
                    </div>
                </div>

                <div className="glass reveal visible" style={{ padding: '25px', borderRadius: '24px' }}>
                    <h4 style={{ marginBottom: '15px' }}>Profile Completion</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                        <span>{percent}% Complete</span>
                        <span>{percent === 100 ? 'Awesome!' : 'Needs completion'}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: percent === 100 ? '#10B981' : 'var(--grad)', borderRadius: '4px' }}></div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                <div className="glass reveal visible" style={{ padding: '40px', borderRadius: '24px', position: 'relative' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 style={{ margin: 0 }}>Personal Information</h2>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                                <Edit3 size={16} /> Edit Profile
                            </button>
                        ) : (
                            <button onClick={() => { setIsEditing(false); setAvatarPreview(user.avatar); setFormData({ name: user.name, college: user.college, department: user.department, phone: user.phone, year: user.year, bio: user.bio }) }} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', color: '#EF4444', borderColor: '#EF4444' }}>
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'x', columnGap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>College</label>
                                <input type="text" name="college" value={formData.college} onChange={handleChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Department</label>
                                <input type="text" name="department" value={formData.department} onChange={handleChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone Number</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Year of Study</label>
                                <select name="year" value={formData.year} onChange={handleChange} style={inputStyle}>
                                    <option value="">Select Year...</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                    <option value="PG">Post Graduate</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Short Bio (Max 300 chars)</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} maxLength={300} rows={3} style={inputStyle} />
                            </div>

                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {loading ? <LoadingSpinner size="small" /> : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}><Mail size={16} /> Email Address</p>
                                <p style={{ fontSize: '1.1rem', margin: 0 }}>{user.email}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}><Building size={16} /> Department</p>
                                <p style={{ fontSize: '1.1rem', margin: 0 }}>{user.department || '—'}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}><Phone size={16} /> Phone</p>
                                <p style={{ fontSize: '1.1rem', margin: 0 }}>{user.phone || '—'}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}><Calendar size={16} /> Year of Study</p>
                                <p style={{ fontSize: '1.1rem', margin: 0 }}>{user.year ? `${user.year} Year` : '—'}</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}><Hash size={16} /> Bio</p>
                                <p style={{ fontSize: '1rem', margin: 0, lineHeight: '1.6' }}>{user.bio || '—'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="glass reveal visible" style={{ padding: '40px', borderRadius: '24px' }}>
                    <h2 style={{ margin: '0 0 30px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Lock size={24} color="var(--pink)" /> Security</h2>
                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                        <input type="password" name="currentPassword" value={pwdData.currentPassword} onChange={handlePwdChange} required placeholder="Current Password" style={inputStyle} />
                        <input type="password" name="newPassword" value={pwdData.newPassword} onChange={handlePwdChange} required placeholder="New Password" style={inputStyle} />
                        <input type="password" name="confirmPassword" value={pwdData.confirmPassword} onChange={handlePwdChange} required placeholder="Confirm New Password" style={inputStyle} />
                        <button type="submit" disabled={pwdLoading} className="btn-outline" style={{ marginTop: '10px' }}>
                            {pwdLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

            </div>

            <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: minmax(300px, 1fr) 2fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default Profile;
