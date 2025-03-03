// components/admin/ManageUsers.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AdminUser = {
  id: number;
  email: string;
  name?: string | null;
  role: string;
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  createdAt: string;
  orders?: { id: number; totalAmount: string; status: string; createdAt: string }[];
  wishlists?: { id: number; productId: number }[];
  cartItems?: {
    id: number;
    quantity: number;
    product: {
      sku: string;
      basePrice: string;
      images: string[];
      translations: { language: string; name: string }[];
    };
  }[];
};

export function ManageUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for the inline edit modal
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<Partial<AdminUser>>({});
  const [updateMessage, setUpdateMessage] = useState("");

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

  function openEditModal(user: AdminUser) {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      role: user.role,
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      country: user.country || "",
    });
    setUpdateMessage("");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdateUser() {
    if (!selectedUser) return;
    setLoading(true);
    setUpdateMessage("");
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateMessage(data.error || "Failed to update user.");
      } else {
        setUpdateMessage("User updated successfully");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, ...formData } : u
          )
        );
      }
    } catch (err: any) {
      setUpdateMessage("Error updating user");
    } finally {
      setLoading(false);
    }
  }

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

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-burgundy/10 text-richEbony rounded-lg shadow-luxury">
          <thead className="bg-burgundy/20 text-brandGold">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
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
                <td className="p-3">{user.phoneNumber || "-"}</td>
                <td className="p-3">
                  {user.address || "-"}
                  {user.city ? `, ${user.city}` : ""}
                  {user.postalCode ? `, ${user.postalCode}` : ""}
                  {user.country ? `, ${user.country}` : ""}
                </td>
                <td className="p-3">{new Date(user.createdAt).toLocaleString()}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openEditModal(user)}
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
            <div className="bg-brandIvory p-6 rounded-lg shadow-2xl w-full max-w-3xl">
              <h2 className="text-3xl font-serif text-brandGold mb-4">
                View / Edit User #{selectedUser.id}
              </h2>

              {/* Display full user details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Name:</strong>{" "}
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </p>
                  <p>
                    <strong>Role:</strong>{" "}
                    <select
                      name="role"
                      value={formData.role || ""}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Address:</strong>{" "}
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </p>
                  <p>
                    <strong>City:</strong>{" "}
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </p>
                  <p>
                    <strong>Postal Code:</strong>{" "}
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode || ""}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </p>
                  <p>
                    <strong>Country:</strong>{" "}
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      className="input-field w-full"
                    />
                  </p>
                </div>
              </div>

              {/* Display Orders, Wishlists, and Cart Items summary */}
              <div className="mt-6 border-t border-platinumGray pt-4">
                <h3 className="text-2xl font-semibold text-brandGold mb-2">
                  Orders, Wishlists & Cart
                </h3>
                <p className="text-platinumGray">
                  <strong>Orders:</strong>{" "}
                  {selectedUser.orders ? selectedUser.orders.length : 0}
                </p>
                <p className="text-platinumGray">
                  <strong>Wishlist Items:</strong>{" "}
                  {selectedUser.wishlists ? selectedUser.wishlists.length : 0}
                </p>
                <p className="text-platinumGray">
                  <strong>Cart Items:</strong>{" "}
                  {selectedUser.cartItems ? selectedUser.cartItems.length : 0}
                </p>
                {/* Optionally add links for more details */}
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
