import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { registrationsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getCategoryColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMine = async () => {
            try {
                const { data } = await registrationsAPI.getMine();

                const calendarEvents = data.registrations
                    .filter(r => r.status !== 'cancelled')
                    .map(r => {
                        const startDate = new Date(r.event.date);
                        const endDate = r.event.endDate ? new Date(r.event.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // add 2 hours if no end date
                        return {
                            id: r.event._id,
                            title: r.event.title,
                            start: startDate,
                            end: endDate,
                            category: r.event.category,
                            venue: r.event.venue,
                        };
                    });
                setEvents(calendarEvents);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMine();
    }, []);

    const eventPropGetter = (event) => {
        const backgroundColor = getCategoryColor(event.category);
        return { style: { backgroundColor, border: 'none', color: 'white', display: 'block' } };
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Navbar />
            <div style={{ padding: '100px 5% 60px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>

                <header className="reveal visible" style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Your Calendar</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Keep track of all your registered events.</p>
                </header>

            <div className="glass reveal visible" style={{ padding: '30px', borderRadius: '24px', background: 'var(--navy2)' }}>
                <div style={{ height: '70vh' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        onSelectEvent={(event) => navigate(`/events/${event.id}`)}
                        eventPropGetter={eventPropGetter}
                        views={['month', 'week', 'agenda']}
                        defaultView="month"
                        popup
                        tooltipAccessor={(event) => `${event.title} at ${event.venue}`}
                    />
                </div>
            </div>

            <div className="reveal visible" style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', padding: '0 20px' }}>
                <h4 style={{ width: '100%', marginBottom: '10px', color: 'var(--text-muted)' }}>Event Categories</h4>
                {['Tech', 'Cultural', 'Sports', 'Business', 'Hackathon', 'Workshop', 'Science', 'Other'].map(cat => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getCategoryColor(cat) }}></div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cat}</span>
                    </div>
                ))}
            </div>

        </div>
        </>
    );
};

export default CalendarPage;
