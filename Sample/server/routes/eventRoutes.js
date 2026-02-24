const express = require('express');
const { createEvent, getAllEvents, getEventById } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('host', 'admin'), createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);

module.exports = router;
