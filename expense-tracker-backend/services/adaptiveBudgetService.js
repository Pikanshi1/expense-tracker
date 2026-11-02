const Expense = require("../models/expense");
const AdaptiveBudget = require("../models/AdaptiveBudget");

const partsFor = (date, timezone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
};

const daysInMonth = (year, month) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

const calculateBudgetValues = ({ monthlyBudget, dailyBudget, totalExpenses, totalIncome, spentToday, daysInCurrentMonth, currentDay, includeAdditionalIncome }) => {
  const availableBudget = monthlyBudget + (includeAdditionalIncome ? totalIncome : 0);
  const remainingMonthlyBudget = availableBudget - totalExpenses;
  const remainingBudgetBeforeToday = availableBudget - (totalExpenses - spentToday);
  const remainingDaysInMonth = daysInCurrentMonth - currentDay + 1;
  const futureDays = Math.max(0, remainingDaysInMonth - 1);
  const calculatedDailyAllowance = remainingDaysInMonth > 0 ? Math.max(0, remainingBudgetBeforeToday / remainingDaysInMonth) : 0;
  const dailyAllowance = dailyBudget === null || dailyBudget === undefined ? calculatedDailyAllowance : Math.max(0, dailyBudget);
  const remainingAllowance = Math.max(0, dailyAllowance - spentToday);
  const futureDailyAllowance = futureDays > 0 ? Math.max(0, remainingMonthlyBudget / futureDays) : 0;
  return {
    remainingMonthlyBudget,
    remainingDaysInMonth,
    dailyAllowance,
    remainingAllowance,
    futureDailyAllowance,
    percentageUsed: dailyAllowance > 0 ? (spentToday / dailyAllowance) * 100 : 0,
    exceededBy: Math.max(0, spentToday - dailyAllowance),
  };
};

const calculateAdaptiveBudget = async (userId, options = {}) => {
  const timezone = options.timezone || "UTC";
  const now = options.now || new Date();
  const current = partsFor(now, timezone);
  const budget = await AdaptiveBudget.findOne({ user: userId, month: current.month - 1, year: current.year }).lean();
  const monthlyBudget = Number(budget?.monthlyBudget || 0);
  const expenses = await Expense.find({ user: userId }).select("amount type date").lean();
  const monthItems = expenses.filter((item) => {
    const date = partsFor(new Date(item.date), timezone);
    return date.year === current.year && date.month === current.month;
  });
  const totalExpenses = monthItems.filter((item) => item.type === "Expense").reduce((sum, item) => sum + Number(item.amount), 0);
  const totalIncome = monthItems.filter((item) => item.type === "Income").reduce((sum, item) => sum + Number(item.amount), 0);
  const spentToday = monthItems.filter((item) => {
    const date = partsFor(new Date(item.date), timezone);
    return item.type === "Expense" && date.day === current.day;
  }).reduce((sum, item) => sum + Number(item.amount), 0);
  const values = calculateBudgetValues({
    monthlyBudget,
    dailyBudget: budget?.dailyBudget,
    totalExpenses,
    totalIncome,
    spentToday,
    daysInCurrentMonth: daysInMonth(current.year, current.month - 1),
    currentDay: current.day,
    includeAdditionalIncome: Boolean(budget?.includeAdditionalIncome),
  });
  return {
    configured: Boolean(budget),
    monthlyBudget,
    dailyBudget: budget?.dailyBudget ?? null,
    totalIncome,
    totalExpenses,
    spentToday,
    ...values,
    timezone,
    date: `${current.year}-${String(current.month).padStart(2, "0")}-${String(current.day).padStart(2, "0")}`,
    settings: budget ? {
      includeAdditionalIncome: budget.includeAdditionalIncome,
      notificationsEnabled: budget.notificationsEnabled,
      notificationTime: budget.notificationTime,
    } : null,
  };
};

module.exports = { calculateAdaptiveBudget, calculateBudgetValues, partsFor };
