const Review = require('../models/Review');
const Booking = require('../models/Booking');
const AppError = require('../../utils/AppError');

/**
 * Basic rule-based simulation of AI sentiment analysis.
 * Returns a score between -1 and 1.
 * @param {string} text 
 */
const calculateBasicSentiment = (text) => {
    const lowerText = text.toLowerCase();

    const positiveWords = ['excellent', 'great', 'awesome', 'amazing', 'perfect', 'good', 'loved', 'beautiful', 'clean', 'comfortable'];
    const negativeWords = ['bad', 'terrible', 'awful', 'dirty', 'poor', 'rude', 'worst', 'uncomfortable', 'noisy', 'broken'];

    let score = 0;

    const words = lowerText.split(/\W+/);

    words.forEach(word => {
        if (positiveWords.includes(word)) score += 0.2;
        if (negativeWords.includes(word)) score -= 0.2;
    });

    // Clamp between -1 and 1
    return Math.max(-1, Math.min(1, score));
};

/**
 * Service to create a new review for a room
 */
const createReview = async (reviewData, customerId) => {
    const { roomId, bookingId, rating, comment } = reviewData;

    // 1. Validate the booking belongs to the customer and is "Completed"
    // Assuming 'bookingStatus' of 'CheckedOut' or 'Confirmed' + payment 'Completed' is valid.
    // We'll enforce that the booking must be 'CheckedOut' or at least 'Confirmed' and they actually stayed
    const booking = await Booking.findOne({ _id: bookingId, customerId, roomId });

    if (!booking) {
        throw new AppError('No matching booking found for this account and room.', 404);
    }

    // To be robust, force them to have completed their stay (or just completed payment for simple implementation)
    if (booking.paymentStatus !== 'Completed') {
        throw new AppError('You can only review a booking that has been fully paid.', 400);
    }

    // 2. Prevent duplicate reviews (also handled by MongoDB unique index, but good to check early)
    const existingReview = await Review.findOne({ customerId, bookingId });
    if (existingReview) {
        throw new AppError('You have already submitted a review for this booking.', 400);
    }

    // 3. Simple AI Sentiment Analysis
    const aiSentimentScore = calculateBasicSentiment(comment);

    // 4. Create Review
    const review = await Review.create({
        customerId,
        roomId,
        bookingId,
        rating,
        comment,
        aiSentimentScore,
        isPublic: true
    });

    return review;
};

/**
 * Service to get all public reviews for a specific room
 */
const getRoomReviews = async (roomId, query) => {
    // Add pagination limits
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ roomId, isPublic: true })
        .populate({
            path: 'customerId',
            select: 'firstName lastName'
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    return reviews;
};

module.exports = {
    createReview,
    getRoomReviews
};
