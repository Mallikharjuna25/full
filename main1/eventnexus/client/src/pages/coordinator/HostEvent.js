import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coordinatorAPI } from '../../services/api';
import CoordinatorNavbar from '../../components/CoordinatorNavbar';
import { Save, Image as ImageIcon, Calendar, MapPin, Users, DollarSign, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';

const InputGroup = ({ label, children, hint }) => (
    <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: 500, fontSize: '0.95rem' }}>
            {label}
        </label>
        {children}
        {hint && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>{hint}</p>}
    </div>
);

const StepIndicator = ({ currentStep, totalSteps }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', gap: '15px' }}>
        {[...Array(totalSteps)].map((_, i) => (
            <React.Fragment key={i}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '0.9rem',
                    background: i + 1 === currentStep ? 'var(--cyan)' : (i + 1 < currentStep ? '#10B981' : 'rgba(255,255,255,0.05)'),
                    color: i + 1 === currentStep ? '#0F172A' : (i + 1 < currentStep ? 'white' : 'var(--text-muted)'),
                    border: i + 1 > currentStep ? '1px solid var(--border)' : 'none',
                    transition: 'all 0.3s'
                }}>
                    {i + 1 < currentStep ? <CheckCircle2 size={16} /> : (i + 1)}
                </div>
                {i < totalSteps - 1 && (
                    <div style={{ height: '2px', width: '40px', background: i + 1 < currentStep ? '#10B981' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                )}
            </React.Fragment>
        ))}
    </div>
);

const HostEvent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state matching Event Schema
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Technology',
        venue: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        participationLimit: '',
        type: 'team',
        teamSize: { min: 1, max: 4 },
        fees: 0,
        prizePool: '',
        status: 'draft'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTeamSizeChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            teamSize: { ...prev.teamSize, [name]: parseInt(value) || 0 }
        }));
    };

    const nextStep = () => {
        // Basic validation before moving next
        if (step === 1 && (!formData.title || !formData.description || !formData.venue)) {
            return setError('Please fill all required fields in Step 1');
        }
        if (step === 2 && (!formData.startDate || !formData.endDate || !formData.registrationDeadline)) {
            return setError('Please fill all required dates in Step 2');
        }

        setError('');
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Construct payload mapping to Event model
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                venue: formData.venue,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
                maxParticipants: parseInt(formData.participationLimit) > 0 ? parseInt(formData.participationLimit) : 10000,
                teamSize: formData.type === 'team' ? formData.teamSize : { min: 1, max: 1 },
                registrationFee: parseInt(formData.fees) || 0,
                prizes: formData.prizePool,
                status: 'published' // Publish directly for now
            };

            await coordinatorAPI.createEvent(payload);
            setLoading(false);
            navigate('/coordinator/my-events');
        } catch (err) {
            console.error(err);
            let message = "Failed to create event. Please check your inputs.";
            if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
                message = err.response.data.errors[0].msg;
            }
            setError(message);
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '14px 15px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
        borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none',
        transition: 'all 0.3s'
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
            <CoordinatorNavbar />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', paddingLeft: '5%', paddingRight: '5%' }}>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '8px' }}>Host an Event</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Create a new event for {user?.collegeName}.</p>
                </div>

                <StepIndicator currentStep={step} totalSteps={3} />

                {error && (
                    <div className="animate-fade-up" style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#FCA5A5', padding: '12px 16px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px'
                    }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <div className="glass animate-fade-up" style={{ padding: '40px', borderRadius: '24px' }}>

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="step-content">
                            <h2 style={{ fontSize: '1.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ImageIcon size={24} color="var(--cyan)" /> Basic Details
                            </h2>

                            <InputGroup label="Event Title *">
                                <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="e.g. Hackathon 2026" required />
                            </InputGroup>

                            <InputGroup label="Event Category *">
                                <select name="category" value={formData.category} onChange={handleChange} style={{ ...inputStyle, appearance: 'none' }}>
                                    {['Technology', 'Hackathon', 'Cultural', 'Sports', 'Business', 'Science', 'Workshop', 'Other'].map(c => <option key={c} value={c} style={{ background: '#0F172A' }}>{c}</option>)}
                                </select>
                            </InputGroup>

                            <InputGroup label="Description *">
                                <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Describe your event..." required />
                            </InputGroup>

                            <InputGroup label="Venue *">
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)' }} />
                                    <input type="text" name="venue" value={formData.venue} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '45px' }} placeholder="e.g. Main Auditorium" required />
                                </div>
                            </InputGroup>
                        </div>
                    )}

                    {/* Step 2: Schedule & Limits */}
                    {step === 2 && (
                        <div className="step-content">
                            <h2 style={{ fontSize: '1.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar size={24} color="var(--cyan)" /> Scheduling & Limits
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <InputGroup label="Start Date & Time *">
                                    <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} style={inputStyle} required />
                                </InputGroup>
                                <InputGroup label="End Date & Time *">
                                    <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} style={inputStyle} required />
                                </InputGroup>
                            </div>

                            <InputGroup label="Registration Deadline *">
                                <input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} style={inputStyle} required />
                            </InputGroup>

                            <div style={{ height: '1px', background: 'var(--border)', margin: '30px 0' }} />

                            <InputGroup label="Maximum Participants">
                                <div style={{ position: 'relative' }}>
                                    <Users size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)' }} />
                                    <input type="number" name="participationLimit" value={formData.participationLimit} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '45px' }} placeholder="Leave empty for unlimited" />
                                </div>
                            </InputGroup>

                            <InputGroup label="Participation Type *">
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" name="type" value="solo" checked={formData.type === 'solo'} onChange={handleChange} /> Solo
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" name="type" value="team" checked={formData.type === 'team'} onChange={handleChange} /> Team
                                    </label>
                                </div>
                            </InputGroup>

                            {formData.type === 'team' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '24px' }}>
                                    <InputGroup label="Min Team Size">
                                        <input type="number" name="min" value={formData.teamSize.min} onChange={handleTeamSizeChange} style={inputStyle} min="1" />
                                    </InputGroup>
                                    <InputGroup label="Max Team Size">
                                        <input type="number" name="max" value={formData.teamSize.max} onChange={handleTeamSizeChange} style={inputStyle} min="1" />
                                    </InputGroup>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Fees & Prizes */}
                    {step === 3 && (
                        <div className="step-content">
                            <h2 style={{ fontSize: '1.5rem', fontFamily: '"Syne", sans-serif', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <DollarSign size={24} color="var(--cyan)" /> Fees & Prizes
                            </h2>

                            <InputGroup label="Registration Fee (₹)">
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '15px', top: '14px', color: 'var(--text-muted)', fontWeight: 'bold' }}>₹</span>
                                    <input type="number" name="fees" value={formData.fees} onChange={handleChange} style={{ ...inputStyle, paddingLeft: '35px' }} placeholder="0 for free" min="0" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>Enter 0 if the event is free.</p>
                            </InputGroup>

                            <InputGroup label="Prize Pool Description">
                                <input type="text" name="prizePool" value={formData.prizePool} onChange={handleChange} style={inputStyle} placeholder="e.g. ₹50,000 Total, Goodies" />
                            </InputGroup>

                            <div className="glass" style={{ padding: '20px', borderRadius: '16px', marginTop: '30px', background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                                <h4 style={{ color: 'var(--cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={18} /> Ready to Publish
                                </h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    By clicking 'Publish Event', your event will be live on the platform and students will be able to register immediately.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="btn-outline"
                            style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}
                        >
                            Back
                        </button>

                        {step < 3 ? (
                            <button type="button" onClick={nextStep} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cyan)', color: '#0F172A' }}>
                                Continue <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundImage: 'linear-gradient(135deg, var(--cyan) 0%, #3B82F6 100%)', color: '#0F172A', fontWeight: 'bold' }}>
                                {loading ? <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(15,23,42,0.3)', borderTopColor: '#0F172A', animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                                Publish Event
                            </button>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default HostEvent;
