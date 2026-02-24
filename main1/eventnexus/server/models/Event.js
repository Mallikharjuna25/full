const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        college: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['Tech', 'Cultural', 'Sports', 'Business', 'Science', 'Hackathon', 'Workshop', 'Other'],
        },
        date: {
            type: Date,
            required: true,
        },
        endDate: Date,
        time: String,
        venue: {
            type: String,
            required: true,
        },
        maxParticipants: {
            type: Number,
            required: true,
            min: 1,
        },
        registrationDeadline: {
            type: Date,
            required: true,
        },
        images: [String],
        bannerImage: {
            type: String,
            default: '',
        },
        instructions: {
            type: String,
            default: '',
        },
        rules: [String],
        prizes: [
            {
                position: String,
                reward: String,
            },
        ],
        coordinators: [
            {
                name: String,
                phone: String,
                email: String,
            },
        ],
        tags: [String],
        entryFee: {
            type: Number,
            default: 0,
        },
        isFree: {
            type: Boolean,
            default: true,
        },
        registrationFormFields: [
            {
                fieldName: String,
                fieldLabel: String,
                fieldType: {
                    type: String,
                    enum: ['text', 'email', 'number', 'select', 'file', 'textarea', 'checkbox'],
                },
                options: [String],
                isRequired: {
                    type: Boolean,
                    default: true,
                },
                placeholder: String,
            },
        ],
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed'],
            default: 'pending',
        },
        adminNote: {
            type: String,
            default: '',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewedAt: Date,
        registrationCount: {
            type: Number,
            default: 0,
        },
        attendanceCount: {
            type: Number,
            default: 0,
        },
        successRate: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.virtual('isRegistrationOpen').get(function () {
    return this.registrationDeadline > new Date() && this.registrationCount < this.maxParticipants;
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
