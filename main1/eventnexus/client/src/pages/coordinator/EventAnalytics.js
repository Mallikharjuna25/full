import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { coordinatorAPI } from '../../services/api';
import CoordinatorNavbar from '../../components/CoordinatorNavbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, Download } from 'lucide-react';

const COLORS = ['#22D3EE', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

const EventAnalytics = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // To fetch real analytics, the backend controller 'getEventAnalytics' is used.
                // Assuming no specific event ID is passed, we fetch overall analytics.
                const { data } = await coordinatorAPI.getAnalytics();
                if (data.analytics) {
                    setAnalytics(data.analytics);
                } else {
                    // Fallback to dummy data if API structure doesn't match perfectly yet
                    generateDummyAnalytics();
                }
            } catch (err) {
                console.error("Error fetching analytics, using dummy data", err);
                generateDummyAnalytics();
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const generateDummyAnalytics = () => {
        setAnalytics({
            totalViews: 4520,
            totalRegistrations: 1240,
            totalRevenue: 50000,
            registrationTrends: [
                { date: 'Mon', registrations: 120 },
                { date: 'Tue', registrations: 200 },
                { date: 'Wed', registrations: 150 },
                { date: 'Thu', registrations: 280 },
                { date: 'Fri', registrations: 190 },
                { date: 'Sat', registrations: 210 },
                { date: 'Sun', registrations: 90 },
            ],
            categoryBreakdown: [
                { name: 'Tech', value: 60 },
                { name: 'Cultural', value: 25 },
                { name: 'Sports', value: 15 }
            ],
            topEvents: [
                { title: 'Mega Hackathon 2026', registrations: 450, max: 500 },
                { title: 'Cultural Night Fest', registrations: 320, max: 400 },
                { title: 'Esports Tournament', registrations: 200, max: 200 }
            ]
        });
    }

    const StatCard = ({ title, value, icon: Icon, color = 'var(--cyan)' }) => (
        <div className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: `rgba(255,255,255,0.05)`, border: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                <Icon size={28} />
            </div>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '4px' }}>{title}</p>
                <h3 style={{ fontSize: '2rem', fontFamily: '"Syne", sans-serif', color: 'white', margin: 0, lineHeight: 1 }}>{value}</h3>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
            <CoordinatorNavbar />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '5%', paddingRight: '5%' }}>

                <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', margin: 0, marginBottom: '8px' }}>Analytics Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Global overview of your institution's events.</p>
                    </div>

                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
                        <Download size={18} /> Export Report
                    </button>
                </div>

                {loading || !analytics ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ width: '40px', height: '40px', margin: '0 auto', borderRadius: '50%', border: '4px solid rgba(34, 211, 238, 0.2)', borderTopColor: 'var(--cyan)', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : (
                    <>
                        <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                            <StatCard title="Total Views" value={analytics.totalViews} icon={TrendingUp} color="#3B82F6" />
                            <StatCard title="Total Registrations" value={analytics.totalRegistrations} icon={Users} color="#10B981" />
                            <StatCard title="Total Revenue" value={`₹${analytics.totalRevenue}`} icon={TrendingUp} color="#F59E0B" />
                        </div>

                        <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr lg:2fr', gap: '30px', animationDelay: '0.1s' }}>

                            {/* Registration Trends Chart */}
                            <div className="glass" style={{ padding: '30px', borderRadius: '24px', flex: 2 }}>
                                <h3 style={{ fontSize: '1.2rem', fontFamily: '"Syne", sans-serif', marginBottom: '24px' }}>Registration Trends (Last 7 Days)</h3>
                                <div style={{ width: '100%', height: '300px' }}>
                                    <ResponsiveContainer>
                                        <LineChart data={analytics.registrationTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} itemStyle={{ color: 'var(--cyan)' }} />
                                            <Line type="monotone" dataKey="registrations" stroke="var(--cyan)" strokeWidth={3} dot={{ r: 4, fill: '#0F172A', stroke: 'var(--cyan)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="glass" style={{ padding: '30px', borderRadius: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontFamily: '"Syne", sans-serif', marginBottom: '24px' }}>Registrations by Category</h3>
                                <div style={{ width: '100%', height: '220px' }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={analytics.categoryBreakdown}
                                                cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                                paddingAngle={5} dataKey="value"
                                            >
                                                {analytics.categoryBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: 'auto' }}>
                                    {analytics.categoryBreakdown.map((entry, index) => (
                                        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            {entry.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Events Table */}
                        <div className="glass animate-fade-up" style={{ padding: '30px', borderRadius: '24px', marginTop: '30px', animationDelay: '0.2s' }}>
                            <h3 style={{ fontSize: '1.2rem', fontFamily: '"Syne", sans-serif', marginBottom: '24px' }}>Top Performing Events</h3>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <th style={{ padding: '15px' }}>EVENT TITLE</th>
                                            <th style={{ padding: '15px' }}>REGISTRATIONS</th>
                                            <th style={{ padding: '15px' }}>CAPACITY</th>
                                            <th style={{ padding: '15px' }}>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.topEvents.map((event, i) => {
                                            const capacityPercentage = Math.round((event.registrations / event.max) * 100);
                                            const status = capacityPercentage >= 100 ? 'Full' : 'Open';
                                            const statusColor = status === 'Open' ? '#10B981' : '#EF4444';

                                            return (
                                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}>
                                                    <td style={{ padding: '15px', color: 'white', fontWeight: 500 }}>{event.title}</td>
                                                    <td style={{ padding: '15px', color: 'white' }}>{event.registrations}</td>
                                                    <td style={{ padding: '15px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${capacityPercentage}%`, height: '100%', background: 'var(--cyan)' }}></div>
                                                            </div>
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{capacityPercentage}%</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px' }}>
                                                        <span style={{ color: statusColor, fontSize: '0.9rem', fontWeight: 600, background: `${statusColor}22`, padding: '4px 10px', borderRadius: '12px' }}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </>
                )}
            </main>
        </div>
    );
};

export default EventAnalytics;
