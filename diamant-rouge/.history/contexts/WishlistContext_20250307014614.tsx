import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

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
    const [isLoading, setIsLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(0);

    // Use useCallback to avoid recreation of this function on each render
    const fetchWishlist = useCallback(async () => {
        // Prevent multiple concurrent requests
        if (isLoading) return;
        
        // Add debounce - only fetch if it's been more than 2 seconds since last fetch
        const now = Date.now();
        if (now - lastFetched < 2000 && wishlist.length > 0) return;
        
        setIsLoading(true);
        try {
            const res = await fetch("/api/wishlist", {
                credentials: "include"
            });
            const data = await res.json();
            if (res.ok) {
                setWishlist(data);
                setLastFetched(now);
            }
        } catch (error) {
            console.error("❌ Failed to fetch wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, lastFetched, wishlist.length]);

    // Initial fetch on component mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    // Fetch wishlist when panel is opened
    useEffect(() => {
        if (isWishlistOpen) {
            fetchWishlist();
        }
    }, [isWishlistOpen, fetchWishlist]);

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
            if (res.ok) {
                // Optimistic update - remove item from state immediately
                setWishlist(current => current.filter(item => item.productId !== productId));
            }
        } catch (error) {
            console.error("❌ Failed to remove from wishlist:", error);
            // If there was an error, refetch to ensure state is correct
            fetchWishlist();
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