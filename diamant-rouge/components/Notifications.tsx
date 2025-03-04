// components/Notifications.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch notifications.");
        }
        const data = await res.json();
        setNotifications(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchNotifications();
  }, []);

  // Mark notifications as read when the component mounts
  useEffect(() => {
    async function markAsRead() {
      try {
        await fetch("/api/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        // Optionally update local state to mark notifications as read
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true }))
        );
      } catch (err) {
        console.error("Error marking notifications as read:", err);
      }
    }
    markAsRead();
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-burgundy text-brandIvory p-4 mb-2 rounded shadow-lg"
          >
            <p className="text-sm">{notification.message}</p>
            <small className="block mt-1 text-platinumGray">
              {new Date(notification.createdAt).toLocaleString()}
            </small>
          </motion.div>
        ))}
      </AnimatePresence>
      {error && <p className="text-burgundy">{error}</p>}
    </div>
  );
}
