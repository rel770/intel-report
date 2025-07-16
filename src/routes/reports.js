const express = require("express");
const controller = require("../controllers/intelReportController");
const router = express.Router();

/**
 * POST /reports
 * Create a new intelligence report
 */
router.post("/", controller.createReport);

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
 * PUT /reports/:id/confirm
 * Confirm a report (set confirmed to true)
 */
router.put("/:id/confirm", controller.confirmReport);

/**
 * DELETE /reports/:id
 * Delete a report
 */
router.delete("/:id", controller.deleteReport);

/**
 * GET /reports/:id
 * Get report by ID
 */
router.get("/:id", controller.getReportById);

/**
 * GET /reports/agent/:fieldCode
 * Get all reports from specific agent
 */
router.get("/agent/:fieldCode", controller.getAgentReports);

module.exports = router;
