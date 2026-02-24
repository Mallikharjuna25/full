const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/events', adminController.getAllEvents);
router.get('/events/pending', adminController.getPendingEvents);
router.put('/events/:id/review', adminController.reviewEvent);
router.get('/users', adminController.getAllUsers);
router.get('/events/:id/export', adminController.exportAttendance);

module.exports = router;
