/**
 * Health Controller
 * Handles system health check operations
 */

const { getCollection, getConnectionStatus } = require("../db");
const { catchAsync } = require("../middleware/errorHandler");

/**
 * Get system health status
 * @route GET /health
 */
const getHealthStatus = catchAsync(async (req, res) => {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "Intelligence Unit API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  };

  // Test database connectivity
  try {
    const collection = getCollection();
    await collection.findOne({}, { limit: 1 });

    healthStatus.database = {
      status: "connected",
      type: "MongoDB",
      connection: "healthy",
    };
  } catch (dbError) {
    healthStatus.status = "degraded";
    healthStatus.database = {
      status: "disconnected",
      error: dbError.message,
    };
  }

  // Set HTTP status based on overall health
  const httpStatus = healthStatus.status === "healthy" ? 200 : 503;
  res.status(httpStatus).json(healthStatus);
});

module.exports = {
  getHealthStatus,
};
