const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getInsights, getExchangeRates } = require("../controllers/smartController");
const router = express.Router();
router.get("/insights", protect, getInsights);
router.get("/exchange-rates", getExchangeRates);
module.exports = router;
