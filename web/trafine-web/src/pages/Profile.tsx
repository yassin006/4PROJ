import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteAccount,
  getUserNotifications,
} from "../api/UserService";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import backgroundImg from "../assets/mercedes-8342911_1920.jpg"; // ✅ image locale
import logo from "../assets/logoo.png";
import { Link } from "react-router-dom";


type Notification = {
  _id: string;
  message: string;
  location?: {
    coordinates: [number, number];
  };
  createdAt: string;
  read: boolean;
};

const Profile = () => {
  const { logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProfile();
        setEmail(data.email);
        setProfileImage(data.profileImage);
        const notifs = await getUserNotifications();
        setNotifications(notifs);
      } catch (err) {
        toast.error("Erreur lors du chargement du profil");
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: { email: string; password?: string } = { email };
      if (password && password.length >= 6) {
        payload.password = password;
      }
      await updateProfile(payload);
      toast.success("✅ Profil mis à jour !");
      setPassword("");
    } catch (err: any) {
      const message =
        err.response?.data?.message?.[0] ||
        err.response?.data?.message ||
        "❌ Erreur lors de la mise à jour";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadProfileImage(file);
      setProfileImage(url.split("/").pop() || null);
      toast.success("📸 Image mise à jour !");
    } catch (err) {
      toast.error("❌ Erreur en envoyant l'image");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ Supprimer votre compte ? Cette action est irréversible.")) return;
    try {
      await deleteAccount();
      toast.success("🗑️ Compte supprimé");
      logout();
    } catch (err: any) {
      toast.error("❌ Erreur lors de la suppression");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/40">
      <div className="flex justify-center mb-6">
  <Link to="/">
    <img
      src={logo}
      alt="Logo"
      className="h-12 md:h-16 drop-shadow hover:scale-105 transition duration-300 cursor-pointer"
    />
  </Link>
</div>



          <div className="flex justify-center mb-6">
            {profileImage ? (
              <img
                src={`http://localhost:3000/uploads/${profileImage}`}
                alt="Profil"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-3xl shadow-inner">
                👤
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Adresse e-mail</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Photo de profil</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                💾 Sauvegarder
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                ❌ Supprimer
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-3">📍 Notifications proches</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500">Aucune notification pour le moment.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    className="border border-yellow-300 p-4 rounded-lg bg-yellow-50 shadow-sm"
                  >
                    <p className="text-gray-800">{notif.message}</p>
                    <small className="text-gray-500">
                      {new Date(notif.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
