const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [60, "Name cannot exceed 60 characters"],
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ["student", "coordinator", "admin"],
            default: "student",
        },
        college: { type: String, trim: true, default: "" },
        phone: { type: String, trim: true, default: "" },
        bio: { type: String, maxlength: 300, default: "" },
        avatar: { type: String, default: "" },
        department: { type: String, trim: true, default: "" },
        year: {
            type: String,
            enum: ["", "1", "2", "3", "4", "PG", "PhD"],
            default: "",
        },
        collegeName: { type: String, trim: true, default: "" },
        designation: { type: String, trim: true, default: "" },
        eventsHosted: { type: Number, default: 0 },
        isProfileComplete: { type: Boolean, default: false },
        lastLogin: { type: Date },
    },
    { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.generateJWT = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
            collegeName: this.collegeName,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Virtual for public profile
UserSchema.virtual("publicProfile").get(function () {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        college: this.college,
        collegeName: this.collegeName,
        department: this.department,
        phone: this.phone,
        year: this.year,
        avatar: this.avatar,
        bio: this.bio,
        designation: this.designation,
        eventsHosted: this.eventsHosted,
        isProfileComplete: this.isProfileComplete,
        createdAt: this.createdAt,
    };
});

module.exports = mongoose.model("User", UserSchema);
