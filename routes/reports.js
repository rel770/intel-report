const express = require("express");
const { ObjectId } = require("mongodb");
const IntelReport = require("../models/IntelReport");

const router = express.Router();

/**
 * POST /reports
 * Create a new intelligence report
 */
router.post("/", async (req, res) => {
  try {
    // Validate input data
    const validation = IntelReport.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    // Create report instance
    const report = new IntelReport(req.body);

    // Get collection from app
    const collection = req.app.get("collection");

    // Insert into database
    const result = await collection.insertOne(report.toDocument());

    res.status(201).json({
      message: "Report created successfully",
      id: result.insertedId,
      report: { ...report.toDocument(), _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      error: "Failed to create report",
      message: error.message,
    });
  }
});

/**
 * GET /reports
 * Get all reports
 */
router.get("/", async (req, res) => {
  try {
    const collection = req.app.get("collection");
    const reports = await collection.find({}).toArray();

    res.json({
      message: "All intelligence reports",
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      error: "Failed to fetch reports",
      message: error.message,
    });
  }
});

module.exports = router;
