// src/api/UserService.ts
import axios from "./axios"; // <-- Utilise bien l'instance configurée

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
  formData.append("profileImage", file);   // ✅ nom attendu par le backend
  const res = await axios.patch("/users/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // ✅ obligatoire pour envoi de fichier
    },
  });
  return `http://localhost:3000/uploads/${res.data.profileImage}`; // retourne l'URL complète
};

export const deleteAccount = async () => {
  const res = await axios.delete("/users/me");
  return res.data;
};
