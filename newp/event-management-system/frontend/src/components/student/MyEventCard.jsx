import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiCheckCircle, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { format } from 'date-fns';

const MyEventCard = ({ registration }) => {
    const [expanded, setExpanded] = useState(false);
    const event = registration.event;

    if (!event) return null;

    return (
        <div className="card p-0 overflow-hidden">
            <div
                className="p-5 cursor-pointer hover:bg-white/5 transition-colors flex flex-col md:flex-row gap-5"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Thumbnail */}
                <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-surface-border">
                    {event.bannerImage ? (
                        <img
                            src={`http://localhost:5000${event.bannerImage}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                            <span className="text-xs font-bold opacity-50 uppercase tracking-widest">{event.category}</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col pt-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white line-clamp-1 pr-4">{event.title}</h3>
                        {registration.attended ? (
                            <span className="shrink-0 flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                                <FiCheckCircle /> Attended
                            </span>
                        ) : (
                            <span className="shrink-0 flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                <FiClock /> Pending
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-gray-400 mb-3">{event.organizerCollegeName}</p>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-300 mt-auto">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-primary-light" />
                            <span>{format(new Date(event.date), 'MMM do, yyyy')} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiMapPin className="text-primary-light" />
                            <span>{event.venue}</span>
                        </div>
                    </div>
                </div>

                {/* Toggle Icon */}
                <div className="hidden md:flex items-center shrink-0 pr-2">
                    {expanded ? <FiChevronUp className="text-2xl text-gray-500" /> : <FiChevronDown className="text-2xl text-gray-500" />}
                </div>
            </div>

            {/* Expanded Content (QR Code) */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/20"
                    >
                        <div className="p-6 flex flex-col md:flex-row items-center gap-8 justify-center">
                            <div className="bg-white p-2 rounded-xl shadow-lg border-2 border-white/10 shrink-0">
                                <img
                                    src={registration.qrCode}
                                    alt="Entry QR"
                                    className="w-40 h-40"
                                />
                            </div>
                            <div className="text-center md:text-left max-w-sm">
                                <h4 className="text-lg font-bold text-primary-light mb-2">Your Entry Pass</h4>
                                <p className="text-sm text-gray-400 mb-4">
                                    Show this QR code at the registration desk on the day of the event. It contains your unique registration ID.
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-surface-card p-3 rounded-lg border border-surface-border">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pass No.</p>
                                        <p className="text-white font-mono break-all line-clamp-1" title={registration._id}>{registration._id}</p>
                                    </div>
                                    <div className="bg-surface-card p-3 rounded-lg border border-surface-border">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Registered On</p>
                                        <p className="text-white">{format(new Date(registration.registeredAt), 'MMM dd, yyyy')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyEventCard;
