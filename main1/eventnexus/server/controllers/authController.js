const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
        const { name, email, password, college } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: 'User already exists' });

        user = await User.create({ name, email, password, college });
        const token = User.generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                college: user.college,
                isProfileComplete: user.isProfileComplete,
                avatar: user.avatar
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = User.generateToken(user._id);
        const userToReturn = { ...user.toObject() };
        delete userToReturn.password;

        res.status(200).json({ success: true, token, user: userToReturn });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, secretKey } = req.body;
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ success: false, message: 'Invalid secret key' });
        }

        let user = await User.findOne({ email, role: 'admin' });
        if (!user) {
            user = await User.create({
                name: 'Administrator',
                email,
                password: process.env.ADMIN_SECRET_KEY,
                role: 'admin',
                isProfileComplete: true
            });
        }

        const token = User.generateToken(user._id);
        res.status(200).json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, college, department, phone, year, bio } = req.body;
        let updateData = { name, college, department, phone, year, bio };

        if (req.file) {
            updateData.avatar = req.file.path;
        }

        const tempUser = { ...req.user.toObject(), ...updateData };
        const requiredFields = ['name', 'college', 'department', 'phone', 'year'];
        const isProfileComplete = requiredFields.every(field => tempUser[field]);

        updateData.isProfileComplete = isProfileComplete;

        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true }).select('-password');
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect current password' });

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
