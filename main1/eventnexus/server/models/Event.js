const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add a title"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [120, "Title cannot exceed 120 characters"],
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        college: {
            type: String,
            required: [true, "Please add a college name"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            enum: ["Technology", "Hackathon", "Cultural", "Sports", "Business", "Science", "Workshop", "Other"],
        },
        venue: {
            type: String,
            required: [true, "Please add a venue"],
            trim: true,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        startTime: { type: String, default: "09:00" },
        endTime: { type: String, default: "18:00" },
        registrationDeadline: { type: Date, required: true },
        maxParticipants: {
            type: Number,
            required: true,
            min: 1,
            max: 10000,
        },
        registrationFee: { type: Number, default: 0, min: 0 },
        prizes: { type: String, trim: true, default: "" },
        tags: { type: [String], default: [] },
        image: { type: String, default: "" },
        status: {
            type: String,
            enum: ["draft", "published", "cancelled", "completed"],
            default: "published",
        },
        coordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coordinatorName: { type: String, required: true },
        coordinatorCollege: { type: String, required: true },
        registrations: [
            {
                student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                registeredAt: { type: Date, default: Date.now },
            },
        ],
        views: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

EventSchema.virtual("registrationCount").get(function () {
    return this.registrations.length;
});

EventSchema.virtual("isRegistrationOpen").get(function () {
    return new Date() < this.registrationDeadline && this.status === "published";
});

EventSchema.index({ coordinator: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ startDate: 1 });
EventSchema.index({ status: 1 });

module.exports = mongoose.model("Event", EventSchema);
