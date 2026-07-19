import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SummaryCard from "../components/SummaryCard";
import {
  getGoals,
  createGoal,
  deleteGoal,
  addSavings,
  updateGoal,
} from "../services/goalService";
import { toast } from "react-toastify";

function Goals() {
  const [goals, setGoals] = useState([]);

  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  const [savingGoal, setSavingGoal] = useState(null);
  const [savingAmount, setSavingAmount] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });
  const [deletingGoal, setDeletingGoal] = useState(null);
  

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.log(error);
    }
  };
  const totalTarget = goals.reduce(
  (sum, goal) => sum + Number(goal.targetAmount || 0),
  0
);

const totalSaved = goals.reduce(
  (sum, goal) => sum + Number(goal.savedAmount || 0),
  0
);

const completedGoals = goals.filter(
  (goal) =>
    (goal.savedAmount || 0) >= goal.targetAmount
).length;

  const handleUpdateGoal = async () => {
    try {
      await updateGoal(editingGoal._id, editForm);

      setEditingGoal(null);

      // refresh goals
      fetchGoals();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.targetAmount || !form.deadline) {
      toast.error("Please fill all fields");
      return;
    }

    await createGoal({
      title: form.title,
      targetAmount: Number(form.targetAmount),
      deadline: form.deadline,
    });

    toast.success("Goal Created");

    setForm({
      title: "",
      targetAmount: "",
      deadline: "",
    });

    loadGoals();
  };

  const handleAddSavings = async () => {
    if (!savingGoal) return;

    await addSavings(savingGoal._id, Number(savingAmount));

    toast.success("Savings Added");

    setSavingGoal(null);
    setSavingAmount("");

    loadGoals();
  };
 
  return(
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Savings Goals</h1>


      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Target Savings"
          amount={totalTarget}
          color="text-blue-600"
        />

        <SummaryCard title="Saved" amount={totalSaved} color="text-green-600" />

        <SummaryCard
          title="Completed Goals"
          amount={completedGoals}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Create Goal</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Goal Name"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            placeholder="Target Amount"
            value={form.targetAmount}
            onChange={(e) =>
              setForm({
                ...form,
                targetAmount: e.target.value,
              })
            }
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              setForm({
                ...form,
                deadline: e.target.value,
              })
            }
            className="border rounded-lg px-4 py-2"
          />
        </div>

        <button
          onClick={handleCreate}
          className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Create Goal
        </button>
      </div>

      <div className="grid gap-6">
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-700">No Goals Yet</h2>

            <p className="text-gray-500 mt-2">
              Create your first savings goal above.
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(
              (goal.savedAmount / goal.targetAmount) * 100,
              100,
            );

            const remaining = goal.targetAmount - goal.savedAmount;

            return (
              <div key={goal._id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{goal.title}</h2>

                    <p className="text-gray-500 mt-2">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>

                    {percentage >= 100 && (
                      <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        Goal Completed 🎉
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-blue-600">
                      ₹{goal.savedAmount}
                    </h3>

                    <p className="text-gray-500">of ₹{goal.targetAmount}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>

                    <span className="font-semibold">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        percentage >= 100
                          ? "bg-green-600"
                          : percentage >= 70
                            ? "bg-yellow-500"
                            : "bg-blue-600"
                      }`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-3 text-sm">
                    <span>Remaining:</span>

                    <span
                      className={
                        remaining > 0
                          ? "text-red-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      ₹{remaining > 0 ? remaining : 0}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => {
                      setEditingGoal(goal);

                      setEditForm({
                        title: goal.title,
                        targetAmount: goal.targetAmount,
                        deadline: goal.deadline.slice(0, 10),
                      });
                    }}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setSavingGoal(goal)}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                  >
                    Add Savings
                  </button>

                  <button
                    onClick={() => setDeletingGoal(goal)}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-5">Edit Goal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={editForm.targetAmount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      targetAmount: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      deadline: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditingGoal(null);
                    setEditForm({
                      title: "",
                      targetAmount: "",
                      deadline: "",
                    });
                  }}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateGoal}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Delete Goal</h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deletingGoal.title}"?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingGoal(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteGoal}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {savingGoal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-105">
            <h2 className="text-2xl font-bold mb-6">Add Savings</h2>

            <p className="text-gray-600 mb-4">
              Goal:
              <span className="font-semibold ml-2">{savingGoal.title}</span>
            </p>

            <p className="text-gray-600 mb-4">
              Saved:
              <span className="font-semibold ml-2">
                ₹{savingGoal.savedAmount}
              </span>
            </p>

            <p className="text-gray-600 mb-6">
              Target:
              <span className="font-semibold ml-2">
                ₹{savingGoal.targetAmount}
              </span>
            </p>

            <input
              type="number"
              placeholder="Enter amount"
              value={savingAmount}
              onChange={(e) => setSavingAmount(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSavingGoal(null);
                  setSavingAmount("");
                }}
                className="px-5 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSavings}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Goals;
