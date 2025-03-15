"use client";

import { useState } from "react";
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

  // Mobile navigation state
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="w-full bg-brandIvory">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col gap-4">
        {/* Top Row: Contact & User Actions */}
        <div className="flex justify-between items-center">
          {/* Left: Contact Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-richEbony hover:text-burgundy transition"
              title="Contactez-nous via WhatsApp"
            >
              <MessageCircle size={20} />
              <span className="text-xs">WhatsApp</span>
            </a>
            <Link
              href="/appointments"
              className="flex flex-col items-center gap-1 text-richEbony hover:text-brandGold transition"
              title="Prendre rendez-vous"
            >
              <Calendar size={18} />
              <span className="text-xs">Rendez-vous</span>
            </Link>
          </div>

          {/* Center: Enlarged Logo with no extra margins/padding */}
          <div className="flex justify-center items-center">
            <Link
              href="/"
              title="Accueil Diamant Rouge"
              className="relative w-80 h-32 hover:scale-105 transition-transform"
            >
              <Image
                src="/images/1/diamant-rouge-logo.svg"
                alt="Diamant Rouge - Joaillerie de Luxe"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          {/* Right: User & Cart Icons */}
          <div className="flex items-center gap-6">
            <Link href="/wishlist" title="Votre liste de souhaits">
              <div className="relative flex flex-col items-center">
                <Heart size={20} className="text-brandGold" />
                <span className="text-xs">Liste</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-burgundy text-brandIvory text-xs px-1 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/cart" title="Votre panier">
              <div className="relative flex flex-col items-center">
                <ShoppingCart size={20} className="text-brandGold" />
                <span className="text-xs">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-burgundy text-brandIvory text-xs px-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" title="Accès Back Office">
                <div className="flex flex-col items-center">
                  <ShieldCheck size={20} className="text-brandGold" />
                  <span className="text-xs">Admin</span>
                </div>
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" title="Votre Profil">
                  <div className="flex flex-col items-center">
                    <User size={20} className="text-brandGold" />
                    <span className="text-xs">Profil</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex flex-col items-center text-brandGold transition"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                  <span className="text-xs">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link href="/auth" title="Se connecter">
                <div className="flex flex-col items-center">
                  <User size={20} className="text-brandGold" />
                  <span className="text-xs">Connexion</span>
                </div>
              </Link>
            )}
            {/* Mobile Nav Toggle */}
            <div className="md:hidden">
              <button onClick={() => setNavOpen(true)} title="Ouvrir le menu">
                <Menu size={24} className="text-brandGold" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Desktop Navigation spanning full width */}
        <nav className="hidden md:flex justify-between mt-4 text-sm font-medium text-richEbony">
          <Link
            href="/"
            className="flex-1 text-center hover:text-brandGold transition duration-300"
          >
            Accueil
          </Link>
          <Link
            href="/collections"
            className="flex-1 text-center hover:text-brandGold transition duration-300"
          >
            Collections
          </Link>
          <Link
            href="/appointments"
            className="flex-1 text-center hover:text-brandGold transition duration-300"
          >
            Rendez-vous
          </Link>
          <Link
            href="/the-house"
            className="flex-1 text-center hover:text-brandGold transition duration-300"
          >
            La Maison
          </Link>
          <Link
            href="/contact"
            className="flex-1 text-center hover:text-brandGold transition duration-300"
          >
            Contact
          </Link>
        </nav>
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
