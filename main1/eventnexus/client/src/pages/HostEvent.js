import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Plus, Edit3, Trash2, QrCode, BarChart3, AlertCircle } from 'lucide-react';

const HostEvent = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    const fetchEvents = async () => {
        try {
            const { data } = await eventsAPI.getHostEvents();
            setEvents(data.events);
        } catch (err) {
            toast.error('Failed to load hosted events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event permanently?')) return;
        try {
            await eventsAPI.delete(id);
            toast.success('Event deleted');
            fetchEvents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete event');
        }
    };

    const getStatusColor = (status) => {
        const colors = { pending: '#F59E0B', approved: '#10B981', rejected: '#EF4444' };
        return colors[status] || 'white';
    };

    const filtered = activeTab === 'All' ? events : events.filter(e => e.status === activeTab.toLowerCase());

    if (loading) return <LoadingSpinner />;

    return (
        <div style={{ padding: '100px 5% 60px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>

            <div className="reveal visible" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>Host Event</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage events you are organizing.</p>
                </div>
                <Link to="/host-event/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <Plus size={20} /> Create New Event
                </Link>
            </div>

            <div className="reveal visible" style={{ display: 'flex', gap: '15px', borderBottom: '1px solid var(--border)', marginBottom: '30px', overflowX: 'auto' }}>
                {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer',
                            color: activeTab === tab ? 'white' : 'var(--text-muted)',
                            borderBottom: activeTab === tab ? '2px solid var(--cyan)' : '2px solid transparent',
                            fontSize: '1.1rem', fontWeight: '500', whiteSpace: 'nowrap'
                        }}
                    >
                        {tab} {tab !== 'All' && `(${events.filter(e => e.status === tab.toLowerCase()).length})`}
                    </button>
                ))}
            </div>

            <div className="reveal visible" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filtered.length === 0 ? (
                    <div className="glass" style={{ padding: '80px 20px', textAlign: 'center', borderRadius: '24px' }}>
                        <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                            <Plus size={40} />
                        </div>
                        <h3 style={{ marginBottom: '10px' }}>No events here</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Get started by creating your first event.</p>
                        <Link to="/host-event/create" className="btn-primary" style={{ textDecoration: 'none' }}>Create Event</Link>
                    </div>
                ) : (
                    filtered.map(event => (
                        <div key={event._id} className="glass" style={{ padding: '20px', borderRadius: '20px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>

                            <div style={{ width: '120px', height: '80px', borderRadius: '12px', background: event.bannerImage ? `url(${event.bannerImage}) center/cover` : 'var(--grad)' }}></div>

                            <div style={{ flex: '1 1 200px' }}>
                                <h3 style={{ fontSize: '1.3rem', margin: '0 0 5px' }}>{event.title} <Link style={{ fontSize: '0.8rem', color: 'var(--cyan)', textDecoration: 'none', marginLeft: '10px' }} to={`/events/${event._id}`}>(View)</Link></h3>
                                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{formatDate(event.date)} • {event.college}</p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)' }}>{event.category}</span>
                                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: `${getStatusColor(event.status)}20`, color: getStatusColor(event.status), fontWeight: 'bold', textTransform: 'capitalize' }}>
                                        Status: {event.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '30px', textAlign: 'center', padding: '0 20px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }} className="hide-mobile">
                                <div>
                                    <h3 style={{ margin: 0 }}>{event.registrationCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {event.maxParticipants}</span></h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Registrations</p>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0 }}>{event.attendanceCount}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Attended</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end', flex: '1 0 auto' }}>
                                <Link to={`/host-event/edit/${event._id}`} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', textDecoration: 'none' }}>
                                    <Edit3 size={16} /> Edit
                                </Link>

                                {(event.status === 'pending' || event.status === 'rejected') && (
                                    <button onClick={() => handleDelete(event._id)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', color: '#EF4444', borderColor: '#EF4444' }}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                )}

                                {event.status === 'approved' && (
                                    <>
                                        <Link to={`/host-event/${event._id}/scan`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', textDecoration: 'none' }}>
                                            <QrCode size={16} /> Scan QR
                                        </Link>
                                        <Link to={`/host-event/${event._id}/analytics`} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', textDecoration: 'none', borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
                                            <BarChart3 size={16} /> Analytics
                                        </Link>
                                    </>
                                )}
                            </div>

                            {event.status === 'rejected' && event.adminNote && (
                                <div style={{ width: '100%', padding: '12px 15px', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                                    <AlertCircle size={18} flexshrink={0} />
                                    <span><strong>Reason for rejection:</strong> {event.adminNote}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
        </div>
    );
};

export default HostEvent;
