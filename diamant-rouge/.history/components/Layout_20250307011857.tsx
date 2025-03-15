import { ReactNode, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import Notifications from "./Notifications";
import WishlistPanel from "./WishlistPanel";
import { useWishlist } from "../contexts/WishlistContext";

type LayoutProps = {
    children: ReactNode;
    title?: string;
    description?: string;
};

export default function Layout({ children, title, description }: LayoutProps) {
    const { isWishlistOpen, closeWishlist } = useWishlist();
    const router = useRouter();
    
    // Close wishlist panel on route change
    useEffect(() => {
        const handleRouteChange = () => {
            closeWishlist();
        };
        
        router.events.on("routeChangeComplete", handleRouteChange);
        
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router, closeWishlist]);

    return (
        <>
            {/* Enhanced SEO Metadata */}
            <Head>
                <title>
                    {title ? `${title} | Diamant-Rouge` : "Diamant-Rouge - Luxury Jewelry House"}
                </title>
                {description && <meta name="description" content={description} />}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* Full width layout */}
            <div className="w-full">
                <Header />

                <main className="pt-[var(--header-height)] min-h-screen transition-opacity duration-500 ease-in-out">
                    {children}
                </main>

                <Footer />
                <ChatBot />
                
                {/* Wishlist Panel */}
                <WishlistPanel 
                    isOpen={isWishlistOpen} 
                    onClose={closeWishlist}
                    locale={router.locale || 'fr'}
                />
            </div>
        </>
    );
}