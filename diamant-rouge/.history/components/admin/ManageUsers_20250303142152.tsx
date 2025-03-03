// components/admin/ManageUsers.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AdminUser = {
  id: number;
  email: string;
  name?: string | null;
  role: string;
  createdAt: string;
};

export function ManageUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  // Fetch users from API endpoint
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch users.");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Open a user for editing
  function handleOpenUser(user: AdminUser) {
    setSelectedUser(user);
    setEditRole(user.role);
    setUpdateMessage("");
  }

  // Update the user's role
  async function handleUpdateUser() {
    if (!selectedUser) return;
    setLoading(true);
    setUpdateMessage("");
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateMessage(data.error || "Failed to update user.");
      } else {
        setUpdateMessage("User updated successfully");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, role: editRole } : u
          )
        );
      }
    } catch (err: any) {
      setUpdateMessage("Error updating user");
    } finally {
      setLoading(false);
    }
  }

  // Delete user
  async function handleDeleteUser(userId: number) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-serif text-brandGold mb-6">Manage Users</h1>

      {error && <p className="text-burgundy mb-4 font-semibold">{error}</p>}
      {loading && !selectedUser && <p className="text-platinumGray">Loading...</p>}

      <div className="overflow-x-auto">
        <table className="w-full bg-burgundy/10 text-richEbony rounded-lg shadow-luxury">
          <thead className="bg-burgundy/20 text-brandGold">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-platinumGray/30 hover:bg-burgundy/5 transition"
              >
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.name || "-"}</td>
                <td className="p-3 text-center">{user.role}</td>
                <td className="p-3">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleOpenUser(user)}
                    className="button-secondary mr-3"
                  >
                    View / Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="button-secondary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inline Edit Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-brandIvory p-6 rounded-lg shadow-2xl w-full max-w-lg">
              <h2 className="text-3xl font-serif text-brandGold mb-4">
                Edit User #{selectedUser.id}
              </h2>
              <p className="mb-2">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <div className="mt-4">
                <label className="block text-lg font-medium text-richEbony mb-2">
                  Role
                </label>
                <select
                  className="input-field w-full"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {updateMessage && (
                <p className="text-sm text-burgundy mt-3 font-semibold">
                  {updateMessage}
                </p>
              )}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpdateUser}
                  className="button-primary w-full md:w-auto"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update User"}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="button-secondary w-full md:w-auto"
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
