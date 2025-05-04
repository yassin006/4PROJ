// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Protection par défaut
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Restriction pour les routes admin
  if (location.pathname.startsWith("/admin") && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
