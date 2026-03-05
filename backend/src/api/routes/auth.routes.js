const express = require('express');
const { body } = require('express-validator');

// Import Controllers and Middlewares
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validate.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// --- Validation Schemas defined directly in routes to keep it colocated ---

const registerValidation = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email structure'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('passwordConfirm')
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password cannot be empty')
];

// --- Authentication Routes ---

// @route   POST /api/v1/auth/register
// @access  Public
router.post(
    '/register',
    registerValidation,  // 1. Run express-validator rules
    validateRequest,     // 2. Intercept and format validation errors
    authController.register // 3. Hit the controller
);

// @route   POST /api/v1/auth/login
// @access  Public
router.post(
    '/login',
    loginValidation,
    validateRequest,
    authController.login
);

// --- Testing Protect and RBAC (Example for later reference) ---
// @route   GET /api/v1/auth/test-admin
// @access  Private/Admin
router.get(
    '/test-admin',
    protect, // Ensure JWT exists and is valid
    restrictTo('Admin'), // Ensure user role is exactly 'Admin'
    (req, res) => {
        res.status(200).json({ status: 'success', message: 'Hello, Admin!', user: req.user });
    }
);

module.exports = router;
