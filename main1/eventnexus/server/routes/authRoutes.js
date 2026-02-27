const express = require("express");
const { body } = require("express-validator");
const {
    registerStudent,
    loginStudent,
    registerCoordinator,
    loginCoordinator,
    logout,
    getMe,
    updateStudentProfile,
    updateCoordinatorProfile,
    changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Fallback authorizeRoles since it might be missing from authMiddleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "User role is not authorized to access this route" });
        }
        next();
    };
};

const router = express.Router();

const studentRegisterValidation = [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 60 }).withMessage("Name must be 2–60 characters"),
    body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").matches(/\d/).withMessage("Password must contain at least one number"),
    body("confirmPassword").custom((v, { req }) => {
        if (v !== req.body.password) throw new Error("Passwords do not match");
        return true;
    }),
];

const studentLoginValidation = [
    body("email").trim().isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
];

const coordinatorRegisterValidation = [
    body("collegeName").trim().notEmpty().withMessage("College name is required").isLength({ min: 2, max: 120 }).withMessage("College name must be 2–120 characters"),
    body("name").trim().notEmpty().withMessage("Your name is required").isLength({ min: 2, max: 60 }).withMessage("Name must be 2–60 characters"),
    body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").matches(/\d/).withMessage("Password must contain at least one number"),
    body("confirmPassword").custom((v, { req }) => {
        if (v !== req.body.password) throw new Error("Passwords do not match");
        return true;
    }),
];

const coordinatorLoginValidation = [
    body("collegeName").trim().notEmpty().withMessage("College name is required"),
    body("email").trim().isEmail().withMessage("Enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
];

router.post("/student/register", studentRegisterValidation, registerStudent);
router.post("/student/login", studentLoginValidation, loginStudent);
router.post("/coordinator/register", coordinatorRegisterValidation, registerCoordinator);
router.post("/coordinator/login", coordinatorLoginValidation, loginCoordinator);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.put("/student/profile", protect, authorizeRoles("student"), updateStudentProfile);
router.put("/coordinator/profile", protect, authorizeRoles("coordinator"), updateCoordinatorProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
