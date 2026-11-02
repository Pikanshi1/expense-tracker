const Budget = require("../models/Budget");
const { createNotification } = require("./notificationController");

const setBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    const numericAmount = Number(amount);
    const now = new Date();
    const targetMonth = month === undefined ? now.getMonth() : Number(month);
    const targetYear = year === undefined ? now.getFullYear() : Number(year);
    const allowed = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Education", "Health", "Other"];
    if (!allowed.includes(category) || !Number.isFinite(numericAmount) || numericAmount <= 0 || !Number.isInteger(targetMonth) || targetMonth < 0 || targetMonth > 11 || !Number.isInteger(targetYear) || targetYear < 2000 || targetYear > 2200) {
      return res.status(400).json({ message: "Enter a valid category, positive amount, month and year." });
    }
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category, month: targetMonth, year: targetYear },
      { $set: { amount: numericAmount } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    await createNotification(req.user.id, "Budget Updated", `${category} budget has been updated.`, "success");
    return res.json({ message: "Budget saved", budget });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save budget." });
  }
};

const getBudgets = async (req, res) => {
  try {
    const month = req.query.month === undefined ? new Date().getMonth() : Number(req.query.month);
    const year = req.query.year === undefined ? new Date().getFullYear() : Number(req.query.year);
    if (!Number.isInteger(month) || month < 0 || month > 11 || !Number.isInteger(year)) return res.status(400).json({ message: "Invalid month or year." });
    const budgets = await Budget.find({ user: req.user.id, month, year }).sort({ category: 1 });
    return res.json(budgets);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load budgets." });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found." });
    return res.json({ message: "Budget deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete budget." });
  }
};

module.exports = { setBudget, getBudgets, deleteBudget };
