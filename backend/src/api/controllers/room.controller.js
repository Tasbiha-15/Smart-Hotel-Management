const roomService = require('../../core/services/room.service');

/**
 * Controller to create a new Room
 */
const createRoom = async (req, res, next) => {
    try {
        const room = await roomService.createRoom(req.body);

        res.status(201).json({
            status: 'success',
            data: { room }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get all rooms (allows filtering via req.query)
 */
const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await roomService.getAllRooms(req.query);

        res.status(200).json({
            status: 'success',
            results: rooms.length,
            data: { rooms }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to get a single room by ID
 */
const getRoom = async (req, res, next) => {
    try {
        const room = await roomService.getRoomById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { room }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to update room details
 */
const updateRoom = async (req, res, next) => {
    try {
        const room = await roomService.updateRoom(req.params.id, req.body);

        res.status(200).json({
            status: 'success',
            data: { room }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to change a room's status
 */
const updateRoomStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const room = await roomService.updateRoomStatus(req.params.id, status);

        res.status(200).json({
            status: 'success',
            data: { room }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoom,
    updateRoom,
    updateRoomStatus
};
