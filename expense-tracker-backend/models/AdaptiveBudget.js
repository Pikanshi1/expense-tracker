const mongoose = require("mongoose");

const adaptiveBudgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: Number, required: true, min: 0, max: 11 },
    year: { type: Number, required: true },
    monthlyBudget: { type: Number, required: true, min: 0 },
    dailyBudget: { type: Number, min: 0, default: null },
    includeAdditionalIncome: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true },
    notificationTime: { type: String, default: "09:00", match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    timezone: { type: String, default: "UTC" },
  },
  { timestamps: true },
);

adaptiveBudgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("AdaptiveBudget", adaptiveBudgetSchema);
