/**
 * Validation Middleware - ObjectId validation
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
 * Validates request body against Joi schema
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Validate all fields, not just the first error
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      return next(error);
    }

    req.body = value;
    next();
  };
};

/**
 * Validates query parameters against Joi schema
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(error);
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validateObjectId,
  validateBody,
  validateQuery,
};
