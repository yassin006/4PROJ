import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import logo from "../assets/logoo.png"; 
import bgImg from "../assets/road-2.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      login();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe invalide.");
    }
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "http://localhost:3000/auth/google",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
      }

      try {
        const url = popup?.location.href;
        if (url && url.includes("access_token=")) {
          const token = new URLSearchParams(new URL(url).search).get("access_token");
          if (token) {
            localStorage.setItem("token", token);
            login();
            navigate("/");
            popup.close();
            clearInterval(timer);
          }
        }
      } catch (e) {
        // CORS
      }
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 shadow-xl rounded-xl p-8 backdrop-blur">
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse email</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-pink-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-pink-600 transition"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex-1 flex justify-center items-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
          </button>

          <button
            onClick={() => navigate("/register")}
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-pink-100 transition"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
