import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, ArrowLeft } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        if (role === 'student') {
            navigate('/student-login');
        } else if (role === 'coordinator') {
            navigate('/coordinator-login');
        }
    };

    return (
        <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '20px' }}>
            <div className="orb1"></div>
            <div className="orb2"></div>
            
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(-5px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                }}
            >
                <ArrowLeft size={20} />
                Back to Home
            </button>

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3.5rem', fontFamily: '"Syne", sans-serif', fontWeight: 700, marginBottom: '16px', lineHeight: '1.2' }}>
                        Select Your <span className="grad-text">Role</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto', fontFamily: '"DM Sans", sans-serif' }}>
                        Choose how you want to experience EventNexus
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
                    {/* Student Role Card */}
                    <div 
                        className="glass feature-card"
                        onClick={() => handleRoleSelect('student')}
                        style={{ 
                            padding: '50px 40px', 
                            borderRadius: '24px', 
                            position: 'relative', 
                            overflow: 'hidden', 
                            borderTop: '4px solid var(--violet)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: 'translateY(0)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(124, 58, 237, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--violet)', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%' }}></div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                width: '100px', 
                                height: '100px', 
                                background: 'rgba(124, 58, 237, 0.15)', 
                                borderRadius: '24px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 30px',
                                color: 'var(--violet)'
                            }}>
                                <GraduationCap size={50} />
                            </div>
                            
                            <h3 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '16px', color: 'white' }}>
                                Student
                            </h3>
                            
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '30px', lineHeight: 1.6 }}>
                                Discover and register for exciting inter-college events
                            </p>

                            <div style={{ 
                                padding: '16px 32px', 
                                background: 'var(--violet)', 
                                color: 'white', 
                                borderRadius: '12px', 
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'inline-block'
                            }}>
                                Continue as Student →
                            </div>
                        </div>
                    </div>

                    {/* Coordinator Role Card */}
                    <div 
                        className="glass feature-card"
                        onClick={() => handleRoleSelect('coordinator')}
                        style={{ 
                            padding: '50px 40px', 
                            borderRadius: '24px', 
                            position: 'relative', 
                            overflow: 'hidden', 
                            borderTop: '4px solid var(--cyan)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: 'translateY(0)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(34, 211, 238, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--cyan)', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%' }}></div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                width: '100px', 
                                height: '100px', 
                                background: 'rgba(34, 211, 238, 0.15)', 
                                borderRadius: '24px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 30px',
                                color: 'var(--cyan)'
                            }}>
                                <Shield size={50} />
                            </div>
                            
                            <h3 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '16px', color: 'white' }}>
                                Organizer
                            </h3>
                            
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '30px', lineHeight: 1.6 }}>
                                Host events and manage registrations for your college
                            </p>

                            <div style={{ 
                                padding: '16px 32px', 
                                background: 'var(--cyan)', 
                                color: 'var(--navy)', 
                                borderRadius: '12px', 
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'inline-block'
                            }}>
                                Continue as Organizer →
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    <p>Don't have an account? You'll be able to sign up on the next page.</p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
