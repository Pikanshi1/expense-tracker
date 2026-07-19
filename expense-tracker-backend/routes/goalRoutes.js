const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  addSavings,
  getGoalSummary,
} = require("../controllers/goalController");

// Get all goals
router.get("/", protect, getGoals);

// Dashboard summary
router.get("/summary", protect, getGoalSummary);

// Create goal
router.post("/", protect, createGoal);

// Update goal
router.put("/:id", protect, updateGoal);

// Delete goal
router.delete("/:id", protect, deleteGoal);

// Add savings to goal
router.patch("/:id/add-savings", protect, addSavings);

module.exports = router;