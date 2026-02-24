import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryColor, getCategoryEmoji, daysUntilEvent } from '../utils/helpers';
import { MapPin, Clock, Users } from 'lucide-react';

const EventCard = ({ event, showStatus = false }) => {
    const categoryColor = getCategoryColor(event.category);
    const emoji = getCategoryEmoji(event.category);
    const seatsFilled = (event.registrationCount / event.maxParticipants) * 100;

    const statusColors = {
        pending: '#F59E0B',
        approved: '#10B981',
        rejected: '#EF4444',
        completed: '#3B82F6'
    };

    return (
        <div className="event-card glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

            {/* Image Area */}
            <div
                className="card-img"
                style={{
                    height: '160px',
                    background: event.bannerImage
                        ? `url(${event.bannerImage}) center/cover`
                        : `linear-gradient(135deg, ${categoryColor}40, rgba(0,0,0,0.8))`,
                    position: 'relative'
                }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, var(--navy) 0%, transparent 100%)' }}></div>

                {/* Category Pill */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', background: categoryColor, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {event.category}
                </div>

                {/* Status Pill (Host View) */}
                {showStatus && (
                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: statusColors[event.status] || '#94A3B8', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {event.status}
                    </div>
                )}

                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', opacity: event.bannerImage ? 0 : 0.8 }}>
                    {emoji}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <h3 style={{ fontSize: '17px', margin: 0, lineHeight: '1.3' }}>{event.title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <MapPin size={14} />
                    <span>{event.college}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} />
                        <span>{daysUntilEvent(event.date)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} />
                        <span>{event.registrationCount}{showStatus ? '' : '+ attending'}</span>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div style={{ margin: '5px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span>{event.registrationCount} Registered</span>
                        <span style={{ color: 'var(--text-muted)' }}>Max {event.maxParticipants}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(seatsFilled, 100)}%`, height: '100%', background: seatsFilled >= 100 ? '#EF4444' : 'var(--grad)', borderRadius: '3px' }}></div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                    <div style={{ fontWeight: 'bold', color: event.isFree ? '#10B981' : 'white' }}>
                        {event.isFree ? 'FREE' : `₹${event.entryFee}`}
                    </div>

                    <Link to={`/events/${event._id}`} className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '13px' }}>
                        View Details
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default EventCard;
