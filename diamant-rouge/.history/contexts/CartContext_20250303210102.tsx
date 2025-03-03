// contexts/CartContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
  id?: number;
  productId: number;
  variationId?: number;
  sku: string;
  name: string;
  price?: number; // if not stored, we'll get it from product
  quantity: number;
  image?: string;
  // Optionally, if you fetch the related product, you can include:
  product?: { images: string[]; basePrice: string; translations: any[] };
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: number, variationId?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);

  async function fetchCartFromServer() {
    if (!session?.user?.email) {
      setCart([]);
      return;
    }
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        console.error("Failed to fetch cart items.");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }

  useEffect(() => {
    fetchCartFromServer();
  }, [session]);

  async function addToCart(item: CartItem) {
    if (!session?.user?.email) {
      console.error("User not authenticated. Please log in to add items to the cart.");
      return;
    }
    const existingItem = cart.find(
      (p) => p.productId === item.productId && p.variationId === item.variationId
    );
    if (existingItem && existingItem.id) {
      try {
        const res = await fetch(`/api/cart?id=${existingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity: existingItem.quantity + item.quantity }),
        });
        if (res.ok) {
          await fetchCartFromServer();
        }
      } catch (err) {
        console.error("Error updating cart item:", err);
      }
    } else {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(item),
        });
        if (res.ok) {
          await fetchCartFromServer();
        }
      } catch (err) {
        console.error("Error adding cart item:", err);
      }
    }
  }

  async function removeFromCart(productId: number, variationId?: number) {
    const item = cart.find(
      (p) => p.productId === productId && p.variationId === variationId
    );
    if (!item || !item.id) return;
    try {
      const res = await fetch(`/api/cart?id=${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        await fetchCartFromServer();
      }
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  }

  async function clearCart() {
    try {
      const res = await fetch("/api/cart?clear=true", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCart([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  }

  async function refreshCart() {
    await fetchCartFromServer();
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
