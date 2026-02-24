import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getEvents } from '../services/api';

const Calendar = () => {
  const [events, setEvents] = useState([]);

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
        <h2>Event Calendar</h2>
        {events.map(event => (
          <div key={event._id} style={{ margin: '1rem 0' }}>
            <strong>{new Date(event.date).toLocaleDateString()}</strong> - {event.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
