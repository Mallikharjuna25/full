const Event = require('../models/Event');
const qrService = require('../services/qrService');

exports.createEvent = async (req, res) => {
  try {
    const qrCode = await qrService.generateQR(req.body.title);
    const event = await Event.create({ ...req.body, host: req.user.id, qrCode });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('host', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('host', 'name email');
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
