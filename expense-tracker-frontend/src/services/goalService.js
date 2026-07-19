import api from "./api";

// Get all goals
export const getGoals = async () => {
  const response = await api.get("/goals");
  return response.data;
};

// Get dashboard summary
export const getGoalSummary = async () => {
  const response = await api.get("/goals/summary");
  return response.data;
};

// Create goal
export const createGoal = async (goal) => {
  const response = await api.post("/goals", goal);
  return response.data;
};

// Update goal
export const updateGoal = async (id, goal) => {
  const response = await api.put(`/goals/${id}`, goal);
  return response.data;
};

// Delete goal
export const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

// Add savings
export const addSavings = async (id, amount) => {
  const response = await api.patch(`/goals/${id}/add-savings`, {
    amount,
  });

  return response.data;
};