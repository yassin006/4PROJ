// src/components/UserTable.tsx
import React, { useEffect, useState } from "react";
import { deleteUser, updateUserRole } from "../../api/AdminService";
import axios from "../../api/axios";
import toast from "react-hot-toast";

type User = {
  _id: string;
  email: string;
  role: string;
};

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Erreur chargement utilisateurs");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    const email = prompt("Confirmez votre email admin :");
    const password = prompt("Confirmez votre mot de passe :");
    if (!email || !password) return;

    try {
      await deleteUser(id, { email, password });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("Utilisateur supprimé !");
    } catch {
      toast.error("Erreur suppression utilisateur");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateUserRole(id, newRole);
      toast.success("Rôle mis à jour");
      fetchUsers();
    } catch {
      toast.error("Erreur mise à jour rôle");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">👥 Utilisateurs</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Email</th>
            <th className="p-2">Rôle</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(u._id)}
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

export default UserTable;
