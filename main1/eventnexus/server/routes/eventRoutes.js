const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { uploadEventImages } = require('../middleware/uploadMiddleware');

router.route('/')
    .get(eventController.getPublicEvents)
    .post(protect, uploadEventImages, eventController.createEvent);

router.get('/host/my-events', protect, eventController.getHostEvents);

router.route('/:id')
    .get(eventController.getEventById)
    .put(protect, uploadEventImages, eventController.updateEvent)
    .delete(protect, eventController.deleteEvent);

router.get('/:id/registrations', protect, eventController.getEventRegistrations);

module.exports = router;
