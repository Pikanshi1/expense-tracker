import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { addExpense } from "../services/expenseService";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

function AddExpense() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      data.amount = Number(data.amount);

      await addExpense(data);

      toast.success("Expense Added Successfully!");

      navigate("/expenses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/expenses")}
          className="text-gray-600 hover:text-blue-600 transition"
          title="Back"
        >
          <FaArrowLeft size={22} />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold">Add Expense</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-lg p-4 md:p-6 space-y-5 max-w-xl w-full"
      >
        <div>
          <label className="block mb-2">Title</label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            {...register("title", {
              required: "Title is required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.title?.message}</p>
        </div>

        <div>
          <label className="block mb-2">Amount</label>

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            {...register("amount", {
              required: "Amount is required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.amount?.message}</p>
        </div>

        <div>
          <label className="block mb-2">Category</label>

          <select
            className="w-full border rounded-lg p-3"
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>

          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        </div>

        <div>
          <label className="block mb-2">Type</label>

          <select
            className="w-full border rounded-lg p-3"
            {...register("type", {
              required: "Type is required",
            })}
          >
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <p className="text-red-500 text-sm">{errors.type?.message}</p>
        </div>

        <div>
          <label className="block mb-2">Date</label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
            {...register("date", {
              required: "Date is required",
            })}
          />

          <p className="text-red-500 text-sm">{errors.date?.message}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Expense
        </button>
      </form>
    </DashboardLayout>
  );
}

export default AddExpense;
