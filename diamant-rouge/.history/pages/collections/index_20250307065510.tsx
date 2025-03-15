import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import CuratedCollection from "../../components/CuratedCollection";
import type { Product, Category } from "@prisma/client";

// Types that include related data
type EnhancedProduct = Product & { 
  category?: { slug: string; translations: Array<{language: string, name: string}> } | null;
  translations: Array<{language: string, name: string, description: string}>;
  variations: Array<{variationType: string, variationValue: string}>;
};

type CollectionPageProps = {
  products: EnhancedProduct[];
  categories: Array<{slug: string, translations: Array<{language: string, name: string}>}>;
  materials: string[];
  gemTypes: string[];
  locale: string;
  featuredProducts: EnhancedProduct[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale || "fr";

  try {
    // Get categories with translations
    const categoryRecords = await prisma.category.findMany({
      select: { 
        slug: true,
        translations: {
          select: { language: true, name: true }
        }
      },
    });

    // Get products with translations, variations and categories
    const products = await prisma.product.findMany({
      include: {
        translations: true,
        variations: true,
        category: {
          include: {
            translations: {
              select: { language: true, name: true }
            }
          }
        },
      },
    });

    // Extract unique materials and gem types from variations
    const materials = [...new Set(
      products
        .flatMap(p => p.variations)
        .filter(v => v.variationType.toLowerCase().includes('material') || v.variationType.toLowerCase().includes('metal'))
        .map(v => v.variationValue)
    )];

    const gemTypes = [...new Set(
      products
        .flatMap(p => p.variations)
        .filter(v => v.variationType.toLowerCase().includes('gem') || v.variationType.toLowerCase().includes('stone'))
        .map(v => v.variationValue)
    )];

    // Get featured products
    const featuredProducts = products.filter(p => p.featured);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        categories: JSON.parse(JSON.stringify(categoryRecords)),
        materials,
        gemTypes,
        locale,
        featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      },
    };
  } catch (error) {
    console.error("❌ Error fetching collections:", error);
    return {
      props: { 
        products: [], 
        categories: [],
        materials: [],
        gemTypes: [],
        locale,
        featuredProducts: [],
      },
    };
  }
};

export default function CollectionsPage({
  products,
  categories,
  materials,
  gemTypes,
  locale,
  featuredProducts,
}: CollectionPageProps) {
  // ---------- FILTER STATES ----------
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedGemType, setSelectedGemType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<string>("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Find highest price for range
  const maxProductPrice = Math.max(...products.map(p => Number(p.basePrice)));
  const priceRangeMax = Math.ceil(maxProductPrice / 10000) * 10000; // Round up to nearest 10,000

  useEffect(() => {
    setPriceRange([0, priceRangeMax]);
    // Delayed animation trigger for staggered entrance
    setTimeout(() => setAnimate(true), 300);
  }, [priceRangeMax]);

  // ---------- FILTERED PRODUCTS ----------
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory && product.category?.slug !== selectedCategory) {
      return false;
    }
    
    // Price filter
    const basePriceNum = Number(product.basePrice);
    if (basePriceNum < priceRange[0] || basePriceNum > priceRange[1]) {
      return false;
    }
    
    // Material filter
    if (selectedMaterial && !product.variations.some(v => 
      v.variationValue.toLowerCase() === selectedMaterial.toLowerCase()
    )) {
      return false;
    }
    
    // Gem type filter
    if (selectedGemType && !product.variations.some(v => 
      v.variationValue.toLowerCase() === selectedGemType.toLowerCase()
    )) {
      return false;
    }
    
    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case "price-asc":
        return Number(a.basePrice) - Number(b.basePrice);
      case "price-desc":
        return Number(b.basePrice) - Number(a.basePrice);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "featured":
      default:
        return b.featured ? 1 : -1;
    }
  });

  // Get translated category names
  const getCategoryName = (slug: string) => {
    const category = categories.find(cat => cat.slug === slug);
    if (!category) return slug;
    
    const translation = category.translations.find(t => t.language === locale) ||
                       category.translations.find(t => t.language === "fr") ||
                       category.translations[0];
    
    return translation?.name || slug;
  };

  // Get the name of the product in the appropriate language
  const getProductName = (product: EnhancedProduct) => {
    const translation = product.translations.find(t => t.language === locale) || 
                       product.translations.find(t => t.language === "fr") ||
                       product.translations[0];
    return translation?.name || "Produit Sans Nom";
  };

  // Format price with commas and MAD
  const formatPrice = (price: number | string) => {
    return Number(price).toLocaleString('fr-FR') + ' MAD';
  };

  return (
    <>
      <NextSeo
        title="Collections | Diamant Rouge"
        description="Découvrez l'élégance intemporelle des collections Diamant Rouge. Des pièces uniques, fabriquées avec passion et savoir-faire."
        openGraph={{
          title: "Collections | Diamant Rouge",
          description: "Explorez nos créations d'exception, alliant tradition et modernité pour sublimer votre beauté."
        }}
      />

      <div className="min-h-screen bg-brandIvory">
        {/* Hero Banner */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src="/images/collections-hero.jpg" 
              alt="Diamant Rouge Collections" 
              layout="fill"
              objectFit="cover"
              priority
              className="brightness-75"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-richEbony to-transparent opacity-60" />
          <div className="relative h-full flex flex-col justify-end items-center text-center pb-20 px-6 z-10">
            <h1 className="text-5xl md:text-6xl font-serif text-brandIvory mb-4 drop-shadow-lg">
              Collections
            </h1>
            <p className="text-lg md:text-xl text-brandIvory max-w-2xl mx-auto drop-shadow">
              Des créations d'exception, façonnées selon les traditions les plus raffinées pour sublimer votre élégance.
            </p>
          </div>
        </div>

        {/* Featured Collections Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-brandGold mb-8 text-center">Pièces Signature</h2>
            <CuratedCollection products={featuredProducts} locale={locale} />
          </section>
        )}

        {/* Main Collections Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 relative">
            {/* Mobile Filter Toggle */}
            <div className="w-full flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-2xl font-serif text-brandGold">Nos Créations</h2>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 border border-brandGold text-brandGold hover:bg-brandGold hover:text-brandIvory transition-colors rounded-sm"
              >
                {isFilterOpen ? 'Masquer les filtres' : 'Filtrer'}
              </button>
            </div>
            
            {/* Filters Sidebar */}
            <AnimatePresence>
              {(isFilterOpen || !isFilterOpen && window.innerWidth >= 1024) && (
                <motion.aside 
                  className={`lg:sticky top-8 w-full lg:w-72 bg-brandIvory z-20 ${isFilterOpen ? 'fixed inset-0 p-6 overflow-auto' : 'relative'} lg:block`}
                  initial={{ x: isFilterOpen ? -300 : 0, opacity: isFilterOpen ? 0 : 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {isFilterOpen && (
                    <div className="flex justify-between items-center mb-6 lg:hidden">
                      <h3 className="text-2xl font-serif text-brandGold">Filtres</h3>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <div className="space-y-8">
                    {/* Category Filter */}
                    <div>
                      <h3 className="text-lg font-serif text-brandGold mb-3">Catégories</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value=""
                            checked={selectedCategory === ""}
                            onChange={() => setSelectedCategory("")}
                            className="form-radio text-brandGold"
                          />
                          <span className="ml-2 text-richEbony">Toutes</span>
                        </label>
                        
                        {categories.map((category) => (
                          <label key={category.slug} className="flex items-center">
                            <input
                              type="radio"
                              name="category"
                              value={category.slug}
                              checked={selectedCategory === category.slug}
                              onChange={() => setSelectedCategory(category.slug)}
                              className="form-radio text-brandGold"
                            />
                            <span className="ml-2 text-richEbony">{getCategoryName(category.slug)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div>
                      <h3 className="text-lg font-serif text-brandGold mb-3">Prix</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                        
                        <div className="px-2">
                          <input
                            type="range"
                            min="0"
                            max={priceRangeMax}
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            className="w-full accent-brandGold"
                          />
                          
                          <input
                            type="range"
                            min="0"
                            max={priceRangeMax}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full accent-brandGold"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => setPriceRange([0, 25000])}
                            className="px-3 py-1 border border-brandGold text-sm text-brandGold hover:bg-brandGold hover:text-brandIvory transition-colors rounded-sm"
                          >
                            &lt; 25 000 MAD
                          </button>
                          
                          <button 
                            onClick={() => setPriceRange([25000, 50000])}
                            className="px-3 py-1 border border-brandGold text-sm text-brandGold hover:bg-brandGold hover:text-brandIvory transition-colors rounded-sm"
                          >
                            25k - 50k MAD
                          </button>
                          
                          <button 
                            onClick={() => setPriceRange([50000, 100000])}
                            className="px-3 py-1 border border-brandGold text-sm text-brandGold hover:bg-brandGold hover:text-brandIvory transition-colors rounded-sm"
                          >
                            50k - 100k MAD
                          </button>
                          
                          <button 
                            onClick={() => setPriceRange([100000, priceRangeMax])}
                            className="px-3 py-1 border border-brandGold text-sm text-brandGold hover:bg-brandGold hover:text-brandIvory transition-colors rounded-sm"
                          >
                            &gt; 100 000 MAD
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Materials */}
                    {materials.length > 0 && (
                      <div>
                        <h3 className="text-lg font-serif text-brandGold mb-3">Matériaux</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="material"
                              value=""
                              checked={selectedMaterial === ""}
                              onChange={() => setSelectedMaterial("")}
                              className="form-radio text-brandGold"
                            />
                            <span className="ml-2 text-richEbony">Tous</span>
                          </label>
                          
                          {materials.map((material) => (
                            <label key={material} className="flex items-center">
                              <input
                                type="radio"
                                name="material"
                                value={material}
                                checked={selectedMaterial === material}
                                onChange={() => setSelectedMaterial(material)}
                                className="form-radio text-brandGold"
                              />
                              <span className="ml-2 text-richEbony">{material}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Gem Types */}
                    {gemTypes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-serif text-brandGold mb-3">Pierres</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="gemType"
                              value=""
                              checked={selectedGemType === ""}
                              onChange={() => setSelectedGemType("")}
                              className="form-radio text-brandGold"
                            />
                            <span className="ml-2 text-richEbony">Toutes</span>
                          </label>
                          
                          {gemTypes.map((gemType) => (
                            <label key={gemType} className="flex items-center">
                              <input
                                type="radio"
                                name="gemType"
                                value={gemType}
                                checked={selectedGemType === gemType}
                                onChange={() => setSelectedGemType(gemType)}
                                className="form-radio text-brandGold"
                              />
                              <span className="ml-2 text-richEbony">{gemType}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Reset Filters */}
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setSelectedMaterial("");
                        setSelectedGemType("");
                        setPriceRange([0, priceRangeMax]);
                      }}
                      className="w-full py-2 mt-4 border border-burgundy text-burgundy hover:bg-burgundy hover:text-brandIvory transition-colors rounded-sm"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
            
            {/* Products Display */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Desktop Results Header */}
              <div className="hidden lg:flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif text-brandGold">Nos Créations</h2>
                
                <div className="flex items-center space-x-4">
                  {/* Sort Options */}
                  <div className="flex items-center">
                    <label htmlFor="sort" className="text-platinumGray mr-2">Trier par:</label>
                    <select
                      id="sort"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="border-b border-brandGold bg-transparent text-richEbony focus:outline-none py-1 pl-2 pr-8"
                    >
                      <option value="featured">En vedette</option>
                      <option value="newest">Nouveautés</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
                  </div>
                  
                  {/* View Toggles */}
                  <div className="flex border border-brandGold rounded-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-brandGold text-brandIvory' : 'text-brandGold'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1 ${viewMode === 'list' ? 'bg-brandGold text-brandIvory' : 'text-brandGold'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Results Header */}
              <div className="flex lg:hidden justify-between items-center mb-6">
                <div className="flex items-center">
                  <label htmlFor="mobile-sort" className="text-platinumGray mr-2">Trier:</label>
                  <select
                    id="mobile-sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border-b border-brandGold bg-transparent text-richEbony focus:outline-none py-1"
                  >
                    <option value="featured">En vedette</option>
                    <option value="newest">Nouveautés</option>
                    <option value="price-asc">Prix ↑</option>
                    <option value="price-desc">Prix ↓</option>
                  </select>
                </div>
                
                <div className="flex border border-brandGold rounded-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-2 py-1 ${viewMode === 'grid' ? 'bg-brandGold text-brandIvory' : 'text-brandGold'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-2 py-1 ${viewMode === 'list' ? 'bg-brandGold text-brandIvory' : 'text-brandGold'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Results Count */}
              <div className="text-platinumGray mb-6">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'création trouvée' : 'créations trouvées'}
              </div>
              
              {/* Products Display */}
              {sortedProducts.length === 0 ? (
                <div className="py-20 text-center">
                  <h3 className="text-2xl font-serif text-brandGold mb-3">Aucune création trouvée</h3>
                  <p className="text-platinumGray mb-8">Aucune création ne correspond à vos critères. Veuillez ajuster vos filtres.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSelectedMaterial("");
                      setSelectedGemType("");
                      setPriceRange([0, priceRangeMax]);
                    }}
                    className="px-6 py-3 bg-brandGold text-brandIvory hover:bg-brandGold/90 transition-colors"
                  >
                    Voir toutes les créations
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Link href={`/product/${product.sku}`}>
                        <a className="group block relative overflow-hidden bg-white transition-all duration-300 hover:shadow-luxury">
                          <div className="relative h-80 overflow-hidden">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={getProductName(product)}
                                layout="fill"
                                objectFit="cover"
                                className="group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-platinumGray">Image non disponible</span>
                              </div>
                            )}
                            
                            {product.featured && (
                              <span className="absolute top-4 left-4 bg-burgundy text-brandIvory text-xs px-3 py-1">
                                En vedette
                              </span>
                            )}
                          </div>
                          
                          <div className="p-4 border-t border-brandGold/20">
                            <h3 className="font-serif text-lg mb-1 text-richEbony">
                              {getProductName(product)}
                            </h3>
                            <div className="flex justify-between items-center">
                              <p className="text-brandGold font-medium">{formatPrice(product.basePrice)}</p>
                              <span className="text-xs text-platinumGray">
                                {product.category ? getCategoryName(product.category.slug) : ""}
                              </span>
                            </div>
                          </div>
                          
                          <div className="absolute inset-x-0 bottom-0 h-0 bg-brandGold/10 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                        </a>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0,import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import CuratedCollection from "../../components/CuratedCollection";
import type { Product, Category } from "@prisma/client";

// Types that include related data
type EnhancedProduct = Product & { 
  category?: { slug: string; translations: Array<{language: string, name: string}> } | null;
  translations: Array<{language: string, name: string, description: string}>;
  variations: Array<{variationType: string, variationValue: string}>;
};

type CollectionPageProps = {
  products: EnhancedProduct[];
  categories: Array<{slug: string, translations: Array<{language: string, name: string}>}>;
  materials: string[];
  gemTypes: string[];
  locale: string;
  featuredProducts: EnhancedProduct[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale || "fr";

  try {
    // Get categories with translations
    const categoryRecords = await prisma.category.findMany({
      select: { 
        slug: true,
        translations: {
          select: { language: true, name: true }
        }
      },
    });

    // Get products with translations, variations and categories
    const products = await prisma.product.findMany({
      include: {
        translations: true,
        variations: true,
        category: {
          include: {
            translations: {
              select: { language: true, name: true }
            }
          }
        },
      },
    });

    // Extract unique materials and gem types from variations
    const materials = [...new Set(
      products
        .flatMap(p => p.variations)
        .filter(v => v.variationType.toLowerCase().includes('material') || v.variationType.toLowerCase().includes('metal'))
        .map(v => v.variationValue)
    )];

    const gemTypes = [...new Set(
      products
        .flatMap(p => p.variations)
        .filter(v => v.variationType.toLowerCase().includes('gem') || v.variationType.toLowerCase().includes('stone'))
        .map(v => v.variationValue)
    )];

    // Get featured products
    const featuredProducts = products.filter(p => p.featured);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        categories: JSON.parse(JSON.stringify(categoryRecords)),
        materials,
        gemTypes,
        locale,
        featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      },
    };
  } catch (error) {
    console.error("❌ Error fetching collections:", error);
    return {
      props: { 
        products: [], 
        categories: [],
        materials: [],
        gemTypes: [],
        locale,
        featuredProducts: [],
      },
    };
  }
};

export default function CollectionsPage({
  products,
  categories,
  materials,
  gemTypes,
  locale,
  featuredProducts,
}: CollectionPageProps) {
  // ---------- FILTER STATES ----------
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedGemType, setSelectedGemType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<string>("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Find highest price for range
  const maxProductPrice = Math.max(...products.map(p => Number(p.basePrice)));
  const priceRangeMax = Math.ceil(maxProductPrice / 10000) * 10000; // Round up to nearest 10,000

  useEffect(() => {
    setPriceRange([0, priceRangeMax]);
    // Delayed animation trigger for staggered entrance
    setTimeout(() => setAnimate(true), 300);
  }, [priceRangeMax]);

  // ---------- FILTERED PRODUCTS ----------
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory && product.category?.slug !== selectedCategory) {
      return false;
    }
    
    // Price filter
    const basePriceNum = Number(product.basePrice);
    if (basePriceNum < priceRange[0] || basePriceNum > priceRange[1]) {
      return false;
    }
    
    // Material filter
    if (selectedMaterial && !product.variations.some(v => 
      v.variationValue.toLowerCase() === selectedMaterial.toLowerCase()
    )) {
      return false;
    }
    
    // Gem type filter
    if (selectedGemType && !product.variations.some(v => 
      v.variationValue.toLowerCase() === selectedGemType.toLowerCase()
    )) {
      return false;
    }
    
    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
      case "price-asc":
        return Number(a.basePrice) - Number(b.basePrice);
      case "price-desc":
        return Number(b.basePrice) - Number(a.basePrice);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "featured":
      default:
        return b.featured ? 1 : -1;
    }
  });

  // Get translated category names
  const getCategoryName = (slug: string) => {
    const category = categories.find(cat => cat.slug === slug);
    if (!category) return slug;
    
    const translation = category.translations.find(t => t.language === locale) ||
                       category.translations.find(t => t.language === "fr") ||
                       category.translations[0];
    
    return translation?.name || slug;
  };

  // Get the name of the product in the appropriate language
  const getProductName = (product: EnhancedProduct) => {
    const translation = product.translations.find(t => t.language === locale) || 
                       product.translations.find(t => t.language === "fr") ||
                       product.translations[0];
    return translation?.name || "Produit Sans Nom";
  };

  // Format price with commas and MAD
  const formatPrice = (price: number | string) => {
    return Number(price).toLocaleString('fr-FR') + ' MAD';
  };

  return (
    <>
      <NextSeo
        title="Collections | Diamant Rouge"
        description="Découvrez l'élégance intemporelle des collections Diamant Rouge. Des pièces uniques, fabriquées avec passion et savoir-faire."
        openGraph={{
          title: "Collections | Diamant Rouge",
          description: "Explorez nos créations d'exception, alliant tradition et modernité pour sublimer votre beauté."
        }}
      />

      <div className="min-h-screen bg-brandIvory">
        {/* Hero Banner */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src="/images/collections-hero.jpg" 
              alt="Diamant Rouge Collections" 
              layout="fill"
              objectFit="cover"
              priority
              className="brightness-75"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-richEbony to-transparent opacity-60" />
          <div className="relative h-full flex flex-col justify-end items-center text-center pb-20 px-6 z-10">
            <h1 className="text-5xl md:text-6xl font-serif text-brandIvory mb-4 drop-shadow-lg">
              Collections
            </h1>
            <p className="text-lg md:text-xl text-brandIvory max-w-2xl mx-auto drop-shadow">
              Des créations d'exception, façonnées selon les traditions les plus raffinées pour sublimer votre élégance.
            </p>
          </div>
        </div>

        {/* Featured Collections Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-brandGold mb-8 text-center">Pièces Signature</h2>
            <CuratedCollection products={featuredProducts} locale={locale} />
          </section>
        )}

        {/* Main Collections Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-