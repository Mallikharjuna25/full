import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QRDisplay from '../components/QRDisplay';
import { getEventById, registerForEvent } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await getEventById(id);
      setEvent(data);
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      await registerForEvent(id);
      alert('Registered successfully');
    } catch (error) {
      alert('Registration failed');
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        <p>Time: {event.time}</p>
        <p>Venue: {event.venue}</p>
        <p>Capacity: {event.capacity}</p>
        <button onClick={handleRegister} style={{ margin: '1rem 0' }}>Register</button>
        {event.qrCode && <QRDisplay value={event.qrCode} />}
      </div>
    </div>
  );
};

export default EventDetails;
