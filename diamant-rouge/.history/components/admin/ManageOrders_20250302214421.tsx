// components/admin/ManageOrders.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    orderItems?: any[];
};

export function ManageOrders() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");

    // Fetch orders from the API endpoint
    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/admin/orders");
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to fetch orders.");
                }
                const data = await res.json();
                setOrders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    // When an order is selected for editing, pre-fill the status field
    function handleOpenOrder(order: AdminOrder) {
        setSelectedOrder(order);
        setOrderStatus(order.status);
        setUpdateMessage("");
    }

    // Update order status using the PUT API route at /api/admin/orders/[id]
    async function handleStatusUpdate() {
        if (!selectedOrder) return;
        setLoading(true);
        setUpdateMessage("");
        try {
            const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: orderStatus }),
            });
            const data = await res.json();
            if (!res.ok) {
                setUpdateMessage(data.error || "Failed to update order.");
            } else {
                setUpdateMessage("Order updated successfully");
                // Update local orders list with new status
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === selectedOrder.id ? { ...o, status: orderStatus } : o
                    )
                );
            }
        } catch (error) {
            setUpdateMessage("Error updating order");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-serif text-brandGold mb-6">
                Gérer les Commandes
            </h1>

            {error && <p className="text-burgundy mb-4 font-semibold">{error}</p>}
            {loading && !selectedOrder && <p className="text-platinumGray">Loading...</p>}

            <div className="overflow-x-auto">
                <table className="w-full bg-burgundy/10 text-richEbony rounded-lg shadow-luxury">
                    <thead className="bg-burgundy/20 text-brandGold">
                    <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Total (€)</th>
                        <th className="p-3">Created</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.id}
                            className="border-b border-platinumGray/30 hover:bg-burgundy/5 transition"
                        >
                            <td className="p-3">{order.id}</td>
                            <td className="p-3">{order.user?.email || "Guest"}</td>
                            <td className="p-3 text-center">{order.status}</td>
                            <td className="p-3 text-center">€{order.totalAmount}</td>
                            <td className="p-3">
                                {new Date(order.createdAt).toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => handleOpenOrder(order)}
                                    className="button-secondary"
                                >
                                    View / Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Inline Order Edit Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-brandIvory p-6 rounded-lg shadow-2xl w-full max-w-lg">
                            <h2 className="text-3xl font-serif text-brandGold mb-4">
                                Éditer Commande #{selectedOrder.id}
                            </h2>
                            <p className="mb-2">
                                <strong>User:</strong> {selectedOrder.user?.email || "Guest"}
                            </p>
                            <p className="mb-2">
                                <strong>Total:</strong> €{selectedOrder.totalAmount}
                            </p>
                            {selectedOrder.shippingAddress && (
                                <p className="mb-2">
                                    <strong>Address:</strong> {selectedOrder.shippingAddress},{" "}
                                    {selectedOrder.city}, {selectedOrder.postalCode},{" "}
                                    {selectedOrder.country}
                                </p>
                            )}
                            <div className="mt-4">
                                <label className="block text-lg font-medium text-richEbony mb-2">
                                    Update Status
                                </label>
                                <select
                                    className="input-field w-full"
                                    value={orderStatus}
                                    onChange={(e) => setOrderStatus(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            {updateMessage && (
                                <p className="text-sm text-burgundy mt-3 font-semibold">
                                    {updateMessage}
                                </p>
                            )}
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleStatusUpdate}
                                    className="button-primary w-full md:w-auto"
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update Status"}
                                </button>
                                <button
                                    onClick={() => setSelectedOrder(null)}
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
