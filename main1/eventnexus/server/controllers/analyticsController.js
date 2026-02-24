const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

exports.getEventAnalytics = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        if (event.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const registrations = await Registration.find({ event: eventId, status: 'confirmed' }).populate('user');
        const attendance = await Attendance.find({ event: eventId });

        const registrationCount = registrations.length;
        const attendanceCount = attendance.length;
        const noShowCount = registrationCount - attendanceCount;
        const successRate = registrationCount > 0 ? (attendanceCount / registrationCount) * 100 : 0;

        const registrationsByDayObj = {};
        const collegeBreakdownObj = {};
        const yearBreakdownObj = {};

        registrations.forEach(r => {
            const dateKey = r.registeredAt.toISOString().split('T')[0];
            registrationsByDayObj[dateKey] = (registrationsByDayObj[dateKey] || 0) + 1;

            const college = r.user.college || 'Unknown';
            collegeBreakdownObj[college] = (collegeBreakdownObj[college] || 0) + 1;

            const year = r.user.year || 'Unknown';
            yearBreakdownObj[year] = (yearBreakdownObj[year] || 0) + 1;
        });

        const hourlyAttendanceObj = {};
        attendance.forEach(a => {
            const hour = new Date(a.scannedAt).getHours();
            hourlyAttendanceObj[`${hour}:00`] = (hourlyAttendanceObj[`${hour}:00`] || 0) + 1;
        });

        const formatForChart = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value }));

        res.status(200).json({
            success: true,
            analytics: {
                registrationCount,
                attendanceCount,
                successRate,
                noShowCount,
                registrationsByDay: formatForChart(registrationsByDayObj).sort((a, b) => new Date(a.name) - new Date(b.name)),
                collegeBreakdown: formatForChart(collegeBreakdownObj).sort((a, b) => b.value - a.value).slice(0, 10),
                yearBreakdown: formatForChart(yearBreakdownObj),
                hourlyAttendance: formatForChart(hourlyAttendanceObj).sort((a, b) => parseInt(a.name) - parseInt(b.name)),
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getHostAnalytics = async (req, res) => {
    try {
        const events = await Event.find({ host: req.user._id });
        const eventSummaries = events.map(e => ({
            _id: e._id,
            title: e.title,
            registrationCount: e.registrationCount,
            attendanceCount: e.attendanceCount,
            successRate: e.successRate
        }));

        const totalRegistrations = events.reduce((sum, e) => sum + e.registrationCount, 0);
        const totalAttendance = events.reduce((sum, e) => sum + e.attendanceCount, 0);

        res.status(200).json({
            success: true,
            summary: {
                totalEvents: events.length,
                totalRegistrations,
                totalAttendance,
                overallSuccessRate: totalRegistrations > 0 ? (totalAttendance / totalRegistrations) * 100 : 0
            },
            events: eventSummaries
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
