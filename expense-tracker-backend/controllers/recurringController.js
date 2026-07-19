
const RecurringExpense = require("../models/RecurringExpense");

const createRecurring = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      description,
      frequency,
    } = req.body;

    const nextDate = new Date();

    if (frequency === "Daily") {
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (frequency === "Weekly") {
      nextDate.setDate(nextDate.getDate() + 7);
    } else {
      // Monthly
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const recurring = await RecurringExpense.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      description,
      frequency,
      nextDate,
    });

    res.status(201).json(recurring);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecurring = async (req, res) => {
  try {
    const recurring = await RecurringExpense.find({
      user: req.user.id,
    });

    res.json(recurring);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteRecurring = async (req, res) => {
  try {
    await RecurringExpense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRecurring,
  getRecurring,
  deleteRecurring,
};