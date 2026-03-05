// Load environment variables early
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

// Catch synchronous Uncaught Exceptions (e.g., console.log(x) where x is undefined)
process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});

const startServer = async () => {
    // 4. Add a console.log to print process.env.MONGODB_URI
    console.log('MONGODB_URI:', process.env.MONGODB_URI);

    // Initialize Database connection
    await connectDB();

    const PORT = process.env.PORT || 5000;

    // Start the server
    const server = app.listen(PORT, () => {
        console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Catch asynchronous Unhandled Rejections (e.g., failed database connection Promise)
    process.on('unhandledRejection', err => {
        console.error('UNHANDLED REJECTION! 💥 Shutting down...');
        console.error(err.name, err.message);

        // Gracefully shutdown the server before exiting the process
        server.close(() => {
            process.exit(1);
        });
    });

    // Handle SIGTERM (e.g., when Heroku or Kubernetes restarts the dyno/pod)
    process.on('SIGTERM', () => {
        console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
        server.close(() => {
            console.log('💥 Process terminated!');
        });
    });
};

startServer();
