const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'host', 'admin'],
        default: 'user',
    },
    college: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    year: {
        type: String,
        enum: ['1', '2', '3', '4', 'PG', 'PhD', ''],
    },
    avatar: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        maxLength: 300,
        default: '',
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.generateToken = function (_id) {
    return jwt.sign({ id: _id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
