const express = require("express");
const { body } = require("express-validator");
const {
    createEvent,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventAnalytics,
} = require("../controllers/coordinatorController");
const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "User role is not authorized to access this route" });
        }
        next();
    };
};

const router = express.Router();

const createEventValidation = [
    body("title").trim().notEmpty().withMessage("Event title is required").isLength({ min: 3, max: 120 }).withMessage("Title must be between 3 and 120 characters"),
    body("description").trim().notEmpty().withMessage("Description is required").isLength({ min: 10, max: 2000 }).withMessage("Description must be between 10 and 2000 characters"),
    body("category").isIn(["Technology", "Hackathon", "Cultural", "Sports", "Business", "Science", "Workshop", "Other"]).withMessage("Invalid category"),
    body("venue").trim().notEmpty().withMessage("Venue is required"),
    body("startDate").isISO8601().withMessage("Valid start date required"),
    body("endDate").isISO8601().withMessage("Valid end date required"),
    body("registrationDeadline").isISO8601().withMessage("Valid deadline required"),
    body("maxParticipants").isInt({ min: 1, max: 10000 }).withMessage("Participants must be between 1 and 10000"),
];

router.use(protect, authorizeRoles("coordinator"));

router.post("/events", createEventValidation, createEvent);
router.get("/events", getMyEvents);
router.get("/events/:id", getEventById);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);
router.get("/analytics", getEventAnalytics);

module.exports = router;
