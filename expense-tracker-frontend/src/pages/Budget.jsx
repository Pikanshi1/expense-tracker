import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getBudgets,
  saveBudget,
  deleteBudget,
  getAdaptiveBudget,
  saveAdaptiveBudget,
} from "../services/budgetService";
import { getExpenses } from "../services/expenseService";
import { toast } from "react-toastify";
import SummaryCard from "../components/SummaryCard";
import { usePreferences } from "../context/PreferencesContext";
import { askBudgetAdvice } from "../services/smartService";

function Budget() {
  const { formatCurrency } = usePreferences();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingCategory, setEditingCategory] = useState("");
  const [adaptive, setAdaptive] = useState(null);
  const [adaptiveForm, setAdaptiveForm] = useState({ monthlyBudget: "", dailyBudget: "", includeAdditionalIncome: false, notificationsEnabled: true, notificationTime: "09:00" });
  const [budgetQuestion, setBudgetQuestion] = useState("");
  const [budgetAdvice, setBudgetAdvice] = useState("");
  const [askingAdvice, setAskingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState("");

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Health",
    "Other",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const budgetData = await getBudgets();
      const expenseData = await getExpenses({ limit: 0 });
      const adaptiveData = await getAdaptiveBudget();

      setBudgets(budgetData);
      setExpenses(expenseData.expenses || []);
      setAdaptive(adaptiveData);
      if (adaptiveData.settings) setAdaptiveForm({ monthlyBudget: adaptiveData.monthlyBudget, dailyBudget: adaptiveData.dailyBudget ?? "", ...adaptiveData.settings });
    } catch (error) {
      console.log(error);
    }

  }

  const handleAdaptiveSave = async (event) => {
    event.preventDefault();
    try {
      const result = await saveAdaptiveBudget(adaptiveForm);
      setAdaptive(result.calculation);
      toast.success("Adaptive budget saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save adaptive budget");
    }
  };

  const handleAskBudgetAdvice = async (event) => {
    event.preventDefault();
    if (!budgetQuestion.trim()) return;
    setAskingAdvice(true);
    setAdviceError("");
    try {
      const result = await askBudgetAdvice(budgetQuestion);
      setBudgetAdvice(result.answer);
    } catch (error) {
      setAdviceError(error.response?.data?.message || "Unable to get budget advice.");
    } finally {
      setAskingAdvice(false);
    }
  };

  const handleBudgetChange = (category, value) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);

      if (existing) {
        return prev.map((b) =>
          b.category === category ? { ...b, amount: value } : b,
        );
      }

      return [...prev, { category, amount: value }];
    });
  };

  const handleSave = async (category) => {
    const budget = budgets.find((b) => b.category === category);

    if (!budget || budget.amount === "" || budget.amount == null || !Number.isFinite(Number(budget.amount)) || Number(budget.amount) <= 0) {
      toast.error("Please enter a budget amount");
      return;
    }

    await saveBudget({
      category,
      amount: Number(budget.amount),
    });

    toast.success("Budget Saved");

    setEditingCategory("");
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
    toast.success("Budget deleted");
    fetchData();
  };

  const totalBudget = budgets.reduce(
    (sum, budget) => sum + Number(budget.amount || 0),
    0,
  );

  const now = new Date();
  const thisMonthExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    return expense.type === "Expense" && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const totalSpent = thisMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const remaining = totalBudget - totalSpent;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Total & Category Budgets</h1>

      <form onSubmit={handleAdaptiveSave} className="app-card mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="eyebrow">ADAPTIVE DAILY BUDGET</p><h2 className="text-2xl font-bold">Make every day count</h2><p className="muted-copy mt-1">Your allowance recalculates whenever transactions change.</p></div>
          <div className="text-right"><p className="muted-copy text-sm">Today's allowance</p><strong className="text-2xl text-emerald-500">{formatCurrency(adaptive?.dailyAllowance || 0)}</strong></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          <label className="text-sm font-semibold">Total monthly budget<input aria-label="Total monthly budget" className="w-full border rounded-xl p-3 mt-2" type="number" min="0" step="0.01" value={adaptiveForm.monthlyBudget} onChange={(e) => setAdaptiveForm({ ...adaptiveForm, monthlyBudget: e.target.value })} placeholder="Enter your total budget" required /></label>
          <label className="text-sm font-semibold">Daily budget<input aria-label="Daily budget" className="w-full border rounded-xl p-3 mt-2" type="number" min="0" step="0.01" value={adaptiveForm.dailyBudget} onChange={(e) => setAdaptiveForm({ ...adaptiveForm, dailyBudget: e.target.value })} placeholder={adaptive?.dailyAllowance ? `Calculated: ${Math.round(adaptive.dailyAllowance)}` : "Optional override"} /><span className="muted-copy block text-xs mt-1">Leave blank to use the calculated allowance.</span></label>
          <label className="text-sm font-semibold">Daily notification time<input className="w-full border rounded-xl p-3 mt-2" type="time" value={adaptiveForm.notificationTime} onChange={(e) => setAdaptiveForm({ ...adaptiveForm, notificationTime: e.target.value })} /></label>
          <label className="flex items-center gap-2 mt-7 text-sm"><input type="checkbox" checked={adaptiveForm.includeAdditionalIncome} onChange={(e) => setAdaptiveForm({ ...adaptiveForm, includeAdditionalIncome: e.target.checked })} /> Include Additional Income in Spending Budget</label>
        </div>
        <div className="flex flex-wrap gap-5 mt-5 text-sm muted-copy"><span>Spent today: {formatCurrency(adaptive?.spentToday || 0)}</span><span>Remaining today: {formatCurrency(adaptive?.remainingAllowance || 0)}</span><span>Monthly remaining: {formatCurrency(adaptive?.remainingMonthlyBudget || 0)}</span><span>{Math.round(adaptive?.percentageUsed || 0)}% used</span></div>
        <button className="gradient-button mt-5" type="submit">Save adaptive budget</button>
      </form>

      <section className="app-card mb-8">
        <p className="eyebrow">ASK AI ABOUT YOUR BUDGET</p>
        <h2 className="text-2xl font-bold">Find ways to improve your plan</h2>
        <p className="muted-copy mt-1">Ask about your allowance, spending categories, or how to stay within this month's budget.</p>
        <form onSubmit={handleAskBudgetAdvice} className="flex flex-col sm:flex-row gap-3 mt-5">
          <input value={budgetQuestion} onChange={(event) => setBudgetQuestion(event.target.value)} maxLength={500} placeholder="How can I reduce my spending this month?" className="flex-1 border rounded-xl p-3" aria-label="Ask AI about your budget" />
          <button type="submit" className="gradient-button" disabled={askingAdvice || !budgetQuestion.trim()}>{askingAdvice ? "Thinking…" : "Ask AI"}</button>
        </form>
        {adviceError && <p className="text-rose-500 mt-3">{adviceError}</p>}
        {budgetAdvice && <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4"><p className="font-semibold text-blue-800">Budget improvement suggestion</p><p className="mt-2 whitespace-pre-wrap text-gray-700">{budgetAdvice}</p></div>}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Budget"
          amount={totalBudget}
          color="text-blue-600"
        />

        <SummaryCard title="Spent" amount={totalSpent} color="text-red-600" />

        <SummaryCard
          title="Remaining"
          amount={remaining}
          color={remaining >= 0 ? "text-green-600" : "text-red-600"}
        />
      </div>

      {budgets.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">
            No budgets set yet
          </h2>
          <p className="text-gray-600 mt-2">
            Click <strong>Edit</strong> on any category to create your first
            monthly budget.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {categories.map((category) => {
          const budgetItem = budgets.find((b) => b.category === category);

          const budget = budgetItem?.amount || "";

          const spent = expenses
            .filter(
              (e) =>
                e.category === category && e.type === "Expense" && new Date(e.date).getMonth() === now.getMonth() && new Date(e.date).getFullYear() === now.getFullYear(),
            )
            .reduce((sum, e) => sum + e.amount, 0);

          const percentage =
            budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

          return (
            <div
              key={category}
              className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{category}</h2>

                  {budget > 0 && (
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        percentage >= 100
                          ? "bg-red-100 text-red-700"
                          : percentage >= 80
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {percentage >= 100
                        ? "Budget Exceeded"
                        : percentage >= 80
                          ? "Near Limit"
                          : "On Track"}
                    </span>
                  )}

                  <p className="text-gray-500 mt-1">
                    {formatCurrency(spent)} / {formatCurrency(budget || 0)}
                  </p>
                  <p
                    className={`font-medium mt-1 ${
                      budget - spent >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Remaining {formatCurrency((budget || 0) - spent)}
                  </p>
                </div>

                <div className="flex gap-3">
                  {editingCategory === category ? (
                    <input
                      type="number"
                      value={budget}
                      placeholder="Budget"
                      onChange={(e) =>
                        handleBudgetChange(category, e.target.value)
                      }
                      className="border rounded-lg px-4 py-2 w-32"
                    />
                  ) : (
                    <h2 className="text-xl font-bold">{formatCurrency(budget || 0)}</h2>
                  )}
                  {editingCategory === category ? (
                    <button
                      onClick={() => {
                        handleSave(category);
                      }}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (budgetItem) {
                        handleDelete(budgetItem._id);
                      }
                    }}
                    disabled={!budgetItem}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 h-4 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    percentage >= 100
                      ? "bg-red-600"
                      : percentage >= 80
                        ? "bg-yellow-500"
                        : "bg-green-600"
                  }`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

export default Budget;
