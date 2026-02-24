const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const emailService = require('../services/emailService');

exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalEvents,
            pendingEventsCount,
            approvedEventsCount,
            rejectedEventsCount,
            totalUsers,
            totalRegistrations,
            recentPendingEvents,
            eventsByCategory
        ] = await Promise.all([
            Event.countDocuments(),
            Event.countDocuments({ status: 'pending' }),
            Event.countDocuments({ status: 'approved' }),
            Event.countDocuments({ status: 'rejected' }),
            User.countDocuments({ role: { $ne: 'admin' } }),
            Registration.countDocuments({ status: 'confirmed' }),
            Event.find({ status: 'pending' }).populate('host', 'name email college').sort({ createdAt: 1 }).limit(5),
            Event.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalEvents,
                pendingEventsCount,
                approvedEventsCount,
                rejectedEventsCount,
                totalUsers,
                totalRegistrations,
                recentPendingEvents,
                eventsByCategory
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' })
            .populate('host', 'name email college avatar')
            .sort({ createdAt: 1 });
        res.status(200).json({ success: true, events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        let query = {};
        if (status) query.status = status;

        const skip = (page - 1) * limit;
        const events = await Event.find(query)
            .populate('host', 'name college email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Event.countDocuments(query);
        res.status(200).json({ success: true, events, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.reviewEvent = async (req, res) => {
    try {
        const { action, adminNote } = req.body;
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, message: 'Invalid action' });
        }

        const event = await Event.findById(req.params.id).populate('host');
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        event.status = action === 'approve' ? 'approved' : 'rejected';
        event.adminNote = adminNote || '';
        event.reviewedBy = req.user._id;
        event.reviewedAt = Date.now();
        await event.save();

        if (action === 'approve') {
            emailService.sendEventApproved({
                to: event.host.email,
                hostName: event.host.name,
                eventTitle: event.title,
                eventUrl: `${process.env.CLIENT_URL}/events/${event._id}`
            }).catch(err => console.error(err));
        } else {
            emailService.sendEventRejected({
                to: event.host.email,
                hostName: event.host.name,
                eventTitle: event.title,
                reason: adminNote
            }).catch(err => console.error(err));
        }

        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const users = await User.find({ role: { $ne: 'admin' } })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await User.countDocuments({ role: { $ne: 'admin' } });

        res.status(200).json({ success: true, users, total });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.exportAttendance = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const attendanceRecords = await Attendance.find({ event: eventId })
            .populate('user', 'name email college department year phone')
            .sort({ scannedAt: 1 });

        const csvHeader = 'Name,Email,College,Department,Year,Phone,Attended At\n';
        const csvRows = attendanceRecords.map(record => {
            const u = record.user;
            return `"${u.name}","${u.email}","${u.college}","${u.department}","${u.year}","${u.phone}","${new Date(record.scannedAt).toISOString()}"`;
        });
        const csvData = csvHeader + csvRows.join('\n');

        await emailService.sendAttendanceReport({
            adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            eventTitle: event.title,
            csvData,
            totalRegistered: event.registrationCount,
            totalAttended: event.attendanceCount
        });

        res.status(200).json({ success: true, message: 'Attendance report emailed to admin' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
