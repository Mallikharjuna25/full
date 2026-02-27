import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Organizer from '../models/Organizer.js';
import Admin from '../models/Admin.js';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register new student
// @route   POST /api/auth/student/signup
// @access  Public
export const registerStudent = asyncHandler(async (req, res) => {
    const { name, email, password, collegeName, branch, graduationYear, registerNumber } = req.body;

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        res.status(400);
        throw new Error('Student already exists');
    }

    const regNumExists = await Student.findOne({ registerNumber });
    if (regNumExists) {
        res.status(400);
        throw new Error('Register number already exists');
    }

    const student = await Student.create({
        name,
        email,
        password,
        collegeName,
        branch,
        graduationYear,
        registerNumber,
        status: 'pending' // Default
    });

    if (student) {
        res.status(201).json({ message: 'Account created. Pending admin review.' });
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

// @desc    Auth student & get token
// @route   POST /api/auth/student/login
// @access  Public
export const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (student && (await student.matchPassword(password))) {
        if (student.status === 'pending') {
            res.status(403);
            throw new Error('Your account is under review by the administrator.');
        }
        if (student.status === 'rejected') {
            res.status(403);
            throw new Error('Your account has been rejected.');
        }

        res.json({
            _id: student._id,
            name: student.name,
            email: student.email,
            role: student.role,
            status: student.status,
            token: generateToken(student._id, 'student'),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register new organizer
// @route   POST /api/auth/organizer/signup
// @access  Public
export const registerOrganizer = asyncHandler(async (req, res) => {
    const { collegeName, email, password, place } = req.body;

    const organizerExists = await Organizer.findOne({ email });
    if (organizerExists) {
        res.status(400);
        throw new Error('Organizer already exists');
    }

    const organizer = await Organizer.create({
        collegeName,
        email,
        password,
        place,
        status: 'pending' // Default
    });

    if (organizer) {
        res.status(201).json({ message: 'Account created. Pending admin review.' });
    } else {
        res.status(400);
        throw new Error('Invalid organizer data');
    }
});

// @desc    Auth organizer & get token
// @route   POST /api/auth/organizer/login
// @access  Public
export const loginOrganizer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const organizer = await Organizer.findOne({ email });

    if (organizer && (await organizer.matchPassword(password))) {
        if (organizer.status === 'pending') {
            res.status(403);
            throw new Error('Your account is under review by the administrator.');
        }
        if (organizer.status === 'rejected') {
            res.status(403);
            throw new Error('Your account has been rejected.');
        }

        res.json({
            _id: organizer._id,
            collegeName: organizer.collegeName,
            email: organizer.email,
            role: organizer.role,
            status: organizer.status,
            token: generateToken(organizer._id, 'organizer'),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Auth admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
    const { adminId, password } = req.body;

    const admin = await Admin.findOne({ adminId });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            adminId: admin.adminId,
            role: admin.role,
            token: generateToken(admin._id, 'admin'),
        });
    } else {
        res.status(401);
        throw new Error('Invalid Admin ID or password');
    }
});
