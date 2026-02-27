import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coordinatorAPI } from '../../services/api';
import CoordinatorNavbar from '../../components/CoordinatorNavbar';
import { BarChart3, Users, Calendar, PlusCircle, ExternalLink, Activity, ArrowUpRight, Building2 } from 'lucide-react';
import { SkeletonGrid } from '../../components/SkeletonCard';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                <Icon size={24} />
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '20px' }}>
                    <ArrowUpRight size={14} /> {trend}%
                </div>
            )}
        </div>
        <div>
            <h3 style={{ fontSize: '2rem', fontFamily: '"Syne", sans-serif', color: 'white', margin: 0, lineHeight: 1 }}>{value}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>{title}</p>
        </div>
    </div>
);

const CoordinatorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, activeEvents: 0 });
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch events
                const { data } = await coordinatorAPI.getMyEvents();
                const events = data.events || [];

                // Calculate basic stats
                const totalEvents = events.length;
                const activeEvents = events.filter(e => e.status === 'published').length;
                const totalRegistrations = events.reduce((sum, e) => sum + (e.registrationCount || 0), 0);

                setStats({ totalEvents, totalRegistrations, activeEvents });
                setRecentEvents(events.slice(0, 3)); // Get top 3

            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const collegeName = user?.collegeName || 'Your Institution';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
            <CoordinatorNavbar />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '5%', paddingRight: '5%' }}>

                {/* Header elements */}
                <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '8px' }}>
                            Hello, <span className="grad-text" style={{ backgroundImage: 'linear-gradient(90deg, var(--cyan), #3B82F6)' }}>{user?.name?.split(' ')[0] || 'Coordinator'}</span> 👋
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Building2 size={18} /> {collegeName}
                        </p>
                    </div>
                    <Link to="/coordinator/host-event" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundImage: 'linear-gradient(135deg, var(--cyan) 0%, #3B82F6 100%)', color: '#0F172A', fontWeight: 'bold' }}>
                        <PlusCircle size={20} /> Host New Event
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px', animationDelay: '0.1s' }}>
                    {loading ? (
                        <>
                            <div className="glass" style={{ height: '160px', borderRadius: '16px' }}></div>
                            <div className="glass" style={{ height: '160px', borderRadius: '16px' }}></div>
                            <div className="glass" style={{ height: '160px', borderRadius: '16px' }}></div>
                        </>
                    ) : (
                        <>
                            <StatCard title="Total Events Hosted" value={stats.totalEvents} icon={Calendar} trend={12} />
                            <StatCard title="Total Registrations" value={stats.totalRegistrations} icon={Users} trend={24} />
                            <StatCard title="Active Events" value={stats.activeEvents} icon={Activity} />
                        </>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr lg:2fr', gap: '30px', animationDelay: '0.2s' }}>

                    {/* Recent Events List */}
                    <div className="glass" style={{ padding: '30px', borderRadius: '24px', flex: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontFamily: '"Syne", sans-serif', margin: 0 }}>Recent Events</h2>
                            <Link to="/coordinator/my-events" style={{ color: 'var(--cyan)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                                View All →
                            </Link>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {[1, 2, 3].map(i => <div key={i} className="glass" style={{ height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}></div>)}
                            </div>
                        ) : (
                            recentEvents.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {recentEvents.map(event => (
                                        <div key={event._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', transition: 'all 0.3s' }} className="hover-lift">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'white' }}>{event.title}</h4>
                                                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}</span>
                                                        <span>•</span>
                                                        <span style={{ color: event.status === 'published' ? '#10B981' : '#F59E0B' }}>{event.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{event.registrationCount || 0}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signups</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                        <Calendar size={32} />
                                    </div>
                                    <p style={{ marginBottom: '16px' }}>You haven't hosted any events yet.</p>
                                    <Link to="/coordinator/host-event" className="btn-outline" style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
                                        Create First Event
                                    </Link>
                                </div>
                            )
                        )}
                    </div>

                    {/* Quick Actions / Analytics Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: 1 }}>
                        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '24px' }}>Quick Actions</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link to="/coordinator/host-event" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--cyan)', color: '#0F172A', textDecoration: 'none', borderRadius: '12px', fontWeight: 600, transition: 'transform 0.2s' }} className="hover-lift">
                                    <PlusCircle size={20} /> Create New Event
                                </Link>
                                <Link to="/coordinator/analytics" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 500, border: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover-lift">
                                    <BarChart3 size={20} color="var(--cyan)" /> View Full Analytics
                                </Link>
                            </div>
                        </div>

                        {/* Event Setup Guide */}
                        {stats.totalEvents === 0 && !loading && (
                            <div className="glass" style={{ padding: '24px', borderRadius: '24px', borderLeft: '4px solid #10B981' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', fontFamily: '"Syne", sans-serif' }}>Getting Started</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: 1.5 }}>
                                    Ready to host your first event? Click "Create New Event" to get started. You'll need event details, dates, and posters ready.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
            <style>{`.hover-lift:hover { transform: translateY(-4px); }`}</style>
        </div>
    );
};

// Temp import fix for Building2 if undefined based on previous mock, but imported correctly above.
export default CoordinatorDashboard;
