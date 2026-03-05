const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: [true, 'A room must have a room number'],
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'A room must have a type'],
            enum: {
                values: ['Standard', 'Deluxe', 'Suite'],
                message: 'Room type is either: Standard, Deluxe, Suite',
            },
        },
        basePrice: {
            type: Number,
            required: [true, 'A room must have a base price'],
            min: [0, 'Price must be positive'],
        },
        amenities: {
            type: [String],
            required: [true, 'A room must have at least one amenity'],
        },
        capacity: {
            type: Number,
            required: [true, 'A room must have a capacity'],
            min: [1, 'Capacity must be at least 1 person'],
        },
        status: {
            type: String,
            enum: {
                values: ['Available', 'Occupied', 'Maintenance'],
                message: 'Status is either: Available, Occupied, Maintenance',
            },
            default: 'Available',
        },
        hotelId: {
            // Prepared for multi-branch scaling in the future
            type: mongoose.Schema.ObjectId,
            ref: 'Hotel', // Assuming a Hotel model might exist later
            required: false,
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for faster querying
roomSchema.index({ basePrice: 1, type: 1 });
roomSchema.index({ status: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
