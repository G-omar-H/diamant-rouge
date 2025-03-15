import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type WishlistItem = {
    productId: number;
};

type WishlistContextType = {
    wishlist: WishlistItem[];
    addToWishlist: (productId: number) => void;
    removeFromWishlist: (productId: number) => void;
    fetchWishlist: () => void;
    isWishlistOpen: boolean;
    toggleWishlist: () => void;
    closeWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    useEffect(() => {
        fetchWishlist();
    }, []);

    async function fetchWishlist() {
        try {
            const res = await fetch("/api/wishlist", {
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) setWishlist(data);
        } catch (error) {
            console.error("❌ Failed to fetch wishlist:", error);
        }
    }

    async function addToWishlist(productId: number) {
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) fetchWishlist();
        } catch (error) {
            console.error("❌ Failed to add to wishlist:", error);
        }
    }

    async function removeFromWishlist(productId: number) {
        try {
            const res = await fetch("/api/wishlist", {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) fetchWishlist();
        } catch (error) {
            console.error("❌ Failed to remove from wishlist:", error);
        }
    }
    
    function toggleWishlist() {
        setIsWishlistOpen(prev => !prev);
    }
    
    function closeWishlist() {
        setIsWishlistOpen(false);
    }

    return (
        <WishlistContext.Provider 
            value={{ 
                wishlist, 
                addToWishlist, 
                removeFromWishlist, 
                fetchWishlist,
                isWishlistOpen,
                toggleWishlist,
                closeWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
    return context;
}