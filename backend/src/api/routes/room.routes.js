const express = require('express');
const { body } = require('express-validator');

// Controllers and Middlewares
const roomController = require('../controllers/room.controller');
const { validateRequest } = require('../middlewares/validate.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// --- Validation Schemas ---
const createRoomValidation = [
    body('roomNumber').notEmpty().withMessage('Room number is required'),
    body('type').isIn(['Standard', 'Deluxe', 'Suite']).withMessage('Invalid room type'),
    body('basePrice').isNumeric().withMessage('Base price must be a number').custom(val => val >= 0).withMessage('Price must be positive'),
    body('amenities').isArray({ min: 1 }).withMessage('At least one amenity required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

const updateStatusValidation = [
    body('status').isIn(['Available', 'Occupied', 'Maintenance']).withMessage('Invalid room status')
];

// --- Routes ---

// Public endpoints (or customer facing)
// GET /api/v1/rooms -> Get all rooms (with filters)
router.get('/', roomController.getAllRooms);

// GET /api/v1/rooms/:id -> Get specific room
router.get('/:id', roomController.getRoom);

// Protected endpoints (Requires Authentication)
router.use(protect); // Apply to all routes below

// POST /api/v1/rooms -> Add new room (Admin/Manager only)
router.post(
    '/',
    restrictTo('Admin', 'Manager'),
    createRoomValidation,
    validateRequest,
    roomController.createRoom
);

// PATCH /api/v1/rooms/:id -> Update room details (Admin/Manager only)
router.patch(
    '/:id',
    restrictTo('Admin', 'Manager'),
    roomController.updateRoom // Additional validation can be applied
);

// PATCH /api/v1/rooms/:id/status -> Update status only (Receptionist/Admin/Manager)
router.patch(
    '/:id/status',
    restrictTo('Admin', 'Manager', 'Receptionist'),
    updateStatusValidation,
    validateRequest,
    roomController.updateRoomStatus
);

module.exports = router;
