/**
 * Custom Error Class for operational errors (e.g., validation, not found)
 * Extends the built-in Error class.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        // Determine status string based on status code (4xx -> fail, 5xx -> error)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // Flag to distinguish operational errors from programming/unknown bugs
        this.isOperational = true;

        // Capture the stack trace, excluding the constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
