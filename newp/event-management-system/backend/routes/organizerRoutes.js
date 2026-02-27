import express from 'express';
import {
    getProfile, createEvent, getMyEvents, getEventParticipants, scanQR
} from '../controllers/organizerController.js';
import { protect, authorize, checkApproved } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('organizer'));

router.get('/profile', getProfile);

router.post('/events', checkApproved, upload.single('bannerImage'), createEvent);
router.get('/events', checkApproved, getMyEvents);
router.get('/events/:eventId/participants', checkApproved, getEventParticipants);
router.post('/events/:eventId/scan', checkApproved, scanQR);

export default router;
