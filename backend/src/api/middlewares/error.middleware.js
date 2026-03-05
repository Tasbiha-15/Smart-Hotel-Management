/**
 * Global Error Handling Middleware
 * Catch all next(err) and format a consistent JSON response
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development: Send detailed error including stack trace
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // Production: Send clean, safe error avoiding leakage of implementation details
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err, message: err.message };

        // Handle specific MongoDB/Mongoose errors safely here (e.g., CastError, DuplicateKeyError)
        if (error.name === 'CastError') {
            const message = `Invalid ${error.path}: ${error.value}.`;
            error.statusCode = 400;
            error.message = message;
            error.isOperational = true;
        }

        if (error.isOperational) {
            // Trusted operational error: send message to client
            res.status(error.statusCode).json({
                status: error.status,
                message: error.message
            });
        } else {
            // Programming or other unknown error: don't leak error details
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    }
};

module.exports = errorHandler;
