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
  updateQuantity: (productId: number, variationId: number | undefined, quantity: number) => Promise<void>;
  isCartLoading: boolean;
};

const LOCAL_STORAGE_CART_KEY = 'diamant_rouge_guest_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const isAuthenticated = !!session?.user?.email;
  const isSessionLoading = status === 'loading';

  // Load cart from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated && !isSessionLoading) {
      try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
        setIsCartLoading(false);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setIsCartLoading(false);
      }
    }
  }, [isAuthenticated, isSessionLoading]);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated && !isSessionLoading && !isCartLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cart, isAuthenticated, isSessionLoading, isCartLoading]);

  // Sync local cart with server when user logs in
  useEffect(() => {
    const syncCartToServer = async () => {
      if (isAuthenticated && !isSessionLoading) {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (storedCart) {
          const localCart: CartItem[] = JSON.parse(storedCart);
          
          // Only sync if there are items in the local cart
          if (localCart.length > 0) {
            setIsCartLoading(true);
            
            // Add each local cart item to the server
            for (const item of localCart) {
              try {
                const cartData = {
                  productId: item.productId,
                  variationId: item.variationId,
                  quantity: item.quantity
                };
                
                await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify(cartData),
                });
              } catch (error) {
                console.error("Error syncing cart item to server:", error);
              }
            }
            
            // Clear local storage cart after sync
            localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
            
            // Fetch the updated cart from server
            await fetchCartFromServer();
          } else {
            // If local cart is empty, just fetch from server
            await fetchCartFromServer();
          }
        } else {
          // No local cart, just fetch from server
          await fetchCartFromServer();
        }
      }
    };

    syncCartToServer();
  }, [isAuthenticated, isSessionLoading]);

  async function fetchCartFromServer() {
    setIsCartLoading(true);
    
    if (!isAuthenticated) {
      setIsCartLoading(false);
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
    } finally {
      setIsCartLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && !isSessionLoading) {
      fetchCartFromServer();
    }
  }, [isAuthenticated, isSessionLoading]);

  async function addToCart(item: CartItem) {
    // Handle guest cart (not authenticated)
    if (!isAuthenticated) {
      const existingItemIndex = cart.findIndex(
        (p) => p.productId === item.productId && p.variationId === item.variationId
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item in local cart
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        setCart(updatedCart);
      } else {
        // Add new item to local cart
        setCart([...cart, item]);
      }
      return;
    }
    
    // Handle authenticated cart (server-side)
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
        // Only send the necessary fields to the server
        const cartData = {
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity
        };
        
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(cartData),
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
    // Handle guest cart (not authenticated)
    if (!isAuthenticated) {
      const updatedCart = cart.filter(
        (p) => !(p.productId === productId && p.variationId === variationId)
      );
      setCart(updatedCart);
      return;
    }
    
    // Handle authenticated cart (server-side)
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
    // Handle guest cart (not authenticated)
    if (!isAuthenticated) {
      setCart([]);
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      return;
    }
    
    // Handle authenticated cart (server-side)
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
    if (isAuthenticated) {
      await fetchCartFromServer();
    } else {
      // For guest cart, we might refresh from localStorage
      try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Error refreshing cart from localStorage:", error);
      }
    }
  }

  // Update quantity function with guest cart support
  async function updateQuantity(productId: number, variationId: number | undefined, quantity: number) {
    if (quantity < 1) return; // Prevent negative quantities
    
    // Handle guest cart (not authenticated)
    if (!isAuthenticated) {
      const updatedCart = cart.map(item => {
        if (item.productId === productId && item.variationId === variationId) {
          return { ...item, quantity };
        }
        return item;
      });
      setCart(updatedCart);
      return;
    }
    
    // Handle authenticated cart (server-side)
    const item = cart.find(
      (p) => p.productId === productId && p.variationId === variationId
    );

    if (!item || !item.id) {
      console.error("Item not found in cart");
      return;
    }

    try {
      // Send update request to the API
      const res = await fetch(`/api/cart?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: quantity }),
      });

      if (res.ok) {
        // Refresh cart data from server
        await fetchCartFromServer();
      } else {
        console.error("Failed to update item quantity");
      }
    } catch (err) {
      console.error("Error updating item quantity:", err);
    }
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      refreshCart,
      updateQuantity,
      isCartLoading
    }}>
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