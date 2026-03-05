const express = require('express');
const { body } = require('express-validator');

const paymentController = require('../controllers/payment.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

const router = express.Router();

// --- Validation Schemas ---
const createPaymentValidation = [
    body('bookingId').isMongoId().withMessage('Valid Booking ID is required'),
    body('amount')
        .isNumeric().withMessage('Amount must be a number')
        .custom(val => val > 0).withMessage('Amount must be positive'),
    body('method')
        .isIn(['Card', 'Cash', 'BankTransfer'])
        .withMessage('Invalid payment method')
];

// --- Routes ---
// All payment handling requires active session (JWT validation)
router.use(protect);

// POST /api/v1/payments -> Process a payment simulation
router.post(
    '/',
    restrictTo('Customer'),
    createPaymentValidation,
    validateRequest,
    paymentController.createPayment
);

// GET /api/v1/payments/:bookingId/invoice -> Download Invoice PDF
// Note: We don't apply validation middleware here because params are easily caught natively, but you could.
router.get(
    '/:bookingId/invoice',
    restrictTo('Customer'), // Customers download their own invoices
    paymentController.getInvoice
);

module.exports = router;
