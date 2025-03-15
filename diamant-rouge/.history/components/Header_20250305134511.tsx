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
    <header className="w-full bg-brandIvory border-b border-brandGold/10 z-40 backgrou
      <div className="w-full mx-auto py-3 flex flex-col">
        {/* Gold accent line */}
        <div className="flex justify-center mb-1.5">
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
        </div>

        {/* Top Row: Contact & User Actions */}
        <div className="flex justify-between items-center w-full px-2 md:px-8">
          {/* Left: Contact Links */}
          <div className="flex items-center gap-5 w-1/4 pl-1">
            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-richEbony hover:text-burgundy transition-colors duration-300"
              title="Contactez-nous via WhatsApp"
            >
              <MessageCircle size={20} className="text-brandGold" />
              <span className="text-[10px] font-medium tracking-wider">WhatsApp</span>
            </a>
            <Link
              href="/appointments"
              className="flex flex-col items-center gap-1 text-richEbony hover:text-brandGold transition-colors duration-300"
              title="Prendre rendez-vous"
            >
              <Calendar size={20} className="text-brandGold" />
              <span className="text-[10px] font-medium tracking-wider">Rendez-vous</span>
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex-grow flex justify-center items-center mx-1 md:mx-3 w-2/4">
            <Link
              href="/"
              title="Accueil Diamant Rouge"
              className="inline-block hover:opacity-90 transition-opacity duration-300"
            >
              <Image
                src="/images/1/diamant-rouge-logo.svg"
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={280}
                height={80}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right: User & Cart Icons */}
          <div className="flex items-center justify-end gap-5 w-1/4 pr-1">
            <Link href="/wishlist" title="Votre liste de souhaits">
              <div className="relative flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                <Heart size={20} className="text-brandGold" />
                <span className="text-[10px] font-medium tracking-wider">Liste</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-burgundy text-brandIvory text-[9px] px-1 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/cart" title="Votre panier">
              <div className="relative flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                <ShoppingCart size={20} className="text-brandGold" />
                <span className="text-[10px] font-medium tracking-wider">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-burgundy text-brandIvory text-[9px] px-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin" title="Accès Back Office">
                <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                  <ShieldCheck size={20} className="text-brandGold" />
                  <span className="text-[10px] font-medium tracking-wider">Admin</span>
                </div>
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" title="Votre Profil">
                  <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                    <User size={20} className="text-brandGold" />
                    <span className="text-[10px] font-medium tracking-wider">Profil</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex flex-col items-center text-brandGold hover:text-burgundy transition-colors duration-300"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link href="/auth" title="Se connecter">
                <div className="flex flex-col items-center hover:text-burgundy transition-colors duration-300">
                  <User size={20} className="text-brandGold" />
                  <span className="text-[10px] font-medium tracking-wider">Connexion</span>
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
                <Menu size={22} className="text-brandGold" />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="flex justify-center my-2">
          <div className="h-[1px] w-full max-w-3xl bg-gradient-to-r from-transparent via-brandGold/60 to-transparent"></div>
        </div>

        {/* Bottom Row: Desktop Navigation */}
        <nav className="hidden md:flex justify-center mt-0.5 mb-1 text-sm tracking-widest font-serif font-medium text-richEbony">
          <Link
            href="/"
            className="px-6 text-center hover:text-brandGold transition-colors duration-300 relative group"
          >
            <span>Accueil</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/20 self-center mx-1">•</span>
          <Link
            href="/collections"
            className="px-6 text-center hover:text-brandGold transition-colors duration-300 relative group"
          >
            <span>Collections</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/20 self-center mx-1">•</span>
          <Link
            href="/appointments"
            className="px-6 text-center hover:text-brandGold transition-colors duration-300 relative group"
          >
            <span>Rendez-vous</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/20 self-center mx-1">•</span>
          <Link
            href="/the-house"
            className="px-6 text-center hover:text-brandGold transition-colors duration-300 relative group"
          >
            <span>La Maison</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/20 self-center mx-1">•</span>
          <Link
            href="/contact"
            className="px-6 text-center hover:text-brandGold transition-colors duration-300 relative group"
          >
            <span>Contact</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
        </nav>
        
        {/* Gold accent line */}
        <div className="flex justify-center mt-1.5">
          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
          <div className="bg-brandIvory w-3/4 max-w-xs h-full p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <Image
                src="/images/1/diamant-rouge-logo.svg"
                alt="Diamant Rouge"
                width={180}
                height={40}
                className="object-contain"
              />
              <button
                onClick={() => setNavOpen(false)}
                className="text-richEbony hover:text-brandGold transition-colors duration-300"
                title="Fermer le menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-brandGold/40 to-transparent mb-6"></div>
            
            <Link
              href="/"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
              onClick={() => setNavOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/collections"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
              onClick={() => setNavOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/appointments"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
              onClick={() => setNavOpen(false)}
            >
              Rendez-vous
            </Link>
            <Link
              href="/the-house"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
              onClick={() => setNavOpen(false)}
            >
              La Maison
            </Link>
            <Link
              href="/contact"
              className="py-3 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
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