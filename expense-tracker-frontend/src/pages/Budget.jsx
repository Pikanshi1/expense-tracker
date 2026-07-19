import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getBudgets,
  saveBudget,
  deleteBudget,
} from "../services/budgetService";
import { getExpenses } from "../services/expenseService";
import { toast } from "react-toastify";
import SummaryCard from "../components/SummaryCard";

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingCategory, setEditingCategory] = useState("");

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Health",
    "Salary",
    "Other",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const budgetData = await getBudgets();
      const expenseData = await getExpenses();

      setBudgets(budgetData);
      setExpenses(expenseData.expenses);
    } catch (error) {
      console.log(error);
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

    if (!budget || budget.amount === "" || budget.amount == null) {
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

  const totalSpent = expenses
    .filter((expense) => expense.type.toLowerCase() === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const remaining = totalBudget - totalSpent;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Monthly Budget</h1>

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
                e.category === category && e.type.toLowerCase() === "expense",
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
                    ₹{spent} / ₹{budget || 0}
                  </p>
                  <p
                    className={`font-medium mt-1 ${
                      budget - spent >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Remaining ₹{(budget || 0) - spent}
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
                    <h2 className="text-xl font-bold">₹{budget || 0}</h2>
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
