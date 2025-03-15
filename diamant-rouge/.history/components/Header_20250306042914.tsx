"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Menu,
  X,
  Search,
  PhoneCall,
} from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const headerVariants = {
    initial: { 
      height: 160,
      backgroundColor: "rgba(250, 243, 227, 1)" 
    },
    scrolled: { 
      height: 120, 
      backgroundColor: "rgba(250, 243, 227, 0.98)",
      boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)"
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 w-full bg-brandIvory border-b border-brandGold/10 z-40"
      variants={headerVariants}
      initial="initial"
      animate={scrolled ? "scrolled" : "initial"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="w-full mx-auto py-3 flex flex-col">
        {/* Decorative gold line */}
        <div className="flex justify-center">
          <div className="h-[1px] w-36 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
        </div>

        {/* Top Row: Contact & User Actions */}
        <div className="flex justify-between items-center w-full px-3 md:px-8 lg:px-12 py-2">
          {/* Left: Contact Links */}
          <div className="hidden md:flex items-center gap-6 pl-2">
            <a
              href="tel:+212555000111"
              className="group flex items-center gap-2 text-richEbony hover:text-brandGold transition-all duration-300"
              title="Appelez-nous"
            >
              <PhoneCall size={16} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs tracking-wider font-medium">+212 555 000 111</span>
            </a>
            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-richEbony hover:text-brandGold transition-all duration-300"
              title="Contactez-nous via WhatsApp"
            >
              <MessageSquare size={16} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs tracking-wider font-medium">WhatsApp</span>
            </a>
          </div>

          {/* Center: Logo */}
          <div className="flex-grow flex justify-center items-center">
            <Link
              href="/"
              title="Accueil Diamant Rouge"
              className="inline-block relative group"
            >
              <Image
                src="public/images/1/diamant-rouge-logo.svg"
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={scrolled ? 220 : 260}
                height={scrolled ? 60 : 70}
                className="object-contain transition-all duration-500"
                priority
              />
              <div className="absolute w-full h-full top-0 left-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-sm"></div>
            </Link>
          </div>

          {/* Right: User & Cart Icons */}
          <div className="flex items-center gap-5 pr-1">
            <button 
              onClick={() => setSearchOpen(true)}
              className="group flex flex-col items-center hover:text-brandGold transition-colors duration-300"
              title="Rechercher"
            >
              <Search size={18} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:block text-[10px] font-medium tracking-wider mt-1">Rechercher</span>
            </button>
            
            <Link href="/wishlist" title="Votre liste de souhaits" className="group">
              <div className="relative flex flex-col items-center hover:text-brandGold transition-colors duration-300">
                <Heart 
                  size={18} 
                  className="text-brandGold group-hover:scale-110 transition-transform duration-300" 
                  fill={wishlist.length > 0 ? "#D4AF37" : "none"} 
                />
                <span className="hidden md:block text-[10px] font-medium tracking-wider mt-1">Favorites</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burgundy text-brandIvory text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            
            <Link href="/cart" title="Votre panier" className="group">
              <div className="relative flex flex-col items-center hover:text-brandGold transition-colors duration-300">
                <ShoppingBag 
                  size={18} 
                  className="text-brandGold group-hover:scale-110 transition-transform duration-300"
                />
                <span className="hidden md:block text-[10px] font-medium tracking-wider mt-1">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burgundy text-brandIvory text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            
            {session?.user?.role === "admin" && (
              <Link href="/admin" title="Accès Back Office" className="group hidden md:flex">
                <div className="flex flex-col items-center hover:text-brandGold transition-colors duration-300">
                  <ShieldCheck size={18} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] font-medium tracking-wider mt-1">Admin</span>
                </div>
              </Link>
            )}
            
            {session ? (
              <>
                <Link href="/profile" title="Votre Profil" className="group">
                  <div className="flex flex-col items-center hover:text-brandGold transition-colors duration-300">
                    <User size={18} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden md:block text-[10px] font-medium tracking-wider mt-1">Profil</span>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="group hidden md:flex flex-col items-center text-brandGold hover:text-burgundy transition-colors duration-300"
                  title="Se déconnecter"
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] font-medium tracking-wider mt-1 text-richEbony">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link href="/auth" title="Se connecter" className="group">
                <div className="flex flex-col items-center hover:text-brandGold transition-colors duration-300">
                  <User size={18} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden md:block text-[10px] font-medium tracking-wider mt-1">Connexion</span>
                </div>
              </Link>
            )}
            
            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setNavOpen(true)}
              title="Ouvrir le menu"
              className="md:hidden hover:text-brandGold transition-colors duration-300"
            >
              <Menu size={22} className="text-brandGold" />
            </button>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="flex justify-center my-1.5">
          <div className="h-[1px] w-full max-w-4xl bg-gradient-to-r from-transparent via-brandGold/40 to-transparent"></div>
        </div>

        {/* Bottom Row: Desktop Navigation */}
        <nav className="hidden md:flex justify-center my-1 text-sm tracking-widest font-serif font-medium">
          <Link
            href="/"
            className="px-5 text-center hover:text-brandGold transition-all duration-300 relative group"
          >
            <span>ACCUEIL</span>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/30 self-center mx-0.5">•</span>
          <Link
            href="/collections"
            className="px-5 text-center hover:text-brandGold transition-all duration-300 relative group"
          >
            <span>COLLECTIONS</span>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/30 self-center mx-0.5">•</span>
          <Link
            href="/jewelry"
            className="px-5 text-center hover:text-brandGold transition-all duration-300 relative group"
          >
            <span>JOAILLERIE</span>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/30 self-center mx-0.5">•</span>
          <Link
            href="/appointments"
            className="px-5 text-center hover:text-brandGold transition-all duration-300 relative group"
          >
            <span>RENDEZ-VOUS</span>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/30 self-center mx-0.5">•</span>
          <Link
            href="/the-house"
            className="px-5 text-center hover:text-brandGold transition-all duration-300 relative group"
          >
            <span>LA MAISON</span>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
          <span className="text-brandGold/30 self-center mx-0.5">•</span>
          <Link
            href="/contact"
            className="px-5 text-center hover:text-brandGold transition-all duration-300 relative group"
          >
            <span>CONTACT</span>
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
          </Link>
        </nav>
        
        {/* Bottom decorative gold line */}
        <div className="flex justify-center mt-1">
          <div className="h-[1px] w-36 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-richEbony/90 z-50 flex items-start justify-center pt-24"
          >
            <div className="w-full max-w-2xl px-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-brandGold font-serif text-2xl">Recherche</h2>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-brandIvory hover:text-brandGold transition-colors duration-300"
                >
                  <X size={28} />
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <input
                  type="text"
                  placeholder="Rechercher des créations, des collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-brandGold/30 focus:border-brandGold text-brandIvory text-xl py-3 px-2 pr-12 outline-none transition-all duration-300"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brandGold hover:scale-110 transition-transform duration-300"
                >
                  <Search size={24} />
                </button>
              </form>
              
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Link href="/collections/bagues" className="p-3 text-brandIvory hover:text-brandGold transition-colors duration-300" onClick={() => setSearchOpen(false)}>
                  <span className="font-serif block mb-1">Bagues</span>
                  <span className="text-xs text-platinumGray">22 créations</span>
                </Link>
                <Link href="/collections/colliers" className="p-3 text-brandIvory hover:text-brandGold transition-colors duration-300" onClick={() => setSearchOpen(false)}>
                  <span className="font-serif block mb-1">Colliers</span>
                  <span className="text-xs text-platinumGray">18 créations</span>
                </Link>
                <Link href="/collections/bracelets" className="p-3 text-brandIvory hover:text-brandGold transition-colors duration-300" onClick={() => setSearchOpen(false)}>
                  <span className="font-serif block mb-1">Bracelets</span>
                  <span className="text-xs text-platinumGray">14 créations</span>
                </Link>
                <Link href="/collections/boucles" className="p-3 text-brandIvory hover:text-brandGold transition-colors duration-300" onClick={() => setSearchOpen(false)}>
                  <span className="font-serif block mb-1">Boucles d'oreilles</span>
                  <span className="text-xs text-platinumGray">16 créations</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {navOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="bg-brandIvory w-4/5 max-w-xs h-full ml-auto p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <Image
                  src="/images/1/diamant-rouge-logo-full.svg"
                  alt="Diamant Rouge"
                  width={140}
                  height={36}
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
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-brandGold/40 to-transparent mb-8"></div>
              
              <div className="space-y-5">
                <Link
                  href="/"
                  className="block py-2 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
                  onClick={() => setNavOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/collections"
                  className="block py-2 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
                  onClick={() => setNavOpen(false)}
                >
                  Collections
                </Link>
                <Link
                  href="/jewelry"
                  className="block py-2 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
                  onClick={() => setNavOpen(false)}
                >
                  Joaillerie
                </Link>
                <Link
                  href="/appointments"
                  className="block py-2 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
                  onClick={() => setNavOpen(false)}
                >
                  Rendez-vous
                </Link>
                <Link
                  href="/the-house"
                  className="block py-2 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
                  onClick={() => setNavOpen(false)}
                >
                  La Maison
                </Link>
                <Link
                  href="/contact"
                  className="block py-2 text-richEbony hover:text-brandGold transition-colors duration-300 font-medium font-serif tracking-wider"
                  onClick={() => setNavOpen(false)}
                >
                  Contact
                </Link>
              </div>
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-brandGold/40 to-transparent my-8"></div>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-3">
                  <PhoneCall size={18} className="text-brandGold" />
                  <a 
                    href="tel:+212555000111" 
                    className="text-sm text-richEbony hover:text-brandGold transition-colors duration-300"
                  >
                    +212 555 000 111
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-brandGold" />
                  <a 
                    href="https://wa.me/212555000111" 
                    className="text-sm text-richEbony hover:text-brandGold transition-colors duration-300"
                  >
                    WhatsApp
                  </a>
                </div>
                
                {session && (
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-brandGold" />
                    <button
                      onClick={() => {
                        signOut();
                        setNavOpen(false);
                      }}
                      className="text-sm text-richEbony hover:text-brandGold transition-colors duration-300"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}