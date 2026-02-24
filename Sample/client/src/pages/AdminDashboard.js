import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getEvents } from '../services/api';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await getEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <h3>All Events</h3>
        {events.map(event => (
          <div key={event._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h4>{event.title}</h4>
            <button onClick={() => navigate(`/analytics/${event._id}`)}>View Analytics</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
