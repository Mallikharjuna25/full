import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onClickAction }) => {
    const isFull = event.registrationCount >= event.maxParticipants;
    const eventDate = new Date(event.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="card flex flex-col h-full cursor-pointer hover:shadow-neon transition-all duration-300 overflow-hidden p-0"
        >
            {/* Banner */}
            <div className="relative h-48 w-full bg-surface-border">
                {event.bannerImage ? (
                    <img
                        src={`http://localhost:5000${event.bannerImage}`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                        <span className="text-xl font-bold opacity-50">{event.category}</span>
                    </div>
                )}
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {event.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.organizerCollegeName}</p>

                <div className="space-y-3 mt-auto mb-6">
                    <div className="flex items-center text-sm text-gray-300 gap-2">
                        <FiCalendar className="text-primary-light" />
                        <span>{eventDate} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300 gap-2">
                        <FiMapPin className="text-primary-light" />
                        <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300 gap-2">
                        <FiUsers className="text-primary-light" />
                        <span>{event.registrationCount} / {event.maxParticipants} Registered</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
                    <div
                        className="bg-gradient-neon h-1.5 rounded-full"
                        style={{ width: `${Math.min((event.registrationCount / event.maxParticipants) * 100, 100)}%` }}
                    ></div>
                </div>

                {onClickAction ? (
                    <button
                        onClick={onClickAction}
                        disabled={isFull}
                        className={`w-full py-2.5 rounded-xl font-semibold transition-all ${isFull ? 'bg-surface-border text-gray-500 cursor-not-allowed' : 'btn-primary'}`}
                    >
                        {isFull ? 'Sold Out' : 'Register Now'}
                    </button>
                ) : (
                    <Link to={`/events/${event._id}`} className={`w-full py-2.5 rounded-xl font-semibold transition-all text-center ${isFull ? 'bg-surface-border text-gray-500 cursor-not-allowed' : 'btn-primary'}`}>
                        {isFull ? 'Sold Out' : 'Register Now'}
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

export default EventCard;
