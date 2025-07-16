const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const reportsRoutes = require("./routes/reports");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let db;
let collection;

MongoClient.connect(process.env.CONNECTION_STRING)
  .then((client) => {
    console.log("Connected to MongoDB Atlas");
    db = client.db("intelligence_unit");
    collection = db.collection("intel_reports");

    // Set collection in app for routes to access
    app.set("collection", collection);
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// Basic health check route
app.get("/", (req, res) => {
  res.json({
    message: "Intelligence Unit - Threat Report Terminal",
    status: "operational",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/reports", reportsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Intelligence Unit API running on http://localhost:${PORT}`);
});

module.exports = { app, getCollection: () => collection };
