const express = require("express");
const router = express.Router();
const { getApiInfo } = require("../controllers/rootController");

// Basic entry point
router.get("/", getApiInfo);

module.exports = router;
