/**
 * Intel Report Model
 * Validation and structure for intelligence reports
 */

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
   * Find report by ID
   */
  static async findById(id) {
    const { ObjectId } = require("mongodb");
    const { getCollection } = require("../db");

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid report ID format");
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
}

module.exports = IntelReport;
