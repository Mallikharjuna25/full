import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAnalytics } from '../services/api';

const EventAnalytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await getAnalytics(id);
      setAnalytics(data);
    };
    fetchAnalytics();
  }, [id]);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Event Analytics: {analytics.event.title}</h2>
        <p><strong>Total Registrations:</strong> {analytics.registrations}</p>
        <p><strong>Total Attendance:</strong> {analytics.attendance}</p>
        <p><strong>Attendance Rate:</strong> {((analytics.attendance / analytics.registrations) * 100).toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default EventAnalytics;
