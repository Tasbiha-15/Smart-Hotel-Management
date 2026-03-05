const jwt = require('jsonwebtoken');

/**
 * Utility to generate a signed JWT
 * @param {string|mongoose.Types.ObjectId} id - The MongoDB _id of the User
 * @returns {string} - The signed JSON Web Token
 */
const generateToken = (id) => {
    console.log("DEBUG: process.env.JWT_EXPIRES_IN =", process.env.JWT_EXPIRES_IN); // Temporary fix debug check

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN // Was incorrectly typed as 'JWT_EXPRESSION'
    });
};

/**
 * Utility to verify a given token against the secret key
 * @param {string} token - The raw JWT token 
 * @returns {Promise<Object>} - The decoded payload (e.g., { id: '...', iat: ..., exp: ... })
 */
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};

module.exports = {
    generateToken,
    verifyToken
};
