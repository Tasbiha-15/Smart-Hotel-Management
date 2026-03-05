const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Booking',
            required: [true, 'Payment must belong to a Booking.'],
        },
        amount: {
            type: Number,
            required: [true, 'Payment must have an amount.'],
            min: [0, 'Amount must be a positive number.'],
        },
        method: {
            type: String,
            enum: ['Card', 'Cash', 'BankTransfer'],
            required: [true, 'Payment must have a method.'],
        },
        transactionId: {
            type: String,
            unique: true,
            required: [true, 'Payment must have a transaction ID.'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
paymentSchema.index({ bookingId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
