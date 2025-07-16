/**
 * Entry Point
 *
 * Main entry point of the application:
 * 1. Connects to MongoDB
 * 2. Starts the Express server
 * 3. Handles process-level errors
 */
require("dotenv").config();
const { connectDB } = require("./db");
const app = require("./server");

const PORT = process.env.PORT || 3000;

/**
 * Start server only after successful MongoDB connection
 */
async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Intelligence Unit API running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle unexpected process terminations
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
  process.exit(1);
});

// Start the application
startServer();
