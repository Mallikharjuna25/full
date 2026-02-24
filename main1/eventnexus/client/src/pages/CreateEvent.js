import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Plus, X, UploadCloud, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(!!id);

    // Form State
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'Tech', date: '', endDate: '', time: '',
        venue: '', maxParticipants: 100, registrationDeadline: '',
        entryFee: 0, isFree: true, instructions: '',
        coordinators: [{ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' }],
        rules: [''], tags: [''],
        registrationFormFields: [
            { fieldName: 'rollNumber', fieldLabel: 'Roll/Registration Number', fieldType: 'text', isRequired: true, options: [], placeholder: 'e.g. 21BCE0001' }
        ]
    });

    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchEvent = async () => {
                try {
                    const { data } = await eventsAPI.getById(id);
                    const e = data.event;
                    if (e.host._id !== user._id) return navigate('/host-event');

                    setFormData({
                        ...e,
                        date: e.date.split('T')[0],
                        endDate: e.endDate ? e.endDate.split('T')[0] : '',
                        registrationDeadline: e.registrationDeadline.split('T')[0]
                    });
                    setBannerPreview(e.bannerImage);
                } catch (err) {
                    toast.error('Failed to fetch event');
                    navigate('/host-event');
                } finally {
                    setInitialLoad(false);
                }
            };
            fetchEvent();
        }
    }, [id, user, navigate]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        onDrop: accepted => {
            setBannerFile(accepted[0]);
            setBannerPreview(URL.createObjectURL(accepted[0]));
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleArrayChange = (i, e, fieldName, nestedKey) => {
        const update = [...formData[fieldName]];
        if (nestedKey) update[i][nestedKey] = e.target.value;
        else update[i] = e.target.value;
        setFormData({ ...formData, [fieldName]: update });
    };

    const addArrayItem = (fieldName, defaultObj) => {
        setFormData({ ...formData, [fieldName]: [...formData[fieldName], defaultObj] });
    };

    const removeArrayItem = (i, fieldName) => {
        const update = [...formData[fieldName]];
        update.splice(i, 1);
        setFormData({ ...formData, [fieldName]: update });
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.title || !formData.date || !formData.venue || !formData.registrationDeadline) {
            return toast.error('Please fill all required fields');
        }

        setLoading(true);
        try {
            const data = new FormData();
            if (bannerFile) data.append('bannerImage', bannerFile);

            // Send as JSON string inside formData
            const eventData = { ...formData, college: user.college };
            data.append('eventData', JSON.stringify(eventData));

            if (id) {
                await eventsAPI.update(id, data);
                toast.success('Event updated successfully');
            } else {
                await eventsAPI.create(data);
                toast.success('Event created! Wait for admin approval.');
            }
            navigate('/host-event');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) return <LoadingSpinner />;

    const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' };

    return (
        <div style={{ padding: '100px 5% 60px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>

            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{id ? 'Edit Event' : 'Create Event'}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{id ? 'Update your event details.' : 'Fill out the details to host a new event.'}</p>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: '6px', flex: 1, borderRadius: '3px', background: step >= i ? 'var(--cyan)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }}></div>
                ))}
            </div>

            <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>

                {step === 1 && (
                    <div className="reveal visible" style={{ animation: 'fadeIn 0.5s' }}>
                        <h2 style={{ marginBottom: '25px' }}>Basic Details</h2>

                        {/* Banner Upload */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Event Banner</label>
                            <div {...getRootProps()} style={{ height: '200px', borderRadius: '16px', border: '2px dashed var(--border)', background: bannerPreview ? `linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.8)), url(${bannerPreview}) center/cover` : 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <input {...getInputProps()} />
                                <UploadCloud size={40} style={{ marginBottom: '10px', color: bannerPreview ? 'white' : 'var(--text-muted)' }} />
                                <span style={{ color: bannerPreview ? 'white' : 'var(--text-muted)' }}>{bannerPreview ? 'Click to change image' : 'Drag & drop image here'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Event Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={labelStyle}>Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                                    {['Tech', 'Cultural', 'Sports', 'Business', 'Hackathon', 'Workshop', 'Science', 'Other'].map(c => <option key={c} value={c} style={{ color: 'black' }}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Venue *</label>
                                <input type="text" name="venue" value={formData.venue} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={labelStyle}>Start Date *</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={labelStyle}>End Date (Optional)</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Time (e.g., 09:00 AM)</label>
                                <input type="time" name="time" value={formData.time} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={labelStyle}>Max Participants</label>
                                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} style={inputStyle} required min="1" />
                            </div>

                            <div>
                                <label style={labelStyle}>Registration Deadline *</label>
                                <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} style={inputStyle} required />
                            </div>

                            <div>
                                <label style={labelStyle}>Event Fee</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} /> Free Event
                                    </label>
                                    {!formData.isFree && (
                                        <input type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} style={{ ...inputStyle, width: '120px' }} placeholder="₹ Amount" />
                                    )}
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px' }} required></textarea>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                            <button onClick={() => setStep(2)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Next Step <ChevronRight size={18} /></button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="reveal visible" style={{ animation: 'fadeIn 0.5s' }}>
                        <h2 style={{ marginBottom: '25px' }}>Rules & Coordinators</h2>

                        {/* Rules */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Event Rules</label>
                            {formData.rules.map((rule, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input type="text" value={rule} onChange={(e) => handleArrayChange(i, e, 'rules')} style={inputStyle} placeholder="Add a rule..." />
                                    {formData.rules.length > 1 && (
                                        <button onClick={() => removeArrayItem(i, 'rules')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><X size={20} /></button>
                                    )}
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('rules', '')} style={{ background: 'none', border: '1px dashed var(--border)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Plus size={16} /> Add Rule</button>
                        </div>

                        {/* Tags */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Tags</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {formData.tags.map((tag, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '4px 12px', border: '1px solid var(--border)' }}>
                                        <span>#</span>
                                        <input type="text" value={tag} onChange={(e) => handleArrayChange(i, e, 'tags')} style={{ background: 'none', border: 'none', color: 'white', outline: 'none', width: '80px' }} placeholder="tag" />
                                        {formData.tags.length > 1 && (
                                            <button onClick={() => removeArrayItem(i, 'tags')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('tags', '')} style={{ background: 'none', border: '1px dashed var(--border)', borderRadius: '20px', padding: '4px 12px', color: 'var(--text-muted)', cursor: 'pointer' }}>+ Add</button>
                            </div>
                        </div>

                        {/* Coordinators */}
                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Coordinators</label>
                            {formData.coordinators.map((coord, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                                    <input type="text" value={coord.name} onChange={(e) => handleArrayChange(i, e, 'coordinators', 'name')} style={inputStyle} placeholder="Name" />
                                    <input type="text" value={coord.phone} onChange={(e) => handleArrayChange(i, e, 'coordinators', 'phone')} style={inputStyle} placeholder="Phone" />
                                    <input type="email" value={coord.email} onChange={(e) => handleArrayChange(i, e, 'coordinators', 'email')} style={inputStyle} placeholder="Email" />
                                    {formData.coordinators.length > 1 && (
                                        <button onClick={() => removeArrayItem(i, 'coordinators')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><X size={20} /></button>
                                    )}
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('coordinators', { name: '', phone: '', email: '' })} style={{ background: 'none', border: '1px dashed var(--border)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Plus size={16} /> Add Coordinator</button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                            <button onClick={() => setStep(1)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronLeft size={18} /> Back</button>
                            <button onClick={() => setStep(3)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Next Step <ChevronRight size={18} /></button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="reveal visible" style={{ animation: 'fadeIn 0.5s' }}>
                        <h2 style={{ marginBottom: '10px' }}>Custom Registration Form</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Add custom fields to collect specific information from participants when they register.</p>

                        <div style={{ background: 'var(--navy)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '30px' }}>
                            <h4 style={{ marginBottom: '20px', color: 'var(--cyan)' }}>Form Preview Builder</h4>

                            {formData.registrationFormFields.map((field, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px', position: 'relative' }}>
                                    {formData.registrationFormFields.length > 1 && (
                                        <button onClick={() => removeArrayItem(i, 'registrationFormFields')} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><X size={18} /></button>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Field Label</label>
                                            <input type="text" value={field.fieldLabel} onChange={(e) => {
                                                const val = e.target.value;
                                                const camelCase = val.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
                                                const update = [...formData.registrationFormFields];
                                                update[i].fieldLabel = val;
                                                update[i].fieldName = camelCase || `field${i}`;
                                                setFormData({ ...formData, registrationFormFields: update });
                                            }} style={{ ...inputStyle, padding: '8px 12px' }} placeholder="e.g. GitHub URL" />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Field Type</label>
                                            <select value={field.fieldType} onChange={(e) => handleArrayChange(i, e, 'registrationFormFields', 'fieldType')} style={{ ...inputStyle, padding: '8px 12px' }}>
                                                <option value="text" style={{ color: 'black' }}>Text (Short)</option>
                                                <option value="email" style={{ color: 'black' }}>Email Address</option>
                                                <option value="number" style={{ color: 'black' }}>Number</option>
                                                <option value="textarea" style={{ color: 'black' }}>Text (Long)</option>
                                                <option value="select" style={{ color: 'black' }}>Dropdown Select</option>
                                                <option value="checkbox" style={{ color: 'black' }}>Checkbox (Boolean)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {field.fieldType === 'select' && (
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Options (Comma separated)</label>
                                            <input type="text" value={field.options?.join(', ')} onChange={(e) => {
                                                const update = [...formData.registrationFormFields];
                                                update[i].options = e.target.value.split(',').map(s => s.trim());
                                                setFormData({ ...formData, registrationFormFields: update });
                                            }} style={{ ...inputStyle, padding: '8px 12px' }} placeholder="Option 1, Option 2, Option 3" />
                                        </div>
                                    )}

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                        <input type="checkbox" checked={field.isRequired} onChange={(e) => {
                                            const update = [...formData.registrationFormFields];
                                            update[i].isRequired = e.target.checked;
                                            setFormData({ ...formData, registrationFormFields: update });
                                        }} />
                                        Required Field
                                    </label>
                                </div>
                            ))}

                            <button onClick={() => addArrayItem('registrationFormFields', { fieldName: `field${formData.registrationFormFields.length}`, fieldLabel: '', fieldType: 'text', isRequired: false, options: [], placeholder: '' })} style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--violet)', border: '1px dashed var(--violet)', padding: '10px', borderRadius: '12px', width: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                                <Plus size={18} /> Add Custom Field
                            </button>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                            <button onClick={() => setStep(2)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ChevronLeft size={18} /> Back</button>
                            <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10B981', color: 'black' }}>
                                {loading ? <LoadingSpinner size="small" /> : <><Save size={18} /> Submit Event</>}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CreateEvent;
