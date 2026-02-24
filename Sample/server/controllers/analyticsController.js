const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

exports.getEventAnalytics = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const registrations = await Registration.countDocuments({ event: req.params.eventId });
    const attendance = await Attendance.countDocuments({ event: req.params.eventId });
    res.json({ event, registrations, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
