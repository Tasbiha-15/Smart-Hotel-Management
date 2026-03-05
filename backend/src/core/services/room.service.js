const Room = require('../models/Room');
const AppError = require('../../utils/AppError');

/**
 * Service to create a new room
 * @param {Object} roomData - Room payload
 * @returns {Object} Created Room
 */
const createRoom = async (roomData) => {
    const existingRoom = await Room.findOne({ roomNumber: roomData.roomNumber });
    if (existingRoom) {
        throw new AppError('A room with this number already exists', 400);
    }

    const room = await Room.create(roomData);
    return room;
};

/**
 * Service to get all rooms with filtering features
 * @param {Object} query - req.query object to filter (e.g., ?type=Deluxe&status=Available)
 * @returns {Array} List of Rooms
 */
const getAllRooms = async (query) => {
    // 1. Basic Filtering
    const queryObj = { ...query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. Advanced Filtering (e.g., basePrice[gte]=100 => { basePrice: { $gte: 100 } })
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let mongooseQuery = Room.find(JSON.parse(queryStr));

    // 3. Sorting (default to descending price if no sort provided)
    if (query.sort) {
        const sortBy = query.sort.split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    // 4. Execute the query
    const rooms = await mongooseQuery;
    return rooms;
};

/**
 * Service to get a single room by ID
 * @param {string} id - Room Mongo ID
 * @returns {Object} Room
 */
const getRoomById = async (id) => {
    const room = await Room.findById(id);
    if (!room) {
        throw new AppError('No room found with that ID', 404);
    }
    return room;
};

/**
 * Service to update a room
 * @param {string} id - Room ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated Room
 */
const updateRoom = async (id, updateData) => {
    const room = await Room.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!room) {
        throw new AppError('No room found with that ID', 404);
    }

    return room;
};

/**
 * Service to update room status (e.g. from Available to Occupied)
 * @param {string} id - Room ID
 * @param {string} newStatus - New status
 * @returns {Object} Updated Room
 */
const updateRoomStatus = async (id, newStatus) => {
    const allowedStatuses = ['Available', 'Occupied', 'Maintenance'];
    if (!allowedStatuses.includes(newStatus)) {
        throw new AppError('Invalid status provided', 400);
    }

    const room = await Room.findByIdAndUpdate(
        id,
        { status: newStatus },
        { new: true, runValidators: true }
    );

    if (!room) {
        throw new AppError('No room found with that ID', 404);
    }

    return room;
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    updateRoomStatus,
};
