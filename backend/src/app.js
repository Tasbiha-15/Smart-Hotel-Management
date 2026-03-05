const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const errorHandler = require('./api/middlewares/error.middleware');

// Route Imports
const authRoutes = require('./api/routes/auth.routes');
const roomRoutes = require('./api/routes/room.routes');
const bookingRoutes = require('./api/routes/booking.routes');
const paymentRoutes = require('./api/routes/payment.routes');
const reviewRoutes = require('./api/routes/review.routes');

// Initialize the Express application
const app = express();

// --- Global Middlewares ---

// 1. Security HTTP headers
app.use(helmet());

// 2. Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// 3. Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Body parser, reading data from body into req.body (with size limit)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- Routes setup ---
const prefix = process.env.API_PREFIX || '/api/v1';
app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/rooms`, roomRoutes);
app.use(`${prefix}/bookings`, bookingRoutes);
app.use(`${prefix}/payments`, paymentRoutes);
app.use(`${prefix}/reviews`, reviewRoutes);

app.get(`${prefix}/health`, (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running optimally' });
});

// --- Handle undefined routes ---
// If the request reaches this point, no matched route was found
app.all('*', (req, res, next) => {
    // Pass the error to the global error handler
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- Global Error Handling Middleware ---
app.use(errorHandler);

module.exports = app;
