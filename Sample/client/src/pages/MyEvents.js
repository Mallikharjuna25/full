import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { getMyEvents } from '../services/api';

const MyEvents = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      const { data } = await getMyEvents();
      setRegistrations(data);
    };
    fetchMyEvents();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>My Registered Events</h2>
        {registrations.map(reg => <EventCard key={reg._id} event={reg.event} />)}
      </div>
    </div>
  );
};

export default MyEvents;
