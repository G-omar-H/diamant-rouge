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
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
  Phone
} from "lucide-react";
import { useRouter } from "next/router";
import axios from "axios";

// Interface for search results
interface SearchResult {
  id: number;
  name: string;
  image: string;
  category: string;
  categoryName?: string;
  price: number;
  slug?: string;
  description?: string;
}

export default function Header() {
  const { cart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Refs
  const collectionsMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

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

  // Load recent searches from localStorage
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      try {
        const parsedSearches = JSON.parse(storedSearches);
        if (Array.isArray(parsedSearches)) {
          setRecentSearches(parsedSearches.slice(0, 5)); // Keep only 5 most recent
        }
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);
  
  // Save search to recent searches
  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    
    const newRecentSearches = [
      query,
      ...recentSearches.filter(s => s !== query) // Remove duplicates
    ].slice(0, 5); // Keep only 5 most recent
    
    setRecentSearches(newRecentSearches);
    
    try {
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    } catch (e) {
      console.error('Error saving recent searches:', e);
    }
  };

  // Refined animation variants for an elegant transition
  const headerVariants = {
    initial: {
      height: "auto",
      backgroundColor: "rgba(250, 243, 227, 0.98)", // Keep solid background
      boxShadow: "none",
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    scrolled: {
      height: "70px",
      backgroundColor: "rgba(250, 243, 227, 0.98)",
      boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)",
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  // Effect to search products when query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        searchProducts(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Function to search products from the API
  const searchProducts = async (query: string) => {
    if (!query) return;
    
    setIsSearching(true);
    try {
      let endpoint = `/api/products/search?q=${encodeURIComponent(query)}`;
      
      // Add category filter if selected
      if (searchCategory) {
        endpoint += `&category=${encodeURIComponent(searchCategory)}`;
      }
      
      // Add locale for localized search results
      if (router.locale) {
        endpoint += `&locale=${router.locale}`;
      }
      
      const { data } = await axios.get(endpoint);
      if (data && data.results) {
        setSearchResults(data.results);
        
        // Only add to recent searches if there are results and it's a user-initiated search
        if (data.results.length > 0) {
          addToRecentSearches(query);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
    }
  };

  // Handle product click - navigate to product and close search
  const handleProductClick = (category: string, id: number) => {
    router.push(`/collections/${category}/${id}`);
      setSearchOpen(false);
      setSearchQuery("");
    setSearchResults([]);
  };

  // Enhanced keyboard navigation within search results
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => {
          const newIndex = prev < searchResults.length - 1 ? prev + 1 : 0;
          // Scroll the item into view if needed
          const resultItem = searchResultsRef.current?.children[newIndex] as HTMLElement;
          resultItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : searchResults.length - 1;
          // Scroll the item into view if needed
          const resultItem = searchResultsRef.current?.children[newIndex] as HTMLElement;
          resultItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          return newIndex;
        });
        break;
        
      case 'Enter':
        if (selectedResultIndex >= 0) {
          e.preventDefault();
          const selected = searchResults[selectedResultIndex];
          handleProductClick(selected.category, selected.id);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        break;
        
      default:
        break;
    }
  };

  // Reset selected result when results change
  useEffect(() => {
    setSelectedResultIndex(-1);
  }, [searchResults]);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Reset search when closed
  useEffect(() => {
    if (!searchOpen) {
      setSearchCategory("");
    }
  }, [searchOpen]);

  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-40"
      variants={headerVariants}
      initial="initial"
      animate={scrolled ? "scrolled" : "initial"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      layout
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
                    <Link 
                      href="/profile" 
                      locale={router.locale} 
                      className="hover:text-brandGold transition-colors duration-300"
                    >
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
                  <Link 
                    href="/auth" 
                    locale={router.locale} 
                    className="hover:text-brandGold transition-colors duration-300"
                  >
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
          <div className={`grid grid-cols-3 items-center w-full ${scrolled ? 'h-[70px] px-8' : 'py-1 px-4 md:px-8'}`}>
            {/* Left side: Navigation or mobile menu button */}
            <div className="flex items-center">
              {scrolled ? (
                <>
                  {/* Left: Desktop Navigation when scrolled */}
                  <div className="hidden md:flex items-center justify-start">
                    <nav className="flex items-center space-x-2 font-serif">
                      <Link 
                        href="/" 
                        locale={router.locale} 
                        className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300"
                      >
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
                          <Link 
                            href="/collections?category=rings" 
                            locale={router.locale}
                            className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                          >
                            Bagues
                          </Link>
                          <Link 
                            href="/collections?category=necklaces" 
                            locale={router.locale}
                            className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                          >
                            Colliers
                          </Link>
                          <Link 
                            href="/collections?category=bracelets"
                            locale={router.locale}
                            className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                          >
                            Bracelets
                          </Link>
                          <Link 
                            href="/collections?category=earrings"
                            locale={router.locale}
                            className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                          >
                            Boucles d'oreilles
                          </Link>
                          <Link 
                            href="/collections"
                            locale={router.locale}
                            className="block px-4 py-2 text-sm text-brandGold hover:bg-brandGold/5 transition-colors duration-200"
                          >
                            Voir toutes les collections
                          </Link>
                        </div>
                      </div>
                      <span className="text-brandGold/30 text-xs">•</span>
                      <Link 
                        href="/jewelry"
                        locale={router.locale}
                        className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300"
                      >
                        JOAILLERIE
                      </Link>
                    </nav>
                  </div>

                  {/* Mobile menu button - visible when scrolled */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setNavOpen(true)}
                      title="Ouvrir le menu"
                      className="text-brandGold hover:scale-110 transition-transform duration-300 p-1.5 -ml-1"
                    >
                      <Menu size={22} strokeWidth={1.75} />
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
                      className="text-brandGold hover:scale-110 transition-transform duration-300 p-1.5 -ml-1"
                    >
                      <Menu size={22} strokeWidth={1.75} />
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
                locale={router.locale}
                title="Accueil Diamant Rouge"
                className="inline-block relative group"
              >
                <Image
                  src="/images/1/diamant-rouge-logo.svg"
                  alt="Diamant Rouge - Joaillerie de Luxe"
                  width={scrolled ? 180 : 200}
                  height={scrolled ? 45 : 50}
                  className="object-contain transition-all duration-500"
                  priority
                />
                <span className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right side: Navigation when scrolled and icons */}
            <div className="flex items-center justify-end gap-3 md:gap-6">
              {/* When scrolled, show the right navigation */}
              {scrolled ? (
                <div className="hidden md:flex items-center justify-end mr-5">
                  <nav className="flex items-center space-x-2 font-serif">
                    <Link 
                      href="/appointments" 
                      locale={router.locale} 
                      className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300"
                    >
                      RENDEZ-VOUS
                    </Link>
                    <span className="text-brandGold/30 text-xs">•</span>
                    <Link 
                      href="/the-house" 
                      locale={router.locale} 
                      className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300"
                    >
                      LA MAISON
                    </Link>
                    <span className="text-brandGold/30 text-xs">•</span>
                    <Link 
                      href="/contact" 
                      locale={router.locale} 
                      className="px-3 text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300"
                    >
                      CONTACT
                    </Link>
                  </nav>
                </div>
              ) : null}

              {/* Right: Icons - always visible */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-brandGold hover:scale-110 transition-transform duration-300 hidden md:block"
                  title="Rechercher"
                >
                  <Search size={scrolled ? 18 : 20} strokeWidth={1.5} />
                </button>

                <button
                  onClick={toggleWishlist}
                  className="relative group"
                  title="Mes Favoris"
                  aria-label="Favoris"
                >
                  <Heart
                    size={scrolled ? 18 : 20}
                    strokeWidth={1.5}
                    className="text-brandGold group-hover:scale-110 transition-transform duration-300"
                  />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-burgundy text-brandIvory text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <Link 
                  href="/cart" 
                  locale={router.locale}
                  title="Votre panier" 
                  className="relative group"
                >
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

                {/* User account icon - visible when logged in */}
                {session?.user?.role === "customer" && (
                  <Link 
                    href="/profile" 
                    locale={router.locale}
                    title="Mon compte" 
                    className="relative group"
                  >
                    <User
                      size={scrolled ? 18 : 20}
                      strokeWidth={1.5}
                      className="text-brandGold group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                )}

                {session?.user?.role === "admin" && (
                  <Link 
                    href="/admin" 
                    locale={router.locale}
                    title="Administration" 
                    className="hidden md:block"
                  >
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
                    locale={router.locale}
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
                      <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-brandIvory border-t border-l border-brandGold/10"></div>
                      <Link 
                        href="/collections?category=rings"
                        locale={router.locale}
                        className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                      >
                        Bagues
                      </Link>
                      <Link 
                        href="/collections?category=necklaces"
                        locale={router.locale}
                        className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                      >
                        Colliers
                      </Link>
                      <Link 
                        href="/collections?category=bracelets"
                        locale={router.locale}
                        className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                      >
                        Bracelets
                      </Link>
                      <Link 
                        href="/collections?category=earrings"
                        locale={router.locale}
                        className="block px-4 py-2 text-sm hover:bg-brandGold/5 hover:text-brandGold transition-colors duration-200"
                      >
                        Boucles d'oreilles
                      </Link>
                      <Link 
                        href="/collections"
                        locale={router.locale}
                        className="block px-4 py-2 text-sm text-brandGold hover:bg-brandGold/5 transition-colors duration-200"
                      >
                        Voir toutes les collections
                      </Link>
                    </div>
                  </div>

                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/jewelry"
                    locale={router.locale}
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>JOAILLERIE</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/appointments"
                    locale={router.locale}
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>RENDEZ-VOUS</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/the-house"
                    locale={router.locale}
                    className="px-5 py-1 text-center text-sm tracking-widest font-medium hover:text-brandGold transition-all duration-300 relative group"
                  >
                    <span>LA MAISON</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[1px] bg-brandGold transition-all duration-300 group-hover:w-1/2"></span>
                  </Link>
                  <span className="text-brandGold/30 mx-1">•</span>
                  <Link
                    href="/contact"
                    locale={router.locale}
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
            className="fixed inset-0 bg-richEbony/80 z-50 flex items-start justify-center pt-28 md:pt-28 px-4 md:px-0"
            onClick={(e) => {
              if ((e.target as HTMLElement).classList.contains('fixed')) {
                setSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="w-full max-w-2xl"
              onKeyDown={handleSearchKeyDown}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 md:mb-10">
                <h2 className="text-brandGold font-serif text-2xl md:text-3xl">Recherche</h2>
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setSearchCategory("");
                  }}
                  className="text-brandIvory hover:text-brandGold transition-colors duration-300 p-1"
                  aria-label="Fermer la recherche"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="relative mx-auto w-full">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brandGold/40 to-transparent mb-4"></div>
                
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <div className="relative flex-grow">
                <input
                      ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher des créations, des collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-brandIvory text-lg md:text-xl py-3 px-2 pr-12 outline-none focus:ring-0 placeholder-brandIvory/50"
                  autoFocus
                      aria-label="Rechercher des produits"
                    />
                    <button
                      type="button"
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-brandIvory/50 hover:text-brandGold transition-colors duration-300"
                      onClick={() => setSearchQuery('')}
                      aria-label="Effacer la recherche"
                      style={{ visibility: searchQuery ? 'visible' : 'hidden' }}
                    >
                      <X size={16} />
                    </button>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brandGold hover:scale-110 transition-transform duration-300"
                  aria-label="Rechercher"
                >
                  <Search size={22} />
                </button>
                  </div>
                  
                  <select
                    value={searchCategory}
                    onChange={(e) => {
                      setSearchCategory(e.target.value);
                      if (searchQuery.trim().length >= 2) {
                        searchProducts(searchQuery.trim());
                      }
                    }}
                    className="bg-transparent border border-brandGold/30 rounded text-brandIvory py-2 px-3 focus:border-brandGold focus:ring-1 focus:ring-brandGold md:w-48"
                    aria-label="Filtrer par catégorie"
                  >
                    <option value="" className="bg-richEbony">Toutes catégories</option>
                    <option value="bagues" className="bg-richEbony">Bagues</option>
                    <option value="colliers" className="bg-richEbony">Colliers</option>
                    <option value="bracelets" className="bg-richEbony">Bracelets</option>
                    <option value="boucles" className="bg-richEbony">Boucles d'oreilles</option>
                  </select>
                </div>
                
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brandGold/40 to-transparent mt-4"></div>
              </form>

              {/* Recent Searches */}
              {!isSearching && !searchResults.length && recentSearches.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-brandIvory/70 text-xs uppercase tracking-widest mb-3">Recherches récentes</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(term);
                          searchProducts(term);
                        }}
                        className="bg-brandIvory/10 text-brandIvory/90 text-sm px-3 py-1 rounded-full hover:bg-brandGold/20 transition-colors duration-200 flex items-center"
                      >
                        <span>{term}</span>
                      </button>
                    ))}
                    {recentSearches.length > 0 && (
                      <button 
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('recentSearches');
                        }}
                        className="text-brandIvory/50 text-xs hover:text-brandGold transition-colors duration-200 px-2"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="mt-8">
                {isSearching && (
                  <div className="text-center py-8">
                    <div className="inline-block w-6 h-6 border-2 border-brandGold border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-brandIvory/70 mt-2 text-sm">Recherche en cours...</p>
                  </div>
                )}

                {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-brandIvory/90 text-lg">Aucun résultat trouvé pour "{searchQuery}"</p>
                    <p className="text-brandIvory/60 mt-2 text-sm">
                      {searchCategory 
                        ? `Essayez de rechercher dans une autre catégorie ou modifiez votre requête.` 
                        : `Essayez avec d'autres termes ou explorez nos collections ci-dessous.`
                      }
                    </p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-brandIvory/90 text-sm uppercase tracking-widest">
                        Résultats ({searchResults.length})
                      </h3>
                      
                      {searchResults.length > 1 && (
                        <div className="flex items-center gap-2">
                          <span className="text-brandIvory/50 text-xs">Trier par:</span>
                          <button 
                            onClick={() => {
                              const sorted = [...searchResults].sort((a, b) => 
                                a.name.localeCompare(b.name, router.locale || 'fr')
                              );
                              setSearchResults(sorted);
                            }}
                            className="text-xs text-brandIvory/70 hover:text-brandGold px-2 py-1 rounded transition-colors"
                          >
                            Nom
                          </button>
                          <button 
                            onClick={() => {
                              const sorted = [...searchResults].sort((a, b) => 
                                (typeof a.price === 'number' && typeof b.price === 'number') 
                                  ? a.price - b.price 
                                  : 0
                              );
                              setSearchResults(sorted);
                            }}
                            className="text-xs text-brandIvory/70 hover:text-brandGold px-2 py-1 rounded transition-colors"
                          >
                            Prix
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      ref={searchResultsRef}
                      className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2"
                    >
                      {searchResults.map((result, index) => (
                        <div 
                          key={result.id}
                          onClick={() => handleProductClick(result.category, result.id)}
                          className={`flex items-center gap-4 p-3 rounded cursor-pointer transition-colors duration-200 ${
                            index === selectedResultIndex 
                              ? 'bg-brandGold/20 ring-1 ring-brandGold/50' 
                              : 'bg-brandIvory/5 hover:bg-brandIvory/10'
                          }`}
                          tabIndex={0}
                          onMouseEnter={() => setSelectedResultIndex(index)}
                          aria-selected={index === selectedResultIndex}
                        >
                          <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-brandIvory/10">
                            {result.image ? (
                              <Image 
                                src={result.image} 
                                alt={result.name} 
                                width={64} 
                                height={64} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, replace with default
                                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-brandGold/10">
                                <Diamond size={24} className="text-brandGold" />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="text-brandIvory font-medium">{result.name}</h4>
                              <p className="text-brandGold font-serif ml-2">{(typeof result.price === 'number' ? result.price : 0).toLocaleString('fr-FR')} €</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-brandIvory/60 text-xs">
                                {result.categoryName || result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                              </span>
                              {result.description && (
                                <span className="text-brandIvory/40 text-xs ml-2 line-clamp-1">• {result.description.substring(0, 40)}...</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Show categories if no search or if results are shown but there's still space */}
              {(searchQuery.length < 2 || (!isSearching && searchResults.length > 0)) && (
                <div className={`${searchResults.length > 0 ? 'mt-10 pt-6 border-t border-brandGold/20' : 'mt-10'} md:mt-14`}>
                <h3 className="text-brandIvory/70 text-xs md:text-sm uppercase tracking-widest mb-6 text-center">Explorez nos collections</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
  <CategoryLink href="/collections?category=bagues" label="Bagues" count={22} onClick={() => setSearchOpen(false)} locale={router.locale} />
  <CategoryLink href="/collections?category=colliers" label="Colliers" count={18} onClick={() => setSearchOpen(false)} locale={router.locale} />
  <CategoryLink href="/collections?category=bracelets" label="Bracelets" count={14} onClick={() => setSearchOpen(false)} locale={router.locale} />
  <CategoryLink href="/collections?category=boucles" label="Boucles d'oreilles" count={16} onClick={() => setSearchOpen(false)} locale={router.locale} />
</div>

                <div className="text-center mt-8 md:mt-10">
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
              )}
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
              <div className="p-4 md:p-6 border-b border-brandGold/10 flex justify-between items-center">
                  <Link href="/" onClick={() => setNavOpen(false)}>
                    <Image
                      src="/images/1/diamant-rouge-logo-full.svg"
                      alt="Diamant Rouge"
                    width={130}
                    height={32}
                      className="object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setNavOpen(false)}
                  className="text-richEbony hover:text-brandGold transition-colors duration-300 p-1.5 rounded-full hover:bg-brandGold/5"
                  aria-label="Close menu"
                  >
                  <X size={22} />
                  </button>
              </div>

              <div className="flex-grow overflow-y-auto py-6 px-6">
                {/* Elegant gold accent line */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Diamond size={6} className="text-brandGold fill-brandGold" />
                    </div>
                  </div>
                </div>
                
                {/* Search bar in mobile menu */}
                <div className="mb-6">
                  <div 
                    className="flex items-center p-3 bg-richEbony/5 rounded-md border border-brandGold/10 text-richEbony/80"
                    onClick={() => {
                      setNavOpen(false);
                      setTimeout(() => setSearchOpen(true), 300);
                    }}
                  >
                    <Search size={18} className="text-brandGold mr-3" />
                    <span className="text-sm">Rechercher nos créations</span>
                  </div>
                </div>
                
                <nav className="space-y-1 mb-8">
                  <MobileLink href="/" locale={router.locale} onClick={() => setNavOpen(false)}>Accueil</MobileLink>
                  <MobileLink href="/collections" locale={router.locale} onClick={() => setNavOpen(false)}>Collections</MobileLink>
                  <MobileLink href="/jewelry" locale={router.locale} onClick={() => setNavOpen(false)}>Joaillerie</MobileLink>
                  <MobileLink href="/appointments" locale={router.locale} onClick={() => setNavOpen(false)}>Rendez-vous</MobileLink>
                  <MobileLink href="/the-house" locale={router.locale} onClick={() => setNavOpen(false)}>La Maison</MobileLink>
                  <MobileLink href="/contact" locale={router.locale} onClick={() => setNavOpen(false)}>Contact</MobileLink>
                </nav>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-brandGold/30 to-transparent my-6"></div>

                <div className="space-y-1">
                  {session ? (
                    <>
                      <MobileLink href="/profile" locale={router.locale} onClick={() => setNavOpen(false)}>Mon Compte</MobileLink>
                      <MobileLink href="/orders" locale={router.locale} onClick={() => setNavOpen(false)}>Mes Commandes</MobileLink>
                      <MobileLink href="/wishlist" locale={router.locale} onClick={() => setNavOpen(false)}>Mes Favoris</MobileLink>
                      {session.user?.role === "admin" && (
                        <MobileLink href="/admin" locale={router.locale} onClick={() => setNavOpen(false)}>
                          <div className="flex items-center">
                            <ShieldCheck size={18} className="text-brandGold mr-2" />
                            <span>Administration</span>
                          </div>
                        </MobileLink>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setNavOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-left py-3 px-1 text-burgundy hover:text-brandGold transition-colors duration-200 border-b border-brandGold/10"
                      >
                        <span className="font-medium">Se déconnecter</span>
                        <LogOut size={18} />
                      </button>
                    </>
                  ) : (
                    <MobileLink href="/auth" locale={router.locale} onClick={() => setNavOpen(false)}>Connexion / Inscription</MobileLink>
                  )}
                </div>
                
                {/* Contact info in mobile menu */}
                <div className="mt-8 pt-6 border-t border-brandGold/10">
                  <h5 className="text-sm text-brandGold mb-4 font-medium">Contactez-nous</h5>
                  <div className="space-y-3">
                    <a href="tel:+212555000111" className="flex items-center gap-2 text-sm text-platinumGray hover:text-brandGold transition-colors duration-200">
                      <Phone size={14} className="text-brandGold" />
                      <span>+212 555 000 111</span>
                    </a>
                    <div className="flex items-center gap-2 text-sm text-platinumGray">
                      <Clock size={14} className="text-brandGold" />
                      <span>Lun-Sam: 9h-19h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-brandGold/10 flex justify-center">
                <div className="flex space-x-5">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-platinumGray hover:text-brandGold transition-colors p-2" aria-label="Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-platinumGray hover:text-brandGold transition-colors p-2" aria-label="Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-platinumGray hover:text-brandGold transition-colors p-2" aria-label="Twitter">
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Helper components
interface CategoryLinkProps {
  href: string;
  label: string;
  count: number;
  onClick: () => void;
  locale?: string | undefined;
}

// Category link component for search overlay using modern Next.js Link
function CategoryLink({ href, label, count, onClick, locale }: CategoryLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      locale={locale}
      className="group flex flex-col items-center p-2"
    >
      <span className="text-brandGold text-xs mb-1">{count}</span>
      <span className="text-brandIvory group-hover:text-brandGold transition-colors duration-300 mb-1 text-sm md:text-base">
        {label}
      </span>
      <span className="block h-[1px] w-0 bg-brandGold transition-all duration-300 group-hover:w-12"></span>
    </Link>
  );
}

// Mobile link component for mobile navigation using modern Next.js Link
interface MobileLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  locale?: string | undefined;
}

function MobileLink({ href, children, onClick, locale }: MobileLinkProps) {
  return (
    <Link
      href={href}
      locale={locale}
      onClick={onClick}
      className="mobile-nav-link"
    >
      {children}
    </Link>
  );
}