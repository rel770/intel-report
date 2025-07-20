const IntelReport = require("../models/IntelReport");
const { catchAsync, ApiError } = require("../middleware/errorHandler");

/**
 * Create a new intelligence report
 * @route POST /reports
 */
exports.createReport = catchAsync(async (req, res) => {
  const report = await IntelReport.create(req.body);
  
  res.status(201).json({
    success: true,
    message: "Report created successfully",
    data: { report }
  });
});

/**
 * Get all intelligence reports
 * @route GET /reports
 */
exports.getAllReports = catchAsync(async (req, res) => {
  const reports = await IntelReport.findAll();
  
  res.json({
    success: true,
    message: "All intelligence reports retrieved successfully",
    data: {
      count: reports.length,
      reports
    }
  });
});

/**
 * Get high threat reports (threatLevel >= 4)
 * @route GET /reports/high
 */
exports.getHighThreatReports = catchAsync(async (req, res) => {
  const reports = await IntelReport.findHighThreats();
  
  res.json({
    success: true,
    message: "High-priority threat reports retrieved successfully",
    data: {
      count: reports.length,
      reports
    }
  });
});

/**
 * Confirm a report (set confirmed to true)
 * @route PUT /reports/:id/confirm
 */
exports.confirmReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const report = await IntelReport.confirmById(id);
  
  res.json({
    success: true,
    message: "Report confirmed successfully",
    data: { report }
  });
});

/**
 * Delete a report
 * @route DELETE /reports/:id
 */
exports.deleteReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await IntelReport.deleteById(id);
  
  res.json({
    success: true,
    message: "Report deleted successfully",
    data: { deletedId: result.deletedId }
  });
});

/**
 * Get report by ID
 * @route GET /reports/:id
 */
exports.getReportById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const report = await IntelReport.findById(id);
  
  if (!report) {
    throw new ApiError(404, "Report not found");
  }
  
  res.json({
    success: true,
    message: "Report retrieved successfully",
    data: { report }
  });
});

/**
 * Get all reports from specific agent
 * @route GET /reports/agent/:fieldCode
 */
exports.getAgentReports = catchAsync(async (req, res) => {
  const { fieldCode } = req.params;
  const reports = await IntelReport.findByAgent(fieldCode);
  
  res.json({
    success: true,
    message: `Reports from agent ${fieldCode} retrieved successfully`,
    data: {
      agent: fieldCode,
      count: reports.length,
      reports
    }
  });
});
