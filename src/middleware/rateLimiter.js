/**
 * Rate Limiting Middleware
 *
 * Provides configurable rate limiting for different API endpoints
 * to prevent abuse and ensure system stability
 */

const rateLimit = require("express-rate-limit");

/**
 * General API rate limiter
 * Applies to all routes unless overridden
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    message: "Too many requests from this IP, please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Strict rate limiter for sensitive operations
 * Use for creation, update, and delete operations
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit each IP to 25 requests per windowMs
  message: {
    error: "Too many requests",
    message: "Too many requests for this operation, please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Too many requests for this operation, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Lenient rate limiter for read operations
 * Use for GET requests that are less resource intensive
 */
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    error: "Too many requests",
    message: "Too many read requests from this IP, please try again after 15 minutes.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

module.exports = {
  generalLimiter,
  strictLimiter,
  readLimiter,
};
