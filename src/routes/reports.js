const express = require("express");
const controller = require("../controllers/intelReportController");
const { validateObjectId, validateBody, sanitizeInput } = require("../middleware/validation");
const { createReportSchema } = require("../schemas/reportSchemas");
const router = express.Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

/**
 * POST /reports
 * Create a new intelligence report
 */
router.post("/", validateBody(createReportSchema), controller.createReport);

/**
 * GET /reports
 * Get all reports
 */
router.get("/", controller.getAllReports);

/**
 * GET /reports/high
 * Get high-priority reports (threatLevel >= 4)
 */
router.get("/high", controller.getHighThreatReports);

/**
 * GET /reports/:id
 * Get report by ID
 */
router.get("/:id", validateObjectId('id'), controller.getReportById);

/**
 * PUT /reports/:id/confirm
 * Confirm a report (set confirmed to true)
 */
router.put("/:id/confirm", validateObjectId('id'), controller.confirmReport);

/**
 * DELETE /reports/:id
 * Delete a report
 */
router.delete("/:id", validateObjectId('id'), controller.deleteReport);

/**
 * GET /reports/agent/:fieldCode
 * Get all reports from specific agent
 */
router.get("/agent/:fieldCode", controller.getAgentReports);

module.exports = router;
