const Booking = require('../models/Booking');
const Room = require('../models/Room');
const AppError = require('../../utils/AppError');

/**
 * Service to create a new booking
 * @param {Object} bookingData - checkInDate, checkOutDate, roomId
 * @param {string} customerId - ID of the creating Customer
 * @returns {Object} Created Booking
 */
const createBooking = async (bookingData, customerId) => {
    const { roomId, checkInDate, checkOutDate } = bookingData;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // 1. Basic Date Validation
    if (checkIn >= checkOut) {
        throw new AppError('Check-out date must be after check-in date', 400);
    }
    if (checkIn < new Date().setHours(0, 0, 0, 0)) {
        throw new AppError('Cannot book dates in the past', 400);
    }

    // 2. Validate Room Availability
    const room = await Room.findById(roomId);
    if (!room) {
        throw new AppError('No room found with that ID', 404);
    }

    // 3. Date Conflict Detection (Check overlapping dates)
    // Two date ranges overlap if: (StartA < EndB) and (EndA > StartB)
    const conflictingBooking = await Booking.findOne({
        roomId,
        bookingStatus: { $ne: 'Cancelled' },
        $and: [
            { checkInDate: { $lt: checkOut } },
            { checkOutDate: { $gt: checkIn } }
        ]
    });

    if (conflictingBooking) {
        throw new AppError('Room is already booked for the selected dates', 400);
    }

    // 4. Calculate Total Amount
    const timeDifferenceInMs = checkOut.getTime() - checkIn.getTime();
    const numberOfNights = Math.ceil(timeDifferenceInMs / (1000 * 3600 * 24));
    const totalAmount = room.basePrice * numberOfNights;

    // 5. Create Booking
    const booking = await Booking.create({
        customerId,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalAmount,
        bookingStatus: 'Confirmed', // Default
        paymentStatus: 'Pending'    // Default
    });

    // 6. Update Room Status (as requested, update to 'Occupied' when confirmed)
    room.status = 'Occupied';
    await room.save({ validateBeforeSave: false });

    return booking;
};

/**
 * Service to retrieve all bookings for a specific customer
 * @param {string} customerId - Customer ID
 * @returns {Array} List of Bookings
 */
const getUserBookings = async (customerId) => {
    const bookings = await Booking.find({ customerId })
        .populate({
            path: 'roomId',
            select: 'roomNumber type basePrice amenities' // Select specific fields from room
        })
        .sort('-createdAt');

    return bookings;
};

/**
 * Service to cancel a booking
 * @param {string} bookingId - Booking ID to cancel
 * @param {string} customerId - Customer ID acting (for security validation)
 * @returns {Object} Cancelled Booking
 */
const cancelBooking = async (bookingId, customerId) => {
    // Find booking that belongs to this specific customer
    const booking = await Booking.findOne({ _id: bookingId, customerId });

    if (!booking) {
        throw new AppError('No active booking found with that ID for this account', 404);
    }

    if (booking.bookingStatus === 'Cancelled') {
        throw new AppError('Booking is already cancelled', 400);
    }

    // Update status
    booking.bookingStatus = 'Cancelled';
    await booking.save();

    // Re-open room availability
    const room = await Room.findById(booking.roomId);
    if (room) {
        // Ideally we should check if there's another active booking on this room right now
        // But for a simple implementation, switch it back to Available
        room.status = 'Available';
        await room.save({ validateBeforeSave: false });
    }

    return booking;
};

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking
};
