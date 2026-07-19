import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}`);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const clearNotifications = async () => {
  const response = await api.delete("/notifications");
  return response.data;
};

export const markAllAsRead=async()=>{
const res=await api.patch("/notifications/read-all");
return res.data;
};