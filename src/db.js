/**
 * MongoDB Connection Module
 *
 * This module is responsible for:
 * 1. Creating connection to MongoDB
 * 2. Exporting functions for collection access
 */
const { MongoClient } = require("mongodb");
require("dotenv").config();

// Store client and collection as private variables in the module
let client;
let reportsCollection;
let connectionStatus = "disconnected";

// Connection options with pooling
const connectionOptions = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 2, // Minimum number of connections in the pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
};

/**
 * Creates connection to MongoDB with retry logic
 * @returns {Promise} - Promise that resolves when connection is established
 */
async function connectDB(maxRetries = 3, retryDelay = 2000) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection... (attempt ${retries + 1}/${maxRetries})`);

      // Connection with pooling options
      client = await MongoClient.connect(process.env.CONNECTION_STRING, connectionOptions);

      // Access database and collection
      const db = client.db("intelligence_unit");
      reportsCollection = db.collection("intel_reports");

      console.log("✔ MongoDB connection established successfully");
      console.log(
        `✔ Connection pool configured: min=${connectionOptions.minPoolSize}, max=${connectionOptions.maxPoolSize}`
      );
      connectionStatus = "connected";
      return client;
    } catch (error) {
      retries++;
      connectionStatus = "error";
      console.error(`✘ MongoDB connection attempt ${retries} failed:`, error.message);

      if (retries < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      } else {
        console.error("✘ All MongoDB connection attempts failed");
        throw error;
      }
    }
  }
}

/**
 * Returns access to intel_reports collection
 * @returns {Collection} - MongoDB collection object
 */
function getCollection() {
  if (!reportsCollection) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return reportsCollection;
}

/**
 * Get current connection status
 */
function getConnectionStatus() {
  return connectionStatus;
}

/**
 * Closes MongoDB connection
 * Useful mainly for tests or graceful app shutdown
 */
async function closeDB() {
  if (client) {
    await client.close();
    connectionStatus = "disconnected";
    console.log("MongoDB connection closed");
  }
}

module.exports = {
  connectDB,
  getCollection,
  getConnectionStatus,
  closeDB,
};
