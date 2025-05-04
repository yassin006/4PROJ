import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadProfileImage, deleteAccount } from "../api/UserService";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProfile();
        setEmail(data.email);
        setProfileImage(data.profileImage);
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
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>

      {profileImage && (
        <img
          src={`http://localhost:3000/uploads/${profileImage}`}
          alt="Profil"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Adresse e-mail</label>
        <input
          type="email"
          className="border p-2 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Nouveau mot de passe</label>
        <input
          type="password"
          className="border p-2 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Photo de profil</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mr-3"
      >
        💾 Sauvegarder
      </button>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        ❌ Supprimer mon compte
      </button>
    </div>
  );
};

export default Profile;
