import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registrationsAPI, eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { Link } from 'react-router-dom';
import { CalendarRange, AlertCircle, TrendingUp } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Business', 'Hackathon', 'Workshop', 'Other'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [regRes, eventsRes] = await Promise.all([
                    registrationsAPI.getMine(),
                    eventsAPI.getAll({ status: 'approved', category, search: searchTerm, limit: 12 })
                ]);
                setRegistrations(regRes.data.registrations);
                setAllEvents(eventsRes.data.events);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [category, searchTerm]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const upcomingRegs = registrations.filter(r => new Date(r.event.date) > new Date() && r.status === 'confirmed');
    const attendedRegs = registrations.filter(r => r.isAttended);

    // Recommended based on college
    const recommended = allEvents.filter(e => e.college === user.college).slice(0, 3);

    return (
        <div style={{ padding: '100px 5% 60px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>

            {/* Header */}
            <header className="reveal visible" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                    {getGreeting()}, <span className="grad-text">{user.name.split(' ')[0]}</span> 👋
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Ready to discover your next big event?</p>
            </header>

            {/* Profile Complete Alert */}
            {!user.isProfileComplete && (
                <div className="glass reveal visible" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', padding: '20px', borderRadius: '16px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <AlertCircle color="#F59E0B" size={28} />
                        <div>
                            <h4 style={{ margin: 0, color: '#FCD34D' }}>Complete your profile</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Add your college and phone number to register for events instantly.</p>
                        </div>
                    </div>
                    <Link to="/profile" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', textDecoration: 'none' }}>
                        Update Profile
                    </Link>
                </div>
            )}

            {/* Stats Row */}
            <div className="reveal visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                <div className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--violet)', padding: '16px', borderRadius: '16px' }}><CalendarRange size={24} /></div>
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{upcomingRegs.length}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Upcoming Events</p>
                    </div>
                </div>
                <div className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '16px', borderRadius: '16px' }}><TrendingUp size={24} /></div>
                    <div>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{attendedRegs.length}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Events Attended</p>
                    </div>
                </div>
            </div>

            {/* Recommended Section */}
            {recommended.length > 0 && (
                <section className="reveal visible" style={{ marginBottom: '60px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '25px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Recommended for you</h2>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Events happening at {user.college}</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {recommended.map(ev => <EventCard key={ev._id} event={ev} />)}
                    </div>
                </section>
            )}

            {/* All Events Section */}
            <section className="reveal visible">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Discover Events</h2>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '10px 15px', borderRadius: '20px', color: 'white', outline: 'none' }}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px' }} className="hide-scrollbar">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setCategory(c === 'All' ? 'All' : c)}
                            style={{
                                background: category === c || (c === 'All' && category === 'All') ? 'var(--violet)' : 'rgba(255,255,255,0.05)',
                                color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s'
                            }}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {loading ? <SkeletonGrid /> : (
                    allEvents.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {allEvents.map(ev => <EventCard key={ev._id} event={ev} />)}
                        </div>
                    ) : (
                        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '20px' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>No events found</h3>
                        </div>
                    )
                )}
            </section>

        </div>
    );
};

export default Home;
