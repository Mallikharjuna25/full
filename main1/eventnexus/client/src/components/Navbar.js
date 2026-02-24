import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = user
        ? [
            { name: 'Home', path: '/home' },
            { name: 'Calendar', path: '/calendar' },
            { name: 'My Events', path: '/my-events' },
            { name: 'Host Event', path: '/host-event' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'Events', path: '/#events' },
            { name: 'Calendar', path: '/calendar' },
            { name: 'Contact', path: '/#contact' },
        ];

    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '15px 5%',
        transition: 'all 0.4s ease',
        background: scrolled ? 'var(--card)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    };

    return (
        <header style={headerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Logo */}
                <Link to={user ? '/home' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--violet)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        ✨
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                        Event<span className="grad-text">Nexus</span>
                    </h2>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="desktop-nav">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => `nav-link ${isActive && link.path !== '/' ? 'active' : ''}`}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop Auth / Profile */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }} className="desktop-nav">
                    {!user ? (
                        <>
                            <Link to="/login" className="btn-outline" style={{ textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
                        </>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 10px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)' }}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.name.split(' ')[0]}</span>
                                <ChevronDown size={14} />
                            </div>

                            {dropdownOpen && (
                                <div className="glass" style={{ position: 'absolute', top: '120%', right: 0, width: '200px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Link to="/profile" className="dropdown-item" style={{ display: 'flex', gap: '10px', padding: '10px', textDecoration: 'none', color: 'var(--text-primary)', borderRadius: '8px' }}>
                                        <User size={16} /> My Profile
                                    </Link>
                                    <Link to="/profile" className="dropdown-item" style={{ display: 'flex', gap: '10px', padding: '10px', textDecoration: 'none', color: 'var(--text-primary)', borderRadius: '8px' }}>
                                        <Settings size={16} /> Settings
                                    </Link>
                                    <div style={{ height: '1px', background: 'var(--border)', margin: '5px 0' }}></div>
                                    <button onClick={logout} className="dropdown-item" style={{ display: 'flex', gap: '10px', padding: '10px', paddingLeft: '10px', textAlign: 'left', background: 'none', border: 'none', color: 'var(--pink)', cursor: 'pointer', borderRadius: '8px', width: '100%', font: 'inherit' }}>
                                        <LogOut size={16} /> Logout
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
                        <NavLink key={link.name} to={link.path} className="nav-link" style={{ padding: '10px 0', fontSize: '1.1rem' }}>
                            {link.name}
                        </NavLink>
                    ))}
                    <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0' }}></div>
                    {!user ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/login" className="btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Sign Up</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/profile" className="btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>Profile</Link>
                            <button onClick={logout} className="btn-primary" style={{ width: '100%' }}>Logout</button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
        .dropdown-item:hover { background: rgba(255,255,255,0.1); }
        .mobile-toggle { display: none; }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block; }
        }
      `}</style>
        </header>
    );
};

export default Navbar;
