import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, QrCode, BarChart3, ChevronRight } from 'lucide-react';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated, isStudent, isCoordinator } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Business', 'Hackathon', 'Workshop', 'Other'];

    const handleHostEvent = () => {
        if (!isAuthenticated) {
            navigate('/role-selection');
        } else if (isCoordinator) {
            navigate('/coordinator/host-event');
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Normalize category values to match server enum
                const categoryMap = {
                    'Tech': 'Technology'
                };
                const mappedCategory = categoryMap[category] || category;

                const params = {};
                if (mappedCategory && mappedCategory !== 'All') params.category = mappedCategory;
                if (searchTerm) params.search = searchTerm;
                params.limit = 9;

                const { data } = await eventsAPI.getAllEvents(params);
                setEvents(data.events || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [category, searchTerm]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ overflowX: 'hidden' }}>
            <Navbar />

            {/* Hero Section */}
            <section className="grid-bg" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', paddingBottom: '60px' }}>
                <div className="orb1"></div>
                <div className="orb2"></div>
                <div style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(rgba(15,23,42,0.8), var(--navy))' }}></div>

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '0 5%', alignItems: 'center' }}>

                    <div className="reveal">
                        <div style={{ display: 'inline-block', background: 'rgba(124, 58, 237, 0.2)', color: 'var(--cyan)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '20px', border: '1px solid rgba(124, 58, 237, 0.4)' }}>
                            The Future of College Events
                        </div>
                        <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '20px', fontFamily: '"Syne", sans-serif', fontWeight: 800 }}>
                            <span className="shimmer-text">Discover. Register.</span><br />
                            Verify. Manage.
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px', fontFamily: '"DM Sans", sans-serif' }}>
                            The ultimate platform for inter-college event discovery. seamless registrations, instant QR passes, and real-time analytics for hosts.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {!isStudent && (
                                <button 
                                    onClick={handleHostEvent}
                                    className="btn-primary" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', padding: '14px 28px', border: 'none', cursor: 'pointer' }}
                                >
                                    Host an Event <ChevronRight size={20} />
                                </button>
                            )}
                            <a href="#events" className="btn-outline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', padding: '14px 28px' }}>
                                Explore Events <ChevronRight size={20} />
                            </a>
                        </div>

                        <div style={{ display: 'flex', gap: '40px', marginTop: '50px', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>200+</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Colleges</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>12K+</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Events</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>50K+</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Students</p>
                            </div>
                        </div>
                    </div>

                    <div className="reveal" style={{ position: 'relative' }}>
                        {/* Dashboard Mockup */}
                        <div className="glass animate-float" style={{ padding: '20px', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '15px' }}>
                                    <div style={{ height: '80px', background: 'var(--grad)', borderRadius: '8px', marginBottom: '15px', opacity: 0.8 }}></div>
                                    <div style={{ height: '14px', width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }}></div>
                                    <div style={{ height: '10px', width: '50%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                                </div>
                                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '15px' }}>
                                    <div style={{ height: '80px', background: 'var(--violet)', borderRadius: '8px', marginBottom: '15px', opacity: 0.8 }}></div>
                                    <div style={{ height: '14px', width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }}></div>
                                    <div style={{ height: '10px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                                </div>
                            </div>

                            {/* Float overlays */}
                            <div className="glass animate-float-alt" style={{ position: 'absolute', right: '-30px', top: '50px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)' }}>
                                <div style={{ background: '#10B981', padding: '10px', borderRadius: '12px' }}><QrCode size={24} color="white" /></div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '14px' }}>Entry Verified</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Just now</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Events Section */}
            <section id="events" className="reveal" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', fontFamily: '"Syne", sans-serif' }}>Events Happening Now</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Explore technical symposiums, cultural fests, and workshops across colleges.</p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }} className="hide-scrollbar">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setCategory(c === 'All' ? 'All' : c)}
                                style={{
                                    background: category === c || (c === 'All' && category === 'All') ? 'var(--violet)' : 'rgba(255,255,255,0.05)',
                                    color: 'white', border: 'none', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s'
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Search events by title..."
                        className="contact-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', maxWidth: '400px', padding: '12px 20px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                    />
                </div>

                {loading ? <SkeletonGrid /> : (
                    events.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {events.map((ev, i) => (
                                <div key={ev._id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                    <EventCard event={ev} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                            <h3>No events found matching your criteria.</h3>
                        </div>
                    )
                )}
            </section>

            {/* Features Section */}
            <section className="reveal" style={{ padding: '80px 5%', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif' }}>Everything you need</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                        <div className="glass" style={{ padding: '40px 30px', textAlign: 'center', borderRadius: '24px', transition: 'transform 0.3s' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 20px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--cyan)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Globe size={32} />
                            </div>
                            <h3 style={{ marginBottom: '15px', fontFamily: '"Syne", sans-serif' }}>Centralized Discovery</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Find all inter-college events in one place. Filter by category, college, and date.</p>
                        </div>

                        <div className="glass" style={{ padding: '40px 30px', textAlign: 'center', borderRadius: '24px', transition: 'transform 0.3s' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 20px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--violet)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <QrCode size={32} />
                            </div>
                            <h3 style={{ marginBottom: '15px', fontFamily: '"Syne", sans-serif' }}>QR Verification</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Instant QR code generation upon registration. Seamless entry management using our built-in scanner.</p>
                        </div>

                        <div className="glass" style={{ padding: '40px 30px', textAlign: 'center', borderRadius: '24px', transition: 'transform 0.3s' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 20px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--pink)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BarChart3 size={32} />
                            </div>
                            <h3 style={{ marginBottom: '15px', fontFamily: '"Syne", sans-serif' }}>Real-Time Analytics</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Track registrations, monitor live attendance, and export detailed CSV reports instantly.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="reveal" style={{ padding: '100px 5%', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', fontFamily: '"Syne", sans-serif' }}>How it works</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '30px', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, var(--cyan), var(--violet), var(--pink))', zIndex: 0 }}></div>

                    {[
                        { step: '1', title: 'Browse', desc: 'Find events that interest you' },
                        { step: '2', title: 'Register', desc: 'Fill dynamic forms & upload ID' },
                        { step: '3', title: 'Get QR', desc: 'Receive instant entry pass' },
                        { step: '4', title: 'Enter', desc: 'Scan pass at venue' }
                    ].map((item, i) => (
                        <div key={item.step} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 20px', background: 'var(--navy)', border: '2px solid var(--violet)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {item.step}
                            </div>
                            <h4 style={{ fontFamily: '"Syne", sans-serif' }}>{item.title}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer style={{ padding: '40px 5%', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>© {new Date().getFullYear()} EventNexus. Built for students.</p>
            </footer>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 900px) {
          .grid-bg > div:first-child > div { grid-template-columns: 1fr !important; text-align: center; }
          .grid-bg .btn-primary { margin: 0 auto; }
          .grid-bg > div:first-child > div > div:nth-child(2) { display: none; }
          div[style*="gridTemplateColumns: repeat(4"] { grid-template-columns: 1fr !important; gap: 40px !important; }
          div[style*="position: absolute; top: 30px"] { width: 2px !important; height: 100% !important; left: 50% !important; right: auto !important; top: 0 !important; background: linear-gradient(180deg, var(--cyan), var(--pink)) !important; transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
