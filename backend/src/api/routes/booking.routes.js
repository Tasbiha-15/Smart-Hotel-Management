const express = require('express');
const { body } = require('express-validator');

const bookingController = require('../controllers/booking.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

const router = express.Router();

// --- Validation Schemas ---
const createBookingValidation = [
    body('roomId').isMongoId().withMessage('Valid Room ID is required'),
    body('checkInDate').isISO8601().toDate().withMessage('Check-in date must be a valid ISO8601 date'),
    body('checkOutDate').isISO8601().toDate().withMessage('Check-out date must be a valid ISO8601 date')
];

// --- Routes ---
// All booking routes in this scope are protected and require a valid JWT
router.use(protect);

// POST /api/v1/bookings -> Create new Booking (Customers only)
// GET  /api/v1/bookings -> Find all bookings for logged-in user
router
    .route('/')
    .post(
        restrictTo('Customer'),
        createBookingValidation,
        validateRequest,
        bookingController.createBooking
    )
    .get(
        restrictTo('Customer'),
        bookingController.getUserBookings
    );

// PATCH /api/v1/bookings/:id/cancel -> Cancel an existing Booking
router.patch(
    '/:id/cancel',
    restrictTo('Customer'),
    bookingController.cancelBooking
);

module.exports = router;
