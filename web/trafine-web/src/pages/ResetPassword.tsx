import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import bgImg from "../assets/road.jpg";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const token = tokenParam.includes("token=")
    ? new URLSearchParams(tokenParam).get("token")!
    : tokenParam;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (password !== confirm) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });
      setMessage(
        res.data?.message || "Mot de passe réinitialisé avec succès !"
      );
    } catch (error: any) {
      console.error("❌ Reset error:", error);
      const res = error.response?.data;
      if (typeof res?.message === "string") {
        setErrorMessage(res.message);
      } else if (Array.isArray(res?.message)) {
        setErrorMessage(res.message.join(", "));
      } else {
        setErrorMessage("Erreur lors de la réinitialisation.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 shadow-xl rounded-xl p-8 backdrop-blur">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-pink-500 bg-[length:200%_200%] animate-gradient-x">
          Réinitialiser le mot de passe
        </h2>

        {message && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded">
            {message}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-black-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Réinitialiser
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
