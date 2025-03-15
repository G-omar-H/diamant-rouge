import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiX, FiAlertCircle, FiEye, FiClock, FiTruck, FiCheck, FiXCircle } from "react-icons/fi";
import Image from "next/image";

type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    sku: string;
    images: string[];
    translations: {
      language: string;
      name: string;
    }[];
  };
};

type AdminOrder = {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  user: {
    email: string;
  } | null;
  shippingAddress?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  orderItems?: OrderItem[];
  customerName?: string | null;
  phoneNumber?: string | null;
};

export function ManageOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Success message auto-dismiss
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch orders from the API endpoint
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/orders");
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors du chargement des commandes.");
      }
      
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // When an order is selected for editing, pre-fill the status field
  function handleOpenOrder(order: AdminOrder) {
    setSelectedOrder(order);
    setOrderStatus(order.status);
    setError("");
    setSuccessMessage("");
  }

  // Update order status
  async function handleStatusUpdate() {
    if (!selectedOrder) return;
    
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: orderStatus }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Échec de la mise à jour de la commande.");
      }
      
      // Update local orders list with new status
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: orderStatus } : o
        )
      );
      
      setSuccessMessage("Statut de la commande mis à jour avec succès");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Get status badge with color coding
  function getStatusBadge(status: string) {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <FiClock className="mr-1" size={12} />
            En attente
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <FiCheck className="mr-1" size={12} />
            Confirmée
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
            <FiTruck className="mr-1" size={12} />
            Expédiée
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <FiCheck className="mr-1" size={12} />
            Livrée
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <FiXCircle className="mr-1" size={12} />
            Annulée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  }

  // Filter orders by status
  const filteredOrders = orders.filter(order => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  // Format date for display
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-brandGold">Gestion des Commandes</h1>
          <p className="text-platinumGray mt-1">Suivez et gérez les commandes de vos clients</p>
        </div>
        <div className="flex items-center">
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-platinumGray/30 rounded-md focus:ring-1 focus:ring-brandGold bg-white/70"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmées</option>
              <option value="SHIPPED">Expédiées</option>
              <option value="DELIVERED">Livrées</option>
              <option value="CANCELLED">Annulées</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="bg-burgundy/10 border border-burgundy/20 text-burgundy px-4 py-3 rounded-md flex items-center gap-2">
          <FiAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md flex items-center gap-2">
          <FiCheck size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-brandGold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-platinumGray">Chargement des commandes...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-sm border border-brandGold/20 rounded-lg overflow-hidden shadow-luxury">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-platinumGray text-lg">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-richEbony/5 text-richEbony">
                  <tr>
                    <th className="p-4 text-left font-serif">N° Commande</th>
                    <th className="p-4 text-left font-serif">Client</th>
                    <th className="p-4 text-center font-serif">Statut</th>
                    <th className="p-4 text-right font-serif">Total</th>
                    <th className="p-4 text-center font-serif">Date</th>
                    <th className="p-4 text-center font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-platinumGray/10 hover:bg-brandGold/5 transition-colors duration-150"
                    >
                      <td className="p-4 font-medium">#{order.id}</td>
                      <td className="p-4">
                        {order.customerName || order.user?.email || "Client anonyme"}
                      </td>
                      <td className="p-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {parseFloat(order.totalAmount).toLocaleString('fr-FR')} MAD
                      </td>
                      <td className="p-4 text-center text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleOpenOrder(order)}
                            aria-label="Voir les détails de la commande"
                            className="p-2 text-brandGold hover:bg-brandGold/10 rounded-md transition-colors duration-200 flex items-center gap-1"
                          >
                            <FiEye size={18} />
                            <span>Détails</span>
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

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
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
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-luxury"
            >
              <div className="flex justify-between items-center border-b border-brandGold/10 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-serif text-brandGold">Commande #{selectedOrder.id}</h2>
                  <p className="text-platinumGray text-sm">
                    Passée le {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-platinumGray hover:text-richEbony p-1"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-richEbony">Information client</h3>
                  <p className="text-richEbony">
                    <span className="font-medium">Client:</span> {selectedOrder.customerName || "Non spécifié"}
                  </p>
                  <p className="text-richEbony">
                    <span className="font-medium">Email:</span> {selectedOrder.user?.email || "Non spécifié"}
                  </p>
                  <p className="text-richEbony">
                    <span className="font-medium">Téléphone:</span> {selectedOrder.phoneNumber || "Non spécifié"}
                  </p>
                </div>
                
                {/* Shipping Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-richEbony">Adresse de livraison</h3>
                  {selectedOrder.shippingAddress ? (
                    <>
                      <p className="text-richEbony">{selectedOrder.shippingAddress}</p>
                      <p className="text-richEbony">
                        {selectedOrder.postalCode} {selectedOrder.city}
                      </p>
                      <p className="text-richEbony">{selectedOrder.country}</p>
                    </>
                  ) : (
                    <p className="text-platinumGray">Aucune adresse de livraison spécifiée</p>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-richEbony border-b border-platinumGray/10 pb-2 mb-4">
                  Produits commandés
                </h3>
                
                <div className="space-y-4">
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item) => {
                      const productName = item.product.translations?.[0]?.name || item.product.sku;
                      return (
                        <div key={item.id} className="flex items-center border-b border-platinumGray/10 pb-4">
                          <div className="w-16 h-16 relative rounded-md overflow-hidden shadow-subtle mr-4">
                            {item.product.images && item.product.images.length > 0 ? (
                              <Image
                                src={item.product.images[0]}
                                alt={productName}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full bg-platinumGray/10 flex items-center justify-center">
                                <FiPackage className="text-platinumGray/40" size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-richEbony">{productName}</h4>
                            <p className="text-sm text-platinumGray">Référence: {item.product.sku}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-richEbony">
                              {parseFloat(item.unitPrice).toLocaleString('fr-FR')} MAD
                            </div>
                            <div className="text-sm text-platinumGray">
                              Qté: {item.quantity}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-platinumGray">Les détails des produits ne sont pas disponibles</p>
                  )}
                </div>
                
                {/* Order Total */}
                <div className="flex justify-end mt-4 pt-4 border-t border-platinumGray/10">
                  <div className="text-right">
                    <span className="text-lg font-medium text-richEbony">Total:</span>
                    <span className="text-lg font-bold text-brandGold ml-2">
                      {parseFloat(selectedOrder.totalAmount).toLocaleString('fr-FR')} MAD
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Update */}
              <div className="border-t border-platinumGray/10 pt-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-richEbony mb-2">
                      Mettre à jour le statut
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="w-full p-3 border border-platinumGray/30 focus:ring-2 focus:ring-brandGold/50 focus:border-brandGold rounded-md bg-white"
                      disabled={isSubmitting}
                    >
                      <option value="PENDING">En attente</option>
                      <option value="CONFIRMED">Confirmée</option>
                      <option value="SHIPPED">Expédiée</option>
                      <option value="DELIVERED">Livrée</option>
                      <option value="CANCELLED">Annulée</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 md:mt-6">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2 text-platinumGray hover:text-richEbony transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleStatusUpdate}
                      className="px-4 py-2 bg-brandGold/90 text-richEbony hover:bg-brandGold transition-colors duration-300 rounded-md shadow-subtle"
                      disabled={isSubmitting || orderStatus === selectedOrder.status}
                    >
                      {isSubmitting ? "Mise à jour..." : "Mettre à jour le statut"}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <p className="mt-3 text-burgundy text-sm">{error}</p>
                )}
                
                {successMessage && (
                  <p className="mt-3 text-emerald-600 text-sm">{successMessage}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}