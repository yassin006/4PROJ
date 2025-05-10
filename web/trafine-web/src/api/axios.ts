import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("🔒 401 Unauthorized – Token invalide ou expiré.");
      localStorage.removeItem("token");
    } else if (status === 403) {
      console.warn("⛔ 403 Forbidden – Accès refusé.");
    } else if (status === 404) {
      console.warn("📭 404 Not Found – Route inexistante.");
    } else if (status >= 500) {
      console.error("💥 Erreur serveur :", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default instance;
