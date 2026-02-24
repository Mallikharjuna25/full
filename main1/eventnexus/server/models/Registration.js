const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    formData: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
    idProofImage: {
        type: String,
        required: true,
    },
    qrCodeData: String,
    qrCodeImage: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed',
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    isAttended: {
        type: Boolean,
        default: false,
    },
    attendedAt: Date,
});

registrationSchema.index({ event: 1, user: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
