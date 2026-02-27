const Event = require("../models/Event");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.createEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const eventData = { ...req.body };
        eventData.coordinator = req.user._id;
        eventData.coordinatorName = req.user.name;
        eventData.coordinatorCollege = req.user.collegeName || req.user.college || "Unknown College";
        eventData.college = req.user.collegeName || req.user.college || "Unknown College";
        eventData.status = "published";

        const event = await Event.create(eventData);

        const user = await User.findById(req.user._id);
        user.eventsHosted += 1;
        await user.save();

        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ coordinator: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: events.length, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, coordinator: req.user._id });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found or not authorized" });
        }
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findOne({ _id: req.params.id, coordinator: req.user._id });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found or not authorized" });
        }

        const allowedFields = ["title", "description", "venue", "startDate", "endDate", "startTime", "endTime", "registrationDeadline", "maxParticipants", "registrationFee", "prizes", "tags", "status"];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        event = await event.save();
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, coordinator: req.user._id });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found or not authorized" });
        }

        await event.deleteOne();

        const user = await User.findById(req.user._id);
        user.eventsHosted = Math.max(0, user.eventsHosted - 1);
        await user.save();

        res.status(200).json({ success: true, message: "Event removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEventAnalytics = async (req, res) => {
    try {
        const events = await Event.find({ coordinator: req.user._id });

        const totalEvents = events.length;
        const publishedEvents = events.filter(e => e.status === "published").length;
        const completedEvents = events.filter(e => e.status === "completed").length;

        let totalRegistrations = 0;
        let totalViews = 0;
        const categoryCount = {};
        const eventPerformance = [];

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const registrationDates = [];

        events.forEach(e => {
            totalRegistrations += e.registrations.length;
            totalViews += e.views;

            categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;

            eventPerformance.push({
                id: e._id,
                title: e.title,
                category: e.category,
                startDate: e.startDate,
                registrations: e.registrations.length,
                maxParticipants: e.maxParticipants,
                fillRate: e.maxParticipants ? ((e.registrations.length / e.maxParticipants) * 100).toFixed(1) : "0.0",
                views: e.views,
                status: e.status
            });

            e.registrations.forEach(r => {
                if (r.registeredAt > sixMonthsAgo) {
                    registrationDates.push(r.registeredAt);
                }
            });
        });

        const avgRegistrationsPerEvent = totalEvents > 0 ? (totalRegistrations / totalEvents).toFixed(1) : 0;

        const categoryBreakdown = Object.keys(categoryCount).map(category => ({
            category,
            count: categoryCount[category]
        }));

        eventPerformance.sort((a, b) => b.registrations - a.registrations);

        const monthlyMap = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthlyMap[label] = 0;
        }

        registrationDates.forEach(date => {
            const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            if (monthlyMap[label] !== undefined) {
                monthlyMap[label]++;
            }
        });

        const monthlyRegistrations = Object.keys(monthlyMap).map(month => ({
            month,
            count: monthlyMap[month]
        }));

        res.status(200).json({
            success: true,
            analytics: {
                totalEvents,
                publishedEvents,
                completedEvents,
                totalRegistrations,
                totalViews,
                avgRegistrationsPerEvent,
                categoryBreakdown,
                eventPerformance,
                monthlyRegistrations
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
