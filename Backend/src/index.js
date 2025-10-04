import dotenv from "dotenv"
dotenv.config({
    path: "../.env"
})
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";

import express from "express"
import cors from "cors"
const app = express()

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URL', 'PORT', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error("ERROR: Missing required environment variables:", missingEnvVars.join(', '));
    process.exit(1);
}

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173', // Vite dev server alternative port
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Basic Express middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
import authRoutes from "../routes/auth.js";
import expenseRoutes from "../routes/expenses.js";
import categoryRoutes from "../routes/categories.js";
import approvalRoutes from "../routes/approvals.js";
import userRoutes from "../routes/users.js";

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler - must be last
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

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