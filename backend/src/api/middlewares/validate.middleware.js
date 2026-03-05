const { validationResult } = require('express-validator');
const AppError = require('../../utils/AppError');

/**
 * Validates the Express request against express-validator rules.
 * Automatically throws an AppError with 400 Bad Request if validation fails.
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // We map through all errors to concatenate them into a single string message
        const errorMessages = errors.array().map(err => err.msg).join('; ');

        // Pass the combined error to the global error handler
        return next(new AppError(`Validation failed: ${errorMessages}`, 400));
    }

    // If no errors, proceed to the actual controller
    next();
};

module.exports = { validateRequest };
