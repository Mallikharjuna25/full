const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');
const qrService = require('../services/qrService');
const emailService = require('../services/emailService');

exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);

        if (!event || event.status !== 'approved') {
            return res.status(404).json({ success: false, message: 'Event not available' });
        }

        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({ success: false, message: 'Registration deadline passed' });
        }

        if (event.registrationCount >= event.maxParticipants) {
            return res.status(400).json({ success: false, message: 'Event is full' });
        }

        const existingRegistration = await Registration.findOne({ event: eventId, user: req.user._id });
        if (existingRegistration && existingRegistration.status !== 'cancelled') {
            return res.status(400).json({ success: false, message: 'Already registered for this event' });
        }

        let idProofImage = '';
        if (req.file) {
            idProofImage = req.file.path;
        } else {
            return res.status(400).json({ success: false, message: 'ID proof image is required' });
        }

        const formData = req.body.formData ? JSON.parse(req.body.formData) : {};

        const token = qrService.generateQRToken();
        const registration = new Registration({
            event: eventId,
            user: req.user._id,
            formData,
            idProofImage,
            qrCodeData: token,
        });

        await registration.save();

        const payload = { registrationId: registration._id, eventId, userId: req.user._id, token };
        const qrImage = await qrService.generateQRImage(payload);

        registration.qrCodeImage = qrImage;
        await registration.save();

        event.registrationCount += 1;
        await event.save();

        // Fire and forget email
        emailService.sendRegistrationConfirmation({
            to: req.user.email,
            userName: req.user.name,
            eventTitle: event.title,
            eventDate: event.date,
            venue: event.venue,
            qrCodeImage: qrImage
        }).catch(err => console.error('Failed to send confirmation email', err));

        res.status(201).json({
            success: true,
            registration: {
                _id: registration._id,
                qrCodeImage,
                event: {
                    title: event.title,
                    date: event.date,
                    venue: event.venue
                }
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getUserRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id, status: { $ne: 'cancelled' } })
            .populate('event', 'title date endDate venue college bannerImage status category time')
            .sort({ registeredAt: -1 });

        res.status(200).json({ success: true, registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getRegistrationById = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id).populate('event');
        if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

        if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, registration });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.cancelRegistration = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id).populate('event');
        if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

        if (registration.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (new Date() > new Date(registration.event.date)) {
            return res.status(400).json({ success: false, message: 'Cannot cancel past event registration' });
        }

        registration.status = 'cancelled';
        await registration.save();

        const event = await Event.findById(registration.event._id);
        if (event.registrationCount > 0) {
            event.registrationCount -= 1;
            await event.save();
        }

        res.status(200).json({ success: true, message: 'Registration cancelled' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.scanQR = async (req, res) => {
    try {
        const { qrData } = req.body;
        if (!qrData) return res.status(400).json({ success: false, message: 'QR Data required' });

        const parsedData = JSON.parse(qrData);
        const { registrationId, eventId, userId, token } = parsedData;

        const registration = await Registration.findById(registrationId)
            .populate('user', 'name email college department year phone')
            .populate('event', 'title date venue host');

        if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
        if (registration.qrCodeData !== token) return res.status(400).json({ success: false, message: 'Invalid QR token' });
        if (!registration.event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (req.user._id.toString() !== registration.event.host.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to scan for this event' });
        }

        if (registration.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Registration was cancelled' });
        }

        if (registration.isAttended) {
            return res.status(200).json({
                success: false,
                alreadyScanned: true,
                message: 'Already checked in',
                attendedAt: registration.attendedAt,
                user: registration.user
            });
        }

        registration.isAttended = true;
        registration.attendedAt = Date.now();
        await registration.save();

        await Attendance.create({
            event: eventId,
            registration: registrationId,
            user: registration.user._id,
            scannedBy: req.user._id,
            method: 'qr_scan'
        });

        const event = await Event.findById(eventId);
        event.attendanceCount += 1;
        if (event.registrationCount > 0) {
            event.successRate = (event.attendanceCount / event.registrationCount) * 100;
        }
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Entry confirmed',
            user: {
                name: registration.user.name,
                college: registration.user.college,
                department: registration.user.department,
                year: registration.user.year,
                phone: registration.user.phone,
                email: registration.user.email
            },
            event: { title: registration.event.title }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
