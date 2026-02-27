import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import StudentNavbar from '../../components/StudentNavbar';
import { User, Mail, Building2, Phone, Calendar, Code, MapPin, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const ProfileField = ({ icon: Icon, label, value, isEditing, onChange, name, type = "text", placeholder }) => (
    <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
            <Icon size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%', padding: '12px 15px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--violet)',
                    borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none'
                }}
            />
        ) : (
            <div style={{
                width: '100%', padding: '12px 15px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                borderRadius: '10px', color: value ? 'white' : 'var(--text-muted)', fontSize: '1rem'
            }}>
                {value || 'Not provided'}
            </div>
        )}
    </div>
);

const StudentProfile = () => {
    const { user, updateProfile, authError, clearError } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.profile?.phone || '',
        collegeName: user?.collegeName || '',
        department: user?.department || '',
        year: user?.year || '',
        city: user?.profile?.city || '',
        bio: user?.profile?.bio || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        clearError();

        try {
            setLoading(true);
            // Construct the payload to match what the backend expects
            const payload = {
                name: formData.name,
                collegeName: formData.collegeName,
                department: formData.department,
                year: formData.year,
                profile: {
                    phone: formData.phone,
                    city: formData.city,
                    bio: formData.bio
                }
            };

            await updateProfile(payload, 'student');
            setLoading(false);
            setIsEditing(false);
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "ST";
        return name.substring(0, 2).toUpperCase();
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
            <StudentNavbar />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', paddingLeft: '5%', paddingRight: '5%' }}>

                <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', margin: 0 }}>My Profile</h1>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                            Edit Profile
                        </button>
                    )}
                </div>

                {authError && (
                    <div className="animate-fade-up" style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#FCA5A5', padding: '12px 16px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px'
                    }}>
                        <AlertCircle size={18} /> {authError}
                    </div>
                )}

                {successMsg && (
                    <div className="animate-fade-up" style={{
                        background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#10B981', padding: '12px 16px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px'
                    }}>
                        <CheckCircle2 size={18} /> {successMsg}
                    </div>
                )}

                <div className="glass animate-fade-up" style={{ padding: '40px', borderRadius: '24px', animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--violet) 0%, #3B82F6 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: 'bold', color: 'white',
                            boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.5)'
                        }}>
                            {user.avatar ? <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : getInitials(user.name)}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontFamily: '"Syne", sans-serif', marginBottom: '5px' }}>{user.name}</h2>
                            <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                                <Mail size={16} /> {user.email}
                            </p>
                            <div style={{ marginTop: '10px', display: 'inline-block', background: 'rgba(124, 58, 237, 0.15)', color: 'var(--violet)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                Student Account
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <ProfileField icon={User} label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} required />
                            <ProfileField icon={Phone} label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} placeholder="+91 9876543210" />
                            <ProfileField icon={Building2} label="College / University" name="collegeName" value={formData.collegeName} isEditing={isEditing} onChange={handleChange} />
                            <ProfileField icon={Code} label="Department" name="department" value={formData.department} isEditing={isEditing} onChange={handleChange} placeholder="e.g. Computer Science" />
                            <ProfileField icon={Calendar} label="Year of Study" name="year" value={formData.year} isEditing={isEditing} onChange={handleChange} placeholder="e.g. 3rd Year" />
                            <ProfileField icon={MapPin} label="City" name="city" value={formData.city} isEditing={isEditing} onChange={handleChange} />
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                                Bio
                            </label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us a little about yourself, your interests, and skills..."
                                    rows={4}
                                    style={{
                                        width: '100%', padding: '12px 15px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--violet)',
                                        borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none',
                                        resize: 'vertical'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%', padding: '15px',
                                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                                    borderRadius: '10px', color: formData.bio ? 'white' : 'var(--text-muted)', fontSize: '1rem',
                                    minHeight: '100px'
                                }}>
                                    {formData.bio || "No bio provided yet. Add a short bio to let organizers know more about you."}
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => { setIsEditing(false); setFormData({ ...user, ...user.profile }); }} className="btn-outline" disabled={loading}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {loading ? <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>

            </main>
        </div>
    );
};

export default StudentProfile;
