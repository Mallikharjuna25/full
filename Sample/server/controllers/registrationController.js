const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

exports.registerForEvent = async (req, res) => {
  try {
    const registration = await Registration.create({ event: req.params.eventId, user: req.user.id });
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create({ event: req.params.eventId, user: req.user.id });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).populate('event');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
