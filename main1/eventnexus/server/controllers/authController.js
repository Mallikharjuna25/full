const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const { validationResult, matchedData } = require("express-validator");
const { sendOTPEmail } = require("../services/emailService");
const crypto = require("crypto");

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateJWT();

    const cookieExpireDays = process.env.JWT_COOKIE_EXPIRE ? parseInt(process.env.JWT_COOKIE_EXPIRE, 10) : 30;

    const options = {
        expires: new Date(
            Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
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

        const { name, email, password, confirmPassword, college } = matchedData(req);

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

        const { email, password } = matchedData(req);

        const user = await User.findOne({ email }).select("+password");

        if (!user || user.role !== "student") {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
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

        const { name, collegeName, email, password, confirmPassword } = matchedData(req);

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

        const { collegeName, email, password } = matchedData(req);

        const user = await User.findOne({ email }).select("+password");

        if (!user || user.role !== "coordinator") {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
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
            return res.status(400).json({ success: false, message: "Current password is incorrect." });
        }

        user.password = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Request OTP for login
exports.requestLoginOTP = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ success: false, message: "Email and role are required" });
        }

        // Check if user exists with the specified role
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email and role" });
        }

        // Delete any existing OTPs for this email and purpose
        await OTP.deleteMany({ email, purpose: 'login' });

        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database
        await OTP.create({
            email,
            otp,
            purpose: 'login',
            expiresAt
        });

        // Send OTP via email
        await sendOTPEmail({
            to: email,
            userName: user.name,
            otp,
            purpose: 'login'
        });

        res.status(200).json({
            success: true,
            message: "OTP sent to your email. Valid for 10 minutes."
        });
    } catch (error) {
        console.error('Request Login OTP Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify OTP and login
exports.verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp, role } = req.body;

        if (!email || !otp || !role) {
            return res.status(400).json({ success: false, message: "Email, OTP, and role are required" });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ 
            email, 
            purpose: 'login',
            verified: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "No OTP found or OTP already used" });
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ success: false, message: "Too many failed attempts. Please request a new OTP." });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return res.status(400).json({ 
                success: false, 
                message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
            });
        }

        // Mark OTP as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Find user and login
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Verify Login OTP Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Request OTP for forgot password
exports.requestForgotPasswordOTP = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ success: false, message: "Email and role are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email and role" });
        }

        // Delete any existing OTPs for this email and purpose
        await OTP.deleteMany({ email, purpose: 'forgot-password' });

        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database
        await OTP.create({
            email,
            otp,
            purpose: 'forgot-password',
            expiresAt
        });

        // Send OTP via email
        await sendOTPEmail({
            to: email,
            userName: user.name,
            otp,
            purpose: 'forgot-password'
        });

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email. Valid for 10 minutes."
        });
    } catch (error) {
        console.error('Request Forgot Password OTP Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify OTP and reset password
exports.resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, otp, newPassword, role } = req.body;

        if (!email || !otp || !newPassword || !role) {
            return res.status(400).json({ success: false, message: "Email, OTP, new password, and role are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ 
            email, 
            purpose: 'forgot-password',
            verified: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "No OTP found or OTP already used" });
        }

        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ success: false, message: "Too many failed attempts. Please request a new OTP." });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return res.status(400).json({ 
                success: false, 
                message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
            });
        }

        // Mark OTP as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Find user and update password
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.password = newPassword;
        await user.save();

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully. You can now login with your new password."
        });
    } catch (error) {
        console.error('Reset Password with OTP Error:', error);
        res.status(500).json({ success:false, message: error.message });
    }
};
