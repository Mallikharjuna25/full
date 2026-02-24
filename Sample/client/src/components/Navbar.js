import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff' }}>
      <Link to="/home" style={{ color: '#fff', margin: '0 1rem' }}>Home</Link>
      <Link to="/calendar" style={{ color: '#fff', margin: '0 1rem' }}>Calendar</Link>
      <Link to="/my-events" style={{ color: '#fff', margin: '0 1rem' }}>My Events</Link>
      {user?.role === 'host' && <Link to="/host-event" style={{ color: '#fff', margin: '0 1rem' }}>Host Event</Link>}
      {user?.role === 'admin' && <Link to="/admin-dashboard" style={{ color: '#fff', margin: '0 1rem' }}>Dashboard</Link>}
      <Link to="/profile" style={{ color: '#fff', margin: '0 1rem' }}>Profile</Link>
      <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
    </nav>
  );
};

export default Navbar;
