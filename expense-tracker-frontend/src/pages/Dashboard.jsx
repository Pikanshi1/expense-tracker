import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SummaryCard from "../components/SummaryCard";
import { getExpenses } from "../services/expenseService";
import ExpenseChart from "../components/ExpenseChart";
import CategoryPieChart from "../components/CategoryPieChart";
import RecentTransactions from "../components/RecentTransactions";
import { useAuth } from "../context/AuthContext";
import { getGoals } from "../services/goalService";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [goals, setGoals] = useState([]);


  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      console.log(data);
      setExpenses(data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

    useEffect(() => {
    fetchExpenses();
    fetchGoals();
  }, []);

    if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }


  const totalIncome = expenses
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = expenses
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpense;
  const totalGoals = goals.length;

  const completedGoals = goals.filter(
    (goal) => (goal.savedAmount / goal.targetAmount) * 100 >= 100,
  ).length;

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTransactions = expenses.length;
  const expenseOnly = expenses.filter(
    (item) => item.type.toLowerCase() === "expense",
  );

  const highestExpense =
    expenseOnly.length > 0
      ? Math.max(...expenseOnly.map((item) => item.amount))
      : 0;

  const lowestExpense =
    expenseOnly.length > 0
      ? Math.min(...expenseOnly.map((item) => item.amount))
      : 0;

  const averageExpense =
    expenseOnly.length > 0
      ? (
          expenseOnly.reduce((sum, item) => sum + item.amount, 0) /
          expenseOnly.length
        ).toFixed(2)
      : 0;
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
    amount: expenses
      .filter(
        (expense) =>
          expense.type === "expense" &&
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
      const filtered = expenses.filter((expense) => {
        return (
          expense.type.toLowerCase() === "expense" &&
          expense.category.trim() === category
        );
      });

      return {
        name: category,
        value: filtered.reduce((sum, expense) => sum + expense.amount, 0),
      };
    })
    .filter((item) => item.value > 0);

  console.log(expenses[0]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome back, {user?.name || "User"} 👋
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Here's your financial overview for today.
        </p>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
          amount={totalTransactions}
          color="text-purple-600"
          isCurrency={false}
        />
        <SummaryCard
          title="Goals Completed"
          amount={`${completedGoals}/${totalGoals}`}
          color="text-indigo-600"
          isCurrency={false}
        />
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Expense Analysis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <SummaryCard
          title="Highest Expense"
          amount={highestExpense}
          color="text-red-600"
        />

        <SummaryCard
          title="Lowest Expense"
          amount={lowestExpense}
          color="text-green-600"
        />

        <SummaryCard
          title="Average Expense"
          amount={averageExpense}
          color="text-purple-600"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <ExpenseChart data={monthlyData} />
        <CategoryPieChart data={categoryData} />
      </div>
      <div className="mt-10">
  <RecentTransactions expenses={expenses} />
</div>
    </DashboardLayout>
  );
}

export default Dashboard;
