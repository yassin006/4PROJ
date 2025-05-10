import axios from "./axios";

export const getProfile = async () => {
  const res = await axios.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data: { email?: string; password?: string }) => {
  const res = await axios.patch("/users/me", data);
  return res.data;
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const res = await axios.patch("/users/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return `http://localhost:3000/uploads/${res.data.profileImage}`;
};

export const deleteAccount = async () => {
  const res = await axios.delete("/users/me");
  return res.data;
};

export const getUserNotifications = async () => {
  const res = await axios.get("/notifications");
  return res.data;
};
