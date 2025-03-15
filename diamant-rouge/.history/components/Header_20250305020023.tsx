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

  // Track scroll for header background (optional subtle effect)
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile navigation state
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-500 bg-brandIvory shadow-md">
      {/* Top Row: Contact, Logo, and Action Icons */}
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Contact Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://wa.me/212555000111"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-richEbony hover:text-burgundy transition duration-300"
            title="Contactez-nous via WhatsApp"
          >
            <MessageCircle size={20} />
            <span className="text-xs font-medium">WhatsApp</span>
          </a>
          <Link
            href="/appointments"
            className="flex items-center gap-1 text-richEbony hover:text-brandGold transition duration-300"
            title="Prendre rendez-vous"
          >
            <Calendar size={18} />
            <span className="text-xs font-medium">Rendez-vous</span>
          </Link>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          title="Accueil Diamant Rouge"
          className="relative w-[180px] h-[50px] hover:scale-105 transition-transform"
        >
          <Image
            src="/images/1/diamant-rouge-logo.svg"
            alt="Diamant Rouge - Joaillerie de Luxe"
            fill
            className="object-contain"
          />
        </Link>

        {/* Right: Action Icons with Labels */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <Link href="/wishlist" title="Votre liste de souhaits" className="flex flex-col items-center gap-1 hover:scale-105 transition">
            <Heart size={20} className="text-brandGold" />
            <span className="text-[10px] font-medium text-richEbony">Liste</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-1 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          {/* Cart */}
          <Link href="/cart" title="Votre panier" className="flex flex-col items-center gap-1 hover:scale-105 transition">
            <ShoppingCart size={20} className="text-brandGold" />
            <span className="text-[10px] font-medium text-richEbony">Panier</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          {/* Admin (if applicable) */}
          {session?.user?.role === "admin" && (
            <Link href="/admin" title="Accès Back Office" className="flex flex-col items-center gap-1 hover:scale-105 transition">
              <ShieldCheck size={20} className="text-brandGold" />
              <span className="text-[10px] font-medium text-richEbony">Admin</span>
            </Link>
          )}
          {/* User Profile / Auth */}
          {session ? (
            <>
              <Link href="/profile" title="Votre Profil" className="flex flex-col items-center gap-1 hover:scale-105 transition">
                <User size={20} className="text-brandGold" />
                <span className="text-[10px] font-medium text-richEbony">Profil</span>
              </Link>
              <button
                onClick={() => signOut()}
                title="Se déconnecter"
                className="flex flex-col items-center gap-1 hover:scale-105 transition text-brandGold"
              >
                <LogOut size={20} />
                <span className="text-[10px] font-medium text-richEbony">Déconnexion</span>
              </button>
            </>
          ) : (
            <Link href="/auth" title="Se connecter" className="flex flex-col items-center gap-1 hover:scale-105 transition">
              <User size={20} className="text-brandGold" />
              <span className="text-[10px] font-medium text-richEbony">Connexion</span>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Row (Desktop) */}
      <div className="hidden md:block bg-brandIvory border-t border-platinumGray">
        <nav className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-center gap-8 text-sm font-medium text-richEbony">
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

      {/* Mobile Navigation Toggle */}
      <button
        className="md:hidden absolute top-3 right-4 text-brandGold transition-transform"
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
            <Link href="/" className="py-2 text-richEbony hover:text-brandGold" onClick={() => setNavOpen(false)}>
              Accueil
            </Link>
            <Link href="/collections" className="py-2 text-richEbony hover:text-brandGold" onClick={() => setNavOpen(false)}>
              Collections
            </Link>
            <Link href="/appointments" className="py-2 text-richEbony hover:text-brandGold" onClick={() => setNavOpen(false)}>
              Rendez-vous
            </Link>
            <Link href="/the-house" className="py-2 text-richEbony hover:text-brandGold" onClick={() => setNavOpen(false)}>
              La Maison
            </Link>
            <Link href="/contact" className="py-2 text-richEbony hover:text-brandGold" onClick={() => setNavOpen(false)}>
              Contact
            </Link>
          </div>
          <div className="flex-1" onClick={() => setNavOpen(false)}></div>
        </div>
      )}
    </header>
  );
}
