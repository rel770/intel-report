/**
 * Intel Report Model
 * Validation and structure for intelligence reports
 * 
 * Note: all errors should be caught and handled by the controller
 */

const { ApiError } = require("../middleware/errorHandler");

class IntelReport {
  constructor(data) {
    this.fieldCode = data.fieldCode;
    this.location = data.location;
    this.threatLevel = data.threatLevel;
    this.description = data.description;
    this.timestamp = data.timestamp || new Date();
    this.confirmed = data.confirmed || false;
  }

  /**
   * Validate required fields
   */
  static validate(data) {
    const errors = [];

    // Required fields
    if (!data.fieldCode || typeof data.fieldCode !== "string") {
      errors.push("fieldCode is required and must be a string");
    }

    if (!data.location || typeof data.location !== "string") {
      errors.push("location is required and must be a string");
    }

    if (typeof data.threatLevel !== "number" || data.threatLevel < 1 || data.threatLevel > 5) {
      errors.push("threatLevel must be a number between 1 and 5");
    }

    if (!data.description || typeof data.description !== "string") {
      errors.push("description is required and must be a string");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a MongoDB document from this report
   */
  toDocument() {
    return {
      fieldCode: this.fieldCode,
      location: this.location,
      threatLevel: this.threatLevel,
      description: this.description,
      timestamp: this.timestamp,
      confirmed: this.confirmed,
    };
  }

  /**
   * Check if this is a high-priority threat
   */
  isHighThreat() {
    return this.threatLevel >= 4;
  }

  /**
   * Create a new report in the database
   */
  static async create(reportData) {
    const { getCollection } = require("../db");
    const report = new IntelReport(reportData);
    const collection = getCollection();

    const result = await collection.insertOne(report.toDocument());
    return { _id: result.insertedId, ...report.toDocument() };
  }
  /**
   * Find report by ID
   */
  static async findById(id) {
    const { ObjectId } = require("mongodb");
    const { getCollection } = require("../db");

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const collection = getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  /**
   * Find all reports with optional filters
   *
   * @param {Object} filters - MongoDB query filters
   * @param {Object} options - Pagination and sorting options
   * @param {number} options.limit - Number of reports to return
   * @param {number} options.skip - Number of reports to skip
   * @param {Object} options.sort - Sorting criteria
   * @param {string} options.sort.field - Field to sort by
   * @param {number} options.sort.order - 1 for ascending, -1 for descending
   * @returns {Promise<Array>} - Array of reports
   */
  static async findAll(filters = {}, options = {}) {
    const { getCollection } = require("../db");
    const collection = getCollection();
    const { limit = 50, skip = 0, sort = { timestamp: -1 } } = options;

    return await collection.find(filters).sort(sort).skip(skip).limit(limit).toArray();
  }

  /**
   * Find high threat reports (threatLevel >= 4)
   */
  static async findHighThreats() {
    return await this.findAll({ threatLevel: { $gte: 4 } });
  }

  /**
   * Find reports by agent field code
   */
  static async findByAgent(fieldCode) {
    return await this.findAll({ fieldCode });
  }

  /**
   * Update report by ID
   */
  static async updateById(id, updateData) {
    const { ObjectId } = require("mongodb");
    const { getCollection } = require("../db");

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const collection = getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      throw new ApiError(404, "Report not found");
    }

    return await this.findById(id);
  }

  /**
   * Confirm report by ID
   */
  static async confirmById(id) {
    return await this.updateById(id, {
      confirmed: true,
      confirmedAt: new Date(),
    });
  }

  /**
   * Delete report by ID
   */
  static async deleteById(id) {
    const { ObjectId } = require("mongodb");
    const { getCollection } = require("../db");

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid report ID format");
    }

    const collection = getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new ApiError(404, "Report not found");
    }

    return { deletedId: id };
  }
}

module.exports = IntelReport;
