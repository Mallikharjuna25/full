import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StudentNavbar from '../../components/StudentNavbar';
import EventCard from '../../components/EventCard';
import { SkeletonGrid } from '../../components/SkeletonCard';
import { Search, Filter, Calendar } from 'lucide-react';

const StudentHome = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Business', 'Hackathon', 'Workshop', 'Other'];

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const { data } = await eventsAPI.getAllEvents({ status: 'approved', category, search: searchTerm });
                setEvents(data.events || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [category, searchTerm]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
            <StudentNavbar />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '5%', paddingRight: '5%' }}>

                {/* Header Section */}
                <div className="animate-fade-up" style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '8px' }}>
                        Welcome back, <span className="grad-text" style={{ backgroundImage: 'var(--grad)' }}>{user?.name?.split(' ')[0] || 'Student'}</span>! 👋
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Discover and register for the latest events happening around you.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="glass animate-fade-up" style={{ padding: '20px', borderRadius: '16px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px', animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                        <div style={{ flex: '1 1 300px', position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search events by title, college, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '14px 15px 14px 45px',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                                    borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--violet)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                            />
                        </div>

                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', overflowX: 'auto', paddingBottom: '5px' }} className="hide-scrollbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                            <Filter size={16} /> Categories:
                        </div>
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setCategory(c === 'All' ? 'All' : c)}
                                style={{
                                    background: category === c || (c === 'All' && category === 'All') ? 'var(--violet)' : 'rgba(255,255,255,0.05)',
                                    color: 'white', border: '1px solid transparent', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s',
                                    borderColor: category === c ? 'transparent' : 'var(--border)',
                                    fontWeight: category === c ? 600 : 400
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontFamily: '"Syne", sans-serif', margin: 0 }}>
                            {category === 'All' ? 'All Events' : `${category} Events`}
                        </h2>
                        {/* Optionally total count or sort options here */}
                    </div>

                    {loading ? <SkeletonGrid /> : (
                        events.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                {events.map((ev, i) => (
                                    <div key={ev._id} className="reveal visible" style={{ transitionDelay: `${i * 0.05}s` }}>
                                        <EventCard event={ev} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px' }}>
                                <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', fontFamily: '"Syne", sans-serif' }}>No events found</h3>
                                <p style={{ color: 'var(--text-muted)' }}>We couldn't find any events matching your current filters.</p>
                                {(category !== 'All' || searchTerm) && (
                                    <button
                                        onClick={() => { setCategory('All'); setSearchTerm(''); }}
                                        className="btn-outline"
                                        style={{ marginTop: '20px' }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )
                    )}
                </div>

            </main>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default StudentHome;
