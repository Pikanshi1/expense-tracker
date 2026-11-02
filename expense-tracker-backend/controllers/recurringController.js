const RecurringExpense = require("../models/RecurringExpense");
const Expense = require("../models/expense");

function advanceDate(date, frequency) {
  const next = new Date(date);
  if (frequency === "Daily") next.setDate(next.getDate() + 1);
  else if (frequency === "Weekly") next.setDate(next.getDate() + 7);
  else if (frequency === "Yearly") next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1);
  return next;
}

const createRecurring = async (req, res) => {
  try {
    const { title, amount, type, category, description = "", frequency = "Monthly", nextDate } = req.body;
    const value = Number(amount);
    if (!title?.trim() || !Number.isFinite(value) || value <= 0 || !["Income", "Expense"].includes(type) || !["Daily", "Weekly", "Monthly", "Yearly"].includes(frequency)) {
      return res.status(400).json({ message: "Enter valid recurring transaction details." });
    }
    const scheduledDate = nextDate ? new Date(nextDate) : advanceDate(new Date(), frequency);
    if (Number.isNaN(scheduledDate.getTime())) return res.status(400).json({ message: "Enter a valid next date." });
    const item = await RecurringExpense.create({ user: req.user.id, title: title.trim(), amount: value, type, category, description, frequency, nextDate: scheduledDate });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create recurring transaction." });
  }
};

const getRecurring = async (req, res) => {
  try {
    const now = new Date();
    const due = await RecurringExpense.find({ user: req.user.id, nextDate: { $lte: now } }).sort({ nextDate: 1 });
    for (const item of due) {
      // A due occurrence is created, then its next date is advanced. Both operations
      // are scoped to the owner; the updated date prevents duplicate creation on refresh.
      let occurrence = new Date(item.nextDate);
      let guard = 0;
      while (occurrence <= now && guard < 24) {
        await Expense.create({ user: req.user.id, title: item.title, amount: item.amount, type: item.type, category: item.category, description: item.description || `Recurring ${item.frequency.toLowerCase()} transaction` , date: occurrence });
        occurrence = advanceDate(occurrence, item.frequency);
        guard += 1;
      }
      item.nextDate = occurrence;
      await item.save();
    }
    const recurring = await RecurringExpense.find({ user: req.user.id }).sort({ nextDate: 1 });
    return res.json(recurring);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load recurring transactions." });
  }
};

const deleteRecurring = async (req, res) => {
  try {
    const item = await RecurringExpense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: "Recurring transaction not found." });
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete recurring transaction." });
  }
};

module.exports = { createRecurring, getRecurring, deleteRecurring };
