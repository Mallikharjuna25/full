import asyncHandler from 'express-async-handler';
import Organizer from '../models/Organizer.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get Organizer profile
// @route   GET /api/organizer/profile
// @access  Private / Organizer
export const getProfile = asyncHandler(async (req, res) => {
    const organizer = await Organizer.findById(req.user._id).select('-password');
    if (organizer) {
        res.json(organizer);
    } else {
        res.status(404);
        throw new Error('Organizer not found');
    }
});

// @desc    Create an Event
// @route   POST /api/organizer/events
// @access  Private / Organizer / Approved
export const createEvent = asyncHandler(async (req, res) => {
    let { title, description, date, time, venue, category, maxParticipants, customFields } = req.body;

    if (typeof customFields === 'string') {
        customFields = JSON.parse(customFields);
    }

    const bannerImage = req.file ? `/uploads/${req.file.filename}` : '';

    const event = new Event({
        title,
        description,
        date,
        time,
        venue,
        category,
        bannerImage,
        maxParticipants,
        organizer: req.user._id,
        organizerCollegeName: req.user.collegeName,
        customFields: customFields || []
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
});

// @desc    Get Organizer's events
// @route   GET /api/organizer/events
// @access  Private / Organizer / Approved
export const getMyEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
});

// @desc    Get Event Participants
// @route   GET /api/organizer/events/:eventId/participants
// @access  Private / Organizer / Approved
export const getEventParticipants = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.eventId);

    if (!event || event.organizer.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Event not found or unauthorized');
    }

    const registrations = await Registration.find({ event: req.params.eventId })
        .populate('student', '-password')
        .sort({ registeredAt: -1 });

    res.json(registrations);
});

// @desc    Scan QR and Mark Attendance
// @route   POST /api/organizer/events/:eventId/scan
// @access  Private / Organizer / Approved
export const scanQR = asyncHandler(async (req, res) => {
    const { qrData } = req.body;
    const eventId = req.params.eventId;

    let parsedData;
    try {
        parsedData = JSON.parse(qrData);
    } catch (err) {
        res.status(400);
        throw new Error('Invalid QR Data format');
    }

    const { registrationId, eventId: qrEventId } = parsedData;

    if (qrEventId !== eventId) {
        res.status(400);
        throw new Error('QR code does not belong to this event');
    }

    const registration = await Registration.findById(registrationId);

    if (!registration) {
        res.status(404);
        throw new Error('Registration not found');
    }

    if (registration.attended) {
        res.status(400);
        throw new Error('Already marked as attended');
    }

    registration.attended = true;
    registration.attendedAt = Date.now();
    await registration.save();

    res.json({ message: 'Attendance marked successfully', student: registration });
});
