// contexts/CartContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
  id?: number; // ID returned from persistent storage
  productId: number;
  variationId?: number;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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

  // Fetch persistent cart from the server
  async function fetchCartFromServer() {
    if (!session?.user?.email) {
      setCart([]);
      return;
    }
    try {
      const res = await fetch("/api/cart");
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

  // Load cart when session changes
  useEffect(() => {
    fetchCartFromServer();
  }, [session]);

  // Add item to cart – update quantity if already exists, else create new
  async function addToCart(item: CartItem) {
    if (!session?.user?.email) {
        console.error("User not authenticated. Please log in to add items to the cart.");
        return;
      }
    const existingItem = cart.find(
      (p) => p.productId === item.productId && p.variationId === item.variationId
    );
    if (existingItem && existingItem.id) {
      // Update quantity via PUT
      try {
        const res = await fetch(`/api/cart/${existingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: existingItem.quantity + item.quantity }),
        });
        if (res.ok) {
          await fetchCartFromServer();
        }
      } catch (err) {
        console.error("Error updating cart item:", err);
      }
    } else {
      // Create new cart item via POST
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  // Remove an item from cart
  async function removeFromCart(productId: number, variationId?: number) {
    const item = cart.find(
      (p) => p.productId === productId && p.variationId === variationId
    );
    if (!item || !item.id) return;
    try {
      const res = await fetch(`/api/cart/${item.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCartFromServer();
      }
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  }

  // Clear all items in the cart
  async function clearCart() {
    try {
      const res = await fetch("/api/cart/clear", {
        method: "DELETE",
      });
      if (res.ok) {
        setCart([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  }

  // Manual refresh (if needed)
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
