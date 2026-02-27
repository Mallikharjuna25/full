import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, isStudent, isCoordinator } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/#events' },
        { name: 'Calendar', path: '/calendar' },
        { name: 'About Us', path: '/#about' },
        { name: 'Contact', path: '/#contact' },
    ];

    const handleNavClick = (e, path) => {
        if (path.startsWith('/#')) {
            e.preventDefault();
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    document.querySelector(path.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                document.querySelector(path.substring(1))?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

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
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--violet)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        ✨
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>
                        Event<span className="grad-text">Nexus</span>
                    </h2>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="desktop-nav">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={(e) => handleNavClick(e, link.path)}
                            className={({ isActive }) => `nav-link ${isActive && link.path !== '/' && !link.path.includes('#') ? 'active' : ''}`}
                            style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop Auth / Profile CTA */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }} className="desktop-nav">
                    {!isAuthenticated ? (
                        <Link to="/role-selection" className="btn-primary" style={{ textDecoration: 'none' }}>Login</Link>
                    ) : (
                        isStudent ? (
                            <Link to="/student/home" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
                        ) : isCoordinator ? (
                            <Link to="/coordinator/dashboard" className="btn-primary" style={{ textDecoration: 'none', backgroundImage: 'var(--grad2)' }}>Go to Dashboard</Link>
                        ) : null
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="glass mobile-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid var(--border)' }}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={(e) => { handleNavClick(e, link.path); setIsOpen(false); }}
                            className="nav-link"
                            style={{ padding: '10px 0', fontSize: '1.1rem', color: 'white', textDecoration: 'none' }}>
                            {link.name}
                        </NavLink>
                    ))}
                    <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0' }}></div>
                    {!isAuthenticated ? (
                        <Link to="/role-selection" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Login</Link>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {isStudent && <Link to="/student/home" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Go to Dashboard</Link>}
                            {isCoordinator && <Link to="/coordinator/dashboard" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Go to Dashboard</Link>}
                        </div>
                    )}
                </div>
            )}

            <style>{`
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
