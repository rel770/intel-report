const express = require('express');
const { getCollection } = require('../db');
const router = express.Router();

/**
 * GET /health
 * System health check endpoint
 */
router.get('/', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'Intelligence Unit API',
      version: '1.0.0'
    };

    // Test database connectivity
    try {
      const collection = getCollection();
      const testResult = await collection.findOne({}, { limit: 1 });
      healthStatus.database = {
        status: 'connected',
        type: 'MongoDB',
        connection: 'local'
      };
    } catch (dbError) {
      healthStatus.status = 'degraded';
      healthStatus.database = {
        status: 'disconnected',
        error: dbError.message
      };
    }

    // Set HTTP status based on overall health
    const httpStatus = healthStatus.status === 'healthy' ? 200 : 503;
    res.status(httpStatus).json(healthStatus);

  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      service: 'Intelligence Unit API'
    });
  }
});

module.exports = router;
