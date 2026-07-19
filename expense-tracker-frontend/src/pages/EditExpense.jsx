import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getExpenseById,
  updateExpense,
} from "../services/expenseService";
import { FaArrowLeft } from "react-icons/fa";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      const data = await getExpenseById(id);

      reset(data.expense);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (formData) => {
    try {
      await updateExpense(id, formData);

      alert("Expense Updated Successfully");

      navigate("/expenses");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
        
    <div className="flex items-center gap-4 mb-6">
        <button
        onClick={() => navigate("/expenses")}
        className="text-gray-600 hover:text-blue-600 transition"
        title="Back"
        >
        <FaArrowLeft size={22} />
        </button>

        <h1 className="text-3xl font-bold">
        Edit Expense
        </h1>
    </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >

        <input
          {...register("title")}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          {...register("amount")}
          placeholder="Amount"
          className="w-full border p-2 rounded"
        />

        <select
          {...register("type")}
          className="w-full border p-2 rounded"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          {...register("category")}
          className="w-full border p-2 rounded"
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          {...register("date")}
          className="w-full border p-2 rounded"
        />

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Update Expense
        </button>

      </form>

    </DashboardLayout>
  );
}

export default EditExpense;