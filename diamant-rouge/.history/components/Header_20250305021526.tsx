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

  // For mobile navigation
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="w-full bg-brandIvory shadow-subtle">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col gap-2">
        {/* Top Row: Contact and Icons */}
        <div className="flex items-center justify-between">
          {/* Left: Contact Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-richEbony hover:text-burgundy transition duration-300"
              title="Contactez-nous via WhatsApp"
            >
              <MessageCircle size={20} />
              <span className="text-xs">WhatsApp</span>
            </a>
            <Link
              href="/appointments"
              className="flex items-center gap-1 text-richEbony hover:text-brandGold transition duration-300"
              title="Prendre rendez-vous"
            >
              <Calendar size={18} />
              <span className="text-xs">Rendez-vous</span>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist" title="Votre liste de souhaits">
              <div className="relative flex flex-col items-center">
                <Heart className="text-brandGold" size={20} />
                <span className="text-xs">Liste</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/cart" title="Votre panier">
              <div className="relative flex flex-col items-center">
                <ShoppingCart className="text-brandGold" size={20} />
                <span className="text-xs">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-burgundy text-brandIvory text-xs px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" title="Accès Back Office">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="text-brandGold" size={20} />
                  <span className="text-xs">Admin</span>
                </div>
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" title="Votre Profil">
                  <div className="flex flex-col items-center">
                    <User className="text-brandGold" size={20} />
                    <span className="text-xs">Profil</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex flex-col items-center text-brandGold hover:text-brandGold transition"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                  <span className="text-xs">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link href="/auth" title="Se connecter">
                <div className="flex flex-col items-center">
                  <User className="text-brandGold" size={20} />
                  <span className="text-xs">Connexion</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Middle Row: Logo */}
        <div className="flex justify-center">
          <Link href="/" title="Accueil Diamant Rouge" className="relative w-[200px] h-[60px] hover:scale-105 transition-transform">
            <Image
              src="/images/1/diamant-rouge-logo.svg"
              alt="Diamant Rouge - Joaillerie de Luxe"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* Bottom Row: Navigation (Desktop) */}
        <nav className="hidden md:flex justify-center space-x-8 text-sm font-medium text-richEbony">
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
      <div className="md:hidden flex justify-between items-center px-4 py-2">
        <button
          onClick={() => setNavOpen(true)}
          className="text-brandGold transition-transform"
          title="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      </div>

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
