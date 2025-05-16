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
    
    // Check if we're on a product page
    const isProductPage = router.pathname.includes('/products/');
    
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

    // Handle dynamic header height adjustment
    useEffect(() => {
        const adjustMainPadding = () => {
            const scrolled = window.scrollY > 50;
            // Get actual height instead of using variables for more precision
            const header = document.querySelector('header');
            if (header) {
                const headerHeight = header.getBoundingClientRect().height;
                document.documentElement.style.setProperty(
                    '--current-header-height', 
                    `${headerHeight}px`
                );
            } else {
                // Fallback to the variable if header isn't found
                document.documentElement.style.setProperty(
                    '--current-header-height', 
                    scrolled ? 'var(--header-height-scrolled)' : 'var(--header-height)'
                );
            }
        };
        
        // Initial setting
        adjustMainPadding();
        
        // Set again after a small delay to ensure accurate measurements
        const timeoutId = setTimeout(adjustMainPadding, 100);
        
        // Listen for DOM mutations in the header
        if (typeof MutationObserver !== 'undefined') {
            const header = document.querySelector('header');
            if (header) {
                const observer = new MutationObserver(adjustMainPadding);
                observer.observe(header, { 
                    attributes: true, 
                    childList: true, 
                    subtree: true 
                });
                
                return () => {
                    observer.disconnect();
                    clearTimeout(timeoutId);
                    window.removeEventListener('scroll', adjustMainPadding);
                    window.removeEventListener('resize', adjustMainPadding);
                };
            }
        }
        
        // Listen for scroll and resize
        window.addEventListener('scroll', adjustMainPadding);
        window.addEventListener('resize', adjustMainPadding);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', adjustMainPadding);
            window.removeEventListener('resize', adjustMainPadding);
        };
    }, []);

    return (
        <>
            {/* Enhanced SEO Metadata */}
            <Head>
                <title>
                    {title ? `${title} | Diamant-Rouge` : "Diamant-Rouge - Luxury Jewelry House"}
                </title>
                {description && <meta name="description" content={description} />}
                <meta 
                    name="viewport" 
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" 
                />
                <meta name="theme-color" content="#FAF3E3" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            </Head>

            {/* Full width layout */}
            <div className="w-full">
                <Header />

                <main className={`min-h-screen transition-opacity duration-500 ease-in-out ${isProductPage ? 'product-page-container' : 'content-container'}`}>
                    {children}
                </main>

                <Footer />
                <ChatBot />
                
                {/* Wishlist Panel */}
                <WishlistPanel 
                    isOpen={isWishlistOpen} 
                    onClose={closeWishlist}
                    locale={router.locale || router.defaultLocale || 'en'}
                />
            </div>
        </>
    );
}