import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getRecurring,
  createRecurring,
  deleteRecurring,
} from "../services/recurringService";
import { toast } from "react-toastify";

function Recurring() {
  const [recurring, setRecurring] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "Expense",
    frequency: "Monthly",
  });

  useEffect(() => {
    loadRecurring();
  }, []);

  const loadRecurring = async () => {
    try {
      const data = await getRecurring();
      setRecurring(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount) {
      return toast.error("Please fill all fields");
    }

    try {
      await createRecurring({
        ...formData,
        amount: Number(formData.amount),
      });

      toast.success("Recurring transaction added");

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        type: "Expense",
        frequency: "Monthly",
      });

      loadRecurring();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recurring transaction?")) return;

    await deleteRecurring(id);

    toast.success("Deleted");

    loadRecurring();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Recurring Transactions</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
            <option>Education</option>
            <option>Health</option>
            <option>Salary</option>
            <option>Other</option>
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option>Expense</option>
            <option>Income</option>
          </select>

          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Add Recurring
        </button>
      </form>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Title</th>

              <th className="text-left p-4">Amount</th>

              <th className="text-left p-4">Category</th>

              <th className="text-left p-4">Type</th>

              <th className="text-left p-4">Frequency</th>

              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {recurring.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  No recurring transactions found.
                </td>
              </tr>
            ) : (
              recurring.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4">{item.title}</td>

                  <td className="p-4">₹{item.amount}</td>

                  <td className="p-4">{item.category}</td>

                  <td
                    className={`p-4 font-semibold ${
                      item.type === "Income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.type}
                  </td>

                  <td className="p-4">{item.frequency}</td>

                  <td className="text-center p-4">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Recurring;
