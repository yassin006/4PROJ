// src/api/AdminService.ts
import axios from "./axios"; // ✅ bon chemin local

export const validateIncident = async (id: string) => {
  return axios.post(`/incidents/${id}/validate`);
};

export const deleteIncident = async (
  id: string,
  credentials: { email: string; password: string }
) => {
  return axios.delete(`/incidents/${id}`, { data: credentials });
};

export const deleteUser = async (
  id: string,
  credentials: { email: string; password: string }
) => {
  return axios.delete(`/users/${id}`, { data: credentials });
};

export const updateUserRole = async (id: string, role: string) => {
  return axios.patch(`/users/${id}/role`, { role });
};
