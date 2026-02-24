import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', cursor: 'pointer' }}
         onClick={() => navigate(`/event/${event._id}`)}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Venue: {event.venue}</p>
    </div>
  );
};

export default EventCard;
