import express from 'express';
import {
    registerStudent, loginStudent,
    registerOrganizer, loginOrganizer,
    loginAdmin
} from '../controllers/authController.js';

const router = express.Router();

router.post('/student/signup', registerStudent);
router.post('/student/login', loginStudent);
router.post('/organizer/signup', registerOrganizer);
router.post('/organizer/login', loginOrganizer);
router.post('/admin/login', loginAdmin);

export default router;
