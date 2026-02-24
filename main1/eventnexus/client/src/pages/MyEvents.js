import React, { useEffect, useState } from 'react';
import { registrationsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRegistrationStatusColor, formatDate, formatTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const MyEvents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    const fetchMine = async () => {
        try {
            const { data } = await registrationsAPI.getMine();
            setRegistrations(data.registrations);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMine();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel your registration?')) return;
        try {
            await registrationsAPI.cancel(id);
            toast.success('Registration cancelled');
            fetchMine();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
    };

    if (loading) return <LoadingSpinner />;

    const now = new Date();

    const filtered = registrations.filter(reg => {
        const eventDate = new Date(reg.event.date);
        if (activeTab === 'cancelled') return reg.status === 'cancelled';
        if (reg.status === 'cancelled') return false;
        if (activeTab === 'upcoming') return eventDate > now;
        if (activeTab === 'past') return eventDate <= now;
        return true;
    });

    return (
        <div style={{ padding: '100px 5% 60px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>

            <header className="reveal visible" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My Events</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your event registrations and entry passes.</p>
            </header>

            <div className="reveal visible" style={{ display: 'flex', gap: '15px', borderBottom: '1px solid var(--border)', marginBottom: '30px' }}>
                {['upcoming', 'past', 'cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer',
                            color: activeTab === tab ? 'white' : 'var(--text-muted)',
                            borderBottom: activeTab === tab ? '2px solid var(--violet)' : '2px solid transparent',
                            textTransform: 'capitalize', fontSize: '1.1rem', fontWeight: '500'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="reveal visible" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filtered.length === 0 ? (
                    <div className="glass" style={{ padding: '80px 20px', textAlign: 'center', borderRadius: '24px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎟️</div>
                        <h3 style={{ marginBottom: '10px' }}>No {activeTab} events</h3>
                        {activeTab === 'upcoming' && (
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Explore the platform and register for some events.</p>
                        )}
                        {activeTab === 'upcoming' && <Link to="/home" className="btn-primary" style={{ textDecoration: 'none' }}>Discover Events</Link>}
                    </div>
                ) : (
                    filtered.map((reg) => (
                        <div key={reg._id} className="glass" style={{ padding: '20px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>

                            <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: reg.event.bannerImage ? `url(${reg.event.bannerImage}) center/cover` : 'var(--border)' }}></div>

                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{reg.event.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{formatDate(reg.event.date)} at {formatTime(reg.event.time)}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '5px 0 0 0' }}>📍 {reg.event.venue}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Status</span>
                                    <span style={{ background: `${getRegistrationStatusColor(reg.status)}20`, color: getRegistrationStatusColor(reg.status), padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                        {reg.status}
                                    </span>
                                </div>

                                {reg.status === 'confirmed' && reg.qrCodeImage && activeTab === 'upcoming' && (
                                    <div style={{ marginLeft: '10px' }}>
                                        <img src={reg.qrCodeImage} alt="QR" style={{ width: '50px', height: '50px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border)' }} onClick={() => { window.location.href = `/my-events/${reg.event._id}` }} />
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Link to={`/my-events/${reg.event._id}`} className="btn-primary" style={{ textDecoration: 'none', padding: '6px 16px', fontSize: '0.9rem', textAlign: 'center' }}>
                                        View Pass
                                    </Link>
                                    {activeTab === 'upcoming' && (
                                        <button onClick={() => handleCancel(reg._id)} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.9rem', color: '#EF4444', borderColor: '#EF4444' }}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default MyEvents;
