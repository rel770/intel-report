/**
 * Stats Controller
 * Handles statistics and analytics operations
 */

const { getCollection } = require("../db");
const { catchAsync } = require("../middleware/errorHandler");

/**
 * Get comprehensive statistics about intel reports
 * @route GET /stats
 */
const getStatistics = catchAsync(async (req, res) => {
  const collection = getCollection();

  // Get all counts in parallel for better performance
  const [totalReports, highThreatReports, confirmedReports, unconfirmedReports] = await Promise.all([
    collection.countDocuments({}),
    collection.countDocuments({ threatLevel: { $gte: 4 } }),
    collection.countDocuments({ confirmed: true }),
    collection.countDocuments({ confirmed: false }),
  ]);

  // Calculate confirmation rate
  const confirmationRate =
    totalReports > 0 ? ((confirmedReports / totalReports) * 100).toFixed(1) + "%" : "0%";

  const response = {
    message: "Intelligence Unit Statistics",
    timestamp: new Date().toISOString(),
    overview: {
      totalReports,
      highThreatReports,
      confirmedReports,
      unconfirmedReports,
      confirmationRate,
    },
  };

  res.json(response);
});

module.exports = {
  getStatistics,
};
