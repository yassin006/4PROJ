// src/components/IncidentTable.tsx
import React, { useEffect, useState } from "react";
import { validateIncident, deleteIncident } from "../../api/AdminService";
import axios from "../../api/axios";
import toast from "react-hot-toast";

type Incident = {
  _id: string;
  type: string;
  status: string;
  location: {
    coordinates: [number, number];
  };
};

const IncidentTable = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const fetchIncidents = async () => {
    try {
      const res = await axios.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      toast.error("Erreur chargement incidents");
    }
  };

  const handleValidate = async (id: string) => {
    try {
      await validateIncident(id);
      toast.success("Incident validé");
      setIncidents((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status: "validated" } : i))
      );
    } catch {
      toast.error("Erreur validation");
    }
  };

  const handleDelete = async (id: string) => {
    const email = prompt("Confirmez votre email admin :");
    const password = prompt("Confirmez votre mot de passe :");
    if (!email || !password) return;

    try {
      await deleteIncident(id, { email, password });
      toast.success("Incident supprimé");
      setIncidents((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error("Erreur suppression");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">🚨 Incidents</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Type</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i._id} className="border-t">
              <td className="p-2">{i.type}</td>
              <td className="p-2">{i.status}</td>
              <td className="p-2 space-x-2">
                {i.status !== "validated" && (
                  <button
                    onClick={() => handleValidate(i._id)}
                    className="text-green-600 hover:underline"
                  >
                    Valider
                  </button>
                )}
                <button
                  onClick={() => handleDelete(i._id)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;
