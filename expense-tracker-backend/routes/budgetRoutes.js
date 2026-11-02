const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  setBudget,
  getBudgets,
   deleteBudget,
} = require("../controllers/budgetController");
const { getAdaptiveBudget, saveAdaptiveBudget } = require("../controllers/adaptiveBudgetController");

const router = express.Router();

router.post("/", protect, setBudget);
router.get("/adaptive", protect, getAdaptiveBudget);
router.put("/adaptive", protect, saveAdaptiveBudget);

router.get("/", protect, getBudgets);

router.delete("/:id",protect,deleteBudget);


module.exports = router;