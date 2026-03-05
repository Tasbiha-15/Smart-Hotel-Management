const bookingService = require('../../core/services/booking.service');

/**
 * Controller to create a booking
 */
const createBooking = async (req, res, next) => {
    try {
        const customerId = req.user._id; // Extracted from JWT protect middleware

        // Call service 
        const booking = await bookingService.createBooking(req.body, customerId);

        // Send Response
        res.status(201).json({
            status: 'success',
            data: { booking }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to fetch all bookings belonging to the logged-in user
 */
const getUserBookings = async (req, res, next) => {
    try {
        const customerId = req.user._id;

        const bookings = await bookingService.getUserBookings(customerId);

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to cancel a user's booking
 */
const cancelBooking = async (req, res, next) => {
    try {
        const customerId = req.user._id;
        const { id: bookingId } = req.params;

        const booking = await bookingService.cancelBooking(bookingId, customerId);

        res.status(200).json({
            status: 'success',
            message: 'Booking successfully cancelled.',
            data: { booking }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking
};
