const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a Customer.'],
        },
        roomId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Room',
            required: [true, 'Review must belong to a Room.'],
        },
        bookingId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Booking',
            required: [true, 'Review must belong to a Booking.'],
        },
        rating: {
            type: Number,
            required: [true, 'Review must have a rating.'],
            min: [1, 'Rating must be at least 1.0'],
            max: [5, 'Rating must not be greater than 5.0'],
            set: (val) => Math.round(val * 10) / 10 // e.g. 4.666666 -> 4.7
        },
        comment: {
            type: String,
            required: [true, 'Review must have a comment.'],
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        },
        aiSentimentScore: {
            type: Number,
            min: -1, // -1 (very negative) to 1 (very positive)
            max: 1
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Prevent duplicate reviews: One customer can only write one review per booking
reviewSchema.index({ customerId: 1, bookingId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
