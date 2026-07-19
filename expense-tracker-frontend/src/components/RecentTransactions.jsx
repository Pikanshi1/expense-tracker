function RecentTransactions({ expenses }) {
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Recent Transactions
      </h2>

      {recentExpenses.length === 0 ? (
        <p className="text-gray-500">
          No transactions found.
        </p>
      ) : (
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div
              key={expense._id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <h3 className="font-medium">
                  {expense.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {expense.category}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${
                    expense.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {expense.type === "income" ? "+" : "-"}₹
                  {expense.amount}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;