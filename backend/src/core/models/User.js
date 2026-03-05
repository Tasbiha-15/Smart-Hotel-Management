const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please tell us your first name!'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Please tell us your last name!'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            // Note: Full complex email validation is handled by express-validator in the routes
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        role: {
            type: String,
            enum: ['Customer', 'Receptionist', 'Manager', 'Admin'],
            default: 'Customer'
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false // Never send the password back to the client by default
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                // This only works on CREATE and SAVE! Which is why we use pre('save')
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Passwords are not the same!'
            }
        },
        passwordChangedAt: Date,
        isActive: {
            type: Boolean,
            default: true,
            select: false // Hide from normal queries
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// --- PRE-SAVE HOOKS ---

// Hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field - we only needed it for validation, we don't want it in the DB
    this.passwordConfirm = undefined;
    next();
});

// Hook to set the passwordChangedAt property when password is modified
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    // Subtract 1 second to ensure the token is created *after* the password was changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Hook to only find active users in all 'find' queries
userSchema.pre(/^find/, function (next) {
    // 'this' points to the current query
    // We don't want to expose deactivated (is_active: false) accounts
    this.find({ isActive: { $ne: false } });
    next();
});

// --- INSTANCE METHODS ---

// Method that belongs to a specific user document to check if password is correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to verify if a user changed their password *after* the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false; // False means NOT changed
};

const User = mongoose.model('User', userSchema);
module.exports = User;
