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
    <header className="w-full bg-brandIvory border-b border-gray-200 shadow-sm">
  <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
    {/* Left: Appointment Link */}
    <div className="flex items-center gap-2">
      <Link
        href="/appointments"
        className="flex items-center text-richEbony hover:text-brandGold transition"
        title="Prendre rendez-vous"
      >
        <Calendar size={18} />
        <span className="text-xs">Rendez-vous</span>
      </Link>
    </div>

    {/* Center: Logo */}
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

    {/* Right: Wishlist & Cart */}
    <div className="flex items-center gap-6">
      <Link href="/wishlist" className="relative" title="Votre liste de souhaits">
        <Heart size={20} className="text-brandGold" />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-2 text-xs bg-burgundy text-brandIvory px-1 rounded-full">
            {wishlist.length}
          </span>
        )}
      </Link>
      <Link href="/cart" className="relative" title="Votre panier">
        <ShoppingBag size={20} className="text-brandGold" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-2 text-xs bg-burgundy text-brandIvory px-1 rounded-full">
            {cart.length}
          </span>
        )}
      </Link>
    </div>
  </div>
</header>
  );
}
