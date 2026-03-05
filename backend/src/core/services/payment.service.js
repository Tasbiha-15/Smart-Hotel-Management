const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const AppError = require('../../utils/AppError');
const invoiceService = require('./invoice.service');

/**
 * Service to simulate a payment process
 * @param {Object} paymentData - { bookingId, amount, method }
 * @param {string} customerId - Logged-in customer ID for validation
 * @returns {Object} Created Payment record
 */
const simulatePayment = async (paymentData, customerId) => {
    const { bookingId, amount, method } = paymentData;

    // 1. Verify Booking belongs to the customer
    const booking = await Booking.findOne({ _id: bookingId, customerId });
    if (!booking) {
        throw new AppError('No booking found with that ID for this account', 404);
    }

    // 2. Prevent double payment
    if (booking.paymentStatus === 'Completed') {
        throw new AppError('This booking has already been paid for.', 400);
    }

    // 3. Verify Amount matches booking total
    if (amount !== booking.totalAmount) {
        throw new AppError(`Payment amount ($${amount}) does not match booking total ($${booking.totalAmount}).`, 400);
    }

    // 4. Simulate Gateway Delay & Decision (80% success rate simulation)
    const isSuccess = Math.random() < 0.8;
    const status = isSuccess ? 'Completed' : 'Failed';

    // Generate random mock transaction ID: e.g., TXN-8f92a1b
    const transactionId = `TXN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 5. Create Payment Record
    const payment = await Payment.create({
        bookingId,
        amount,
        method,
        transactionId,
        status
    });

    // 6. Update Booking status if successful
    if (isSuccess) {
        booking.paymentStatus = 'Completed';
        await booking.save();
    } else {
        // If we wanted to, we could trigger a retry warning here. 
        // We throw an AppError to let the user know their card 'declined'
        throw new AppError(`Payment Simulation Failed. Transaction ID: ${transactionId}. Please try again.`, 400);
    }

    return payment;
};

/**
 * Service to retrieve a PDF invoice for a completed booking
 * @param {string} bookingId 
 * @param {string} customerId 
 * @returns {Buffer} PDF data
 */
const getInvoiceForBooking = async (bookingId, customerId) => {
    // 1. Fetch Booking and populate related data required for the invoice
    const booking = await Booking.findOne({ _id: bookingId, customerId })
        .populate('roomId', 'roomNumber type')
        .populate('customerId', 'firstName lastName email');

    if (!booking) {
        throw new AppError('Booking not found.', 404);
    }

    // 2. Fetch corresponding completed Payment
    const payment = await Payment.findOne({ bookingId, status: 'Completed' });
    if (!payment) {
        throw new AppError('Invoice unavailable: Payment has not been completed for this booking.', 400);
    }

    // 3. Delegate PDF generation to dedicated service
    const pdfBuffer = await invoiceService.generateInvoicePDF(booking, payment);

    return pdfBuffer;
};

module.exports = {
    simulatePayment,
    getInvoiceForBooking
};
