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

  // Handle scroll effect with precise threshold
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  // Refined animation variants for an elegant transition
  const headerVariants = {
    initial: { 
      height: "auto",
      backgroundColor: "rgba(250, 243, 227, 0.98)", // Keep solid background
      boxShadow: "none"
    },
    scrolled: { 
      height: "90px", 
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
      className="fixed top-0 left-0 w-full z-40"
      variants={headerVariants}
      initial="initial"
      animate={scrolled ? "scrolled" : "initial"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Container with conditional styling based on scroll position */}
      <div className={`w-full bg-brandIvory ${scrolled ? 'border-b border-brandGold/20 shadow-sm' : ''}`}>
        {/* Gold accent line top - only visible when not scrolled */}
        {!scrolled && (
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-[1px] w-60 bg-gradient-to-r from-transparent via-brandGold to-transparent my-1.5"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Diamond size={7} className="text-brandGold fill-brandGold" />
              </div>
            </div>
          </div>
        )}

        {/* Main header content layout - adjusts when scrolled */}
        <div className="mx-auto flex flex-col">
          {/* Top Bar: Store Info & Account - Only visible when not scrolled */}
          {!scrolled && (
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
          )}

          {/* Main Row: Perfect symmetrical positioning */}
          <div className={`grid grid-cols-3 items-center w-full ${scrolled ? 'h-[90px] px-8' : 'py-3 px-4 md:px-8'}`}>
            {/* Left side: Navigation or mobile menu button */}
            <div className="flex items-center">
              {scrolled ? (
                <>
                  {/* Left: Desktop Navigation when scrolled */}
                  <div className="hidden md:flex items-center justify-start">
                    <nav className="flex items-center space-x-2 font-serif">
                      <Link href="/" className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300">
                        ACCUEIL
                      </Link>
                      <span className="text-brandGold/30 text-xs">•</span>
                      <div className="relative" ref={collectionsMenuRef}>
                        <button 
                          onClick={() => setCollectionsOpen(!collectionsOpen)}
                          className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-colors duration-300 flex items-center"
                        >
                          <span>COLLECTIONS</span>
                          <ChevronDown size={12} className={`ml-1 transition-transform duration-300 ${collectionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div className={`absolute top-full left-0 w-48 bg-brandIvory shadow-luxury border border-brandGold/10 rounded py-2 z-50 transition-all duration-300 ${collectionsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                          <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-brandIvory border-t border-l border-brandGold/10"></div>
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
                        </div>
                      </div>
                      <span className="text-brandGold/30 text-xs">•</span>
                      <Link href="/jewelry" className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300">
                        JOAILLERIE
                      </Link>
                    </nav>
                  </div>
                  
                  {/* Mobile menu button - visible when scrolled */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setNavOpen(true)}
                      title="Ouvrir le menu"
                      className="text-brandGold hover:scale-110 transition-transform duration-300"
                    >
                      <Menu size={24} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile menu button - visible when not scrolled */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setNavOpen(true)}
                      title="Ouvrir le menu"
                      className="text-brandGold hover:scale-110 transition-transform duration-300"
                    >
                      <Menu size={24} />
                    </button>
                  </div>
                  {/* This div ensures proper spacing in the grid layout when not showing navigation */}
                  <div className="hidden md:block"></div>
                </>
              )}
            </div>

            {/* Center: Logo - perfectly centered */}
            <div className="flex justify-center items-center">
              <Link
                href="/"
                title="Accueil Diamant Rouge"
                className="inline-block relative group"
              >
                <Image
                  src="/images/1/diamant-rouge-logo.svg"
                  alt="Diamant Rouge - Joaillerie de Luxe"
                  width={scrolled ? 180 : 240}
                  height={scrolled ? 45 : 60}
                  className="object-contain transition-all duration-500"
                  priority
                />
                <span className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right side: Navigation when scrolled and icons */}
            <div className="flex items-center justify-end gap-3">
              {/* When scrolled, show the right navigation */}
              {scrolled ? (
                <div className="hidden md:flex items-center justify-end mr-5">
                  <nav className="flex items-center space-x-2 font-serif">
                    <Link href="/appointments" className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300">
                      RENDEZ-VOUS
                    </Link>
                    <span className="text-brandGold/30 text-xs">•</span>
                    <Link href="/the-house" className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300">
                      LA MAISON
                    </Link>
                    <span className="text-brandGold/30 text-xs">•</span>
                    <Link href="/contact" className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300">
                      CONTACT
                    </Link>
                  </nav>
                </div>
              ) : null}

              {/* Right: Icons - always visible */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="text-brandGold hover:scale-110 transition-transform duration-300"
                  title="Rechercher"
                >
                  <Search size={scrolled ? 18 : 20} strokeWidth={1.5} />
                </button>
                
                <Link href="/wishlist" title="Vos pièces favorites" className="relative group">
                  <Heart 
                    size={scrolled ? 18 : 20}  
                    strokeWidth={1.5}
                    className="text-brandGold group-hover:scale-110 transition-transform duration-300" 
                    fill={wishlist.length > 0 ? "#D4AF37" : "none"} 
                  />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                
                <Link href="/cart" title="Votre panier" className="relative group">
                  <ShoppingBag 
                    size={scrolled ? 18 : 20}
                    strokeWidth={1.5}
                    className="text-brandGold group-hover:scale-110 transition-transform duration-300"
                  />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
                
                {session?.user?.role === "admin" && (
                  <Link href="/admin" title="Administration" className="hidden md:block">
                    <ShieldCheck size={scrolled ? 18 : 20} strokeWidth={1.5} className="text-brandGold hover:scale-110 transition-transform duration-300" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Nav Line Decoration & Navigation - Only visible when not scrolled */}
          {!scrolled && (
            <>
              <div className="hidden md:flex justify-center">
                <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-brandGold/40 to-transparent my-1"></div>
              </div>

              {/* Desktop Navigation - Only visible when not scrolled */}
              <nav className="hidden md:flex justify-center my-2 font-serif">
                <div className="flex items-center justify-center">
                  <Link
                    href="/"
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>ACCUEIL</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                  <span className="text-brandGold/30 mx-1">•</span>
                  
                  <div className="relative group" ref={collectionsMenuRef}>
                    <button 
                      onClick={() => setCollectionsOpen(!collectionsOpen)}
                      className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group flex items-center gap-1"
                    >
                      <span>COLLECTIONS</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${collectionsOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                    </button>
                    
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-48 bg-brandIvory shadow-luxury border border-brandGold/10 rounded py-2 mt-1 transition-all duration-300 ${collectionsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} z-50`}>
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
                  
                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/jewelry"
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>JOAILLERIE</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/appointments"
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>RENDEZ-VOUS</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/the-house"
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>LA MAISON</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/contact"
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>CONTACT</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                </div>
              </nav>

              {/* Diamond Accent Line - Bottom - Only visible when not scrolled */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-[1px] w-60 bg-gradient-to-r from-transparent via-brandGold to-transparent my-1.5"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Diamond size={7} className="text-brandGold fill-brandGold" />
                  </div>
                </div>
              </div>
            </>
          )}
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
                  <CategoryLink href="/collections/bagues" label="Bagues" count={22} onClick={() => setSearchOpen(false)} />
                  <CategoryLink href="/collections/colliers" label="Colliers" count={18} onClick={() => setSearchOpen(false)} />
                  <CategoryLink href="/collections/bracelets" label="Bracelets" count={14} onClick={() => setSearchOpen(false)} />
                  <CategoryLink href="/collections/boucles" label="Boucles d'oreilles" count={16} onClick={() => setSearchOpen(false)} />
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
                      src="/images/1/diamant-rouge-logo-full.svg"
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
                  <MobileLink href="/" onClick={() => setNavOpen(false)}>Accueil</MobileLink>
                  <MobileLink href="/collections" onClick={() => setNavOpen(false)}>Collections</MobileLink>
                  <MobileLink href="/jewelry" onClick={() => setNavOpen(false)}>Joaillerie</MobileLink>
                  <MobileLink href="/appointments" onClick={() => setNavOpen(false)}>Rendez-vous</MobileLink>
                  <MobileLink href="/the-house" onClick={() => setNavOpen(false)}>La Maison</MobileLink>
                  <MobileLink href="/contact" onClick={() => setNavOpen(false)}>Contact</MobileLink>
                </nav>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-brandGold/30 to-transparent my-6"></div>
                
                <div className="space-y-3">
                  {session ? (
                    <>
                      <MobileLink href="/profile" onClick={() => setNavOpen(false)}>Mon Compte</MobileLink>
                      <MobileLink href="/orders" onClick={() => setNavOpen(false)}>Mes Commandes</MobileLink>
                      <MobileLink href="/wishlist" onClick={() => setNavOpen(false)}>Mes Favoris</MobileLink>
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
                    <MobileLink href="/auth" onClick={() => setNavOpen(false)}>Connexion / Inscription</MobileLink>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-brandGol" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}