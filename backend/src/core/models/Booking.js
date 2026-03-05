const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Booking must belong to a Customer.'],
        },
        roomId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Room',
            required: [true, 'Booking must belong to a Room.'],
        },
        checkInDate: {
            type: Date,
            required: [true, 'Booking must have a check-in date.'],
        },
        checkOutDate: {
            type: Date,
            required: [true, 'Booking must have a check-out date.'],
        },
        totalAmount: {
            type: Number,
            required: [true, 'Booking must have a total amount.'],
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending',
        },
        bookingStatus: {
            type: String,
            enum: ['Confirmed', 'Cancelled', 'CheckedIn', 'CheckedOut'],
            default: 'Confirmed',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries 
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ roomId: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
