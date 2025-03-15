"use client";

import { useState, useEffect, useRef } from "react";
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
  Diamond,
  Clock,
  ChevronDown
} from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  
  // Ref for dropdown menu
  const collectionsMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close collections menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionsMenuRef.current && !collectionsMenuRef.current.contains(event.target as Node)) {
        setCollectionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animation variants
  const headerVariants = {
    initial: { 
      height: 180,
      backgroundColor: "rgba(250, 243, 227, 1)" 
    },
    scrolled: { 
      height: 130, 
      backgroundColor: "rgba(250, 243, 227, 0.98)",
      boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)"
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 w-full bg-brandIvory border-b border-brandGold/20 z-40"
      variants={headerVariants}
      initial="initial"
      animate={scrolled ? "scrolled" : "initial"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Diamond Accent Line - Top */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-[1px] w-60 bg-gradient-to-r from-transparent via-brandGold to-transparent my-1.5"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Diamond size={7} className="text-brandGold fill-brandGold" />
          </div>
        </div>
      </div>

      <div className="w-full mx-auto py-2 flex flex-col">
        {/* Top Bar: Store Info & Account */}
        <div className="hidden md:flex justify-between items-center text-xs px-8 py-1.5 text-platinumGray border-b border-brandGold/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-brandGold" />
              <span>Lun-Sam: 9h-19h</span>
            </div>
            <a
              href="tel:+212555000111"
              className="group flex items-center gap-2 hover:text-brandGold transition-all duration-300"
              title="Appelez-nous"
            >
              <PhoneCall size={12} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
              <span className="tracking-wide">+212 555 000 111</span>
            </a>
          </div>
          
          <div className="flex items-center gap-5">
            {session ? (
              <>
                <Link href="/profile" className="hover:text-brandGold transition-colors duration-300">
                  Mon Compte
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hover:text-brandGold transition-colors duration-300 flex items-center gap-1"
                >
                  <span>Déconnexion</span>
                  <LogOut size={12} />
                </button>
              </>
            ) : (
              <Link href="/auth" className="hover:text-brandGold transition-colors duration-300">
                Connexion / Inscription
              </Link>
            )}

            <a
              href="https://wa.me/212555000111"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 hover:text-brandGold transition-all duration-300"
              title="Contactez-nous via WhatsApp"
            >
              <MessageSquare size={12} className="text-brandGold group-hover:scale-110 transition-transform duration-300" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Main Row: Logo & Navigation */}
        <div className="flex justify-between items-center w-full px-4 md:px-8 lg:px-12 py-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setNavOpen(true)}
            title="Ouvrir le menu"
            className="md:hidden text-brandGold hover:scale-110 transition-transform duration-300"
          >
            <Menu size={24} />
          </button>

          {/* Center: Logo */}
          <div className="flex-grow flex justify-center items-center">
            <Link
              href="/"
              title="Accueil Diamant Rouge"
              className="inline-block relative group"
            >
              <Image
                src="/images/diamant-rouge-logo.svg"
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={scrolled ? 200 : 240}
                height={scrolled ? 50 : 60}
                className="object-contain transition-all duration-500"
                priority
              />
              <div className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-all duration-300"></div>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-brandGold hover:scale-110 transition-transform duration-300"
              title="Rechercher"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <Link href="/wishlist" title="Vos pièces favorites" className="relative group">
              <Heart 
                size={20} 
                strokeWidth={1.5}
                className="text-brandGold group-hover:scale-110 transition-transform duration-300" 
                fill={wishlist.length > 0 ? "#D4AF37" : "none"} 
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            <Link href="/cart" title="Votre panier" className="relative group">
              <ShoppingBag 
                size={20} 
                strokeWidth={1.5}
                className="text-brandGold group-hover:scale-110 transition-transform duration-300"
              />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {session?.user?.role === "admin" && (
              <Link href="/admin" title="Administration" className="hidden md:block">
                <ShieldCheck size={20} strokeWidth={1.5} className="text-brandGold hover:scale-110 transition-transform duration-300" />
              </Link>
            )}
          </div>
        </div>

        {/* Nav Line Decoration */}
        <div className="hidden md:flex justify-center">
          <div className="h-[1px] w-1/3 bg-gradient-to-r from-transparent via-brandGold/40 to-transparent my-1"></div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center my-2 font-serif">
          <div className="flex items-center justify-center space-x-1">
            <NavLink href="/">ACCUEIL</NavLink>
            
            {/* Collections Dropdown */}
            <div className="relative group" ref={collectionsMenuRef}>
              <button 
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group flex items-center gap-1"
              >
                <span>COLLECTIONS</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${collectionsOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
              </button>
              
              {/* Collection Items Dropdown */}
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-48 bg-brandIvory shadow-luxury border border-brandGold/10 rounded py-2 mt-1 transition-all duration-300 ${collectionsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-brandIvory border-t border-l border-brandGold/10"></div>
                <Link href="/collections/bagues" className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200">
                  Bagues
                </Link>
                <Link href="/collections/colliers" className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200">
                  Colliers
                </Link>
                <Link href="/collections/bracelets" className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200">
                  Bracelets
                </Link>
                <Link href="/collections/boucles" className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200">
                  Boucles d'oreilles
                </Link>
                <div className="h-px w-full bg-brandGold/10 my-1"></div>
                <Link href="/collections" className="block px-4 py-2 text-sm text-brandGold hover:bg-brandGold/5 transition-colors duration-200">
                  Voir toutes les collections
                </Link>
              </div>
            </div>
            
            <NavLink href="/jewelry">JOAILLERIE</NavLink>
            <NavLink href="/appointments">RENDEZ-VOUS</NavLink>
            <NavLink href="/the-house">LA MAISON</NavLink>
            <NavLink href="/contact">CONTACT</NavLink>
          </div>
        </nav>

        {/* Diamond Accent Line - Bottom */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-[1px] w-60 bg-gradient-to-r from-transparent via-brandGold to-transparent my-1.5"></div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Diamond size={7} className="text-brandGold fill-brandGold" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-richEbony/80 z-50 flex items-start justify-center pt-28"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="w-full max-w-2xl px-6"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-brandGold font-serif text-3xl">Recherche</h2>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-brandIvory hover:text-brandGold transition-colors duration-300"
                >
                  <X size={28} />
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="relative mx-auto w-full">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brandGold/40 to-transparent mb-4"></div>
                <input
                  type="text"
                  placeholder="Rechercher des créations, des collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-brandIvory text-xl py-3 px-2 pr-12 outline-none focus:ring-0 placeholder-brandIvory/50"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brandGold hover:scale-110 transition-transform duration-300"
                >
                  <Search size={24} />
                </button>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brandGold/40 to-transparent mt-4"></div>
              </form>
              
              <div className="mt-14">
                <h3 className="text-brandIvory/70 text-sm uppercase tracking-widest mb-6 text-center">Explorez nos collections</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <SearchCategoryLink href="/collections/bagues" label="Bagues" count={22} onClick={() => setSearchOpen(false)} />
                  <SearchCategoryLink href="/collections/colliers" label="Colliers" count={18} onClick={() => setSearchOpen(false)} />
                  <SearchCategoryLink href="/collections/bracelets" label="Bracelets" count={14} onClick={() => setSearchOpen(false)} />
                  <SearchCategoryLink href="/collections/boucles" label="Boucles d'oreilles" count={16} onClick={() => setSearchOpen(false)} />
                </div>
                
                <div className="text-center mt-10">
                  <Link 
                    href="/collections" 
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex items-center text-brandGold hover:text-brandGold/80 transition-colors duration-300"
                  >
                    <span className="text-sm uppercase tracking-wider font-medium">Voir toutes nos créations</span>
                    <Diamond size={10} className="ml-2 fill-brandGold" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {navOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
              className="bg-brandIvory w-4/5 max-w-xs h-full ml-auto flex flex-col"
            >
              <div className="p-6 border-b border-brandGold/10">
                <div className="flex justify-between items-center">
                  <Link href="/" onClick={() => setNavOpen(false)}>
                    <Image
                      src="/images/diamant-rouge-logo.svg"
                      alt="Diamant Rouge"
                      width={140}
                      height={36}
                      className="object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setNavOpen(false)}
                    className="text-richEbony hover:text-brandGold transition-colors duration-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto py-6 px-6">
                <nav className="space-y-5">
                  <MobileNavLink href="/" label="Accueil" onClick={() => setNavOpen(false)} />
                  <MobileNavLink href="/collections" label="Collections" onClick={() => setNavOpen(false)} />
                  <MobileNavLink href="/jewelry" label="Joaillerie" onClick={() => setNavOpen(false)} />
                  <MobileNavLink href="/appointments" label="Rendez-vous" onClick={() => setNavOpen(false)} />
                  <MobileNavLink href="/the-house" label="La Maison" onClick={() => setNavOpen(false)} />
                  <MobileNavLink href="/contact" label="Contact" onClick={() => setNavOpen(false)} />
                </nav>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-brandGold/30 to-transparent my-6"></div>
                
                <div className="space-y-3">
                  {session ? (
                    <>
                      <MobileNavLink href="/profile" label="Mon Compte" onClick={() => setNavOpen(false)} />
                      <MobileNavLink href="/orders" label="Mes Commandes" onClick={() => setNavOpen(false)} />
                      <MobileNavLink href="/wishlist" label="Mes Favoris" onClick={() => setNavOpen(false)} />
                      <button
                        onClick={() => {
                          signOut();
                          setNavOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-left py-2 text-burgundy hover:text-brandGold transition-colors duration-200"
                      >
                        <span className="font-medium">Se déconnecter</span>
                        <LogOut size={18} />
                      </button>
                    </>
                  ) : (
                    <MobileNavLink href="/auth" label="Connexion / Inscription" onClick={() => setNavOpen(false)} />
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-brandGold/10 bg-brandGold/5">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <PhoneCall size={16} className="text-brandGold" />
                    <a 
                      href="tel:+212555000111" 
                      className="text-richEbony hover:text-brandGold transition-colors duration-200"
                    >
                      +212 555 000 111
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-brandGold" />
                    <a 
                      href="https://wa.me/212555000111" 
                      className="text-richEbony hover:text-brandGold transition-colors duration-200"
                    >
                      WhatsApp
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-brandGold" />
                    <span className="text-platinumGray">Lun-Sam: 9h-19h</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Desktop Navigation Link Component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <>
      <Link
        href={href}
        className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
      >
        <span>{children}</span>
        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
      </Link>
      <span className="text-brandGold/30">•</span>
    </>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2 text-richEbony font-medium font-serif hover:text-brandGold transition-colors duration-200 border-b border-brandGold/5"
    >
      {label}
    </Link>
  );
}

// Search Category Link Component
function SearchCategoryLink({ href, label, count, onClick }: { href: string; label: string; count: number; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center group" 
      onClick={onClick}
    >
      <span className="font-serif text-brandIvory text-lg group-hover:text-brandGold transition-colors duration-300">
        {label}
      </span>
      <span className="text-xs text-brandIvory/50 mt-1">
        {count} créations
      </span>
    </Link>
  );
}