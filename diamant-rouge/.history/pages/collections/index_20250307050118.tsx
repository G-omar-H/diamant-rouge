import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";
import type { Product } from "@prisma/client";

type CollectionPageProps = {
    products: Array<Product & {
        category?: { slug: string; translations: any[] } | null;
        translations: any[];
    }>;
    categories: Array<{
        slug: string;
        translations: any[];
    }>;
    materials: string[];
    gemTypes: string[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const locale = context.locale || "fr";

    try {
        // Fetch categories with translations
        const categoryRecords = await prisma.category.findMany({
            include: {
                translations: true
            },
        });

        // Fetch all products with complete details
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

        // Extract unique materials and gem types from variations
        const allVariations = products.flatMap(p => p.variations);
        const materials = [...new Set(allVariations
            .filter(v => v.variationType === "material")
            .map(v => v.variationValue))];

        const gemTypes = [...new Set(allVariations
            .filter(v => v.variationType === "gemstone")
            .map(v => v.variationValue))];

        return {
            props: {
                products: JSON.parse(JSON.stringify(products)),
                categories: JSON.parse(JSON.stringify(categoryRecords)),
                materials,
                gemTypes
            },
        };
    } catch (error) {
        console.error("❌ Error fetching collections:", error);
        return {
            props: {
                products: [],
                categories: [],
                materials: [],
                gemTypes: []
            },
        };
    }
};

export default function CollectionsPage({
    products,
    categories,
    materials,
    gemTypes
}: CollectionPageProps) {
    // Locale state (default to French)
    const [locale, setLocale] = useState("fr");

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedMaterial, setSelectedMaterial] = useState<string>("");
    const [selectedGemType, setSelectedGemType] = useState<string>("");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [sortOption, setSortOption] = useState<string>("featured");

    // UI states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<"grid" | "list">("grid");

    // Filter function
    const filterProducts = (productsToFilter) => {
        const filtered = productsToFilter.filter((product) => {
            // Category filter
            if (selectedCategory && product.category?.slug !== selectedCategory) {
                return false;
            }
    
            // Price filter
            const basePrice = Number(product.basePrice);
            if (basePrice < priceRange[0] || basePrice > priceRange[1]) {
                return false;
            }
    
            // Material filter
            if (selectedMaterial && !product.variations.some(v =>
                v.variationType === "material" && v.variationValue === selectedMaterial)) {
                return false;
            }
    
            // Gemstone filter
            if (selectedGemType && !product.variations.some(v =>
                v.variationType === "gemstone" && v.variationValue === selectedGemType)) {
                return false;
            }
    
            return true;
        });
    
        // Apply sorting
        return sortProducts(filtered);
    };

    // Use useMemo to store filtered products
const filteredProducts = useMemo(() => {
    return filterProducts(products);
}, [products, selectedCategory, selectedMaterial, selectedGemType, priceRange, sortOption]);

    // Sort function
    const sortProducts = (productsToSort: any[]) => {
        const sorted = [...productsToSort];

        switch (sortOption) {
            case "price-asc":
                sorted.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
                break;
            case "price-desc":
                sorted.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
                break;
            case "newest":
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "featured":
                sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
            default:
                break;
        }

        setTimeout(() => setLoading(false), 400); // Simulate some loading time for smooth transitions
        return sorted;
    };

    // Get filtered & sorted products
    const filteredProducts = getFilteredProducts();

    // Get translation helper
    const getTranslation = (translations: any[], field: string) => {
        const translation = translations.find(t => t.language === locale) || translations[0];
        return translation ? translation[field] : '';
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedMaterial("");
        setSelectedGemType("");
        setPriceRange([0, 1000000]);
        setSortOption("featured");
    };

    // Formatted price with space for thousands
    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    return (
        <>
            <NextSeo
                title="Collections | Diamant Rouge - Joaillerie d'exception"
                description="Découvrez nos collections exclusives de joaillerie d'exception, façonnées à la main selon les traditions ancestrales marocaines."
                openGraph={{
                    title: "Collections | Diamant Rouge - Joaillerie d'exception",
                    description: "Explorez l'élégance intemporelle des créations Diamant Rouge, où la tradition marocaine rencontre le raffinement contemporain.",
                    images: [
                        {
                            url: "/images/collections-banner.jpg",
                            width: 1200,
                            height: 630,
                            alt: "Collections Diamant Rouge",
                        }
                    ]
                }}
            />

            <div className="min-h-screen bg-brandIvory">
                {/* Hero Section */}
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/collections-banner.jpg"
                            alt="Collections Diamant Rouge"
                            layout="fill"
                            objectFit="cover"
                            quality={90}
                            priority
                            className="opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-richEbony/50"></div>
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                        <motion.h1
                            className="text-5xl md:text-6xl font-serif text-brandIvory mb-4 drop-shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            Nos Collections
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-brandIvory/90 max-w-2xl mx-auto leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        >
                            La quintessence du savoir-faire artisanal marocain sublimée par l'excellence de la joaillerie contemporaine. Chaque pièce raconte une histoire unique, façonnée par nos maîtres joailliers avec passion et précision.
                        </motion.p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Filters Section */}
                    <div className="mb-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-serif text-brandGold">
                                    {filteredProducts.length} création{filteredProducts.length !== 1 ? 's' : ''}
                                    {selectedCategory && categories.find(c => c.slug === selectedCategory) ?
                                        ` dans ${getTranslation(categories.find(c => c.slug === selectedCategory)!.translations, 'name')}` :
                                        ''}
                                </h2>
                                {(selectedCategory || selectedMaterial || selectedGemType || priceRange[0] > 0 || priceRange[1] < 1000000) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-burgundy hover:text-burgundy/80 text-sm flex items-center mt-1 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>                                        Effacer tous les filtres
                                    </button>
                                )}
                            </div>

                            <div className="flex space-x-2 w-full md:w-auto">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="btn-outline-gold flex-1 md:flex-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                    </svg>
                                    Filtrer
                                </button>

                                <div className="flex border border-brandGold/30 rounded-md">
                                    <button
                                        className={`px-3 py-2 ${view === 'grid' ? 'text-brandGold' : 'text-platinumGray'}`}
                                        onClick={() => setView('grid')}
                                        title="Vue grille"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button
                                        className={`px-3 py-2 ${view === 'list' ? 'text-brandGold' : 'text-platinumGray'}`}
                                        onClick={() => setView('list')}
                                        title="Vue liste"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="relative">
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="appearance-none pl-4 pr-10 py-2 border border-brandGold/30 rounded-md bg-transparent text-richEbony focus:outline-none focus:ring-1 focus:ring-brandGold focus:border-brandGold"
                                    >
                                        <option value="featured">Nos Favoris</option>
                                        <option value="newest">Nouveautés</option>
                                        <option value="price-asc">Prix croissant</option>
                                        <option value="price-desc">Prix décroissant</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-richEbony">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters Panel */}
                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-brandIvory border border-brandGold/20 rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Category Filter */}
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-richEbony mb-2">
                                                Catégorie
                                            </label>
                                            <select
                                                id="category"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="input-field w-full"
                                            >
                                                <option value="">Toutes les catégories</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.slug} value={cat.slug}>
                                                        {getTranslation(cat.translations, 'name')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Material Filter */}
                                        <div>
                                            <label htmlFor="material" className="block text-sm font-medium text-richEbony mb-2">
                                                Matière
                                            </label>
                                            <select
                                                id="material"
                                                value={selectedMaterial}
                                                onChange={(e) => setSelectedMaterial(e.target.value)}
                                                className="input-field w-full"
                                            >
                                                <option value="">Toutes les matières</option>
                                                {materials.map((material) => (
                                                    <option key={material} value={material}>
                                                        {material}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Gemstone Filter */}
                                        <div>
                                            <label htmlFor="gemstone" className="block text-sm font-medium text-richEbony mb-2">
                                                Pierre Précieuse
                                            </label>
                                            <select
                                                id="gemstone"
                                                value={selectedGemType}
                                                onChange={(e) => setSelectedGemType(e.target.value)}
                                                className="input-field w-full"
                                            >
                                                <option value="">Toutes les pierres</option>
                                                {gemTypes.map((gem) => (
                                                    <option key={gem} value={gem}>
                                                        {gem}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Price Range */}
                                        <div>
                                            <label className="block text-sm font-medium text-richEbony mb-2">
                                                Fourchette de Prix (MAD)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                    placeholder="Min"
                                                    className="input-field w-full"
                                                />
                                                <span className="text-platinumGray">à</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[1] === 1000000 ? "" : priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                                                    placeholder="Max"
                                                    className="input-field w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Product Display */}
                    <div>
                        {loading ? (
                            // Skeleton Loader Grid
                            <div className={
                                view === 'grid'
                                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                    : "space-y-6"
                            }>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={`bg-white rounded-lg overflow-hidden shadow-sm ${view === 'list' ? 'flex' : ''}`}>
                                        <div className={`${view === 'list' ? 'w-1/3' : 'w-full'} aspect-square bg-gray-200 animate-pulse`}></div>
                                        <div className={`p-4 ${view === 'list' ? 'w-2/3' : ''}`}>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            // Empty State
                            <div className="text-center py-16 px-4">
                                <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-brandGold/10 mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brandGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-serif text-brandGold mb-3">
                                    Aucun résultat trouvé
                                </h2>
                                <p className="text-platinumGray max-w-lg mx-auto mb-8">
                                    Nous n'avons pas trouvé de créations correspondant à vos critères. Essayez d'élargir votre recherche ou consultez nos autres collections.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="btn-gold"
                                >
                                    Voir toutes les créations
                                </button>
                            </div>
                        ) : (
                            // Product Grid or List
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={view}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={
                                        view === 'grid'
                                            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
                                            : "space-y-10"
                                    }
                                >
                                    {filteredProducts.map((product) => {
                                        const name = getTranslation(product.translations, 'name');
                                        const productUrl = `/produit/${product.id}`;

                                        return (
                                            view === 'grid' ? (
                                                // Grid View
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="group"
                                                >
                                                    <Link href={productUrl}>
                                                        <div className="cursor-pointer">
                                                            <div className="relative aspect-square overflow-hidden bg-white rounded-lg mb-4 group-hover:shadow-md transition-all duration-300">
                                                                {product.images && product.images.length > 0 ? (
                                                                    <Image
                                                                        src={product.images[0]}
                                                                        alt={name}
                                                                        layout="fill"
                                                                        objectFit="cover"
                                                                        className="transform group-hover:scale-105 transition-all duration-700"
                                                                    />
                                                                ) : (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-platinumGray">
                                                                        Image non disponible
                                                                    </div>
                                                                )}

                                                                {product.featured && (
                                                                    <div className="absolute top-2 right-2 bg-brandGold text-white text-xs px-2 py-1 rounded">
                                                                        Édition Limitée
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <h3 className="font-serif text-lg text-richEbony group-hover:text-brandGold transition-colors">
                                                                {name}
                                                            </h3>

                                                            <p className="text-brandGold font-medium">
                                                                {formatPrice(Number(product.basePrice))} MAD
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ) : (
                                                // List View
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="w-full sm:w-1/3 md:w-1/4 relative aspect-square sm:aspect-auto">
                                                        {product.images && product.images.length > 0 ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={name}
                                                                layout="fill"
                                                                objectFit="cover"
                                                                className="transform group-hover:scale-105 transition-all duration-700"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-platinumGray">
                                                                Image non disponible
                                                            </div>
                                                        )}

                                                        {product.featured && (
                                                            <div className="absolute top-2 left-2 bg-brandGold text-white text-xs px-2 py-1 rounded">
                                                                Édition Limitée
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-6 flex flex-col justify-between flex-grow">
                                                        <div>
                                                            <h3 className="font-serif text-xl text-richEbony group-hover:text-brandGold transition-colors mb-2">
                                                                {name}
                                                            </h3>

                                                            <p className="text-platinumGray mb-4 line-clamp-2">
                                                                {getTranslation(product.translations, 'description')}
                                                            </p>

                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {product.category && (
                                                                    <span className="text-xs px-2 py-1 bg-brandGold/10 text-brandGold rounded">
                                                                        {getTranslation(product.category.translations, 'name')}
                                                                    </span>
                                                                )}

                                                                {product.variations
                                                                    .filter(v => v.variationType === "material")
                                                                    .slice(0, 1)
                                                                    .map(v => (
                                                                        <span key={v.id} className="text-xs px-2 py-1 bg-burgundy/10 text-burgundy rounded">
                                                                            {v.variationValue}
                                                                        </span>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <p className="text-brandGold font-medium text-lg">
                                                                {formatPrice(Number(product.basePrice))} MAD
                                                            </p>

                                                            <Link href={productUrl}>
                                                                <button className="btn-outline-gold">
                                                                    Découvrir
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        );
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Craftmanship Note */}
                <section className="py-20 px-6 bg-pattern-light">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-serif text-brandGold mb-6">L'Art de la Joaillerie</h2>
                        <p className="text-platinumGray leading-relaxed mb-8">
                            Chaque création Diamant Rouge est façonnée à la main, alliant l'expertise des traditions joaillières marocaines à une vision contemporaine. Nos maîtres artisans perpétuent un savoir-faire ancestral, où chaque détail est minutieusement élaboré pour créer des pièces uniques qui traverseront les générations.
                        </p>
                        <Link href="/savoir-faire">
                            <button className="btn-outline-gold">
                                Découvrir Notre Savoir-Faire
                            </button>
                        </Link>
                    </div>
                </section>
            </div>

            <style jsx>{`
                                .bg-pattern-light {
                    background-color: #f9f6f0;
                    background-image: url('/images/subtle-pattern.png');
                    background-size: 200px;
                    background-repeat: repeat;
                }
                
                .input-field {
                    @apply px-4 py-2 border border-brandGold/30 rounded-md bg-transparent text-richEbony focus:outline-none focus:ring-1 focus:ring-brandGold focus:border-brandGold placeholder-platinumGray/60;
                }
                
                .btn-gold {
                    @apply px-6 py-2.5 bg-brandGold hover:bg-brandGold/90 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brandGold/50 focus:ring-offset-2;
                }
                
                .btn-outline-gold {
                    @apply px-4 py-2 border border-brandGold text-brandGold hover:bg-brandGold hover:text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brandGold/50;
                }
                
                .shadow-luxury {
                    box-shadow: 0 10px 25px -5px rgba(166, 134, 77, 0.1), 0 8px 10px -6px rgba(166, 134, 77, 0.05);
                }
                
                .animate-fadeIn {
                    animation: fadeIn 1.2s ease-out forwards;
                }
                
                .animate-slideIn {
                    animation: slideIn 0.8s ease-out forwards;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}