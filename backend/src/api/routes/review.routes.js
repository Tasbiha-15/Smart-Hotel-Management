const express = require('express');
const { body } = require('express-validator');

const reviewController = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

const router = express.Router({ mergeParams: true });
// mergeParams allows accessing req.params.roomId from nested route config later if needed

// --- Validation Schemas ---
const createReviewValidation = [
    body('roomId').isMongoId().withMessage('Valid Room ID is required'),
    body('bookingId').isMongoId().withMessage('Valid Booking ID is required'),
    body('rating')
        .isNumeric().withMessage('Rating must be a number')
        .custom(val => val >= 1 && val <= 5).withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .notEmpty().withMessage('Comment cannot be empty')
        .isLength({ max: 1000 }).withMessage('Comment maximum length is 1000 characters')
];

// --- Routes ---

// GET /api/v1/rooms/:roomId/reviews is handled via redirection in app.js or room.routes.js
// For simplicity, we can also mount a direct endpoint:
// GET /api/v1/reviews/room/:roomId
router.get('/room/:roomId', reviewController.getRoomReviews);

// POST /api/v1/reviews -> Create new Review (Protected)
router.post(
    '/',
    protect,
    restrictTo('Customer'),
    createReviewValidation,
    validateRequest,
    reviewController.createReview
);

module.exports = router;
