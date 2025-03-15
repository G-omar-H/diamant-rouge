import { GetServerSideProps } from "next";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import ProductCard from "../../components/ProductCard";
import type { Product } from "@prisma/client";
import { useRouter } from "next/router";

// Enhanced types for better collection presentation
type EnhancedProduct = Product & {
    category?: { slug: string; name: string } | null;
    translations: { language: string; name: string; description: string }[];
    gemTypes?: string[];
    materials?: string[];
};

type CollectionPageProps = {
    products: EnhancedProduct[];
    categories: { slug: string; name: string }[];
    materials: string[];
    gemTypes: string[];
    priceRange: { min: number; max: number };
};

// Inline SVG components
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        // Fetch categories with translations
        const categoryRecords = await prisma.category.findMany({
            select: {
                slug: true,
                translations: {
                    select: { name: true, language: true }
                }
            },
        });

        // Fetch all products with enhanced data
        const products = await prisma.product.findMany({
            include: {
                translations: true,
                variations: true,
                category: {
                    include: {
                        translations: {
                            select: { name: true, language: true }
                        }
                    }
                },
            },
        });

        // Get price range
        const productsWithPrices = products.filter(p => p.basePrice !== null);
        const minPrice = productsWithPrices.length > 0
            ? Math.floor(Number(productsWithPrices.reduce((min, p) =>
                Number(p.basePrice) < min ? Number(p.basePrice) : min, Number(productsWithPrices[0].basePrice))))
            : 0;
        const maxPrice = productsWithPrices.length > 0
            ? Math.ceil(Number(productsWithPrices.reduce((max, p) =>
                Number(p.basePrice) > max ? Number(p.basePrice) : max, Number(productsWithPrices[0].basePrice))))
            : 10000;

        // Extract unique materials and gem types from variations
        const materialsSet = new Set<string>();
        const gemTypesSet = new Set<string>();

        products.forEach(product => {
            product.variations.forEach(variation => {
                if (variation.variationType === 'material') {
                    materialsSet.add(variation.variationValue);
                }
                if (variation.variationType === 'gemType') {
                    gemTypesSet.add(variation.variationValue);
                }
            });
        });

        // Process categories to include names
        const categories = categoryRecords.map(cat => ({
            slug: cat.slug,
            name: cat.translations.find(t => t.language === context.locale || t.language === 'fr')?.name || cat.slug
        }));

        // Format products with enhanced data
        const enhancedProducts = products.map(product => {
            const materials = product.variations
                .filter(v => v.variationType === 'material')
                .map(v => v.variationValue);

            const gemTypes = product.variations
                .filter(v => v.variationType === 'gemType')
                .map(v => v.variationValue);

            return {
                ...product,
                category: product.category ? {
                    slug: product.category.slug,
                    name: product.category.translations.find(t =>
                        t.language === context.locale || t.language === 'fr'
                    )?.name || product.category.slug
                } : null,
                materials,
                gemTypes
            };
        });

        return {
            props: {
                products: JSON.parse(JSON.stringify(enhancedProducts)),
                categories,
                materials: Array.from(materialsSet),
                gemTypes: Array.from(gemTypesSet),
                priceRange: { min: minPrice, max: maxPrice }
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
                priceRange: { min: 0, max: 10000 }
            },
        };
    }
};

export default function CollectionsPage({
    products,
    categories,
    materials,
    gemTypes,
    priceRange,
}: CollectionPageProps) {
    const router = useRouter();
    const [view, setView] = useState<"grid" | "gallery">("grid");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [showScrollEffect, setShowScrollEffect] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const heroRef = useRef<HTMLDivElement>(null);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [selectedGemTypes, setSelectedGemTypes] = useState<string[]>([]);
    const [priceFilters, setPriceFilters] = useState<[number, number]>([priceRange.min, priceRange.max]);
    const [sortOption, setSortOption] = useState<string>("featured");
    const [isCollectionHighlighted, setIsCollectionHighlighted] = useState(true);

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current) return;
            const scrollPosition = window.scrollY;
            const heroHeight = heroRef.current.offsetHeight;
            setShowScrollEffect(scrollPosition > heroHeight - 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter products
    const filteredProducts = products.filter((product) => {
        // Category filter
        if (selectedCategory && product.category?.slug !== selectedCategory) {
            return false;
        }

        // Materials filter
        if (selectedMaterials.length > 0 &&
            !product.materials?.some(m => selectedMaterials.includes(m))) {
            return false;
        }

        // Gemstone filter
        if (selectedGemTypes.length > 0 &&
            !product.gemTypes?.some(g => selectedGemTypes.includes(g))) {
            return false;
        }

        // Price filter
        const productPrice = Number(product.basePrice);
        if (productPrice < priceFilters[0] || productPrice > priceFilters[1]) {
            return false;
        }

        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
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

    // Update active filters display
    useEffect(() => {
        const filters = [];

        if (selectedCategory) {
            const category = categories.find(c => c.slug === selectedCategory);
            filters.push(`Catégorie: ${category?.name || selectedCategory}`);
        }

        selectedMaterials.forEach(material => {
            filters.push(`Matériel: ${material}`);
        });

        selectedGemTypes.forEach(gem => {
            filters.push(`Pierre: ${gem}`);
        });

        if (priceFilters[0] > priceRange.min || priceFilters[1] < priceRange.max) {
            filters.push(`Prix: ${priceFilters[0]} - ${priceFilters[1]} MAD`);
        }

        setActiveFilters(filters);
    }, [selectedCategory, selectedMaterials, selectedGemTypes, priceFilters, categories, priceRange]);

    useEffect(() => {
        // Defer client-side hydration-sensitive rendering
        setIsMounted(true);
      }, []);

    // Reset all filters
    const handleResetFilters = () => {
        setSelectedCategory("");
        setSelectedMaterials([]);
        setSelectedGemTypes([]);
        setPriceFilters([priceRange.min, priceRange.max]);
        setSortOption("featured");
    };

    // Toggle material selection
    const toggleMaterial = (material: string) => {
        setSelectedMaterials(prev =>
            prev.includes(material)
                ? prev.filter(m => m !== material)
                : [...prev, material]
        );
    };

    // Toggle gemstone selection
    const toggleGemType = (gemType: string) => {
        setSelectedGemTypes(prev =>
            prev.includes(gemType)
                ? prev.filter(g => g !== gemType)
                : [...prev, gemType]
        );
    };

    return (
        <>
            <Head>
                <title>Collections | Diamant Rouge</title>
                <meta name="description" content="Découvrez nos créations exclusives de haute joaillerie, où l'excellence artisanale rencontre l'élégance intemporelle." />
            </Head>

            {/* Hero Section with Parallax */}
            <div
                ref={heroRef}
                className="h-[50vh] lg:h-[70vh] relative overflow-hidden bg-gray-900 flex items-center justify-center"
            >
                {/* Background image with parallax effect */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/collections-hero.jpg"
                        alt="Diamant Rouge Collections"
                        layout="fill"
                        objectFit="cover"
                        quality={90}
                        priority
                        className="opacity-80"
                    />
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-serif text-brandIvory mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Collections
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-brandIvory/90 font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Chaque création raconte une histoire d'excellence artisanale,
                        où des gemmes précieuses et des métaux nobles se transforment en œuvres d'art à porter.
                    </motion.p>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <div className="w-8 h-12 border-2 border-brandIvory rounded-full flex items-start justify-center">
                        <motion.div
                            className="w-1.5 h-3 bg-brandIvory rounded-full mt-2"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="bg-brandIvory">
                {/* Featured Collection Highlight (can be toggled off) */}
                {isCollectionHighlighted && (
                    <div className="relative py-16 px-6 bg-gradient-to-r from-brandGold/5 to-burgundy/5">
                        {/* Close button for highlight */}
                        <button
                            onClick={() => setIsCollectionHighlighted(false)}
                            className="absolute top-4 right-4 text-platinumGray hover:text-burgundy"
                            aria-label="Fermer la mise en avant"
                        >
                            <XIcon className="h-6 w-6" />
                        </button>

                        <div className="max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="relative aspect-square overflow-hidden">
                                    <Image
                                        src="/images/featured-collection.jpg"
                                        alt="Collection Celestial - Diamant Rouge"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-sm"
                                    />
                                </div>
                                <div className="space-y-6 p-4">
                                    <h2 className="text-4xl font-serif text-brandGold">Collection Celestial</h2>
                                    <p className="text-lg text-platinumGray leading-relaxed">
                                        Inspirée par la magnificence des corps célestes, notre collection signature évoque
                                        l'harmonie cosmique à travers des créations d'exception. Chaque pièce capte la lumière
                                        des étoiles et la magie de l'infini.
                                    </p>
                                    <div className="pt-4">
                                        <Link
                                            href="/collections/celestial"
                                            className="button-primary inline-block"
                                        >
                                            Découvrir la collection
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Filters and Sort Bar - Desktop */}
                    <div className="hidden md:block sticky top-0 bg-brandIvory z-30 py-4 border-b border-brandGold/20">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                                {/* Category Filter */}
                                <div className="relative group">
                                    <button className="filter-button">
                                        Catégorie
                                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    </button>
                                    <div className="filter-dropdown">
                                        <div
                                            className={`filter-option ${selectedCategory === "" ? "bg-brandGold/10" : ""}`}
                                            onClick={() => setSelectedCategory("")}
                                        >
                                            Toutes les catégories
                                        </div>
                                        {categories.map((cat) => (
                                            <div
                                                key={cat.slug}
                                                className={`filter-option ${selectedCategory === cat.slug ? "bg-brandGold/10" : ""}`}
                                                onClick={() => setSelectedCategory(cat.slug)}
                                            >
                                                {cat.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Materials Filter */}
                                <div className="relative group">
                                    <button className="filter-button">
                                        Matériaux
                                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    </button>
                                    <div className="filter-dropdown">
                                        {materials.map((material) => (
                                            <div
                                                key={material}
                                                className={`filter-option flex items-center ${selectedMaterials.includes(material) ? "bg-brandGold/10" : ""
                                                    }`}
                                                onClick={() => toggleMaterial(material)}
                                            >
                                                <span className="w-4 h-4 border border-brandGold rounded-sm mr-2 flex items-center justify-center">
                                                    {selectedMaterials.includes(material) && (
                                                        <span className="w-2 h-2 bg-brandGold rounded-sm" />
                                                    )}
                                                </span>
                                                {material}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gemstones Filter */}
                                <div className="relative group">
                                    <button className="filter-button">
                                        Pierres
                                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    </button>
                                    <div className="filter-dropdown">
                                        {gemTypes.map((gemType) => (
                                            <div
                                                key={gemType}
                                                className={`filter-option flex items-center ${selectedGemTypes.includes(gemType) ? "bg-brandGold/10" : ""
                                                    }`}
                                                onClick={() => toggleGemType(gemType)}
                                            >
                                                <span className="w-4 h-4 border border-brandGold rounded-sm mr-2 flex items-center justify-center">
                                                    {selectedGemTypes.includes(gemType) && (
                                                        <span className="w-2 h-2 bg-brandGold rounded-sm" />
                                                    )}
                                                </span>
                                                {gemType}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div className="relative group">
                                    <button className="filter-button">
                                        Prix
                                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    </button>
                                    <div className="filter-dropdown w-72 p-6">
                                        <div className="mb-4">
                                            <div className="flex justify-between mb-2">
                                                <span>{priceFilters[0]} MAD</span>
                                                <span>{priceFilters[1]} MAD</span>
                                            </div>
                                            <div className="flex space-x-4">
                                                <input
                                                    type="range"
                                                    min={priceRange.min}
                                                    max={priceRange.max}
                                                    value={priceFilters[0]}
                                                    onChange={(e) => setPriceFilters([parseInt(e.target.value), priceFilters[1]])}
                                                    className="w-full accent-brandGold"
                                                />
                                                <input
                                                    type="range"
                                                    min={priceRange.min}
                                                    max={priceRange.max}
                                                    value={priceFilters[1]}
                                                    onChange={(e) => setPriceFilters([priceFilters[0], parseInt(e.target.value)])}
                                                    className="w-full accent-brandGold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="relative group">
                                <button className="filter-button">
                                    Trier par
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                </button>
                                <div className="filter-dropdown right-0 left-auto">
                                    <div
                                        className={`filter-option ${sortOption === "featured" ? "bg-brandGold/10" : ""}`}
                                        onClick={() => setSortOption("featured")}
                                    >
                                        En vedette
                                    </div>
                                    <div
                                        className={`filter-option ${sortOption === "newest" ? "bg-brandGold/10" : ""}`}
                                        onClick={() => setSortOption("newest")}
                                    >
                                        Nouveautés
                                    </div>
                                    <div
                                        className={`filter-option ${sortOption === "price-asc" ? "bg-brandGold/10" : ""}`}
                                        onClick={() => setSortOption("price-asc")}
                                    >
                                        Prix croissant
                                    </div>
                                    <div
                                        className={`filter-option ${sortOption === "price-desc" ? "bg-brandGold/10" : ""}`}
                                        onClick={() => setSortOption("price-desc")}
                                    >
                                        Prix décroissant
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                            <div className="flex items-center flex-wrap mt-4 pt-3 gap-2">
                                <span className="text-sm text-platinumGray">Filtres actifs :</span>
                                {activeFilters.map((filter, idx) => (
                                    <span
                                        key={idx}
                                        className="text-sm px-3 py-1 bg-brandGold/10 text-platinumGray rounded-full"
                                    >
                                        {filter}
                                    </span>
                                ))}
                                <button
                                    onClick={handleResetFilters}
                                    className="text-sm text-burgundy hover:underline ml-2"
                                >
                                    Effacer tous les filtres
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Filters Button */}
                    <div className="md:hidden flex justify-between items-center mb-6 sticky top-0 bg-brandIvory z-30 py-4">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="filter-button"
                        >
                            Filtres & Tri
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                        </button>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setView("grid")}
                                className={`p-2 ${view === "grid" ? "text-brandGold" : "text-platinumGray"}`}
                                aria-label="Vue grille"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setView("gallery")}
                                className={`p-2 ${view === "gallery" ? "text-brandGold" : "text-platinumGray"}`}
                                aria-label="Vue galerie"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filters Drawer */}
                    <AnimatePresence>
                        {mobileFiltersOpen && (
                            <motion.div
                                className="fixed inset-0 z-50 md:hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="absolute inset-0 bg-gray-900/60" onClick={() => setMobileFiltersOpen(false)} />



                                <motion.div
                                    className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-brandIvory p-6 overflow-y-auto"
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                                >
                                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-brandGold/20">
                                        <h2 className="text-2xl font-serif text-brandGold">Filtres & Tri</h2>
                                        <button
                                            onClick={() => setMobileFiltersOpen(false)}
                                            className="text-platinumGray hover:text-burgundy"
                                            aria-label="Fermer les filtres"
                                        >
                                            <XIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Category Filter */}
                                        <div>
                                            <h3 className="text-lg font-medium text-platinumGray mb-3">Catégorie</h3>
                                            <div className="space-y-2">
                                                <div
                                                    className={`py-2 px-3 rounded-sm cursor-pointer transition ${selectedCategory === "" ? "bg-brandGold/10 text-brandGold" : "hover:bg-brandGold/5"}`}
                                                    onClick={() => setSelectedCategory("")}
                                                >
                                                    Toutes les catégories
                                                </div>
                                                {categories.map((cat) => (
                                                    <div
                                                        key={cat.slug}
                                                        className={`py-2 px-3 rounded-sm cursor-pointer transition ${selectedCategory === cat.slug ? "bg-brandGold/10 text-brandGold" : "hover:bg-brandGold/5"}`}
                                                        onClick={() => setSelectedCategory(cat.slug)}
                                                    >
                                                        {cat.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Materials Filter */}
                                        <div>
                                            <h3 className="text-lg font-medium text-platinumGray mb-3">Matériaux</h3>
                                            <div className="space-y-2">
                                                {materials.map((material) => (
                                                    <div
                                                        key={material}
                                                        className="flex items-center py-2 px-3 rounded-sm cursor-pointer transition hover:bg-brandGold/5"
                                                        onClick={() => toggleMaterial(material)}
                                                    >
                                                        <span className="w-5 h-5 border border-brandGold rounded-sm mr-3 flex items-center justify-center">
                                                            {selectedMaterials.includes(material) && (
                                                                <span className="w-3 h-3 bg-brandGold rounded-sm" />
                                                            )}
                                                        </span>
                                                        <span className={selectedMaterials.includes(material) ? "text-brandGold" : ""}>
                                                            {material}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gemstones Filter */}
                                        <div>
                                            <h3 className="text-lg font-medium text-platinumGray mb-3">Pierres</h3>
                                            <div className="space-y-2">
                                                {gemTypes.map((gemType) => (
                                                    <div
                                                        key={gemType}
                                                        className="flex items-center py-2 px-3 rounded-sm cursor-pointer transition hover:bg-brandGold/5"
                                                        onClick={() => toggleGemType(gemType)}
                                                    >
                                                        <span className="w-5 h-5 border border-brandGold rounded-sm mr-3 flex items-center justify-center">
                                                            {selectedGemTypes.includes(gemType) && (
                                                                <span className="w-3 h-3 bg-brandGold rounded-sm" />
                                                            )}
                                                        </span>
                                                        <span className={selectedGemTypes.includes(gemType) ? "text-brandGold" : ""}>
                                                            {gemType}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Range Filter */}
                                        <div>
                                            <h3 className="text-lg font-medium text-platinumGray mb-3">Prix</h3>
                                            <div className="px-3">
                                                <div className="flex justify-between mb-2 text-sm text-platinumGray">
                                                    <span>{priceFilters[0]} MAD</span>
                                                    <span>{priceFilters[1]} MAD</span>
                                                </div>
                                                <div className="mb-6">
                                                <input
  type="range"
  min={priceRange.min}
  max={priceRange.max}
  step={Math.max(1, Math.floor((priceRange.max - priceRange.min) / 100))}
  value={priceFilters[0]}
  onChange={(e) => setPriceFilters([parseInt(e.target.value), priceFilters[1]])}
  className="w-full accent-brandGold mb-4"
/>
                                                    <input
                                                        type="range"
                                                        min={priceRange.min}
                                                        max={priceRange.max}
                                                        step={(priceRange.max - priceRange.min) / 100}
                                                        value={priceFilters[1]}
                                                        onChange={(e) => setPriceFilters([priceFilters[0], parseInt(e.target.value)])}
                                                        className="w-full accent-brandGold"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sort Options */}
                                        <div>
                                            <h3 className="text-lg font-medium text-platinumGray mb-3">Trier par</h3>
                                            <div className="space-y-2">
                                                <div
                                                    className={`py-2 px-3 rounded-sm cursor-pointer transition ${sortOption === "featured" ? "bg-brandGold/10 text-brandGold" : "hover:bg-brandGold/5"}`}
                                                    onClick={() => setSortOption("featured")}
                                                >
                                                    En vedette
                                                </div>
                                                <div
                                                    className={`py-2 px-3 rounded-sm cursor-pointer transition ${sortOption === "newest" ? "bg-brandGold/10 text-brandGold" : "hover:bg-brandGold/5"}`}
                                                    onClick={() => setSortOption("newest")}
                                                >
                                                    Nouveautés
                                                </div>
                                                <div
                                                    className={`py-2 px-3 rounded-sm cursor-pointer transition ${sortOption === "price-asc" ? "bg-brandGold/10 text-brandGold" : "hover:bg-brandGold/5"}`}
                                                    onClick={() => setSortOption("price-asc")}
                                                >
                                                    Prix croissant
                                                </div>
                                                <div
                                                    className={`py-2 px-3 rounded-sm cursor-pointer transition ${sortOption === "price-desc" ? "bg-brandGold/10 text-brandGold" : "hover:bg-brandGold/5"}`}
                                                    onClick={() => setSortOption("price-desc")}
                                                >
                                                    Prix décroissant
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-brandGold/20">
                                            <button
                                                onClick={handleResetFilters}
                                                className="w-full py-3 px-6 border border-burgundy text-burgundy rounded-sm hover:bg-burgundy/5 transition"
                                            >
                                                Réinitialiser les filtres
                                            </button>
                                            <button
                                                onClick={() => setMobileFiltersOpen(false)}
                                                className="w-full mt-4 py-3 px-6 bg-brandGold text-white rounded-sm hover:bg-brandGold/90 transition"
                                            >
                                                Appliquer les filtres
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Summary */}
                    <div className="flex flex-wrap items-center justify-between mt-8 mb-10">
                        <div className="mb-4 md:mb-0">
                            <p className="text-platinumGray">
                                {sortedProducts.length} {sortedProducts.length > 1 ? 'créations' : 'création'} {activeFilters.length > 0 ? 'filtrées' : ''}
                            </p>
                            {activeFilters.length > 0 && (
                                <div className="md:hidden mt-2">
                                    <button
                                        onClick={handleResetFilters}
                                        className="text-sm text-burgundy hover:underline"
                                    >
                                        Effacer tous les filtres
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* View Switcher - Desktop */}
                        <div className="hidden md:flex space-x-4 items-center">
                            <span className="text-platinumGray">Vue :</span>
                            <button
                                onClick={() => setView("grid")}
                                className={`p-2 ${view === "grid" ? "text-brandGold" : "text-platinumGray hover:text-brandGold/70"}`}
                                aria-label="Vue grille"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setView("gallery")}
                                className={`p-2 ${view === "gallery" ? "text-brandGold" : "text-platinumGray hover:text-brandGold/70"}`}
                                aria-label="Vue galerie"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* No Results */}
                    {sortedProducts.length === 0 && (
                        <div className="py-20 text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-platinumGray/40 mb-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-2xl font-serif text-platinumGray mb-2">Aucune création trouvée</h3>
                            <p className="text-platinumGray">
                                Aucune création ne correspond à vos critères de recherche.
                            </p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-6 px-6 py-2 border border-brandGold text-brandGold rounded-sm hover:bg-brandGold/5 transition"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {sortedProducts.length > 0 && (
                        <motion.div
                            layout
                            className={`
${view === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
                                    : "space-y-8"
                                }
`}
                        >
                            <AnimatePresence>
                                {sortedProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {view === "grid" ? (
                                            <ProductCard product={product} />
                                        ) : (
                                            // Gallery View
                                            <div className="flex flex-col md:flex-row border-b border-brandGold/10 pb-8">
                                                <div className="md:w-1/3 relative aspect-square mb-6 md:mb-0 md:mr-8">
                                                    <Link href={`/products/${product.slug}`}>
                                                        <Image
                                                            src={product.featuredImage || "/images/product-placeholder.jpg"}
                                                            alt={product.translations[0]?.name || product.slug}
                                                            layout="fill"
                                                            objectFit="cover"
                                                            className="rounded-sm hover:opacity-90 transition"
                                                        />
                                                        {product.featured && (
                                                            <div className="absolute top-3 left-3 bg-brandGold text-white text-xs uppercase tracking-wider py-1 px-2">
                                                                En vedette
                                                            </div>
                                                        )}
                                                    </Link>
                                                </div>
                                                <div className="md:w-2/3 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-serif mb-2">
                                                            <Link
                                                                href={`/products/${product.slug}`}
                                                                className="text-platinumGray hover:text-brandGold"
                                                            >
                                                                {product.translations[0]?.name || product.slug}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-platinumGray/80 text-sm mb-4 line-clamp-3">
                                                            {product.translations[0]?.description || ""}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {product.category && (
                                                                <span className="text-xs bg-brandGold/5 text-platinumGray px-2 py-1 rounded-sm">
                                                                    {product.category.name}
                                                                </span>
                                                            )}
                                                            {product.materials?.slice(0, 2).map((material) => (
                                                                <span key={material} className="text-xs bg-brandGold/5 text-platinumGray px-2 py-1 rounded-sm">
                                                                    {material}
                                                                </span>
                                                            ))}
                                                            {product.gemTypes?.slice(0, 2).map((gem) => (
                                                                <span key={gem} className="text-xs bg-brandGold/5 text-platinumGray px-2 py-1 rounded-sm">
                                                                    {gem}
                                                                </span>
                                                            ))}
                                                            {(product.materials?.length > 2 || product.gemTypes?.length > 2) && (
                                                                <span className="text-xs bg-brandGold/5 text-platinumGray px-2 py-1 rounded-sm">
                                                                    +{(product.materials?.length || 0) + (product.gemTypes?.length || 0) - 4} plus
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                    <span className="text-brandGold text-lg">
  {isMounted 
    ? Number(product.basePrice).toLocaleString('fr-FR') 
    : Number(product.basePrice)} MAD
</span>
                                                        <Link
                                                            href={`/products/${product.slug}`}
                                                            className="text-sm px-4 py-2 border border-brandGold text-brandGold rounded-sm hover:bg-brandGold hover:text-white transition-all"
                                                        >
                                                            Découvrir
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Craftsmanship Section - Brand Story */}
                    <div className="mt-24 mb-16 py-12 border-t border-b border-brandGold/10">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="font-serif text-3xl mb-6 text-brandGold">L'Art de la Haute Joaillerie</h2>
                            <p className="text-lg text-platinumGray leading-relaxed mb-8">
                                Chaque création Diamant Rouge est le fruit d'un savoir-faire exceptionnel,
                                transmis de génération en génération. Nos maîtres joailliers façonnent avec
                                passion des pièces uniques, alliant tradition ancestrale et innovation contemporaine.
                            </p>
                            <Link
                                href="/savoir-faire"
                                className="inline-block border-b border-brandGold text-brandGold hover:border-burgundy hover:text-burgundy transition-colors"
                            >
                                Découvrir notre savoir-faire
                            </Link>
                        </div>
                    </div>

                    {/* FAQ Section - Assistance */}
                    <div className="bg-brandGold/5 rounded-sm p-8 mt-16">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="font-serif text-2xl mb-6 text-brandGold text-center">Questions Fréquentes</h3>

                            <div className="space-y-4">
                                <details className="group border-b border-brandGold/20 pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span>Comment prendre rendez-vous pour une consultation personnalisée ?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-platinumGray/80 mt-3 group-open:animate-fadeIn">
                                        Pour une consultation personnalisée avec l'un de nos experts, veuillez nous contacter par téléphone
                                        ou via notre formulaire en ligne. Nous vous proposerons un rendez-vous dans notre boutique ou par
                                        visioconférence selon vos préférences.
                                    </p>
                                </details>

                                <details className="group border-b border-brandGold/20 pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span>Proposez-vous des créations sur mesure ?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-platinumGray/80 mt-3 group-open:animate-fadeIn">
                                        Absolument. Notre atelier de haute joaillerie se dédie à la création de pièces uniques, conçues
                                        selon vos désirs. Des pierres précieuses aux métaux nobles, chaque élément est sélectionné avec
                                        le plus grand soin pour créer une pièce qui vous ressemble.
                                    </p>
                                </details>

                                <details className="group pb-4">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span>Quels services après-vente proposez-vous ?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-platinumGray/80 mt-3 group-open:animate-fadeIn">
                                        Diamant Rouge s'engage à préserver la beauté de vos créations à travers le temps. Nous offrons
                                        des services d'entretien, de réparation et de restauration réalisés par nos maîtres joailliers.
                                        Chaque pièce bénéficie d'une garantie et d'un suivi personnalisé.
                                    </p>
                                </details>
                            </div>

                            <div className="mt-8 text-center">
                                <Link
                                    href="/contact"
                                    className="inline-block px-8 py-3 bg-brandGold text-white rounded-sm hover:bg-brandGold/90 transition"
                                >
                                    Nous Contacter
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}