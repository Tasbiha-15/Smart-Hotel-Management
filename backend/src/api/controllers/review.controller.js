const reviewService = require('../../core/services/review.service');

/**
 * Controller to create a review
 */
const createReview = async (req, res, next) => {
    try {
        const customerId = req.user._id;

        const review = await reviewService.createReview(req.body, customerId);

        res.status(201).json({
            status: 'success',
            data: { review }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to fetch reviews for a specific room
 */
const getRoomReviews = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        const reviews = await reviewService.getRoomReviews(roomId, req.query);

        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: { reviews }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getRoomReviews
};
