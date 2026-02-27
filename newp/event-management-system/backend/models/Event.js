import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    bannerImage: { type: String, default: '' },
    maxParticipants: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true },
    organizerCollegeName: { type: String, required: true },
    customFields: [{
        fieldName: String,
        fieldType: String, // text, dropdown, file, number, date
        options: [String],
        required: Boolean
    }],
    isActive: { type: Boolean, default: true },
    registrationCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
