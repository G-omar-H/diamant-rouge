import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiUsers, FiFilter, FiX, FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin, FiAlertCircle, FiCheck, FiShoppingBag, FiHeart, FiShoppingCart } from "react-icons/fi";

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
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | "all">("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors du chargement des utilisateurs");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
        setUpdateMessage(data.error || "Erreur lors de la mise à jour de l'utilisateur");
      } else {
        setUpdateMessage("Utilisateur mis à jour avec succès");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, ...formData } : u
          )
        );
      }
    } catch (err: any) {
      setUpdateMessage("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la suppression de l'utilisateur");
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-brandGold">Gestion des Utilisateurs</h1>
          <p className="text-platinumGray mt-1">Gérez les comptes clients et administrateurs</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-burgundy/10 border border-burgundy/20 text-burgundy px-4 py-3 rounded-md flex items-center gap-2">
          <FiAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg p-4 shadow-luxury">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-platinumGray" size={18} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold focus:border-brandGold bg-white/70"
            />
          </div>
          
          {/* Role filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value === "all" ? "all" : e.target.value)}
              className="px-4 py-2 w-full border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
            >
              <option value="all">Tous les rôles</option>
              <option value="customer">Clients</option>
              <option value="admin">Administrateurs</option>
            </select>
          </div>
          
          {/* Reset filters */}
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-platinumGray/30 text-platinumGray hover:text-richEbony hover:border-platinumGray transition-colors duration-200 rounded-md flex items-center gap-2"
            >
              <FiX size={18} />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading && !selectedUser ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-platinumGray">Chargement des utilisateurs...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-platinumGray text-lg">Aucun utilisateur trouvé</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-brandGold border border-brandGold/30 hover:bg-brandGold/10 rounded-md transition-colors duration-200"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-richEbony/5 text-richEbony">
                  <tr>
                    <th className="p-4 text-left font-serif">ID</th>
                    <th className="p-4 text-left font-serif">Email</th>
                    <th className="p-4 text-left font-serif">Nom</th>
                    <th className="p-4 text-center font-serif">Rôle</th>
                    <th className="p-4 text-left font-serif">Téléphone</th>
                    <th className="p-4 text-left font-serif">Adresse</th>
                    <th className="p-4 text-center font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-platinumGray/10 hover:bg-brandGold/5 transition-colors duration-150"
                    >
                      <td className="p-4 font-mono text-sm">{user.id}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 font-medium">{user.name || "-"}</td>
                      <td className="p-4 text-center">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brandGold/20 text-brandGold border border-brandGold/30">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-platinumGray/10 text-platinumGray">
                            Client
                          </span>
                        )}
                      </td>
                      <td className="p-4">{user.phoneNumber || "-"}</td>
                      <td className="p-4 max-w-xs truncate">
                        {user.address ? `${user.address}${user.city ? `, ${user.city}` : ""}` : "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => openEditModal(user)}
                            aria-label="Modifier l'utilisateur"
                            className="p-2 text-brandGold hover:bg-brandGold/10 rounded-full transition-colors duration-200"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(user.id)}
                            aria-label="Supprimer l'utilisateur"
                            className="p-2 text-burgundy hover:bg-burgundy/10 rounded-full transition-colors duration-200"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Inline Edit Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-richEbony/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury"
            >
              <div className="flex justify-between items-center border-b border-brandGold/10 pb-4 mb-6">
                <h2 className="text-xl font-serif text-brandGold">Détails de l'Utilisateur #{selectedUser.id}</h2>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-platinumGray hover:text-richEbony p-1"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              {/* User details form */}
              <div className="space-y-6">
                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-richEbony mb-2 flex items-center">
                    <FiMail className="mr-2" size={16} />
                    Email (non modifiable)
                  </label>
                  <p className="p-3 bg-platinumGray/10 rounded-md">{selectedUser.email}</p>
                </div>
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-richEbony mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                      placeholder="Nom de l'utilisateur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-richEbony mb-2">
                      Rôle
                    </label>
                    <select
                      name="role"
                      value={formData.role || "customer"}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md bg-white"
                    >
                      <option value="customer">Client</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                </div>
                
                {/* Contact */}
                <div>
                  <h3 className="font-medium text-lg text-brandGold mb-3 flex items-center">
                    <FiPhone className="mr-2" size={18} />
                    Coordonnées
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-richEbony mb-2">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                        placeholder="Téléphone"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div>
                  <h3 className="font-medium text-lg text-brandGold mb-3 flex items-center">
                    <FiMapPin className="mr-2" size={18} />
                    Adresse
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-richEbony mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                        placeholder="Adresse"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-richEbony mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ""}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                          placeholder="Ville"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-richEbony mb-2">
                          Code Postal
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode || ""}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                          placeholder="Code postal"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-richEbony mb-2">
                        Pays
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md"
                        placeholder="Pays"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Activity Summary */}
                <div className="bg-brandGold/10 p-4 rounded-lg">
                  <h3 className="font-medium text-lg text-brandGold mb-3">Résumé d'Activité</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center flex flex-col items-center">
                      <FiShoppingBag size={24} className="text-richEbony mb-2" />
                      <div className="text-2xl font-bold text-richEbony">
                        {selectedUser.orders ? selectedUser.orders.length : 0}
                      </div>
                      <div className="text-sm text-platinumGray">Commandes</div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <FiHeart size={24} className="text-richEbony mb-2" />
                      <div className="text-2xl font-bold text-richEbony">
                        {selectedUser.wishlists ? selectedUser.wishlists.length : 0}
                      </div>
                      <div className="text-sm text-platinumGray">Favoris</div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <FiShoppingCart size={24} className="text-richEbony mb-2" />
                      <div className="text-2xl font-bold text-richEbony">
                        {selectedUser.cartItems ? selectedUser.cartItems.length : 0}
                      </div>
                      <div className="text-sm text-platinumGray">Articles au panier</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Success/error message */}
              {updateMessage && (
                <div className={`mt-4 p-3 rounded-md ${updateMessage.includes("succès") ? "bg-emerald-50 text-emerald-800" : "bg-burgundy/10 text-burgundy"} flex items-center gap-2`}>
                  {updateMessage.includes("succès") ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
                  <span>{updateMessage}</span>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-platinumGray hover:text-richEbony transition-colors duration-200"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle"
                  disabled={loading}
                >
                  {loading ? "Mise à jour..." : "Enregistrer les Modifications"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-richEbony/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-luxury"
            >
              <div className="flex items-center mb-4 text-burgundy">
                <FiTrash2 size={24} className="mr-3" />
                <h2 className="text-xl font-serif">Confirmer la Suppression</h2>
              </div>
              
              <p className="text-richEbony mb-6">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera également toutes ses données associées.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-platinumGray hover:text-richEbony transition-colors duration-200"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm !== null) {
                      handleDeleteUser(showDeleteConfirm);
                      setShowDeleteConfirm(null);
                    }
                  }}
                  className="px-4 py-2 bg-burgundy text-white hover:bg-burgundy/80 transition-colors duration-300 rounded-md shadow-subtle"
                  disabled={loading}
                >
                  {loading ? "Suppression..." : "Confirmer la Suppression"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}