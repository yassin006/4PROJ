import React, { useState } from "react";
import logo from "../assets/phones.png";
import bgImg from "../assets/road-2.jpg";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Register error:", error);
      const res = error.response?.data;

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
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        <h2 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-pink-500 bg-[length:200%_200%] animate-gradient-x">
          Créer un compte
        </h2>

        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: user@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-pink-600 transition"
          >
            S'inscrire
          </button>
        </form>

        {/* ✅ Pink link below the form */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-pink-600 hover:underline text-sm">
            Vous avez déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
