/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  console.error(`${new Date().toISOString()} - ERROR:`, {
    message: error.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError") {
    const message = "Invalid resource ID format";
    error = new ApiError(400, message);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ApiError(400, message);
  }

  // Joi validation error
  if (err.isJoi) {
    const message = err.details.map((detail) => detail.message).join(", ");
    error = new ApiError(400, message);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = {
  globalErrorHandler,
};
