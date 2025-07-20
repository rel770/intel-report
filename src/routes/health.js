const express = require("express");
const { getHealthStatus } = require("../controllers/healthController");
const router = express.Router();

/**
 * GET /health
 * System health check endpoint
 */
router.get("/", getHealthStatus);

module.exports = router;
