const express = require("express");
const { getStatistics } = require("../controllers/statsController");
const router = express.Router();

/**
 * GET /stats
 * Get statistics about intel reports
 */
router.get("/", getStatistics);

module.exports = router;
