import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirectToAuth } from "../lib/authUtils";
import { Product, ProductTranslation } from "@prisma/client";

type WishlistItem = {
    id?: number;
    userId?: number;
    productId: number;
    product?: Product & {
        translations: ProductTranslation[];
        images?: string[];
    };
};

type WishlistContextType = {
    wishlist: WishlistItem[];
    addToWishlist: (productId: number) => void;
    removeFromWishlist: (productId: number) => void;
    fetchWishlist: () => void;
    isWishlistOpen: boolean;
    toggleWishlist: () => void;
    closeWishlist: () => void;
    isAuthenticated: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(0);
    
    // Fetch timeout ref to prevent multiple fetches
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Flag to track if initial fetch has been done
    const initialFetchDoneRef = useRef(false);
    
    // Get authentication status from NextAuth session
    const { data: session, status } = useSession();
    const isAuthenticated = !!session;
    const isSessionLoading = status === "loading";

    // Use useCallback to avoid recreation of this function on each render
    const fetchWishlist = useCallback(async (force = false) => {
        // Don't fetch if not authenticated
        if (!isAuthenticated || isSessionLoading) return;
        
        // Prevent multiple concurrent requests
        if (isLoading) return;
        
        // Enhanced debounce - 5 seconds between normal fetches, bypass for forced fetches
        const now = Date.now();
        if (!force && now - lastFetched < 5000 && wishlist.length > 0) return;
        
        // Clear any existing timeout
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
            fetchTimeoutRef.current = null;
        }
        
        // Only set loading if it's a forced fetch or we don't have data
        if (force || wishlist.length === 0) {
            setIsLoading(true);
        }
        
        try {
            const res = await fetch("/api/wishlist", {
                credentials: "include",
                // Add cache control headers to prevent browser caching
                headers: {
                    "Cache-Control": "no-cache, no-store, max-age=0",
                    "Pragma": "no-cache"
                }
            });
            
            // Only process if component is still mounted (check with ref)
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
                setLastFetched(now);
                initialFetchDoneRef.current = true;
            }
        } catch (error) {
            console.error("❌ Failed to fetch wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, lastFetched, wishlist.length, isAuthenticated, isSessionLoading]);

    // Initial fetch on authentication status change only
    useEffect(() => {
        // Only fetch if authenticated and not already done
        if (isAuthenticated && !isSessionLoading && !initialFetchDoneRef.current) {
            fetchWishlist(true); // Force the initial fetch
        }
        
        // Clear fetch on unmount
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
        };
    }, [isAuthenticated, isSessionLoading, fetchWishlist]);

    // Fetch wishlist when panel is opened - only if needed
    useEffect(() => {
        if (isWishlistOpen && isAuthenticated && !isSessionLoading) {
            // Use a debounced fetch when opening panel
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
            }
            
            fetchTimeoutRef.current = setTimeout(() => {
                fetchWishlist(false); // Non-forced fetch with existing debounce
            }, 300);
        }
        
        // Cleanup timeout
        return () => {
            if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
                fetchTimeoutRef.current = null;
            }
        };
    }, [isWishlistOpen, isAuthenticated, isSessionLoading, fetchWishlist]);

    async function addToWishlist(productId: number) {
        // Redirect to auth if not authenticated
        if (!isAuthenticated) {
            closeWishlist();
            redirectToAuth('favorite', productId);
            return;
        }
        
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) {
                // Optimistic update - add item to state immediately
                const newItem = { productId };
                setWishlist(current => {
                    // Check if it already exists to prevent duplicates
                    if (!current.some(item => item.productId === productId)) {
                        return [...current, newItem];
                    }
                    return current;
                });
                
                // Fetch after a short delay to ensure server consistency
                setTimeout(() => fetchWishlist(true), 500);
            }
        } catch (error) {
            console.error("❌ Failed to add to wishlist:", error);
        }
    }

    async function removeFromWishlist(productId: number) {
        // Safety check - should not happen but just in case
        if (!isAuthenticated) return;
        
        try {
            // Optimistic update - remove item from state immediately
            setWishlist(current => current.filter(item => item.productId !== productId));
            
            const res = await fetch("/api/wishlist", {
                method: "DELETE",
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify({ productId }),
            });
            
            if (!res.ok) {
                // If server request failed, revert optimistic update
                fetchWishlist(true);
            }
        } catch (error) {
            console.error("❌ Failed to remove from wishlist:", error);
            // If there was an error, refetch to ensure state is correct
            fetchWishlist(true);
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
                fetchWishlist: () => fetchWishlist(true), // Always force fetch when called directly
                isWishlistOpen,
                toggleWishlist,
                closeWishlist,
                isAuthenticated
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