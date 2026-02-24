const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/event/:id', analyticsController.getEventAnalytics);
router.get('/host', analyticsController.getHostAnalytics);

module.exports = router;
