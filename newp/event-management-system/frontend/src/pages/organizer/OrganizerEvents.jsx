import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { FiPlus, FiEdit2, FiUsers, FiCamera, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

const OrganizerEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/organizer/events');
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch organizer events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
                    <p className="text-gray-400">Manage all events hosted by your institution.</p>
                </div>
                <Link to="/organizer/dashboard/create" className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                    <FiPlus /> <span className="hidden sm:inline">Create Event</span>
                </Link>
            </div>

            {loading ? (
                <Loader />
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="card p-0 overflow-hidden flex flex-col">
                            <div className="h-40 bg-surface-border relative">
                                {event.bannerImage ? (
                                    <img src={`http://localhost:5000${event.bannerImage}`} alt="Banner" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-neon" />
                                )}
                                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md">
                                    {event.category}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>

                                <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
                                    <span>{format(new Date(event.date), 'MMM do, yyyy')}</span>
                                    <span>{event.participantsCount} / {event.capacity} Joined</span>
                                </div>

                                <div className="mt-auto grid grid-cols-2 gap-2">
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
                                    >
                                        <FiEye /> View
                                    </Link>
                                    <Link
                                        to={`/organizer/dashboard/edit/${event._id}`}
                                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
                                    >
                                        <FiEdit2 /> Edit
                                    </Link>
                                    <Link
                                        to={`/organizer/dashboard/participants/${event._id}`}
                                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
                                    >
                                        <FiUsers /> Guests
                                    </Link>
                                    <Link
                                        to={`/organizer/dashboard/scan/${event._id}`}
                                        className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-light text-sm font-medium transition-colors"
                                    >
                                        <FiCamera /> Scan QR
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-card rounded-2xl border border-surface-border">
                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                        <FiPlus className="text-2xl text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No events created yet</h3>
                    <p className="text-gray-500 mb-6">Start hosting incredible events by creating your first one.</p>
                    <Link to="/organizer/dashboard/create" className="btn-primary inline-flex">
                        Create Event
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OrganizerEvents;
