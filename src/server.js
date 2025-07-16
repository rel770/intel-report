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
require("dotenv").config();

// Create Express application
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

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

// Error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Export the app for use in index.js
module.exports = app;
