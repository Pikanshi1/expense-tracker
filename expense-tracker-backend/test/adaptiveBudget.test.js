const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateBudgetValues } = require("../services/adaptiveBudgetService");

const calculate = (values) => calculateBudgetValues({
  monthlyBudget: 30000,
  totalIncome: 0,
  daysInCurrentMonth: 30,
  currentDay: 21,
  includeAdditionalIncome: false,
  ...values,
});

test("starts with the calculated daily allowance and subtracts today's spending", () => {
  const result = calculate({ totalExpenses: 0, spentToday: 0 });
  assert.equal(result.dailyAllowance, 3000);
  assert.equal(result.remainingAllowance, 3000);
});

test("redistributes overspending across future days", () => {
  const result = calculate({ monthlyBudget: 12000, totalExpenses: 1700, spentToday: 1700 });
  assert.equal(result.dailyAllowance, 1200);
  assert.equal(result.remainingMonthlyBudget, 10300);
  assert.equal(result.futureDailyAllowance, 10300 / 9);
  assert.equal(result.exceededBy, 500);
});

test("reduces today's remaining allowance without losing unspent monthly funds", () => {
  const result = calculate({ totalExpenses: 500, spentToday: 500 });
  assert.equal(result.remainingAllowance, 2500);
  assert.equal(result.futureDailyAllowance, 29500 / 9);
});

test("includes additional income only when enabled", () => {
  const excluded = calculate({ totalExpenses: 0, totalIncome: 10000, spentToday: 0 });
  const included = calculate({ totalExpenses: 0, totalIncome: 10000, spentToday: 0, includeAdditionalIncome: true });
  assert.equal(excluded.remainingMonthlyBudget, 30000);
  assert.equal(included.remainingMonthlyBudget, 40000);
});

test("uses the correct remaining days at a month boundary", () => {
  const result = calculate({ totalExpenses: 0, spentToday: 0, daysInCurrentMonth: 31, currentDay: 31 });
  assert.equal(result.remainingDaysInMonth, 1);
  assert.equal(result.futureDailyAllowance, 0);
});

test("recalculation is idempotent for edited or deleted totals", () => {
  const edited = calculate({ totalExpenses: 1200, spentToday: 1200 });
  const restored = calculate({ totalExpenses: 0, spentToday: 0 });
  assert.equal(edited.remainingMonthlyBudget, 28800);
  assert.equal(restored.remainingMonthlyBudget, 30000);
});
