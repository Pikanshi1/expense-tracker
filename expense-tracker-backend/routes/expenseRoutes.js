const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getDashboard,
    getAnalytics,
    exportCSV,
    exportPDF
} = require("../controllers/expenseController");


router.get("/dashboard", protect, getDashboard);
router.get("/analytics", protect, getAnalytics);
router.get("/export/csv", protect, exportCSV);
router.get("/export/pdf", protect, exportPDF);
router.get("/", protect, getExpenses);
router.get("/:id", protect, getExpenseById);
router.post("/", protect, addExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;