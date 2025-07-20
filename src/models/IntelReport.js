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
}

module.exports = IntelReport;
