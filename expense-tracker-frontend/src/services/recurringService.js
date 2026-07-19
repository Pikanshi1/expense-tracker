import api from "./api";

export const getRecurring = async () => {
  const res = await api.get("/recurring");
  return res.data;
};

export const createRecurring = async (data) => {
  const res = await api.post("/recurring", data);
  return res.data;
};

export const deleteRecurring = async (id) => {
  const res = await api.delete(`/recurring/${id}`);
  return res.data;
};