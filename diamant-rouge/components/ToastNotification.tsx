import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Check, X } from "lucide-react";

export type ToastType = "cart" | "wishlist" | "success" | "error";

type ToastProps = {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
};

export default function ToastNotification({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  // Auto-dismiss the toast after duration
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
      case "cart":
        return <ShoppingCart size={18} className="text-brandIvory" />;
      case "wishlist":
        return <Heart size={18} className="text-brandIvory" />;
      case "success":
        return <Check size={18} className="text-brandIvory" />;
      case "error":
        return <X size={18} className="text-brandIvory" />;
      default:
        return null;
    }
  };

  // Get background color based on toast type
  const getBgColor = () => {
    switch (type) {
      case "cart":
        return "bg-brandGold";
      case "wishlist":
        return "bg-burgundy";
      case "success":
        return "bg-emerald-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-platinumGray";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 25 }}
          className={`fixed top-6 right-6 z-50 ${getBgColor()} text-brandIvory px-5 py-3 rounded-lg shadow-lg flex items-center max-w-sm`}
        >
          <div className="mr-3 flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-grow">
            <p className="text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-brandIvory/70 hover:text-brandIvory transition-colors"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 