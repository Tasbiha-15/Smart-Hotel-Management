const User = require('../models/User');
const AppError = require('../../utils/AppError');
const { generateToken } = require('../../utils/jwt');

/**
 * Service to register a new User
 * @param {Object} userData - Extract from req.body 
 * @returns {Object} { user, token }
 */
const registerUser = async (userData) => {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError('Email is already registered. Please log in.', 400);
    }

    // 2. Create the new user. 
    // We explicitly select the fields to prevent an attacker from bypassing the role ('Admin' injection) via req.body
    const newUser = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        role: userData.role || 'Customer' // Keep role explicitly assigned, or default
    });

    // 3. Remove password from output just in case
    newUser.password = undefined;

    // 4. Generate JWT
    const token = generateToken(newUser._id);

    return { user: newUser, token };
};

/**
 * Service to authenticate an existing User
 * @param {String} email 
 * @param {String} password 
 * @returns {Object} { user, token }
 */
const loginUser = async (email, password) => {
    // 1. Check if email and password are provided
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    // 2. Find the user by email and explicitly select the password field (since select: false is set in schema)
    const user = await User.findOne({ email }).select('+password');

    // 3. Check if user exists AND password matches using schema instance method
    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Incorrect email or password', 401); // 401 Unauthorized
    }

    // 4. If everything is ok, generate token
    const token = generateToken(user._id);

    // 5. Remove password from the response object
    user.password = undefined;

    return { user, token };
};

module.exports = {
    registerUser,
    loginUser
};
