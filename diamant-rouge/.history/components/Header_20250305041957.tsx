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
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="w-full bg-brandIvory sticky top-0 z-50 shadow-luxury">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-6 flex flex-col">
        {/* Top Row: Contact & User Actions */}
        <div className="flex justify-between items-center">
          {/* Left: Contact Links */}
          <div className="flex items-center gap-8">
            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-richEbony hover:text-burgundy transition-colors duration-300"
              title="Contactez-nous via WhatsApp"
            >
              <MessageCircle size={22} className="text-brandGold" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
            <Link
              href="/appointments"
              className="flex flex-col items-center gap-2 text-richEbony hover:text-brandGold transition-colors duration-300"
              title="Prendre rendez-vous"
            >
              <Calendar size={22} className="text-brandGold" />
              <span className="text-xs font-medium">Rendez-vous</span>
            </Link>
          </div>

          {/* Center: Enlarged Logo with increased margins */}
          <div className="flex-grow flex justify-center items-center mx-6 md:mx-10">
            <Link
              href="/"
              title="Accueil Diamant Rouge"
              className="inline-block hover:scale-105 transition-transform duration-300 py-2 md:py-3"
            >
              <Image
                src="/images/1/diamant-rouge-logo.svg"
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={320}
                height={110}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Right: User & Cart Icons */}
          <div className="flex items-center gap-8">
            <Link href="/wishlist" title="Votre liste de souhaits">
              <div className="relative flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                <Heart size={22} className="text-brandGold mb-1" />
                <span className="text-xs font-medium">Liste</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-xs px-1.5 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/cart" title="Votre panier">
              <div className="relative flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                <ShoppingCart size={22} className="text-brandGold mb-1" />
                <span className="text-xs font-medium">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-xs px-1.5 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" title="Accès Back Office">
                <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                  <ShieldCheck size={22} className="text-brandGold mb-1" />
                  <span className="text-xs font-medium">Admin</span>
                </div>
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" title="Votre Profil">
                  <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                    <User size={22} className="text-brandGold mb-1" />
                    <span className="text-xs font-medium">Profil</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex flex-col items-center text-brandGold hover:text-burgundy transition-colors duration-300"
                  title="Se déconnecter"
                >
                  <LogOut size={22} className="mb-1" />
                  <span className="text-xs font-medium">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link href="/auth" title="Se connecter">
                <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                  <User size={22} className="text-brandGold mb-1" />
                  <span className="text-xs font-medium">Connexion</span>
                </div>
              </Link>
            )}
            {/* Mobile Nav Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setNavOpen(true)}
                title="Ouvrir le menu"
                className="hover:text-burgundy transition-colors duration-300"
              >
                <Menu size={26} className="text-brandGold" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Desktop Navigation */}
        <nav className="hidden md:flex justify-center mt-6 text-sm tracking-wide font-medium text-richEbony">
          <Link
            href="/"
            className="px-8 text-center hover:text-brandGold transition-colors duration-300"
          >
            Accueil
          </Link>
          <Link
            href="/collections"
            className="px-8 text-center hover:text-brandGold transition-colors duration-300"
          >
            Collections
          </Link>
          <Link
            href="/appointments"
            className="px-8 text-center hover:text-brandGold transition-colors duration-300"
          >
            Rendez-vous
          </Link>
          <Link
            href="/the-house"
            className="px-8 text-center hover:text-brandGold transition-colors duration-300"
          >
            La Maison
          </Link>
          <Link
            href="/contact"
            className="px-8 text-center hover:text-brandGold transition-colors duration-300"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation Overlay */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex">
          <div className="bg-brandIvory w-3/4 max-w-xs h-full p-6 flex flex-col">
            <button
              onClick={() => setNavOpen(false)}
              className="self-end text-richEbony hover:text-brandGold mb-6 transition-colors duration-300"
              title="Fermer le menu"
            >
              <X size={26} />
            </button>
            <Link
              href="/"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium"
              onClick={() => setNavOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/collections"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium"
              onClick={() => setNavOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/appointments"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium"
              onClick={() => setNavOpen(false)}
            >
              Rendez-vous
            </Link>
            <Link
              href="/the-house"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium"
              onClick={() => setNavOpen(false)}
            >
              La Maison
            </Link>
            <Link
              href="/contact"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium"
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