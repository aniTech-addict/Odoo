import dotenv from "dotenv"
dotenv.config({
    path: "../.env"
})
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";

import express from "express"
const app = express()

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URL', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error("ERROR: Missing required environment variables:", missingEnvVars.join(', '));
    process.exit(1);
}

// Basic Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle Express app errors
app.on("error", (error) => {
    console.error("Express app error:", error);
    process.exit(1);
});

( async () => {
    try{
        // Connect to MongoDB with proper error handling
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("MongoDB connected successfully");

        // Start the server with proper error handling
        const server = app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

        // Handle server-specific errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`ERROR: Port ${process.env.PORT} is already in use`);
            } else {
                console.error("Server error:", error);
            }
            process.exit(1);
        });

        // Graceful shutdown handling
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed');
                    process.exit(0);
                });
            });
        });

    }catch(error){
        console.error("ERROR: Failed to start server:", error.message);
        process.exit(1);
    }
})()