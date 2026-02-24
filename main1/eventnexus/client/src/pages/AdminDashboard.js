import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { LogOut, CalendarRange, Users, CheckCircle2, XCircle, Clock, ShieldCheck, Mail, Building } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Users paginated
    const [usersList, setUsersList] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const [userTotal, setUserTotal] = useState(0);

    // Events paginated
    const [eventsList, setEventsList] = useState([]);
    const [eventPage, setEventPage] = useState(1);
    const [eventTotal, setEventTotal] = useState(0);
    const [eventFilter, setEventFilter] = useState('');

    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchStats();
        fetchUsers(1);
        fetchEvents(1, '');
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await adminAPI.getStats();
            setStats(data.stats);
        } catch (err) {
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async (page) => {
        try {
            const { data } = await adminAPI.getUsers(page);
            setUsersList(data.users);
            setUserTotal(data.totalPages);
            setUserPage(page);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEvents = async (page, status) => {
        try {
            const { data } = await adminAPI.getEvents(page, status);
            setEventsList(data.events);
            setEventTotal(data.totalPages);
            setEventPage(page);
            setEventFilter(status);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    if (loading || !stats) return <LoadingSpinner />;

    const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>

            {/* Sidebar */}
            <div style={{ width: '250px', background: 'var(--navy2)', borderRight: '1px solid var(--border)', padding: '30px 20px', display: 'flex', flexDirection: 'column' }} className="admin-sidebar">

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
                    <ShieldCheck size={32} color="#EF4444" />
                    <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>EventNexus</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Admin Portal</p>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <button onClick={() => setActiveTab('overview')} className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}>
                        <BarChartIcon /> Overview
                    </button>
                    <button onClick={() => setActiveTab('events')} className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}>
                        <CalendarRange size={20} /> Manage Events
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}>
                        <Users size={20} /> Manage Users
                    </button>
                </nav>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{user.name.charAt(0)}</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{user.name}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>System Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', cursor: 'pointer' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>

            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }} className="admin-content">

                {activeTab === 'overview' && (
                    <div className="reveal visible" style={{ animation: 'fadeIn 0.4s' }}>
                        <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>

                        {/* KPI Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <KPICard title="Total Events" value={stats.totalEvents} icon={<CalendarRange size={24} />} color="var(--violet)" />
                            <KPICard title="Pending Review" value={stats.pendingEvents} icon={<Clock size={24} />} color="#F59E0B" />
                            <KPICard title="Total Users" value={stats.totalUsers} icon={<Users size={24} />} color="var(--cyan)" />
                            <KPICard title="Total Registrations" value={stats.totalRegistrations} icon={<CheckCircle2 size={24} />} color="#10B981" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                            {/* Needs Review List */}
                            <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={20} color="#F59E0B" /> Needs Review</h3>

                                {stats.recentPendingEvents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No events pending review! 🎉</div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {stats.recentPendingEvents.map(ev => (
                                            <div key={ev._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                                <div>
                                                    <h4 style={{ margin: '0 0 5px 0' }}>{ev.title}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>By: {ev.host.name} • {ev.host.college}</p>
                                                </div>
                                                <Link to={`/admin/events/${ev._id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', textDecoration: 'none' }}>Review</Link>
                                            </div>
                                        ))}
                                        {stats.pendingEvents > 5 && (
                                            <button onClick={() => { setActiveTab('events'); fetchEvents(1, 'pending'); }} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', marginTop: '10px' }}>View all pending →</button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Category Chart */}
                            <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '20px' }}>Events by Category</h3>
                                <div style={{ height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={stats.eventsByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="_id">
                                                {stats.eventsByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="reveal visible" style={{ animation: 'fadeIn 0.4s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h1 style={{ margin: 0 }}>Manage Events</h1>
                            <select value={eventFilter} onChange={(e) => fetchEvents(1, e.target.value)} style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', outline: 'none' }}>
                                <option value="" style={{ color: 'black' }}>All Statuses</option>
                                <option value="pending" style={{ color: 'black' }}>Pending Review</option>
                                <option value="approved" style={{ color: 'black' }}>Approved</option>
                                <option value="rejected" style={{ color: 'black' }}>Rejected</option>
                            </select>
                        </div>

                        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                        <th style={{ padding: '20px' }}>Event Name</th>
                                        <th style={{ padding: '20px' }}>Host / College</th>
                                        <th style={{ padding: '20px' }}>Date</th>
                                        <th style={{ padding: '20px' }}>Status</th>
                                        <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventsList.map(ev => (
                                        <tr key={ev._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{ev.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.category}</div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div>{ev.host.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.host.college}</div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div>{formatDate(ev.date)}</div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize',
                                                    background: ev.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : ev.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: ev.status === 'approved' ? '#10B981' : ev.status === 'pending' ? '#F59E0B' : '#EF4444'
                                                }}>
                                                    {ev.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px', textAlign: 'right' }}>
                                                <Link to={`/admin/events/${ev._id}`} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block' }}>
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {eventTotal > 1 && (
                                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px', borderTop: '1px solid var(--border)' }}>
                                    {Array.from({ length: eventTotal }, (_, i) => i + 1).map(p => (
                                        <button key={p} onClick={() => fetchEvents(p, eventFilter)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', background: p === eventPage ? 'var(--cyan)' : 'transparent', color: p === eventPage ? 'black' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="reveal visible" style={{ animation: 'fadeIn 0.4s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h1 style={{ margin: 0 }}>Registered Users</h1>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {usersList.map(u => (
                                <div key={u._id} className="glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
                                        {u.avatar ? <img src={u.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name.charAt(0)}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <h4 style={{ margin: '0 0 5px 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{u.name}</h4>
                                        <p style={{ margin: '0 0 3px 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={12} /> {u.email}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><Building size={12} /> {u.college || 'N/A'} • {u.year} Yr</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {userTotal > 1 && (
                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {Array.from({ length: userTotal }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => fetchUsers(p)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', background: p === userPage ? 'var(--cyan)' : 'transparent', color: p === userPage ? 'black' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
            <style>{`
        .admin-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; color: var(--text-muted); text-align: left; cursor: pointer; border-radius: 12px; font-size: 1rem; transition: all 0.3s; }
        .admin-nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
        .admin-nav-item.active { background: rgba(34, 211, 238, 0.1); color: var(--cyan); font-weight: bold; }
        
        @media (max-width: 900px) {
          .admin-sidebar { width: 80px !important; padding: 20px 10px !important; }
          .admin-sidebar h2, .admin-sidebar p, .admin-nav-item span { display: none !important; }
          .admin-nav-item { justify-content: center; }
          .admin-content { padding: 20px !important; }
        }
      `}</style>
        </div>
    );
};

const KPICard = ({ title, value, icon, color }) => (
    <div className="glass" style={{ padding: '25px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: color, opacity: 0.1, transform: 'scale(2)' }}>{icon}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: `rgba(255,255,255,0.05)`, color: color, padding: '12px', borderRadius: '12px' }}>{icon}</div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>{title}</h3>
        </div>
        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{value}</h2>
    </div>
);

const BarChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
);

export default AdminDashboard;
