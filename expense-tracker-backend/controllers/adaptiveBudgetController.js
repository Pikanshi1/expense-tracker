const AdaptiveBudget = require("../models/AdaptiveBudget");
const { calculateAdaptiveBudget } = require("../services/adaptiveBudgetService");

const getAdaptiveBudget = async (req, res) => {
  try {
    const timezone = typeof req.query.timezone === "string" ? req.query.timezone : "UTC";
    try { Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(); } catch { return res.status(400).json({ message: "Invalid timezone." }); }
    return res.json(await calculateAdaptiveBudget(req.user.id, { timezone }));
  } catch (error) {
    return res.status(500).json({ message: "Unable to calculate adaptive budget." });
  }
};

const saveAdaptiveBudget = async (req, res) => {
  try {
    const monthlyBudget = Number(req.body.monthlyBudget);
    const dailyBudget = req.body.dailyBudget === "" || req.body.dailyBudget === undefined || req.body.dailyBudget === null ? null : Number(req.body.dailyBudget);
    const timezone = req.body.timezone || "UTC";
    if (!Number.isFinite(monthlyBudget) || monthlyBudget < 0 || (dailyBudget !== null && (!Number.isFinite(dailyBudget) || dailyBudget < 0)) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(req.body.notificationTime || "09:00")) {
      return res.status(400).json({ message: "Enter valid monthly and daily budgets and notification time." });
    }
    try { Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(); } catch { return res.status(400).json({ message: "Invalid timezone." }); }
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "numeric" }).formatToParts(now);
    const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
    const budget = await AdaptiveBudget.findOneAndUpdate(
      { user: req.user.id, month: values.month - 1, year: values.year },
      { $set: { monthlyBudget, dailyBudget, timezone, includeAdditionalIncome: Boolean(req.body.includeAdditionalIncome), notificationsEnabled: req.body.notificationsEnabled !== false, notificationTime: req.body.notificationTime || "09:00" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return res.json({ message: "Adaptive budget saved.", budget, calculation: await calculateAdaptiveBudget(req.user.id, { timezone }) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save adaptive budget." });
  }
};

module.exports = { getAdaptiveBudget, saveAdaptiveBudget };
