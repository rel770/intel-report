const { ObjectId } = require("mongodb");
const IntelReport = require("../models/IntelReport");

exports.createReport = async (req, res) => {
  try {
    const validation = IntelReport.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: "Validation failed", details: validation.errors });
    }
    const report = new IntelReport(req.body);
    const collection = req.app.get("collection");
    const result = await collection.insertOne(report.toDocument());
    res.status(201).json({
      message: "Report created successfully",
      id: result.insertedId,
      report: { ...report.toDocument(), _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to create report", message: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const collection = req.app.get("collection");
    const reports = await collection.find({}).toArray();
    res.json({ message: "All intelligence reports", count: reports.length, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports", message: error.message });
  }
};

exports.getHighThreatReports = async (req, res) => {
  try {
    const collection = req.app.get("collection");
    const highThreatReports = await collection.find({ threatLevel: { $gte: 4 } }).toArray();
    res.json({ message: "High-priority threat reports", count: highThreatReports.length, reports: highThreatReports });
  } catch (error) {
    console.error("Error fetching high-priority reports:", error);
    res.status(500).json({ error: "Failed to fetch high-priority reports", message: error.message });
  }
};

exports.confirmReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid report ID format" });
    }
    const collection = req.app.get("collection");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { confirmed: true, confirmedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Report not found" });
    }
    const updatedReport = await collection.findOne({ _id: new ObjectId(id) });
    res.json({ message: "Report confirmed successfully", report: updatedReport });
  } catch (error) {
    console.error("Error confirming report:", error);
    res.status(500).json({ error: "Failed to confirm report", message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid report ID format" });
    }
    const collection = req.app.get("collection");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json({ message: "Report deleted successfully", deletedId: id });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report", message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid report ID format" });
    }
    const collection = req.app.get("collection");
    const report = await collection.findOne({ _id: new ObjectId(id) });
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json({ message: "Report retrieved successfully", report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report", message: error.message });
  }
};

exports.getAgentReports = async (req, res) => {
  try {
    const { fieldCode } = req.params;
    const collection = req.app.get("collection");
    const agentReports = await collection.find({ fieldCode: fieldCode }).toArray();
    res.json({ message: `Reports from agent ${fieldCode}`, agent: fieldCode, count: agentReports.length, reports: agentReports });
  } catch (error) {
    console.error("Error fetching agent reports:", error);
    res.status(500).json({ error: "Failed to fetch agent reports", message: error.message });
  }
};
