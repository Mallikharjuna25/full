import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coordinatorAPI } from '../../services/api';
import CoordinatorNavbar from '../../components/CoordinatorNavbar';
import { Calendar, Users, Settings, PlusCircle, ExternalLink, CalendarDays, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { SkeletonGrid } from '../../components/SkeletonCard';

const CoordinatorMyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await coordinatorAPI.getMyEvents();
            setEvents(data.events || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone and will remove all registrations.")) {
            try {
                await coordinatorAPI.deleteEvent(id);
                fetchEvents();
            } catch (err) {
                alert("Failed to delete event.");
            }
        }
    };

    const filteredEvents = events.filter(ev => filter === 'all' || ev.status === filter);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
            <CoordinatorNavbar />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '5%', paddingRight: '5%' }}>

                <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', margin: 0, marginBottom: '8px' }}>Hosted Events</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage and track all events you've created.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '12px' }}>
                            {['all', 'published', 'draft', 'completed'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        background: filter === f ? 'var(--cyan)' : 'transparent',
                                        color: filter === f ? '#0F172A' : 'var(--text-muted)',
                                        border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                        textTransform: 'capitalize', fontWeight: filter === f ? 600 : 400,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <Link to="/coordinator/host-event" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundImage: 'linear-gradient(135deg, var(--cyan) 0%, #3B82F6 100%)', color: '#0F172A', fontWeight: 'bold' }}>
                            <PlusCircle size={18} /> New
                        </Link>
                    </div>
                </div>

                {loading ? <SkeletonGrid /> : (
                    filteredEvents.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                            {filteredEvents.map((ev, i) => (
                                <div key={ev._id} className="glass feature-card reveal visible" style={{ padding: '24px', borderRadius: '16px', position: 'relative', display: 'flex', flexDirection: 'column', transitionDelay: `${i * 0.05}s` }}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ background: ev.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: ev.status === 'published' ? '#10B981' : '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            {ev.status}
                                        </div>

                                        <div className="dropdown" style={{ position: 'relative' }}>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                                            {/* Dropdown menu mock */}
                                            <div className="dropdown-content glass" style={{ display: 'none', position: 'absolute', right: 0, top: '100%', zIndex: 10, width: '150px', borderRadius: '8px', padding: '5px' }}>
                                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', width: '100%', background: 'none', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', borderRadius: '4px' }}><Edit2 size={14} /> Edit</button>
                                                <button onClick={() => handleDelete(ev._id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', width: '100%', background: 'none', border: 'none', color: '#EF4444', textAlign: 'left', cursor: 'pointer', borderRadius: '4px' }}><Trash2 size={14} /> Delete</button>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.4rem', fontFamily: '"Syne", sans-serif', marginBottom: '12px', color: 'white' }}>
                                        {ev.title}
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', flexGrow: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <CalendarDays size={16} />
                                            {ev.startDate ? new Date(ev.startDate).toLocaleDateString() : 'TBA'} - {ev.endDate ? new Date(ev.endDate).toLocaleDateString() : 'TBA'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <Users size={16} />
                                            {ev.registrationCount || 0} Registrations {ev.maxParticipants && `/ ${ev.maxParticipants}`}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                                        <Link to={`/events/${ev._id}`} className="btn-outline" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', color: 'white', borderColor: 'var(--border)' }}>
                                            View Page
                                        </Link>
                                        <Link to={`/coordinator/analytics?event=${ev._id}`} className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--cyan)' }}>
                                            Analytics
                                        </Link>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass" style={{ textAlign: 'center', padding: '80px 20px', borderRadius: '16px' }}>
                            <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                                <Calendar size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', fontFamily: '"Syne", sans-serif' }}>No events found</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px' }}>
                                {filter === 'all' ? "You haven't created any events yet." : `No events with status '${filter}' found.`}
                            </p>
                            {filter === 'all' && (
                                <Link to="/coordinator/host-event" className="btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem', textDecoration: 'none', backgroundImage: 'linear-gradient(135deg, var(--cyan) 0%, #3B82F6 100%)', color: '#0F172A', fontWeight: 'bold' }}>
                                    Create First Event
                                </Link>
                            )}
                        </div>
                    )
                )}
            </main>

            <style>{`.dropdown:hover .dropdown-content { display: block !important; } .dropdown-content button:hover { background: rgba(255,255,255,0.1) !important; }`}</style>
        </div>
    );
};

export default CoordinatorMyEvents;
