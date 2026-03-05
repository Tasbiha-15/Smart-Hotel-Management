const AppError = require('../../utils/AppError');
const { verifyToken } = require('../../utils/jwt');
const User = require('../../core/models/User');

/**
 * Middleware to protect routes: Verification of JWT token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Pass to next middleware
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Getting token and check of it's there
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) { // Fallback if using cookies later
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access.', 401)
            );
        }

        // 2. Verification token
        const decoded = await verifyToken(token);

        // 3. Check if user still exists (e.g., account was deleted while token is still active)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
                new AppError('The user belonging to this token does no longer exist.', 401)
            );
        }

        // 4. Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(
                new AppError('User recently changed password! Please log in again.', 401)
            );
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        // Attach user to req object for next middlewares to use
        req.user = currentUser;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again!', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Your token has expired! Please log in again.', 401));
        }
        next(err);
    }
};

/**
 * Middleware for Role Based Access Control (RBAC)
 * @param  {...string} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['Admin', 'Manager']. role='Customer'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403) // 403 Forbidden
            );
        }
        next();
    };
};

module.exports = {
    protect,
    restrictTo
};
