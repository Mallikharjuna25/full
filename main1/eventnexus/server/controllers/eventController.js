const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getPublicEvents = async (req, res) => {
    try {
        const { category, college, search, page = 1, limit = 12 } = req.query;
        const query = { status: 'approved' };

        if (category && category !== 'All') query.category = category;
        if (college) query.college = college;
        if (search) query.title = { $regex: search, $options: 'i' };

        const skip = (page - 1) * limit;
        const events = await Event.find(query)
            .populate('host', 'name college avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Event.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({ success: true, events, totalPages, currentPage: Number(page), total });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('host', 'name college avatar email');
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.status !== 'approved') {
            if (!req.user || (req.user._id.toString() !== event.host._id.toString() && req.user.role !== 'admin')) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
        }

        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const eventData = JSON.parse(req.body.eventData);

        if (req.files && req.files.bannerImage) {
            eventData.bannerImage = req.files.bannerImage[0].path;
        }
        if (req.files && req.files.images) {
            eventData.images = req.files.images.map(f => f.path);
        }

        eventData.host = req.user._id;
        eventData.status = 'pending';

        const event = await Event.create(eventData);
        res.status(201).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        let updateData = req.body.eventData ? JSON.parse(req.body.eventData) : req.body;

        if (req.files) {
            if (req.files.bannerImage) updateData.bannerImage = req.files.bannerImage[0].path;
            if (req.files.images) updateData.images = [...event.images, ...req.files.images.map(f => f.path)];
        }

        if (event.host.toString() === req.user._id.toString() && event.status === 'approved' && req.user.role !== 'admin') {
            updateData.status = 'pending';
        }

        event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (event.status === 'approved' && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: 'Approved events can only be deleted by admins' });
        }

        await event.deleteOne();
        await Registration.deleteMany({ event: req.params.id });

        res.status(200).json({ success: true, message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getHostEvents = async (req, res) => {
    try {
        const events = await Event.find({ host: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getEventRegistrations = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const registrations = await Registration.find({ event: req.params.id }).populate('user', 'name email college department phone');
        res.status(200).json({ success: true, registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
