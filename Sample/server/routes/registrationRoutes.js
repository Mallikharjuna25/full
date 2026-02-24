const express = require('express');
const { registerForEvent, markAttendance, getUserRegistrations } = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:eventId', authMiddleware, registerForEvent);
router.post('/:eventId/attendance', authMiddleware, markAttendance);
router.get('/my-events', authMiddleware, getUserRegistrations);

module.exports = router;
