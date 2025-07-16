const express = require('express');
const router = express.Router();

/**
 * GET /stats
 * Get statistics about intel reports
 */
router.get('/', async (req, res) => {
  try {
    const collection = req.app.get('collection');
    
    // Get all counts in parallel
    const [
      totalReports,
      highThreatReports,
      confirmedReports,
      unconfirmedReports
    ] = await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({ threatLevel: { $gte: 4 } }),
      collection.countDocuments({ confirmed: true }),
      collection.countDocuments({ confirmed: false })
    ]);

    // Get threat level distribution
    const threatLevelStats = await collection.aggregate([
      {
        $group: {
          _id: '$threatLevel',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();

    // Get top agents (by report count)
    const agentStats = await collection.aggregate([
      {
        $group: {
          _id: '$fieldCode',
          reportCount: { $sum: 1 },
          highThreatCount: {
            $sum: {
              $cond: [{ $gte: ['$threatLevel', 4] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { reportCount: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray();

    res.json({
      message: 'Intelligence Unit Statistics',
      timestamp: new Date().toISOString(),
      overview: {
        totalReports,
        highThreatReports,
        confirmedReports,
        unconfirmedReports,
        confirmationRate: totalReports > 0 ? (confirmedReports / totalReports * 100).toFixed(1) + '%' : '0%'
      },
      threatLevelDistribution: threatLevelStats,
      topAgents: agentStats
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

module.exports = router;
