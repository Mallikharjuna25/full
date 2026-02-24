import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, Users, TrendingUp, UserMinus, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EventAnalytics = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await analyticsAPI.getEventAnalytics(id);
                setData(res.data.analytics);
            } catch (err) {
                toast.error('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [id]);

    const handleExport = async () => {
        setExporting(true);
        try {
            await adminAPI.exportAttendance(id);
            toast.success('Attendance CSV has been emailed to you!');
        } catch (err) {
            toast.error('Failed to export data');
        } finally {
            setExporting(false);
        }
    };

    const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

    if (loading) return <LoadingSpinner />;
    if (!data) return null;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--navy)', border: '1px solid var(--border)', padding: '10px 15px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 5px', color: 'var(--text-muted)' }}>{label}</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: payload[0].color }}>Count: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ padding: '100px 5% 60px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>

            <Link to={user.role === 'admin' ? '/admin/dashboard' : '/host-event'} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '20px' }}>
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className="reveal visible" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>Event Analytics</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time insights and attendance data.</p>
                </div>

                {user.role === 'admin' && (
                    <button onClick={handleExport} disabled={exporting} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cyan)', color: 'var(--navy)' }}>
                        {exporting ? <LoadingSpinner size="small" /> : <><Download size={18} /> Export Attendance CSV</>}
                    </button>
                )}
            </div>

            {/* KPI Cards */}
            <div className="reveal visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--violet)', padding: '16px', borderRadius: '16px' }}><Users size={28} /></div>
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>{data.registrationCount}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Registered</p>
                    </div>
                </div>

                <div className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '16px', borderRadius: '16px' }}><TrendingUp size={28} /></div>
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>{data.attendanceCount}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Attended</p>
                    </div>
                </div>

                <div className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--pink)', padding: '16px', borderRadius: '16px' }}><BarChart3 size={28} /></div>
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>{data.successRate.toFixed(1)}%</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Turnout Rate</p>
                    </div>
                </div>

                <div className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '16px', borderRadius: '16px' }}><UserMinus size={28} /></div>
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>{data.noShowCount}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>No Shows</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="reveal visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

                {/* Registration Trend */}
                <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Registration Trend</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        {data.registrationsByDay.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.registrationsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--violet)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--violet)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="count" stroke="var(--violet)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>
                        )}
                    </div>
                </div>

                {/* College Breakdown */}
                <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>College Demographics</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        {data.collegeBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.collegeBreakdown}
                                        cx="50%" cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="_id"
                                    >
                                        {data.collegeBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>
                        )}
                    </div>
                </div>

            </div>
            <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(400px, 1fr))"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default EventAnalytics;
