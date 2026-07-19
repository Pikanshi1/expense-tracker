const mongoose = require("mongoose");

const recurringExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["Income", "Expense"],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: String,

    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      default: "Monthly",
    },

    nextDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RecurringExpense",
  recurringExpenseSchema
);