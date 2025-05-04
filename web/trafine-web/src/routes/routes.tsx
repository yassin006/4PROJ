// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import GoogleCallback from "../pages/GoogleCallback";
import MapView from "../pages/MapView";
import PrivateRoute from "../components/PrivateRoute";
import App from "../App"; // ✅ Layout global avec Navbar
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard"; // 🛠️ À créer

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />, // 🔒 Route protégée par auth
    children: [
      {
        path: "",
        element: <App />, // 🧩 Layout avec Navbar
        children: [
          { path: "", element: <Home /> },
          { path: "dashboard", element: <div>Dashboard (à créer)</div> },
          { path: "map", element: <MapView /> },
          { path: "profile", element: <Profile /> },
          { path: "admin", element: <AdminDashboard /> }, // 🔐 Admin uniquement
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/auth/google/callback", element: <GoogleCallback /> },
  { path: "*", element: <NotFound /> },
]);
