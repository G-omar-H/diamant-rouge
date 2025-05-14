// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react"; // ✅ Import NextAuth Session Provider
import { CartProvider } from "../contexts/CartContext";
import { WishlistProvider } from "../contexts/WishlistContext";
import { ToastProvider } from "../contexts/ToastContext";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const router = useRouter();
    const { locale } = router;

    return (
        <SessionProvider session={session}> {/* ✅ Ensures session context is available */}
            <div dir={locale === "ar" ? "rtl" : "ltr"}>
                <ToastProvider>
                    <CartProvider> {/* ✅ Cart is now session-aware */}
                        <WishlistProvider>
                            <Layout title="Home" description="Welcome to Diamant-Rouge, the epitome of luxury jewelry.">
                                <Component {...pageProps} key={router.asPath} />
                            </Layout>
                        </WishlistProvider>
                    </CartProvider>
                </ToastProvider>
            </div>
        </SessionProvider>
    );
}
