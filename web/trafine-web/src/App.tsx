// src/App.tsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar */}
      {isAuthenticated && (
        <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Trafine 🚗
          </Link>
          <div className="flex gap-4">
            <Link
              to="/map"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              Carte
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              Profil
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 font-medium hover:text-green-600 transition"
              >
                Espace Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-red-600 font-medium hover:underline"
            >
              Déconnexion
            </button>
          </div>
        </nav>
      )}

      {/* ✅ Affichage des pages */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
