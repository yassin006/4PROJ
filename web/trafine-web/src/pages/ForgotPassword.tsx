import React, { useState } from "react";
import phonesImg from "../assets/logoo12.png"; // ← Nouveau logo
import bgImg from "../assets/road.jpg";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const cleanedEmail = email.trim().toLowerCase();
      console.log("📤 Email envoyé au backend:", cleanedEmail);

      const res = await api.post("/auth/forgot-password", {
        email: cleanedEmail,
      });

      console.log("✅ Réponse backend :", res.data);
      setMessage(res.data?.message || "Email de réinitialisation envoyé.");

      // ⏳ Redirection après 4 secondes
      setTimeout(() => {
        window.location.href = "http://localhost:5173/RESET-password";
      }, 4000);
    } catch (error: any) {
      console.error("❌ Erreur Forgot Password:", error);
      const res = error?.response?.data;
      if (typeof res?.message === "string") {
        setErrorMessage(res.message);
      } else if (Array.isArray(res?.message)) {
        setErrorMessage(res.message.join(", "));
      } else {
        setErrorMessage("Erreur inconnue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 shadow-xl rounded-xl p-8 backdrop-blur">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-pink-500 bg-[length:200%_200%] animate-gradient-x">
          Mot de passe oublié ?
        </h2>

        <div className="flex justify-center mb-6">
          <img src={phonesImg} alt="phones" className="h-24" />
        </div>

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
              Adresse email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
