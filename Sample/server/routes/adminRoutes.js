const express = require('express');
const { getEventAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/analytics/:eventId', authMiddleware, roleMiddleware('admin'), getEventAnalytics);

module.exports = router;
