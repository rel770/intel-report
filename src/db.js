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

/**
 * Creates connection to MongoDB
 * @returns {Promise} - Promise that resolves when connection is established
 */
async function connectDB() {
  try {
    // Simple connection without additional options
    client = await MongoClient.connect(process.env.CONNECTION_STRING);

    // Access database and collection
    const db = client.db("intelligence_unit");
    reportsCollection = db.collection("intel_reports");

    console.log("✔ MongoDB connection established successfully");
    return client;
  } catch (error) {
    console.error("✘ MongoDB connection error:", error);
    throw error;
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
 * Closes MongoDB connection
 * Useful mainly for tests or graceful app shutdown
 */
async function closeDB() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

module.exports = {
  connectDB,
  getCollection,
  closeDB,
};
