import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    registerNumber: { type: String, required: true },
    customFieldData: { type: Map, of: String },
    qrCode: { type: String }, // base64 QR image
    qrData: { type: String }, // JSON string encoded in QR
    attended: { type: Boolean, default: false },
    attendedAt: { type: Date },
    registeredAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
