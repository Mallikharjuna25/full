import React, { useEffect, useState, Fragment } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, registrationsAPI, adminAPI } from '../services/api';
import { formatDate, formatTime, getCategoryColor, getCategoryEmoji, daysUntilEvent } from '../utils/helpers';
import { MapPin, Calendar, Clock, Users, ArrowLeft, Building, Tag, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import QRDisplay from '../components/QRDisplay';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myRegistration, setMyRegistration] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Admin action state
    const [adminNote, setAdminNote] = useState('');
    const [reviewing, setReviewing] = useState(false);

    // Registration Form State
    const [step, setStep] = useState(1); // 1: Form, 2: ID, 3: Review
    const [formData, setFormData] = useState({});
    const [idProof, setIdProof] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await eventsAPI.getById(id);
                setEvent(data.event);

                if (user) {
                    const regsRes = await registrationsAPI.getMine();
                    const reg = regsRes.data.registrations.find(r => r.event._id === id);
                    if (reg) setMyRegistration(reg);
                }
            } catch (err) {
                toast.error('Failed to load event');
                if (user?.role === 'admin') navigate('/admin/dashboard');
                else navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, user, navigate]);

    const isAdminView = location.pathname.includes('/admin/events');
    const isHostView = user && event && user._id === event.host._id && !isAdminView;

    const handleAdminReview = async (action) => {
        if (action === 'reject' && !adminNote) return toast.error('Please provide a reason for rejection');
        setReviewing(true);
        try {
            await adminAPI.reviewEvent(id, { action, adminNote });
            toast.success(`Event ${action}ed successfully`);
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error('Review failed');
        } finally {
            setReviewing(false);
        }
    };

    const handleRegisterSubmit = async () => {
        if (!idProof) return toast.error('ID proof is required');
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('formData', JSON.stringify(formData));
            data.append('idProofImage', idProof);

            const res = await registrationsAPI.register(id, data);
            toast.success('Successfully registered! 🎉');
            setMyRegistration({ ...res.data.registration, event });
            setModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: 5242880, // 5MB
        onDrop: accepted => setIdProof(accepted[0])
    });

    if (loading) return <LoadingSpinner />;
    if (!event) return null;

    const bannerStyle = {
        background: event.bannerImage
            ? `linear-gradient(to bottom, rgba(15,23,42,0.6), var(--navy)), url(${event.bannerImage}) center/cover`
            : `linear-gradient(to bottom, ${getCategoryColor(event.category)}40, var(--navy))`,
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '40px 5%'
    };

    const isRegistrationOpen = new Date() < new Date(event.registrationDeadline) && event.registrationCount < event.maxParticipants;

    return (
        <div style={{ paddingBottom: '100px', minHeight: '100vh' }}>

            {/* Dynamic Banner */}
            <div style={bannerStyle}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', marginBottom: '20px', backdropFilter: 'blur(10px)' }}>
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <span style={{ background: getCategoryColor(event.category), padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            {getCategoryEmoji(event.category)} {event.category}
                        </span>
                        {event.status !== 'approved' && (
                            <span style={{ background: event.status === 'pending' ? '#F59E0B' : '#EF4444', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                Status: {event.status}
                            </span>
                        )}
                    </div>

                    <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', lineHeight: '1.1' }}>{event.title}</h1>
                    <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={18} color="var(--cyan)" /> {event.college}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="var(--pink)" /> {formatDate(event.date)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--violet)" /> {event.venue}</span>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 5%', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>

                {/* Left Column - Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    {/* Images Strip */}
                    {event.images && event.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px' }} className="hide-scrollbar">
                            {event.images.map((img, i) => (
                                <img key={i} src={img} alt={`Event ${i}`} style={{ height: '200px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }} />
                            ))}
                        </div>
                    )}

                    {/* Description & Instructions */}
                    <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Info size={24} color="var(--cyan)" /> About the Event</h3>
                        <div dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br/>') }} style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}></div>

                        {event.instructions && (
                            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
                                <h4 style={{ color: '#FCD34D', marginBottom: '10px' }}>Special Instructions</h4>
                                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{event.instructions}</p>
                            </div>
                        )}
                    </section>

                    {/* Rules */}
                    {event.rules && event.rules.length > 0 && (
                        <section className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck size={24} color="var(--violet)" /> Rules & Guidelines</h3>
                            <ol style={{ paddingLeft: '20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {event.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                            </ol>
                        </section>
                    )}

                    {/* Tags & Coordinators grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={20} color="var(--pink)" /> Coordinators</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {event.coordinators.map((c, i) => (
                                    <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{c.name}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>📞 {c.phone}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>✉️ {c.email}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Tag size={20} color="var(--cyan)" /> Tags</h4>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {event.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sticky Panel */}
                <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div className="glass" style={{ padding: '30px', borderRadius: '24px', background: 'rgba(15,23,42,0.8)' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                            <h2 style={{ fontSize: '2rem', margin: 0, color: event.isFree ? '#10B981' : 'white' }}>{event.isFree ? 'FREE' : `₹${event.entryFee}`}</h2>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Entry Fee</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet)' }}><Clock size={20} /></div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{formatTime(event.time)}</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Start Time</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}><AlertTriangle size={20} /></div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{daysUntilEvent(event.registrationDeadline)} left</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reg. closes {formatDate(event.registrationDeadline)}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                                <span>Seats Filled</span>
                                <span>{event.registrationCount} / {event.maxParticipants}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min((event.registrationCount / event.maxParticipants) * 100, 100)}%`, height: '100%', background: 'var(--grad)', borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        {isAdminView ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <textarea
                                    placeholder="Note for host (required for rejection)"
                                    value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', minHeight: '80px' }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleAdminReview('approve')} disabled={reviewing} className="btn-primary" style={{ flex: 1, background: '#10B981' }}>Approve ✅</button>
                                    <button onClick={() => handleAdminReview('reject')} disabled={reviewing} className="btn-primary" style={{ flex: 1, background: '#EF4444' }}>Reject ❌</button>
                                </div>
                            </div>
                        ) : isHostView ? (
                            /* Host Actions */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {event.status === 'pending' && <div style={{ padding: '15px', background: 'rgba(245, 158, 11, 0.1)', color: '#FCD34D', borderRadius: '12px', textAlign: 'center' }}>Awaiting Admin Review</div>}
                                {event.status === 'rejected' && <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', borderRadius: '12px' }}><strong>Rejected:</strong> {event.adminNote}</div>}

                                <Link to={`/host-event/edit/${event._id}`} className="btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>Edit Event</Link>

                                {event.status === 'approved' && (
                                    <>
                                        <Link to={`/host-event/${event._id}/scan`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', background: 'var(--cyan)', color: 'var(--navy)' }}>Open Scanner</Link>
                                        <Link to={`/host-event/${event._id}/analytics`} className="btn-outline" style={{ textAlign: 'center', textDecoration: 'none' }}>View Analytics</Link>
                                    </>
                                )}
                            </div>
                        ) : myRegistration ? (
                            /* Already Registered */
                            <QRDisplay {...{
                                qrCodeImage: myRegistration.qrCodeImage,
                                registrationId: myRegistration._id,
                                eventTitle: event.title,
                                eventDate: event.date,
                                venue: event.venue
                            }} />
                        ) : (
                            /* Registration Action */
                            !user ? (
                                <Link to="/login" state={{ from: location }} className="btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}>Login to Register</Link>
                            ) : !user.isProfileComplete ? (
                                <Link to="/profile" className="btn-outline" style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}>Complete Profile to Register</Link>
                            ) : isRegistrationOpen ? (
                                <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ width: '100%' }}>Register Now</button>
                            ) : (
                                <button disabled className="btn-outline" style={{ width: '100%', opacity: 0.5 }}>Registration Closed</button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as="div" style={{ position: 'relative', zIndex: 1000 }} onClose={() => setModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
                    </Transition.Child>

                    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto' }}>
                        <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="glass" style={{ width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '40px', background: 'var(--navy2)', border: '1px solid rgba(255,255,255,0.1)' }}>

                                    <Dialog.Title as="h2" style={{ fontSize: '2rem', marginBottom: '10px' }}>Register for {event.title}</Dialog.Title>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                        <div style={{ height: '4px', flex: 1, background: step >= 1 ? 'var(--cyan)' : 'var(--border)', borderRadius: '2px' }}></div>
                                        <div style={{ height: '4px', flex: 1, background: step >= 2 ? 'var(--cyan)' : 'var(--border)', borderRadius: '2px' }}></div>
                                        <div style={{ height: '4px', flex: 1, background: step >= 3 ? 'var(--cyan)' : 'var(--border)', borderRadius: '2px' }}></div>
                                    </div>

                                    {step === 1 && (
                                        <div>
                                            <h4 style={{ marginBottom: '20px' }}>Basic Information</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                                                <input type="text" value={user.name} disabled className="contact-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-muted)' }} />
                                                <input type="email" value={user.email} disabled className="contact-input" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-muted)' }} />
                                                {event.registrationFormFields.map((field, i) => (
                                                    <div key={i}>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{field.fieldLabel} {field.isRequired && '*'}</label>
                                                        {field.fieldType === 'select' ? (
                                                            <select
                                                                required={field.isRequired}
                                                                onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
                                                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', outline: 'none' }}
                                                            >
                                                                <option value="" disabled selected>Select option...</option>
                                                                {field.options.map(opt => <option key={opt} value={opt} style={{ color: 'black' }}>{opt}</option>)}
                                                            </select>
                                                        ) : field.fieldType === 'textarea' ? (
                                                            <textarea
                                                                required={field.isRequired}
                                                                placeholder={field.placeholder}
                                                                onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
                                                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', outline: 'none', minHeight: '80px' }}
                                                            />
                                                        ) : field.fieldType === 'checkbox' ? (
                                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <input type="checkbox" required={field.isRequired} onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.checked })} />
                                                                {field.fieldLabel}
                                                            </label>
                                                        ) : (
                                                            <input
                                                                type={field.fieldType}
                                                                required={field.isRequired}
                                                                placeholder={field.placeholder}
                                                                onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
                                                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', outline: 'none' }}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                                <button onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
                                                <button onClick={() => setStep(2)} className="btn-primary">Next Step</button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <h4 style={{ marginBottom: '20px' }}>College ID Proof</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Please upload a clear image of your valid college ID card. This helps us verify your identity.</p>

                                            <div {...getRootProps()} style={{ border: '2px dashed var(--border)', padding: '40px', textAlign: 'center', borderRadius: '16px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', marginBottom: '30px' }}>
                                                <input {...getInputProps()} />
                                                {idProof ? (
                                                    <div style={{ color: 'var(--cyan)' }}>✅ Selected: {idProof.name}</div>
                                                ) : (
                                                    <div style={{ color: 'var(--text-muted)' }}>Drag & drop your ID image here, or click to select files (Max 5MB)</div>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                                                <button onClick={() => { if (!idProof) return toast.error('Upload ID'); setStep(3); }} className="btn-primary">Review</button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <h4 style={{ marginBottom: '20px' }}>Review Summary</h4>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.95rem' }}>
                                                <p style={{ margin: '0 0 10px 0', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}><strong>Name:</strong> {user.name}</p>
                                                <p style={{ margin: '0 0 10px 0', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}><strong>College:</strong> {user.college}</p>
                                                <p style={{ margin: 0 }}><strong>ID Proof Attached:</strong> ✅ Yes</p>
                                            </div>

                                            <div style={{ padding: '15px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '30px' }}>
                                                By proceeding, I confirm that all details provided are correct and I agree to abide by the rules set forth by the event organizers.
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button onClick={() => setStep(2)} className="btn-outline" disabled={submitting}>Back</button>
                                                <button onClick={handleRegisterSubmit} disabled={submitting} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {submitting ? <LoadingSpinner size="small" /> : 'Confirm Registration'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 350px"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: relative !important; top: 0 !important; }
        }
      `}</style>
        </div>
    );
};

export default EventDetails;
