const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { uploadIdProof } = require('../middleware/uploadMiddleware');

router.post('/event/:eventId', protect, uploadIdProof, registrationController.registerForEvent);
router.get('/my', protect, registrationController.getUserRegistrations);
router.post('/scan', protect, authorizeRoles('host', 'admin'), registrationController.scanQR);

router.route('/:id')
    .get(protect, registrationController.getRegistrationById)
    .delete(protect, registrationController.cancelRegistration);

module.exports = router;
