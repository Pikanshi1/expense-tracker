import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type ExpenseChartProps = {
  data: Array<{ month: string; amount: number }>;
};

function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Monthly Expenses
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="amount"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;