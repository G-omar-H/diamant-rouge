import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

type CartItem = {
    productId: number;
    variationId?: number;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    image?: string; // ✅ Ensure image is stored
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: number, variationId?: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const userEmail = session?.user?.email || "guest";
    const userKey = `cart-${userEmail}`;

    const [cart, setCart] = useState<CartItem[]>([]);

    // ✅ Load cart from localStorage when user logs in/out
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem(userKey);
            setCart(savedCart ? JSON.parse(savedCart) : []);
        }
    }, [userKey]);

    // ✅ Save cart whenever it updates
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(userKey, JSON.stringify(cart));
        }
    }, [cart, userKey]);

    function addToCart(item: CartItem) {
        setCart((prev) => {
            const existingIndex = prev.findIndex(
                (p) => p.productId === item.productId && p.variationId === item.variationId
            );
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += item.quantity;
                return updated;
            } else {
                return [...prev, item];
            }
        });
    }

    function removeFromCart(productId: number, variationId?: number) {
        setCart((prev) =>
            prev.filter((p) => p.productId !== productId || p.variationId !== variationId)
        );
    }

    function clearCart() {
        setCart([]);
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
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
