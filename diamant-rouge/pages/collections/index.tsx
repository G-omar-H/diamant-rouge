import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import Image from "next/image";
import { FiFilter } from "react-icons/fi";
import { useRouter } from "next/router";
import Head from "next/head";
import { FaSpinner } from 'react-icons/fa';
import { serializeData } from "../../lib/utils";
import debounce from 'lodash/debounce';

type ProductTranslation = {
    language: string;
    name: string;
    description?: string;
    materialDescription?: string;
};

type ProductType = {
    id: number;
    slug: string;
    sku: string;
    basePrice: string;
    createdAt: Date;
    images: string[];
    material?: string;
    translations: ProductTranslation[];
    category?: { 
        slug: string; 
        translations?: any[] 
    } | null;
    variations?: {
        id: number;
        variationType: string;
        variationValue: string;
        additionalPrice: string;
    }[];
};

type CollectionPageProps = {
    products: Array<ProductType>;
    categories: Array<{ slug: string; translations: any[] }>;
    productTypes: Array<string>;
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

        // Extract unique product types from variations
        const allTypes = products
            .flatMap(product => product.variations?.map(v => v.variationType) || [])
            .filter(Boolean);
        
        // Get unique values
        const productTypes = [...new Set(allTypes)];

        // Use our utility to serialize everything in one go
        const serializedData = serializeData({
            products: products,
            categories: categoryRecords,
            productTypes: productTypes
        });

        return {
            props: serializedData,
        };
    } catch (error) {
        console.error("❌ Error fetching collections:", error);
        return {
            props: { products: [], categories: [], productTypes: [] },
        };
    }
};

export default function CollectionsPage({ products, categories, productTypes }: CollectionPageProps) {
    const router = useRouter();
    const { category: categoryParam, minPrice: minPriceParam, maxPrice: maxPriceParam, type: typeParam } = router.query;
    
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
    
    // Add state for product type
    const [selectedType, setSelectedType] = useState<string>(
      typeof typeParam === 'string' ? typeParam : ""
    );
    
    const [loading, setLoading] = useState(true);
    
    // Price range states
    const [priceRangeLimits, setPriceRangeLimits] = useState<[number, number]>([0, 100000]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    
    // Toggle state for price filter visibility
    const [isPriceFilterVisible, setIsPriceFilterVisible] = useState(false);
    
    // Use a ref to store the active price range to avoid re-renders during slider dragging
    const priceRangeRef = useRef<[number, number]>([...priceRange]);
    
    // Ref for the price slider track element
    const trackRef = useRef<HTMLDivElement>(null);
    
    // Add a debounced function to update the URL with price range
    const updateUrlWithPrice = useCallback(
        debounce((minPrice: number, maxPrice: number) => {
            const newQuery = {...router.query};
            
            if (minPrice !== priceRangeLimits[0]) {
                newQuery.minPrice = minPrice.toString();
            } else {
                delete newQuery.minPrice;
            }
            
            if (maxPrice !== priceRangeLimits[1]) {
                newQuery.maxPrice = maxPrice.toString();
            } else {
                delete newQuery.maxPrice;
            }
            
            // Don't update URL if it's the same
            const currentQueryString = new URLSearchParams(router.query as any).toString();
            const newQueryString = new URLSearchParams(newQuery as any).toString();
            
            if (currentQueryString !== newQueryString) {
                router.push({
                    pathname: router.pathname,
                    query: newQuery
                }, undefined, { shallow: true });
            }
        }, 500),
        [router, priceRangeLimits]
    );
    
    // Sync the ref with the state when the state changes
    useEffect(() => {
        priceRangeRef.current = [...priceRange];
    }, [priceRange]);
    
    // Get current locale from router
    const locale = router.locale || "fr";
    
    // Prepare products data for ProductCard component to fix type issues
    const prepareProductsForDisplay = useCallback((products: Array<ProductType>) => {
        return products.map(product => ({
            ...product,
            basePrice: String(product.basePrice),
            translations: product.translations || [],
            sku: product.sku || `SKU-${product.id}`, // Ensure SKU exists
            images: product.images || ["/images/product-placeholder.jpg"], // Ensure images array exists
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
        const { category, minPrice: minPriceParam, maxPrice: maxPriceParam, type: typeParam } = router.query;

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

        if (typeParam && typeof typeParam === 'string' && typeParam !== selectedType) {
            setSelectedType(typeParam);
        }
    }, [router.query]); // Only depend on router.query to avoid infinite loops

    // Update URL when filters change
    useEffect(() => {
        const newQuery = {...router.query};
        
        if (selectedCategory) {
            newQuery.category = selectedCategory;
        } else {
            delete newQuery.category;
        }
        
        if (selectedType) {
            newQuery.type = selectedType;
        } else {
            delete newQuery.type;
        }
        
        // Don't update URL if it's the same
        const currentQueryString = new URLSearchParams(router.query as any).toString();
        const newQueryString = new URLSearchParams(newQuery as any).toString();
        
        if (currentQueryString !== newQueryString) {
            router.push({
                pathname: router.pathname,
                query: newQuery
            }, undefined, { shallow: true });
        }
    }, [selectedCategory, selectedType, router]);

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
    
    // Function to calculate visual position for thumbs
    const calculateThumbPosition = useCallback((value: number): string => {
        const [min, max] = priceRangeLimits;
        const percentage = ((value - min) / (max - min)) * 100;
        return `${Math.min(Math.max(percentage, 0), 100)}%`;
    }, [priceRangeLimits]);
    
    // Simplified track click handler that uses the ref for rendering and only updates state at the end
    const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!trackRef.current) return;
        
        const trackRect = trackRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - trackRect.left) / trackRect.width;
        const [min, max] = priceRangeLimits;
        const clickValue = Math.round(min + clickPosition * (max - min));
        
        // Determine which thumb to move based on the click position
        const [currentMin, currentMax] = priceRangeRef.current;
        const distToMin = Math.abs(clickValue - currentMin);
        const distToMax = Math.abs(clickValue - currentMax);
        
        if (distToMin <= distToMax) {
            const newMin = Math.min(clickValue, currentMax - 1000);
            priceRangeRef.current = [newMin, currentMax];
            setMinPrice(newMin);
        } else {
            const newMax = Math.max(clickValue, currentMin + 1000);
            priceRangeRef.current = [currentMin, newMax];
            setMaxPrice(newMax);
        }
        
        // Force re-render
        setPriceRange([...priceRangeRef.current]);
        
        // Update URL with debounce
        updateUrlWithPrice(priceRangeRef.current[0], priceRangeRef.current[1]);
    }, [priceRangeLimits, updateUrlWithPrice]);
    
    // Simplified thumb drag handler that uses the ref for rendering and only updates state at the end
    const handleThumbMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Capture initial values
        const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const startRange = [...priceRangeRef.current];
        let isDragging = true;
        
        // Convert trackRef to element variable to avoid null checks in every event handler
        const trackElement = trackRef.current;
        if (!trackElement) return;
        
        const trackRect = trackElement.getBoundingClientRect();
        
        const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            
            const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const deltaX = currentX - startX;
            const percentMove = deltaX / trackRect.width;
            const valueMove = Math.round(percentMove * (priceRangeLimits[1] - priceRangeLimits[0]));
            
            if (type === 'min') {
                const newMin = Math.max(
                    priceRangeLimits[0],
                    Math.min(startRange[0] + valueMove, priceRangeRef.current[1] - 1000)
                );
                priceRangeRef.current = [newMin, priceRangeRef.current[1]];
                
                // Update the visual rendering
                if (trackElement) {
                    const thumbElement = trackElement.querySelector('[data-thumb="min"]') as HTMLElement;
                    const trackHighlight = trackElement.querySelector('[data-track-highlight]') as HTMLElement;
                    if (thumbElement) thumbElement.style.left = calculateThumbPosition(newMin);
                    if (trackHighlight) {
                        trackHighlight.style.left = calculateThumbPosition(newMin);
                        trackHighlight.style.right = `calc(100% - ${calculateThumbPosition(priceRangeRef.current[1])})`;
                    }
                }
            } else {
                const newMax = Math.min(
                    priceRangeLimits[1],
                    Math.max(startRange[1] + valueMove, priceRangeRef.current[0] + 1000)
                );
                priceRangeRef.current = [priceRangeRef.current[0], newMax];
                
                // Update the visual rendering
                if (trackElement) {
                    const thumbElement = trackElement.querySelector('[data-thumb="max"]') as HTMLElement;
                    const trackHighlight = trackElement.querySelector('[data-track-highlight]') as HTMLElement;
                    if (thumbElement) thumbElement.style.left = calculateThumbPosition(newMax);
                    if (trackHighlight) {
                        trackHighlight.style.right = `calc(100% - ${calculateThumbPosition(newMax)})`;
                    }
                }
            }
        };
        
        const handleEnd = () => {
            isDragging = false;
            
            // Only update state once at the end of dragging
            setMinPrice(priceRangeRef.current[0]);
            setMaxPrice(priceRangeRef.current[1]);
            setPriceRange([...priceRangeRef.current]);
            
            // Update URL with debounce
            updateUrlWithPrice(priceRangeRef.current[0], priceRangeRef.current[1]);
            
            // Remove event listeners
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchend', handleEnd);
        };
        
        // Add event listeners
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchend', handleEnd);
    };
    
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
        
        // Product type filter
        if (selectedType && (!product.variations || !product.variations.some(v => 
            v.variationType === selectedType || v.variationValue === selectedType))) {
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
        setSelectedType("");
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
                <div className="relative h-60 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image 
                            src="/images/home/about-sourcing-01.jpg" 
                            alt="Collections Diamant Rouge" 
                            fill
                            sizes="100vw"
                            className="object-cover object-center opacity-100"
                            priority
                        />
                    </div>
                    
                    <div className="container mx-auto relative h-full flex flex-col justify-end items-center pb-8 sm:pb-12 text-center px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white drop-shadow-lg mb-3 sm:mb-4 text-shadow-strong">
                                Nos Collections
                            </h1>
                            <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium text-shadow-md">
                                Découvrez nos pièces intemporelles, façonnées dans l'excellence et le raffinement.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16">
                    {/* FILTERS SECTION - Always visible */}
                    <div className="mb-10 border-b border-brandGold/10 pb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-serif text-brandGold bg-gradient-to-r from-brandGold to-brandGold/80 bg-clip-text text-transparent">
                                    {sortedProducts.length} {sortedProducts.length > 1 ? 'Créations' : 'Création'}
                                </h2>
                                {(selectedCategory || minPrice !== "" || maxPrice !== "" || selectedType !== "") && (
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
                                        
                                        {selectedType && (
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brandGold/5 rounded text-xs border border-brandGold/20">
                                                <span className="text-platinumGray">{selectedType}</span>
                                                <button 
                                                    onClick={() => setSelectedType("")}
                                                    className="text-brandGold hover:text-burgundy transition-colors ml-1"
                                                    aria-label="Supprimer le filtre de type"
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
                                            className="text-xs text-burgundy hover:text-burgundy/80 transition-colors underline ml-2"
                                            aria-label="Réinitialiser tous les filtres"
                                        >
                                            Effacer tout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Refined filters section */}
                        <div className="bg-gradient-to-b from-brandIvory/30 to-brandIvory/10 rounded-lg p-6 border border-brandGold/20 shadow-sm">
                            <div className="flex flex-col items-center gap-8">
                                {/* Jewelry Type Filters - Main Filter */}
                                <div className="w-full mb-5">
                                    <div className="overflow-x-auto py-4 -mx-1 px-1 scrollbar-hide">
                                        <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-5 min-w-max sm:min-w-0 sm:max-w-3xl mx-auto">
                                             <button
                                                onClick={() => setSelectedCategory("")}
                                                className={`flex flex-col items-center gap-2 transition-all duration-300 ${!selectedCategory 
                                                    ? 'opacity-100 scale-105' 
                                                    : 'opacity-70 hover:opacity-90 hover:scale-105'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${!selectedCategory 
                                                    ? 'bg-gradient-to-br from-brandGold to-brandGold/80 text-white shadow-lg' 
                                                    : 'bg-brandIvory/60 text-platinumGray hover:bg-brandGold/5 hover:text-brandGold border border-brandGold/20'}`}>
                                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
                                                        <rect x="5" y="8" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
                                                        <rect x="5" y="15" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
                                                        <rect x="11" y="8" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
                                                        <rect x="16" y="15" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium tracking-wide">Tous</span>
                                            </button>
                                            
                                            {/* Rings */}
                                            <button
                                                onClick={() => setSelectedCategory("rings")}
                                                className={`flex flex-col items-center gap-2 transition-all duration-300 ${selectedCategory === "rings" 
                                                    ? 'opacity-100 scale-105' 
                                                    : 'opacity-70 hover:opacity-90 hover:scale-105'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${selectedCategory === "rings" 
                                                    ? "bg-gradient-to-br from-brandGold to-brandGold/80 text-white shadow-lg" 
                                                    : "bg-brandIvory/60 text-platinumGray hover:bg-brandGold/5 hover:text-brandGold border border-brandGold/20"}`}>
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <circle cx="12" cy="12" r="6" strokeWidth="1.5" />
                                                        <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                                                        <path d="M12 5L12 7" strokeWidth="1.2" strokeLinecap="round" />
                                                        <path d="M12 17L12 19" strokeWidth="1.2" strokeLinecap="round" />
                                                        <path d="M7 12L5 12" strokeWidth="1.2" strokeLinecap="round" />
                                                        <path d="M19 12L17 12" strokeWidth="1.2" strokeLinecap="round" />
                                                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium tracking-wide">Bagues</span>
                                            </button>
                                            
                                            {/* Necklaces */}
                                            <button
                                                onClick={() => setSelectedCategory("necklaces")}
                                                className={`flex flex-col items-center gap-2 transition-all duration-300 ${selectedCategory === "necklaces" 
                                                    ? 'opacity-100 scale-105' 
                                                    : 'opacity-70 hover:opacity-90 hover:scale-105'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${selectedCategory === "necklaces" 
                                                    ? "bg-gradient-to-br from-brandGold to-brandGold/80 text-white shadow-lg" 
                                                    : "bg-brandIvory/60 text-platinumGray hover:bg-brandGold/5 hover:text-brandGold border border-brandGold/20"}`}>
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6Z" strokeWidth="1.2" />
                                                        <path d="M12 22V6" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M8 10L12 14L16 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6 17H18" strokeWidth="1.5" strokeLinecap="round" />
                                                        <circle cx="12" cy="4" r="0.6" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium tracking-wide">Colliers</span>
                                            </button>
                                            
                                            {/* Bracelets */}
                                            <button
                                                onClick={() => setSelectedCategory("bracelets")}
                                                className={`flex flex-col items-center gap-2 transition-all duration-300 ${selectedCategory === "bracelets" 
                                                    ? 'opacity-100 scale-105' 
                                                    : 'opacity-70 hover:opacity-90 hover:scale-105'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${selectedCategory === "bracelets" 
                                                    ? "bg-gradient-to-br from-brandGold to-brandGold/80 text-white shadow-lg" 
                                                    : "bg-brandIvory/60 text-platinumGray hover:bg-brandGold/5 hover:text-brandGold border border-brandGold/20"}`}>
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M4 12C4 10.8954 7.58172 10 12 10C16.4183 10 20 10.8954 20 12C20 13.1046 16.4183 14 12 14C7.58172 14 4 13.1046 4 12Z" strokeWidth="1.5" />
                                                        <circle cx="12" cy="12" r="8" strokeWidth="1.5" strokeDasharray="2 1.5" />
                                                        <circle cx="12" cy="12" r="2" strokeWidth="1.2" />
                                                        <circle cx="12" cy="12" r="0.8" fill="currentColor" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium tracking-wide">Bracelets</span>
                                            </button>
                                            
                                            {/* Earrings */}
                                            <button
                                                onClick={() => setSelectedCategory("earrings")}
                                                className={`flex flex-col items-center gap-2 transition-all duration-300 ${selectedCategory === "earrings" 
                                                    ? 'opacity-100 scale-105' 
                                                    : 'opacity-70 hover:opacity-90 hover:scale-105'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${selectedCategory === "earrings" 
                                                    ? "bg-gradient-to-br from-brandGold to-brandGold/80 text-white shadow-lg" 
                                                    : "bg-brandIvory/60 text-platinumGray hover:bg-brandGold/5 hover:text-brandGold border border-brandGold/20"}`}>
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4V6C12 7.10457 11.1046 8 10 8C8.89543 8 8 7.10457 8 6V4Z" strokeWidth="1.3" />
                                                        <path d="M16 4C16 2.89543 16.8954 2 18 2C19.1046 2 20 2.89543 20 4V6C20 7.10457 19.1046 8 18 8C16.8954 8 16 7.10457 16 6V4Z" strokeWidth="1.3" />
                                                        <path d="M10 8L10 18" strokeWidth="1.3" strokeLinecap="round" />
                                                        <path d="M18 8L18 18" strokeWidth="1.3" strokeLinecap="round" />
                                                        <circle cx="10" cy="4" r="0.8" fill="currentColor" />
                                                        <circle cx="18" cy="4" r="0.8" fill="currentColor" />
                                                        <path d="M6 12L10 16" strokeWidth="1" strokeLinecap="round" stroke-opacity="0.6" />
                                                        <path d="M14 12L18 16" strokeWidth="1" strokeLinecap="round" stroke-opacity="0.6" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium tracking-wide">Boucles d'Oreilles</span>
                                            </button>
                                        </div>
                                    </div>
                                    {/* Mobile indicator for scroll */}
                                    <div className="flex justify-center mt-2 sm:hidden">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-1 h-1 bg-brandGold/40 rounded-full"></div>
                                            <div className="w-1 h-1 bg-brandGold/40 rounded-full"></div>
                                            <div className="w-1 h-1 bg-brandGold/40 rounded-full"></div>
                                        </div>
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
                                                ref={trackRef}
                                                className="relative h-1.5 w-full bg-gradient-to-r from-brandGold/10 via-brandGold/5 to-brandGold/10 rounded-full cursor-pointer"
                                                onClick={handleTrackClick}
                                                aria-label="Ajuster la fourchette de prix"
                                            >
                                                {/* Active track */}
                                                <div 
                                                    data-track-highlight
                                                    className="absolute h-full bg-gradient-to-r from-brandGold/70 to-brandGold/80 rounded-full"
                                                    style={{
                                                        left: calculateThumbPosition(priceRangeRef.current[0]),
                                                        right: `calc(100% - ${calculateThumbPosition(priceRangeRef.current[1])})`
                                                    }}
                                                ></div>
                                                
                                                {/* Min thumb */}
                                                <div 
                                                    data-thumb="min"
                                                    className="absolute w-4 h-4 -mt-[5px] -ml-2 rounded-full cursor-grab border border-brandGold/30 shadow-md hover:scale-110 transition-all duration-150"
                                                    style={{
                                                        left: calculateThumbPosition(priceRangeRef.current[0]),
                                                        background: 'linear-gradient(to bottom right, #f8efdb, #d4af37)',
                                                        zIndex: 20
                                                    }}
                                                    onMouseDown={handleThumbMouseDown('min')}
                                                    onTouchStart={handleThumbMouseDown('min')}
                                                    aria-label="Prix minimum"
                                                >
                                                </div>
                                                
                                                {/* Max thumb */}
                                                <div 
                                                    data-thumb="max"
                                                    className="absolute w-4 h-4 -mt-[5px] -ml-2 rounded-full cursor-grab border border-brandGold/30 shadow-md hover:scale-110 transition-all duration-150"
                                                    style={{
                                                        left: calculateThumbPosition(priceRangeRef.current[1]),
                                                        background: 'linear-gradient(to bottom right, #f8efdb, #d4af37)',
                                                        zIndex: 20
                                                    }}
                                                    onMouseDown={handleThumbMouseDown('max')}
                                                    onTouchStart={handleThumbMouseDown('max')}
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
                                        className="mx-auto w-full max-w-xs sm:max-w-none"
                                    >
                                        <div className="mx-auto w-64 sm:w-auto">
                                            <ProductCard product={product} locale={locale} />
                                        </div>
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