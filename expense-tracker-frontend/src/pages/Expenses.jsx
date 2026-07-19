import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ExpenseTable from "../components/ExpenseTable";
import { getExpenses } from "../services/expenseService";
import { deleteExpense } from "../services/expenseService";
import { updateExpense } from "../services/expenseService";
import DeleteModal from "../components/DeleteModal";
import { exportToCSV } from "../utils/exportCSV";
import { exportToPDF } from "../utils/exportPDF";
import { exportToExcel } from "../utils/exportExcel";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [currentPage,search, category, type, sort]);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses({
           page: currentPage,
           limit: 10,
           search,
           category,
           type,
           sort,
           });
      setExpenses(data.expenses);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
  navigate(`/expenses/edit/${id}`);
   };

   const handleDelete = (id) => {
     setDeleteId(id);
     setShowDeleteModal(true);
  };
     const confirmDelete = async () => {
  try {
    await deleteExpense(deleteId);

    toast.success("Expense deleted successfully!");

    fetchExpenses();

    setShowDeleteModal(false);
    setDeleteId(null);
     } catch (error) {
    toast.error("Failed to delete expense");
    }
   };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold mb-6">
        Expenses
      </h1>

      <button
         onClick={() => navigate("/expenses/add")}
         className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
      >
        + Add Expense
      </button>
      </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-3 flex-1">

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-2 flex-1 min-w-45"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-lg p-2 flex-1 min-w-37.5"
      >
        <option value="">All Categories</option>
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


      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded-lg p-2 flex-1 min-w-37.5"
      >
        <option value="">All Types</option>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border rounded-lg p-2 flex-1 min-w-37.5"
      >
        <option value="">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="highest">Highest Amount</option>
        <option value="lowest">Lowest Amount</option>
      </select>

      </div>
      <div className="flex flex-wrap gap-3 justify-end">
      <button
         onClick={() => exportToCSV(expenses)}
         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
         CSV
      </button>

      <button
         onClick={() => exportToPDF(expenses)}
         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
         PDF
      </button>
      <button
        onClick={() => exportToExcel(expenses)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
        Excel
       </button>
      </div>

      

    </div>

      <ExpenseTable 
            expenses={expenses} 
            handleEdit={handleEdit}  
            handleDelete={handleDelete} 
       />

       <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
          </div>
          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
    </DashboardLayout>
  );
}

export default Expenses;