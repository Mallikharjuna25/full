import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const StudentNavbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { label: "Home", path: "/student/home" },
        { label: "Calendar", path: "/student/calendar" },
        { label: "My Events", path: "/student/my-events" },
        { label: "Profile", path: "/student/profile" }
    ];

    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '15px 5%',
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(15,23,42,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    };

    const getInitials = (name) => {
        if (!name) return "ST";
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <header style={headerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Logo */}
                <Link to="/student/home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--violet)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        ✨
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>
                        Event<span className="grad-text">Nexus</span>
                    </h2>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="desktop-nav">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                style={{
                                    color: isActive ? 'var(--violet)' : 'white',
                                    textDecoration: 'none',
                                    fontWeight: isActive ? 600 : 500,
                                    position: 'relative',
                                    transition: 'color 0.3s'
                                }}
                            >
                                {link.label}
                                {isActive && (
                                    <div style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%', height: '2px', background: 'var(--violet)', borderRadius: '2px' }} />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Desktop Auth / Profile Dropdown */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }} className="desktop-nav">
                    {user && (
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <div
                                style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', cursor: 'pointer', color: 'white',
                                    border: dropdownOpen ? '2px solid var(--violet)' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : getInitials(user.name)}
                            </div>

                            {dropdownOpen && (
                                <div className="glass" style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px',
                                    padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px',
                                    animation: 'dropIn 0.2s ease forwards',
                                    transformOrigin: 'top right', borderRadius: '12px'
                                }}>
                                    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 600, color: 'white', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
                                            <span style={{ fontSize: '10px', padding: '2px 8px', background: 'var(--violet)', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>Student</span>
                                        </div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</span>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--border)', margin: '5px 0' }}></div>

                                    <Link to="/student/profile" className="dropdown-item" style={{ padding: '8px 10px', textDecoration: 'none', color: '#E2E8F0', borderRadius: '8px' }}>
                                        My Profile
                                    </Link>
                                    <Link to="/student/my-events" className="dropdown-item" style={{ padding: '8px 10px', textDecoration: 'none', color: '#E2E8F0', borderRadius: '8px' }}>
                                        My Events
                                    </Link>
                                    <Link to="/student/calendar" className="dropdown-item" style={{ padding: '8px 10px', textDecoration: 'none', color: '#E2E8F0', borderRadius: '8px' }}>
                                        Calendar
                                    </Link>

                                    <div style={{ height: '1px', background: 'var(--border)', margin: '5px 0' }}></div>
                                    <button onClick={logout} className="dropdown-item logout-btn" style={{
                                        padding: '8px 10px', textAlign: 'left', background: 'none', border: 'none',
                                        color: '#EF4444', cursor: 'pointer', borderRadius: '8px', width: '100%', font: 'inherit'
                                    }}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="glass mobile-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {navLinks.map((link) => (
                        <NavLink key={link.label} to={link.path} className="nav-link" style={{ padding: '10px 0', fontSize: '1.1rem', color: 'white', textDecoration: 'none' }}>
                            {link.label}
                        </NavLink>
                    ))}
                    <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0' }}></div>
                    <button onClick={logout} className="btn-primary" style={{ width: '100%' }}>Logout</button>
                </div>
            )}

            <style>{`
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .dropdown-item:hover { background: rgba(255,255,255,0.1); }
                .logout-btn:hover { background: rgba(239,68,68,0.1) !important; color: #F87171 !important; }
                .mobile-toggle { display: none; }
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block; }
                }
            `}</style>
        </header>
    );
};

export default StudentNavbar;
