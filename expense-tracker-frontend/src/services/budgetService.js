import api from "./api";

export const getBudgets = async () => {
  const response = await api.get("/budgets");
  return response.data;
};

export const saveBudget = async (budget) => {
  const response = await api.post("/budgets", budget);
  return response.data;
};

export const deleteBudget=async(id)=>{
const response=await api.delete(`/budgets/${id}`);
return response.data;
};