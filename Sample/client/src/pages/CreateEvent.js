import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createEvent } from '../services/api';

const CreateEvent = () => {
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', venue: '', capacity: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      alert('Event created successfully');
      navigate('/home');
    } catch (error) {
      alert('Failed to create event');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={formData.title}
                 onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <textarea placeholder="Description" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <input type="date" value={formData.date}
                 onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          <input type="time" value={formData.time}
                 onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
          <input type="text" placeholder="Venue" value={formData.venue}
                 onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required />
          <input type="number" placeholder="Capacity" value={formData.capacity}
                 onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
          <button type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
