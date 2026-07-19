import { FaEdit, FaTrash } from "react-icons/fa";

function ExpenseTable({ expenses, handleEdit, handleDelete
}) {
  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto mt-6 max-w-full">

      <table className="w-full table-auto">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">Title</th>

            <th className="p-4 text-left">Category</th>

            <th className="p-4 text-left">Type</th>

            <th className="p-4 text-left">Amount</th>

            <th className="p-4 text-left">Date</th>

            <th className="p-4 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {expenses.map((expense) => (

            <tr
              key={expense._id}
              className="border-t"
            >

              <td className="p-4">
                {expense.title}
              </td>

              <td className="p-4">
                {expense.category}
              </td>

              <td className="p-4">
                {expense.type}
              </td>

              <td className="p-4">
                ₹{expense.amount}
              </td>

              <td className="p-4">
                {new Date(expense.date).toLocaleDateString()}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-4">
                <button
                  onClick={() => handleEdit(expense._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit size={18} />
                </button>

                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={18} />
                </button>
                 </div>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default ExpenseTable;