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
    <header className="w-full bg-brandIvory bg-[url('/images/subtle-pattern.png')] bg-opacity-50 z-40">
      {/* Full width container */}
      <div className="w-full mx-auto px-4 md:px-16 lg:px-24 py-8 flex flex-col">
        {/* Decorative Ornament */}
        <div className="flex justify-center mb-4">
          <div className="h-0.5 w-36 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
        </div>

        {/* Top Row: Contact & User Actions - Full Width */}
        <div className="flex justify-between items-center w-full">
          {/* Left: Contact Links - given more space */}
          <div className="flex items-center gap-10 md:gap-16 w-1/4">
            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-richEbony hover:text-burgundy transition-colors duration-300"
              title="Contactez-nous via WhatsApp"
            >
              <MessageCircle size={24} className="text-brandGold" />
              <span className="text-xs font-medium tracking-wider">WhatsApp</span>
            </a>
            <Link
              href="/appointments"
              className="flex flex-col items-center gap-2 text-richEbony hover:text-brandGold transition-colors duration-300"
              title="Prendre rendez-vous"
            >
              <Calendar size={24} className="text-brandGold" />
              <span className="text-xs font-medium tracking-wider">Rendez-vous</span>
            </Link>
          </div>

          {/* Center: Enlarged Logo with increased margins */}
          <div className="flex-grow flex justify-center items-center mx-4 md:mx-8 w-2/4">
            <Link
              href="/"
              title="Accueil Diamant Rouge"
              className="inline-block hover:scale-105 transition-transform duration-300 py-4 md:py-6"
            >
              <Image
                src="/images/1/diamant-rouge-logo.svg"
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={380}
                height={140}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right: User & Cart Icons - given more space */}
          <div className="flex items-center justify-end gap-8 md:gap-12 w-1/4">
            <Link href="/wishlist" title="Votre liste de souhaits">
              <div className="relative flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                <Heart size={24} className="text-brandGold mb-1.5" />
                <span className="text-xs font-medium tracking-wider">Liste</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-xs px-1.5 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/cart" title="Votre panier">
              <div className="relative flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                <ShoppingCart size={24} className="text-brandGold mb-1.5" />
                <span className="text-xs font-medium tracking-wider">Panier</span>
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
                  <ShieldCheck size={24} className="text-brandGold mb-1.5" />
                  <span className="text-xs font-medium tracking-wider">Admin</span>
                </div>
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" title="Votre Profil">
                  <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                    <User size={24} className="text-brandGold mb-1.5" />
                    <span className="text-xs font-medium tracking-wider">Profil</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex flex-col items-center text-brandGold hover:text-burgundy transition-colors duration-300"
                  title="Se déconnecter"
                >
                  <LogOut size={24} className="mb-1.5" />
                  <span className="text-xs font-medium tracking-wider">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link href="/auth" title="Se connecter">
                <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                  <User size={24} className="text-brandGold mb-1.5" />
                  <span className="text-xs font-medium tracking-wider">Connexion</span>
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
                <Menu size={28} className="text-brandGold" />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Line - wider and more elegant */}
        <div className="flex justify-center my-6">
          <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-brandGold to-transparent opacity-70"></div>
        </div>

        {/* Bottom Row: Desktop Navigation - full width with better spacing */}
        <nav className="hidden md:flex justify-center mt-4 text-sm tracking-wider font-serif font-medium text-richEbony">
          {["Accueil", "Collections", "Rendez-vous", "La Maison", "Contact"].map((item, index) => (
            <>
              <Link
                key={item}
                href={
                  item === "Accueil" 
                    ? "/" 
                    : item === "La Maison" 
                      ? "/the-house" 
                      : `/${item.toLowerCase()}`
                }
                className="px-10 md:px-16 text-center hover:text-brandGold transition-colors duration-300"
              >
                {item}
              </Link>
              {index < 4 && (
                <span className="text-brandGold opacity-40 self-center">•</span>
              )}
            </>
          ))}
        </nav>
        
        {/* Decorative Ornament */}
        <div className="flex justify-center mt-4">
          <div className="h-0.5 w-36 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
        </div>
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