import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function IncomeExpenseChart({ income, expense }) {
  const data = [
    {
      name: "Income",
      amount: income,
    },
    {
      name: "Expense",
      amount: expense,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Income vs Expense
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="amount"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default IncomeExpenseChart;