/**
 * Validation Middleware
 * Validates ObjectId format and sanitizes input
 */

const { ObjectId } = require("mongodb");
const { ApiError } = require("./errorHandler");

/**
 * Validates MongoDB ObjectId format
 */
const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!ObjectId.isValid(id)) return next(new ApiError(400, `Invalid ${paramName} format`));

    next();
  };
};

/**
 * Basic input sanitization
 */
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      } else if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

module.exports = {
  validateObjectId,
  sanitizeInput,
};
