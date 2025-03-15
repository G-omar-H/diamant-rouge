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
} from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();

  // Track scroll for sticky header effect
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile navigation state
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-brandIvory/90 shadow-luxury backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {/* First Row: Contact, Logo, and Icons */}
      <div
        className={`w-full ${
          isScrolled ? "bg-brandIvory/80 shadow-subtle" : "bg-brandIvory/70"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Left: Contact Links */}
          <div className="flex items-center gap-4">
            {/* WhatsApp with label */}
            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-burgundy transition duration-300 text-richEbony"
              title="Contactez-nous via WhatsApp"
            >
              <MessageCircle size={22} />
              <span className="hidden sm:inline text-xs">WhatsApp</span>
            </a>
            {/* Rendez-vous */}
            <Link
              href="/appointments"
              className="flex items-center gap-1 text-richEbony hover:text-brandGold transition duration-300"
              title="Prendre rendez-vous"
            >
              <Calendar size={18} />
              <span className="hidden sm:inline text-xs">Rendez-vous</span>
            </Link>
          </div>

          {/* Center: Logo */}
          <Link
            href="/"
            className="relative w-[200px] h-[60px] hover-scale transition-transform"
            title="Accueil Diamant Rouge"
          >
            <Image
              src="/images/1/diamant-rouge-logo.svg"
              alt="Diamant Rouge - Joaillerie de Luxe"
              fill
              className="object-contain"
            />
          </Link>

          {/* Right: Icons with Labels */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="hover-scale" title="Votre liste de souhaits">
              <div className="flex flex-col items-center">
                <Heart className="text-brandGold" size={22} />
                <span className="hidden sm:inline text-xs">Liste</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            {/* Cart */}
            <Link href="/cart" className="hover-scale" title="Votre panier">
              <div className="flex flex-col items-center">
                <ShoppingCart className="text-brandGold" size={22} />
                <span className="hidden sm:inline text-xs">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            {/* Admin Link */}
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="hover-scale" title="Accès Back Office">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="text-brandGold" size={22} />
                  <span className="hidden sm:inline text-xs">Admin</span>
                </div>
              </Link>
            )}
            {/* User Profile and Logout */}
            {session ? (
              <>
                <Link href="/profile" className="hover-scale" title="Votre Profil">
                  <div className="flex flex-col items-center">
                    <User className="text-brandGold" size={22} />
                    <span className="hidden sm:inline text-xs">Profil</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hover-scale text-brandGold"
                  title="Se déconnecter"
                >
                  <div className="flex flex-col items-center">
                    <LogOut size={22} />
                    <span className="hidden sm:inline text-xs">Déconnexion</span>
                  </div>
                </button>
              </>
            ) : (
              <Link href="/auth" className="hover-scale" title="Se connecter">
                <div className="flex flex-col items-center">
                  <User className="text-brandGold" size={22} />
                  <span className="hidden sm:inline text-xs">Connexion</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Navigation (Desktop) */}
      <div className={`hidden md:block ${isScrolled ? "bg-brandIvory/90 shadow-subtle" : "bg-brandIvory/70"}`}>
        <nav className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-center space-x-8 text-sm font-medium text-richEbony">
          <Link href="/" className="hover:text-brandGold transition duration-300">
            Accueil
          </Link>
          <Link href="/collections" className="hover:text-brandGold transition duration-300">
            Collections
          </Link>
          <Link href="/appointments" className="hover:text-brandGold transition duration-300">
            Rendez-vous
          </Link>
          <Link href="/the-house" className="hover:text-brandGold transition duration-300">
            La Maison
          </Link>
          <Link href="/contact" className="hover:text-brandGold transition duration-300">
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation Toggle Button */}
      <button
        className={`md:hidden absolute top-3 right-4 text-brandGold transition-transform ${
          navOpen ? "scale-0" : "scale-100"
        }`}
        onClick={() => setNavOpen(true)}
        title="Ouvrir le menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Navigation Overlay */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">
          <div className="bg-brandIvory w-3/4 max-w-xs h-full p-5 flex flex-col">
            <button
              onClick={() => setNavOpen(false)}
              className="self-end text-richEbony hover:text-brandGold mb-4"
              title="Fermer le menu"
            >
              <X size={24} />
            </button>
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
          <div className="flex-1" onClick={() => setNavOpen(false)}></div>
        </div>
      )}
    </header>
  );
}
