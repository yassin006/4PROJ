// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast"; // ✅ Ajout pour notifications

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-center" /> {/* ✅ Affichage des toasts */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
