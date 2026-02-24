import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HostEvent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Host an Event</h2>
        <button onClick={() => navigate('/create-event')} style={{ margin: '1rem', padding: '1rem 2rem' }}>
          Create New Event
        </button>
      </div>
    </div>
  );
};

export default HostEvent;
