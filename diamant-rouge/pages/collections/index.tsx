import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import Image from "next/image";
import { FiFilter } from "react-icons/fi";
import type { Product } from "@prisma/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { FaSpinner } from 'react-icons/fa';

type CollectionPageProps = {
    products: Array<Product & { category?: { slug: string; translations?: any[] } | null }>;
    categories: Array<{ slug: string; translations: any[] }>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const locale = context.locale || "fr";
    
    try {
        // Fetch categories with translations
        const categoryRecords = await prisma.category.findMany({
            include: {
                translations: true
            }
        });

        // Fetch all products with translations and categories
        const products = await prisma.product.findMany({
            include: {
                translations: true,
                variations: true,
                category: {
                    include: {
                        translations: true
                    }
                },
            },
        });

        return {
            props: {
                products: JSON.parse(JSON.stringify(products)),
                categories: JSON.parse(JSON.stringify(categoryRecords)),
            },
        };
    } catch (error) {
        console.error("❌ Error fetching collections:", error);
        return {
            props: { products: [], categories: [] },
        };
    }
};

export default function CollectionsPage({ products, categories }: CollectionPageProps) {
    const router = useRouter();
    const { category: categoryParam, minPrice: minPriceParam, maxPrice: maxPriceParam } = router.query;
    
    // Initialize state from URL parameters
    const [selectedCategory, setSelectedCategory] = useState<string>(
      typeof categoryParam === 'string' ? categoryParam : ""
    );
    
    const [minPrice, setMinPrice] = useState<number | "">(
      typeof minPriceParam === 'string' && !isNaN(Number(minPriceParam)) 
        ? Number(minPriceParam) 
        : ""
    );
    
    const [maxPrice, setMaxPrice] = useState<number | "">(
      typeof maxPriceParam === 'string' && !isNaN(Number(maxPriceParam)) 
        ? Number(maxPriceParam) 
        : ""
    );
    
    const [loading, setLoading] = useState(true);
    
    // Price range states
    const [priceRangeLimits, setPriceRangeLimits] = useState<[number, number]>([0, 100000]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [isDragging, setIsDragging] = useState<null | 'min' | 'max'>(null);
    
    // Toggle state for price filter visibility
    const [isPriceFilterVisible, setIsPriceFilterVisible] = useState(false);
    
    const trackRef = useRef<HTMLDivElement>(null);
    
    // Get current locale from router
    const locale = router.locale || "fr";
    
    // Prepare products data for ProductCard component to fix type issues
    const prepareProductsForDisplay = useCallback((products: Array<Product & { category?: { slug: string; translations?: any[] } | null; translations?: any[] }>) => {
        return products.map(product => ({
            ...product,
            basePrice: String(product.basePrice),
            translations: product.translations || [], // Ensure translations exist
        }));
    }, []);
    
    // Find min and max product prices for slider bounds
    useEffect(() => {
        if (products && products.length > 0) {
            const prices = products.map(p => Number(p.basePrice));
            
            // Find actual min and max prices rather than rounding
            const actualMinPrice = Math.min(...prices);
            const actualMaxPrice = Math.max(...prices);
            
            // Round min down to nearest 100
            const minProductPrice = Math.floor(actualMinPrice / 100) * 100;
            
            // Round max up to nearest 100
            const maxProductPrice = Math.ceil(actualMaxPrice / 100) * 100;
            
            // Set limits with actual product price range
            setPriceRangeLimits([minProductPrice, maxProductPrice]);
            
            // Initialize price range with URL params if present, otherwise use product limits
            setPriceRange([
                minPrice !== "" ? Number(minPrice) : minProductPrice,
                maxPrice !== "" ? Number(maxPrice) : maxProductPrice
            ]);
            
            // Log the actual price range for debugging
            console.log(`Product price range: ${minProductPrice} - ${maxProductPrice} MAD`);
        }
    }, [products, minPrice, maxPrice]);
    
    // Read query params from URL
    useEffect(() => {
        const { category, minPrice: minPriceParam, maxPrice: maxPriceParam } = router.query;

        // Only set states if different from current to avoid loops
        if (category && typeof category === 'string' && category !== selectedCategory) {
            setSelectedCategory(category);
        }

        if (minPriceParam && typeof minPriceParam === 'string' && minPriceParam !== String(minPrice)) {
            setMinPrice(Number(minPriceParam));
            setPriceRange([Number(minPriceParam), priceRange[1]]);
        }

        if (maxPriceParam && typeof maxPriceParam === 'string' && maxPriceParam !== String(maxPrice)) {
            setMaxPrice(Number(maxPriceParam));
            setPriceRange([priceRange[0], Number(maxPriceParam)]);
        }
    }, [router.query]); // Only depend on router.query to avoid infinite loops

    // Update URL when filters change
    useEffect(() => {
        // Skip URL updates during active dragging to prevent excessive state changes
        if (isDragging) return;
        
        // Use timeout for debouncing URL updates
        const updateTimeout = setTimeout(() => {
            const categoryQuery = selectedCategory ? { category: selectedCategory } : {};
            const minPriceQuery = minPrice !== "" ? { minPrice: String(minPrice) } : {};
            const maxPriceQuery = maxPrice !== "" ? { maxPrice: String(maxPrice) } : {};
            
            // Create a new URL with the updated query parameters
            const newQuery = {
                ...categoryQuery,
                ...minPriceQuery,
                ...maxPriceQuery,
            };
            
            // Only update if the query is different to avoid unnecessary navigation
            if (JSON.stringify(newQuery) !== JSON.stringify(router.query)) {
                // Use the router.replace instead of push to prevent adding to history stack
                // This prevents the browser from creating multiple history entries
                router.replace(
                    {
                        pathname: '/collections',
                        query: newQuery,
                    },
                    undefined,
                    { locale: router.locale, scroll: false }
                );
            }
        }, 300); // 300ms debounce
        
        return () => clearTimeout(updateTimeout);
    }, [selectedCategory, minPrice, maxPrice, isDragging, router.locale]);
    
    // Get translated category names
    const getCategoryName = (slug: string) => {
        const category = categories.find(c => c.slug === slug);
        if (!category) return slug;
        
        const translation = category.translations.find(t => t.language === "fr") || 
                           category.translations.find(t => t.language === "en");
        return translation?.name || slug;
    };

    // Format price with commas for thousands
    const formatPrice = (price: number | string): string => {
        if (price === "" || price === undefined) return "";
        return Number(price).toLocaleString('fr-FR');
    };
    
    // Calculate percentage position for slider thumbs
    const calculateThumbPosition = (value: number): string => {
        const [min, max] = priceRangeLimits;
        const percentage = ((value - min) / (max - min)) * 100;
        return `${Math.min(Math.max(percentage, 0), 100)}%`;
    };
    
    // Handle slider track click
    const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const trackRect = e.currentTarget.getBoundingClientRect();
        const clickPosition = (e.clientX - trackRect.left) / trackRect.width;
        const [min, max] = priceRangeLimits;
        const clickValue = min + clickPosition * (max - min);
        
        // Determine which thumb to move based on the click position
        const [currentMin, currentMax] = priceRange;
        const distToMin = Math.abs(clickValue - currentMin);
        const distToMax = Math.abs(clickValue - currentMax);
        
        if (distToMin <= distToMax) {
            setMinPrice(Math.round(clickValue));
            setPriceRange([Math.round(clickValue), currentMax]);
        } else {
            setMaxPrice(Math.round(clickValue));
            setPriceRange([currentMin, Math.round(clickValue)]);
        }
    }, [priceRange, priceRangeLimits]);
    
    // Handle thumb drag start
    const handleThumbMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(type);
    };
    
    // Handle thumb drag
    useEffect(() => {
        if (!isDragging) return;
        
        const handleMouseMove = (e: MouseEvent) => {
            const sliderTrack = document.getElementById('price-slider-track');
            if (!sliderTrack) return;
            
            const trackRect = sliderTrack.getBoundingClientRect();
            const position = (e.clientX - trackRect.left) / trackRect.width;
            const [min, max] = priceRangeLimits;
            let value = Math.round(min + position * (max - min));
            
            // Constrain value within limits
            value = Math.max(min, Math.min(max, value));
            
            if (isDragging === 'min') {
                const newMinPrice = Math.min(value, priceRange[1] - 1000);
                setMinPrice(newMinPrice);
                setPriceRange([newMinPrice, priceRange[1]]);
            } else {
                const newMaxPrice = Math.max(value, priceRange[0] + 1000);
                setMaxPrice(newMaxPrice);
                setPriceRange([priceRange[0], newMaxPrice]);
            }
        };
        
        const handleMouseUp = () => {
            setIsDragging(null);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, priceRange, priceRangeLimits]);

    // Filter products
    const filteredProducts = products.filter((product) => {
        // Category filter
        if (selectedCategory && product.category?.slug !== selectedCategory) {
            return false;
        }
        
            const basePriceNum = Number(product.basePrice);
        
        // Min price filter
        if (minPrice !== "" && basePriceNum < Number(minPrice)) {
                return false;
            }
        
        // Max price filter
        if (maxPrice !== "" && basePriceNum > Number(maxPrice)) {
            return false;
        }
        
        return true;
    });
    
    // Sort products - always sort by latest since we removed the dropdown
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        // Default: latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory("");
        setMinPrice("");
        setMaxPrice("");
    };


    return (
        <>
            <Head>
                <title>Diamant Rouge | Collections</title>
                <meta name="description" content="Découvrez notre collection de bijoux de luxe. Bagues, colliers, bracelets et diamants d'exception." />
            </Head>
        
            <div className="hero-section">
            <div className="min-h-screen bg-white">
                {/* HERO SECTION */}
                <div className="relative h-72 md:h-96 bg-gradient-to-r from-brandGold/20 to-burgundy/20 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image 
                            src="/images/home/about-sourcing-01.jpg" 
                            alt="Collections Diamant Rouge" 
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                            priority
                            className="opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brandIvory to-transparent"></div>
                    </div>
                    
                    <div className="container mx-auto relative h-full flex flex-col justify-end items-center pb-12 text-center px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-serif text-brandGold drop-shadow-sm mb-4">
                                Nos Collections
                            </h1>
                            <p className="text-platinumGray text-lg md:text-xl max-w-2xl mx-auto">
                                Découvrez nos pièces intemporelles, façonnées dans l'excellence et le raffinement.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* FILTERS SECTION - Always visible */}
                    <div className="mb-8 border-b border-brandGold/10 pb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-serif text-brandGold">
                                    {sortedProducts.length} {sortedProducts.length > 1 ? 'Créations' : 'Création'}
                                </h2>
                                {(selectedCategory || minPrice !== "" || maxPrice !== "") && (
                                    <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                                        <span className="text-xs text-platinumGray">Filtres:</span>
                                        {selectedCategory && (
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brandGold/5 rounded text-xs border border-brandGold/20">
                                                <span className="text-platinumGray">{getCategoryName(selectedCategory)}</span>
                                                <button 
                                                    onClick={() => setSelectedCategory("")}
                                                    className="text-brandGold hover:text-burgundy transition-colors ml-1"
                                                    aria-label="Supprimer le filtre de catégorie"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        {minPrice !== "" && (
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brandGold/5 rounded text-xs border border-brandGold/20">
                                                <span className="text-platinumGray">Min: {formatPrice(minPrice)} MAD</span>
                                                <button 
                                                    onClick={() => {
                                                        setMinPrice("");
                                                        setPriceRange([priceRangeLimits[0], priceRange[1]]);
                                                    }}
                                                    className="text-brandGold hover:text-burgundy transition-colors ml-1"
                                                    aria-label="Supprimer le filtre de prix minimum"
                                                >
                                                    ×
                                                </button>
                            </div>
                                        )}
                                        {maxPrice !== "" && (
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brandGold/5 rounded text-xs border border-brandGold/20">
                                                <span className="text-platinumGray">Max: {formatPrice(maxPrice)} MAD</span>
                                <button 
                                                    onClick={() => {
                                                        setMaxPrice("");
                                                        setPriceRange([priceRange[0], priceRangeLimits[1]]);
                                                    }}
                                                    className="text-brandGold hover:text-burgundy transition-colors ml-1"
                                                    aria-label="Supprimer le filtre de prix maximum"
                                                >
                                                    ×
                                </button>
                                            </div>
                                        )}
                                        <button 
                                            onClick={resetFilters}
                                            className="text-xs text-burgundy hover:underline transition-colors"
                                        >
                                            Réinitialiser
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Refined filters section */}
                        <div className="bg-gradient-to-b from-brandIvory/30 to-brandIvory/10 rounded-lg p-6 border border-brandGold/20 shadow-sm">
                            <div className="flex flex-col items-center gap-8">
                                {/* Category buttons - centered */}
                                <div className="w-full">
                                    <h3 className="font-serif text-center text-lg text-brandGold mb-5 relative after:content-[''] after:absolute after:w-12 after:h-px after:bg-brandGold/30 after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2">
                                        Catégorie
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                                        <button
                                            onClick={() => setSelectedCategory("")}
                                            className={`text-xs px-5 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === "" 
                                                ? "bg-gradient-to-r from-brandGold to-brandGold/90 text-white shadow-md" 
                                                : "bg-brandIvory/80 text-platinumGray hover:bg-brandGold/10 hover:text-brandGold hover:border-brandGold/40 border border-brandGold/20"}`}
                                        >
                                            Toutes
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.slug}
                                                onClick={() => setSelectedCategory(cat.slug)}
                                                className={`text-xs px-5 py-2.5 rounded-full transition-all duration-300 ${selectedCategory === cat.slug 
                                                    ? "bg-gradient-to-r from-brandGold to-brandGold/90 text-white shadow-md" 
                                                    : "bg-brandIvory/80 text-platinumGray hover:bg-brandGold/10 hover:text-brandGold hover:border-brandGold/40 border border-brandGold/20"}`}
                                            >
                                                {getCategoryName(cat.slug)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price filter toggle button */}
                                <div className="w-full flex justify-center my-1">
                                    <button
                                        onClick={() => setIsPriceFilterVisible(!isPriceFilterVisible)}
                                        className="flex items-center gap-2 px-4 py-1.5 text-sm text-brandGold border border-brandGold/20 rounded-full hover:bg-brandGold/5 transition-colors duration-300 group"
                                    >
                                        <span className="font-serif">Affiner par prix</span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="12" 
                                            height="12" 
                                            fill="currentColor" 
                                            viewBox="0 0 16 16"
                                            className={`transform transition-transform duration-300 group-hover:translate-y-0.5 ${isPriceFilterVisible ? 'rotate-180 group-hover:-translate-y-0.5' : ''}`}
                                        >
                                            <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Price range slider - collapsible */}
                                <motion.div 
                                    className="w-full max-w-xl mx-auto"
                                    initial={false}
                                    animate={{ 
                                        height: isPriceFilterVisible ? 'auto' : 0,
                                        opacity: isPriceFilterVisible ? 1 : 0,
                                        marginTop: isPriceFilterVisible ? 16 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    {isPriceFilterVisible && (
                                        <div className="bg-gradient-to-r from-brandIvory/60 to-brandIvory/40 p-5 rounded-lg border border-brandGold/30 shadow-inner">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-sm font-serif text-brandGold">Fourchette de prix</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-platinumGray font-light bg-brandIvory/80 px-3 py-1 rounded-full border border-brandGold/10">
                                                        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} <span className="text-2xs opacity-70">MAD</span>
                                                    </span>
                                                </div>
                                        </div>

                                            {/* Show price distribution indicator */}
                                            <div className="relative h-1 mb-5 mt-6 w-full bg-brandGold/5 rounded-full overflow-hidden">
                                                {products.map((product, index) => {
                                                    const price = Number(product.basePrice);
                                                    const position = ((price - priceRangeLimits[0]) / (priceRangeLimits[1] - priceRangeLimits[0])) * 100;
                                                    return (
                                                        <div 
                                                            key={index}
                                                            className="absolute w-0.5 h-3 -mt-1 rounded-full bg-gradient-to-b from-brandGold/20 to-brandGold/60" 
                                                            style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
                                                        />
                                                    );
                                                })}
                                        </div>
                                        
                                            {/* Enhanced slider track */}
                                            <div 
                                                id="price-slider-track"
                                                className="relative h-1.5 w-full bg-gradient-to-r from-brandGold/10 via-brandGold/5 to-brandGold/10 rounded-full cursor-pointer"
                                                onClick={handleTrackClick}
                                                aria-label="Ajuster la fourchette de prix"
                                            >
                                                {/* Active track */}
                                                <div 
                                                    className="absolute h-full bg-gradient-to-r from-brandGold/70 to-brandGold/80 rounded-full"
                                                    style={{
                                                        left: calculateThumbPosition(priceRange[0]),
                                                        right: `calc(100% - ${calculateThumbPosition(priceRange[1])})`
                                                    }}
                                                ></div>
                                                
                                                {/* Min thumb */}
                                                <div 
                                                    className={`absolute w-4 h-4 -mt-[5px] -ml-2 rounded-full cursor-grab border border-brandGold/30 
                                                        ${isDragging === 'min' ? 'cursor-grabbing ring-2 ring-brandGold/20 shadow-lg scale-110' : 'shadow-md hover:scale-110'} 
                                                        transition-all duration-150`}
                                                    style={{
                                                        left: calculateThumbPosition(priceRange[0]),
                                                        background: 'linear-gradient(to bottom right, #f8efdb, #d4af37)'
                                                    }}
                                                    onMouseDown={handleThumbMouseDown('min')}
                                                    aria-label="Prix minimum"
                                                >
                                                </div>
                                                
                                                {/* Max thumb */}
                                                <div 
                                                    className={`absolute w-4 h-4 -mt-[5px] -ml-2 rounded-full cursor-grab border border-brandGold/30 
                                                        ${isDragging === 'max' ? 'cursor-grabbing ring-2 ring-brandGold/20 shadow-lg scale-110' : 'shadow-md hover:scale-110'} 
                                                        transition-all duration-150`}
                                                    style={{
                                                        left: calculateThumbPosition(priceRange[1]),
                                                        background: 'linear-gradient(to bottom right, #f8efdb, #d4af37)'
                                                    }}
                                                    onMouseDown={handleThumbMouseDown('max')}
                                                    aria-label="Prix maximum"
                                                >
                                                </div>
                                            </div>
                                            
                                            {/* Price inputs */}
                                            <div className="flex items-center gap-3 mt-6">
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={minPrice === "" ? "" : formatPrice(minPrice)}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/[^\d]/g, "");
                                                                const numValue = value === "" ? "" : Number(value);
                                                                if (numValue === "" || (typeof numValue === 'number' && numValue <= priceRange[1] - 1000)) {
                                                                    setMinPrice(numValue);
                                                                    if (numValue !== "" && typeof numValue === 'number') {
                                                                        setPriceRange([numValue, priceRange[1]]);
                                                                    }
                                                                }
                                                            }}
                                                            className="w-full py-1.5 px-3 pr-12 border border-brandGold/40 rounded-full bg-brandIvory/40 text-platinumGray placeholder-platinumGray/50 text-xs focus:outline-none focus:ring-1 focus:ring-brandGold/50 focus:border-brandGold/60 transition-colors duration-200"
                                                            placeholder="Min"
                                                            aria-label="Prix minimum"
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-platinumGray/60 font-light">MAD</div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-brandGold/60">à</span>
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={maxPrice === "" ? "" : formatPrice(maxPrice)}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/[^\d]/g, "");
                                                                const numValue = value === "" ? "" : Number(value);
                                                                if (numValue === "" || (typeof numValue === 'number' && numValue >= priceRange[0] + 1000)) {
                                                                    setMaxPrice(numValue);
                                                                    if (numValue !== "" && typeof numValue === 'number') {
                                                                        setPriceRange([priceRange[0], numValue]);
                                                                    }
                                                                }
                                                            }}
                                                            className="w-full py-1.5 px-3 pr-12 border border-brandGold/40 rounded-full bg-brandIvory/40 text-platinumGray placeholder-platinumGray/50 text-xs focus:outline-none focus:ring-1 focus:ring-brandGold/50 focus:border-brandGold/60 transition-colors duration-200"
                                                            placeholder="Max"
                                                            aria-label="Prix maximum"
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-platinumGray/60 font-light">MAD</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* PRODUCTS GRID */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {sortedProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-serif text-brandGold mb-4">
                                    Aucune pièce trouvée
                                </h3>
                                <p className="text-platinumGray">
                                    Veuillez ajuster vos filtres ou consulter nos autres collections.
                                </p>
                                <button 
                                    onClick={resetFilters}
                                    className="mt-6 px-6 py-2 bg-brandGold text-brandIvory rounded hover:bg-brandGold/90 transition"
                                >
                                    Voir toutes les créations
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                                {prepareProductsForDisplay(sortedProducts).map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    >
                                        <ProductCard product={product} locale={locale} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}