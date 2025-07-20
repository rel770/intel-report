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

module.exports = {
  validateObjectId
};
