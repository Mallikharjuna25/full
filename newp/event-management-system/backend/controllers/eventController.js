import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// @desc    Get All Active Events
// @route   GET /api/events
// @access  Public
export const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ isActive: true })
        .populate('organizer', 'collegeName')
        .sort({ date: 1 });

    res.json(events);
});

// @desc    Get Single Event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('organizer', 'collegeName email place');

    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});
