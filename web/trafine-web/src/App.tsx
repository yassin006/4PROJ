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
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
