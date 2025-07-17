// Quick test to verify MongoDB connection
const { connectDB, closeDB } = require("../src/db");
require("dotenv").config({ path: "../.env" });

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    console.log("CONNECTION_STRING:", process.env.CONNECTION_STRING); // Debug print
    await connectDB();
    console.log("✔ Connection successful!");
    await closeDB();
    console.log("✔ Connection closed properly");
    process.exit(0);
  } catch (error) {
    console.error("✘ Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
