import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SummaryCard from "../components/SummaryCard";
import { getExpenses } from "../services/expenseService";
import ExpenseChart from "../components/ExpenseChart";
import CategoryPieChart from "../components/CategoryPieChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import Last7DaysChart from "../components/Last7DaysChart";
import { exportToPDF } from "../utils/ExportPDF";
import { exportToCSV } from "../utils/ExportCSV";
import { exportToExcel } from "../utils/ExportExcel";

function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data.expenses);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (filter === "all") return true;

    const expenseDate = new Date(expense.date);
    const today = new Date();

    if (filter === "today") {
      return expenseDate.toDateString() === today.toDateString();
    }

    if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return expenseDate >= weekAgo;
    }

    if (filter === "month") {
      return (
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear()
      );
    }

    if (filter === "year") {
      return expenseDate.getFullYear() === today.getFullYear();
    }

    return true;
  });

  const monthlyData = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month, index) => ({
    month,
    amount: filteredExpenses
      .filter(
        (expense) =>
          expense.type.toLowerCase() === "expense" &&
          new Date(expense.date).getMonth() === index,
      )
      .reduce((sum, expense) => sum + expense.amount, 0),
  }));

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

  const categoryData = categories
    .map((category) => {
      const filtered = filteredExpenses.filter(
        (expense) =>
          expense.type.toLowerCase() === "expense" &&
          expense.category.trim() === category,
      );

      return {
        name: category,
        value: filtered.reduce((sum, expense) => sum + expense.amount, 0),
      };
    })
    .filter((item) => item.value > 0);

  const topCategories = [...categoryData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const last7DaysData = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    const total = filteredExpenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
          expense.type.toLowerCase() === "expense" &&
          expenseDate.toDateString() === date.toDateString()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      amount: total,
    };
  });

  const totalIncome = filteredExpenses
    .filter((item) => item.type.toLowerCase() === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = filteredExpenses
    .filter((item) => item.type.toLowerCase() === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpense;

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="print:hidden flex flex-wrap gap-3 justify-between items-center mb-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Today", value: "today" },
            { label: "Week", value: "week" },
            { label: "Month", value: "month" },
            { label: "Year", value: "year" },
            { label: "All Time", value: "all" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-5 py-2 rounded-full ${
                filter === item.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => exportToPDF(filteredExpenses)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            PDF
          </button>

          <button
            onClick={() => exportToExcel(filteredExpenses)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Excel
          </button>

          <button
            onClick={() => exportToCSV(filteredExpenses)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            CSV
          </button>

          <button
            onClick={handlePrint}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard title="Balance" amount={balance} color="text-blue-600" />

        <SummaryCard
          title="Income"
          amount={totalIncome}
          color="text-green-600"
        />

        <SummaryCard
          title="Expenses"
          amount={totalExpense}
          color="text-red-600"
        />

        <SummaryCard
          title="Transactions"
          amount={filteredExpenses.length}
          color="text-purple-600"
          isCurrency={false}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <ExpenseChart data={monthlyData} />

        <CategoryPieChart data={categoryData} />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Top Spending Categories</h2>

        <div className="space-y-4">
          {topCategories.map((category, index) => (
            <div
              key={category.name}
              className="flex justify-between items-center border-b pb-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {index === 0
                    ? "🥇"
                    : index === 1
                      ? "🥈"
                      : index === 2
                        ? "🥉"
                        : `${index + 1}.`}
                </span>

                <span className="font-medium">{category.name}</span>
              </div>

              <span className="font-bold text-blue-600">₹{category.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <IncomeExpenseChart income={totalIncome} expense={totalExpense} />
      </div>

      <div className="mt-8">
        <Last7DaysChart data={last7DaysData} />
      </div>
    </DashboardLayout>
  );
}

export default Analytics;
