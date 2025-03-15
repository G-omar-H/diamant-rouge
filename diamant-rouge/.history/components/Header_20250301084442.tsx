"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import {
    ShoppingCart,
    Heart,
    User,
    LogOut,
    Calendar,
    MessageCircle,
    ShieldCheck,
    Menu,
    X,
    Sun,
    Moon,
} from "lucide-react";

export default function Header() {
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { data: session } = useSession();

    // Track scroll to apply sticky style
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ========== THEME STATE ==========
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const savedTheme = localStorage.getItem("diamantrouge-theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);
    const handleThemeToggle = () => {
        setIsDarkMode((prev) => {
            const newVal = !prev;
            if (newVal) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("diamantrouge-theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("diamantrouge-theme", "light");
            }
            return newVal;
        });
    };

    // ========== MOBILE NAV FOR 2ND ROW (NAV LINKS) ==========
    const [navOpen, setNavOpen] = useState(false);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                isScrolled
                    ? "bg-brandIvory/90 shadow-luxury backdrop-blur-md"
                    : "bg-transparent"
            }`}
        >
            {/*
        ─────────────────────────────────────────
        1) FIRST ROW: Left(WhatsApp/RendezVous) - Center(Logo) - Right(Icons)
        ─────────────────────────────────────────
      */}
            <div
                className={`w-full ${
                    isScrolled ? "bg-brandIvory/80 shadow-subtle" : "bg-brandIvory/70"
                }`}
            >
                <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
                    {/* LEFT: WhatsApp & Rendez-vous */}
                    <div className="flex items-center gap-4">
                        {/* WhatsApp link */}
                        <a
                            href="https://wa.me/212555000111"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-burgundy hover-scale transition duration-300 text-richEbony"
                            title="Contacter via WhatsApp"
                        >
                            <MessageCircle size={22} />
                        </a>
                        {/* Rendez-vous link */}
                        <Link
                            href="/appointments"
                            className="flex items-center gap-1 text-richEbony hover:text-brandGold transition duration-300"
                        >
                            <Calendar size={18} />
                            <span className="hidden sm:inline">Rendez-vous</span>
                        </Link>
                    </div>

                    {/* CENTER: Logo */}
                    <Link
                        href="/"
                        className="relative w-[200px] h-[60px] hover-scale transition-transform"
                    >
                        <Image
                            src="/images/1/diamant-rouge-logo.svg"
                            alt="Diamant Rouge"
                            fill
                            className="object-contain"
                        />
                    </Link>

                    {/* RIGHT: Icons (Wishlist, Cart, Admin, User, Theme) */}
                    <div className="flex items-center gap-4">
                        {/* Wishlist */}
                        <Link href="/wishlist" className="relative hover-scale">
                            <Heart className="text-brandGold" size={22} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-2 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
                            )}
                        </Link>
                        {/* Cart */}
                        <Link href="/cart" className="relative hover-scale">
                            <ShoppingCart className="text-brandGold" size={22} />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
                            )}
                        </Link>
                        {/* Admin link (if role=admin) */}
                        {session?.user?.role === "admin" && (
                            <Link href="/admin" className="hover-scale">
                                <ShieldCheck className="text-brandGold" size={22} />
                            </Link>
                        )}
                        {/* Auth */}
                        {session ? (
                            <>
                                <Link href="/profile" className="hover-scale">
                                    <User className="text-brandGold" size={22} />
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="hover-scale text-brandGold"
                                    title="Se déconnecter"
                                >
                                    <LogOut size={22} />
                                </button>
                            </>
                        ) : (
                            <Link href="/auth" className="hover-scale" title="Se connecter">
                                <User className="text-brandGold" size={22} />
                            </Link>
                        )}

                    </div>
                </div>
            </div>

            {/*
        ─────────────────────────────────────────
        2) SECOND ROW: Navigation (Desktop)
           Centered content, mobile hidden.
        ─────────────────────────────────────────
      */}
            <div
                className={`${
                    isScrolled ? "bg-brandIvory/90 shadow-subtle" : "bg-brandIvory/70"
                } hidden md:block`}
            >
                <nav className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-center space-x-8 text-sm font-medium text-richEbony">
                    <Link href="/" className="hover:text-brandGold transition duration-300">
                        Accueil
                    </Link>
                    <Link
                        href="/collections"
                        className="hover:text-brandGold transition duration-300"
                    >
                        Collections
                    </Link>
                    <Link
                        href="/appointments"
                        className="hover:text-brandGold transition duration-300"
                    >
                        Rendez-vous
                    </Link>
                    <Link
                        href="/the-house"
                        className="hover:text-brandGold transition duration-300"
                    >
                        La Maison
                    </Link>
                    <Link
                        href="/contact"
                        className="hover:text-brandGold transition duration-300"
                    >
                        Contact
                    </Link>
                </nav>
            </div>

            {/* Mobile Nav Toggle Button (Hamburger) - visible on small screens */}
            <button
                className={`md:hidden absolute top-3 right-4 text-brandGold transition-transform ${
                    navOpen ? "scale-0" : "scale-100"
                }`}
                onClick={() => setNavOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/*
        MOBILE NAV OVERLAY
      */}
            {navOpen && (
                <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">
                    {/* Drawer */}
                    <div className="bg-brandIvory w-3/4 max-w-xs h-full p-5 flex flex-col">
                        {/* Close button */}
                        <button
                            onClick={() => setNavOpen(false)}
                            className="self-end text-richEbony hover:text-brandGold mb-4"
                        >
                            <X size={24} />
                        </button>
                        {/* Nav Items */}
                        <Link
                            href="/"
                            className="py-2 text-richEbony hover:text-brandGold"
                            onClick={() => setNavOpen(false)}
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/collections"
                            className="py-2 text-richEbony hover:text-brandGold"
                            onClick={() => setNavOpen(false)}
                        >
                            Collections
                        </Link>
                        <Link
                            href="/appointments"
                            className="py-2 text-richEbony hover:text-brandGold"
                            onClick={() => setNavOpen(false)}
                        >
                            Rendez-vous
                        </Link>
                        <Link
                            href="/the-house"
                            className="py-2 text-richEbony hover:text-brandGold"
                            onClick={() => setNavOpen(false)}
                        >
                            La Maison
                        </Link>
                        <Link
                            href="/contact"
                            className="py-2 text-richEbony hover:text-brandGold"
                            onClick={() => setNavOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Click outside to close */}
                    <div className="flex-1" onClick={() => setNavOpen(false)}></div>
                </div>
            )}
        </header>
    );
}
