const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    registration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    scannedAt: {
        type: Date,
        default: Date.now,
    },
    method: {
        type: String,
        default: 'qr_scan',
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
