const authService = require('../../core/services/auth.service');

/**
 * Controller to handle User Registration
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Pass to error handler
 */
const register = async (req, res, next) => {
    try {
        // 1. Pass request body to the service layer. Keep controller thin!
        const { user, token } = await authService.registerUser(req.body);

        // 2. Send Response
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user
            }
        });

    } catch (error) {
        // Passes AppError or raw thrown error to the global error handler
        next(error);
    }
};

/**
 * Controller to handle User Login
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Pass to error handler
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Let the service layer handle querying DB and comparing passwords
        const { user, token } = await authService.loginUser(email, password);

        // 2. Send Response
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};
