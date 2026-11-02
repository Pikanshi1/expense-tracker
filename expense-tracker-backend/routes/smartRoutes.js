const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getInsights, getExchangeRates, askBudgetAdvice } = require("../controllers/smartController");
const router = express.Router();
router.get("/insights", protect, getInsights);
router.post("/budget-advice", protect, askBudgetAdvice);
router.get("/exchange-rates", getExchangeRates);
module.exports = router;
