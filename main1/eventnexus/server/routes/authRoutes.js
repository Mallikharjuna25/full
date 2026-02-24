const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);

router.get('/me', protect, authController.getMe);
router.put('/profile', protect, uploadAvatar, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
