const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateJWT();

    const options = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user: user.publicProfile,
    });
};

exports.registerStudent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, confirmPassword, college } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            college: college || "",
            role: "student",
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginStudent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user || user.role !== "student") {
            return res.status(401).json({ success: false, message: "No student account found with this email" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.registerCoordinator = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, collegeName, email, password, confirmPassword } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const trimmedCollegeName = collegeName.trim();

        const user = await User.create({
            name,
            email,
            password,
            collegeName: trimmedCollegeName,
            college: trimmedCollegeName,
            role: "coordinator",
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginCoordinator = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { collegeName, email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user || user.role !== "coordinator") {
            return res.status(401).json({ success: false, message: "No coordinator account found with this email" });
        }

        if (user.collegeName.toLowerCase().trim() !== collegeName.toLowerCase().trim()) {
            return res.status(401).json({ success: false, message: "College name does not match our records for this email" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user: user.publicProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStudentProfile = async (req, res) => {
    try {
        const { name, college, department, phone, year, bio } = req.body;

        let user = await User.findById(req.user.id);

        if (name !== undefined) user.name = name;
        if (college !== undefined) user.college = college;
        if (department !== undefined) user.department = department;
        if (phone !== undefined) user.phone = phone;
        if (year !== undefined) user.year = year;
        if (bio !== undefined) user.bio = bio;

        user.isProfileComplete = Boolean(user.name && user.college && user.department && user.phone && user.year);

        await user.save();

        res.status(200).json({ success: true, user: user.publicProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCoordinatorProfile = async (req, res) => {
    try {
        const { name, collegeName, designation, phone, bio } = req.body;

        let user = await User.findById(req.user.id);

        if (name !== undefined) user.name = name;
        if (collegeName !== undefined) {
            user.collegeName = collegeName.trim();
            user.college = collegeName.trim();
        }
        if (designation !== undefined) user.designation = designation;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;

        user.isProfileComplete = Boolean(user.name && user.collegeName && user.designation && user.phone);

        await user.save();

        res.status(200).json({ success: true, user: user.publicProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select("+password");

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password" });
        }

        user.password = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
