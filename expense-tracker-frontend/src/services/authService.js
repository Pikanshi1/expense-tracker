import api from "./api";

export const registerUser = async (userData) => {

    const response = await api.post(
        "/users/register",
        userData
    );

    return response.data;
};

export const loginUser = async (userData) => {

    const response = await api.post(
        "/users/login",
        userData
    );

    return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("profileImage", imageFile);

  const response = await api.put(
    "/users/profile/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const removeProfileImage = async () => {
  const response = await api.delete("/users/profile/image");
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/users/change-password",
    passwordData
  );

  return response.data;
};