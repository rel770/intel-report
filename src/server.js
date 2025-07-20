/**
 * Express Application Setup
 *
 * This file is responsible for:
 * 1. Express application configuration
 * 2. Middleware setup
 * 3. Route loading and configuration
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { globalErrorHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const { generalLimiter } = require("./middleware/rateLimiter");

// Create Express application
const app = express();

// Security middleware
app.use(helmet()); // Helmet helps secure Express apps by setting various HTTP headers

app.disable("x-powered-by"); // Disable 'X-Powered-By' header for security reasons

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting middleware
app.use(generalLimiter);

// Request logger middleware
app.use(requestLogger);

// Load route files
const reportsRoutes = require("./routes/reports");
const statsRoutes = require("./routes/stats");
const healthRoutes = require("./routes/health");
const rootRoutes = require("./routes/root");

// Configure routes
app.use("/", rootRoutes);
app.use("/reports", reportsRoutes);
app.use("/stats", statsRoutes);
app.use("/health", healthRoutes);

// Global error handling middleware - must be last
app.use(globalErrorHandler);

// Export the app for use in index.js
module.exports = app;
