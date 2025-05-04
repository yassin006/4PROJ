// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  deleteUser,
  updateUserRole,
  validateIncident,
  deleteIncident,
} from "../api/AdminService";
import axios from "../api/axios"; // ✅ bon import
import toast from "react-hot-toast"; 
type User = {
  _id: string;
  email: string;
  role: string;
};

type Incident = {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  severity: string;
  source: string;
  image: string | null;
  location: {
    type: string;
    coordinates: [number, number];
  };
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const usersRes = await axios.get("/users");
      setUsers(usersRes.data);
    } catch (err: any) {
      setError("Erreur chargement utilisateurs : " + err.message);
    }

    try {
      const incidentsRes = await axios.get("/incidents"); // ✅ route corrigée
      setIncidents(incidentsRes.data);
    } catch (err: any) {
      console.warn("⚠️ Impossible de charger les incidents :", err.message);
      setIncidents([]); // pour ne pas planter le render
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Confirmer la suppression de l’utilisateur ?")) return;
  
    try {
      await deleteUser(id, { email: "placeholder", password: "placeholder" });
      toast.success("✅ Utilisateur supprimé avec succès !");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("❌ Échec de la suppression de l’utilisateur.");
    }
  };

  const handleValidateIncident = async (id: string) => {
    try {
      await validateIncident(id);
      toast.success("Incident validé avec succès !");
      fetchData();
    } catch (err) {
      toast.error("❌ Erreur lors de la validation.");
      console.error(err);
    }
  };

  const handleDeleteIncident = async (id: string) => {
    if (!window.confirm("Confirmer la suppression de l’incident ?")) return;
  
    try {
      await deleteIncident(id, { email: "placeholder", password: "placeholder" });
      toast.success("✅ Incident supprimé avec succès !");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("❌ Échec de la suppression de l’incident.");
    }
  };
  
  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUserRole(id, role);
      toast.success(`✅ Rôle mis à jour : ${role}`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("❌ Impossible de modifier le rôle.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Espace Admin</h1>
      {error && <div className="text-red-600 mb-4">❌ {error}</div>}

      {/* Utilisateurs */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <span>{u.email} ({u.role})</span>
              <div className="space-x-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Incidents */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Incidents</h2>
        {incidents.length === 0 ? (
          <p className="text-gray-500">Aucun incident à afficher.</p>
        ) : (
          <ul className="space-y-2">
  {incidents.map((i) => (
    <li
      key={i._id}
      className="border p-3 rounded flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        {i.image ? (
          <img
            src={`http://localhost:3000/uploads/incidents/${i.image}`}
            alt="Incident"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
            Pas d'image
          </div>
        )}
        <div>
          <h3 className="font-semibold">{i.title}</h3>
          <p className="text-sm text-gray-500">{i.type} – {i.status}</p>
        </div>
      </div>

      <div className="space-x-2">
        {i.status === "pending" && (
          <button
            onClick={() => handleValidateIncident(i._id)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Valider
          </button>
        )}
        <button
          onClick={() => handleDeleteIncident(i._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Supprimer
        </button>
      </div>
    </li>
  ))}
</ul>

        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
