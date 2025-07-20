/**
 * Joi Validation Schemas
 * Defines validation rules for report endpoints
 */

const Joi = require("joi");

// Intel Report Create Schema
const createReportSchema = Joi.object({
  fieldCode: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .pattern(/^[A-Z0-9-]+$/)
    .required()
    .messages({
      "string.pattern.base": "fieldCode must contain only uppercase letters, numbers, and hyphens",
    }),

  location: Joi.string().trim().min(3).max(100).required(),

  threatLevel: Joi.number().integer().min(1).max(5).required(),

  description: Joi.string().trim().min(10).max(1000).required(),
});

// Intel Report Update Schema
const updateReportSchema = Joi.object({
  fieldCode: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .pattern(/^[A-Z0-9-]+$/),

  location: Joi.string().trim().min(3).max(100),

  threatLevel: Joi.number().integer().min(1).max(5),

  description: Joi.string().trim().min(10).max(1000),

  confirmed: Joi.boolean(),
}).min(1); // At least one field must be provided

// Query parameter schemas
const getReportsQuerySchema = Joi.object({
  threatLevel: Joi.number().integer().min(1).max(5),
  confirmed: Joi.boolean(),
  fieldCode: Joi.string()
    .trim()
    .pattern(/^[A-Z0-9-]+$/),
  limit: Joi.number().integer().min(1).max(100).default(50),
  skip: Joi.number().integer().min(0).default(0),
});

module.exports = {
  createReportSchema,
  updateReportSchema,
  getReportsQuerySchema,
};
