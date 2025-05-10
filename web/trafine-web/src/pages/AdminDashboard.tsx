import React, { useEffect, useState } from "react";
import {
  deleteUser,
  updateUserRole,
  validateIncident,
  deleteIncident,
} from "../api/AdminService";
import axios from "../api/axios";
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
      const incidentsRes = await axios.get("/incidents");
      setIncidents(incidentsRes.data);
    } catch (err: any) {
      console.warn("Impossible de charger les incidents :", err.message);
      setIncidents([]);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">🛠️ Tableau de bord Admin</h1>

      {error && <div className="text-red-600 mb-4">❌ {error}</div>}

      <section className="mb-10 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">👥 Utilisateurs</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">Aucun utilisateur pour le moment.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((u) => (
              <li key={u._id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">{u.email}</p>
                  <p className="text-sm text-gray-500">Rôle : {u.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">🚧 Incidents</h2>
        {incidents.length === 0 ? (
          <p className="text-gray-500">Aucun incident à afficher.</p>
        ) : (
          <ul className="space-y-4">
            {incidents.map((i) => (
              <li
                key={i._id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  {i.image ? (
                    <img
                      src={`http://localhost:3000/uploads/incidents/${i.image}`}
                      alt="Incident"
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500">
                      Pas d'image
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{i.title}</h3>
                    <p className="text-sm text-gray-500">{i.type} • {i.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {i.status === "pending" && (
                    <button
                      onClick={() => handleValidateIncident(i._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Valider
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteIncident(i._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
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
