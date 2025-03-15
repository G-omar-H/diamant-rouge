"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession, signOut } from "next-auth/react";
import { Calendar, Heart, User, LogOut, ShieldCheck, Menu } from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="w-full bg-brandIvory">
      <div className="max-w-screen-xl mx-auto px-0 py-0 flex flex-col gap-0">
        {/* Top Row: Left (Rendez-vous), Center (Logo), Right (Icons) */}
        <div className="w-full flex justify-between items-center py-2 px-4">
          {/* Left: Rendez-vous */}
          <div className="flex items-center gap-6">
            <Link
              href="/appointments"
              className="flex flex-col items-center gap-1 text-richEbony hover:text-brandGold transition"
              title="Prendre rendez-vous"
            >
              <Calendar size={18} />
              <span className="text-xs">Rendez-vous</span>
            </Link>
          </div>

          {/* Center: Logo */}
          <div className="flex-grow flex justify-center items-center">
            <Link
              href="/"
              title="Accueil Diamant Rouge"
              className="inline-block hover:scale-105 transition-transform"
            >
              <Image
                src="/images/1/diamant-rouge-logo.svg"
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={300}
                height={100}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Right: Wishlist, Admin, Profile/Auth, Mobile Nav Toggle */}
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
            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="flex flex-col items-center text-richEbony hover:text-brandGold transition"
                title="Menu"
              >
                <Menu size={20} />
                <span className="text-xs">Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center mt-2 text-sm font-medium text-richEbony">
          <Link href="/collections" className="px-4 hover:text-brandGold">
            Collections
          </Link>
          <Link href="/about" className="px-4 hover:text-brandGold">
            À propos
          </Link>
          <Link href="/contact" className="px-4 hover:text-brandGold">
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Navigation Overlay */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-brandIvory w-64 h-full p-4 shadow-lg">
            <button
              onClick={() => setNavOpen(false)}
              className="mb-4 flex flex-col items-center text-richEbony hover:text-brandGold transition"
              title="Fermer"
            >
              <Menu size={20} />
              <span className="text-xs">Fermer</span>
            </button>
            <nav className="flex flex-col gap-4 text-sm font-medium text-richEbony">
              <Link href="/collections" className="hover:text-brandGold">
                Collections
              </Link>
              <Link href="/about" className="hover:text-brandGold">
                À propos
              </Link>
              <Link href="/contact" className="hover:text-brandGold">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
    