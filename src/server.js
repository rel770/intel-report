/**
 * Express Application Setup
 *
 * This file is responsible for:
 * 1. Express application configuration
 * 2. Middleware setup
 * 3. Route loading and configuration
 * No MongoDB connection logic or server startup here
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { globalErrorHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

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

// Request logger middleware
app.use(requestLogger);

// Load route files
const reportsRoutes = require("./routes/reports");
const statsRoutes = require("./routes/stats");
const healthRoutes = require("./routes/health");

// Configure routes
app.use("/reports", reportsRoutes);
app.use("/stats", statsRoutes);
app.use("/health", healthRoutes);

// Basic entry point
app.get("/", (req, res) => {
  res.json({
    name: "Intelligence Unit API",
    status: "operational",
    endpoints: [
      "/reports",
      "/reports/high",
      "/reports/:id",
      "/reports/:id/confirm",
      "/reports/agent/:fieldCode",
      "/stats",
      "/health",
    ],
  });
});

// Global error handling middleware - must be last
app.use(globalErrorHandler);

// Export the app for use in index.js
module.exports = app;
