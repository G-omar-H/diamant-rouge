import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import Image from "next/image";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import type { Product } from "@prisma/client";
import { useRouter } from "next/router";
import Head from "next/head";

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
    // States

    const router = useRouter();
  const { category } = router.query;
  
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [sortOption, setSortOption] = useState("latest");
    
    // Get translated category names
    const getCategoryName = (slug: string) => {
        const category = categories.find(c => c.slug === slug);
        if (!category) return slug;
        
        const translation = category.translations.find(t => t.language === "fr") || 
                           category.translations.find(t => t.language === "en");
        return translation?.name || slug;
    };

    // Filter products
    const filteredProducts = products.filter((product) => {
        // Category filter
        if (selectedCategory && product.category?.slug !== selectedCategory) {
            return false;
        }
        // Price filter
        if (maxPrice !== "") {
            const basePriceNum = Number(product.basePrice);
            if (basePriceNum > Number(maxPrice)) {
                return false;
            }
        }
        return true;
    });
    
    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === "price-asc") {
            return Number(a.basePrice) - Number(b.basePrice);
        } 
        if (sortOption === "price-desc") {
            return Number(b.basePrice) - Number(a.basePrice);
        }
        // Default: latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory("");
        setMaxPrice("");
        setSortOption("latest");
    };

    return (
        <>
            <Head>
                <title>Collections | Diamant Rouge</title>
                <meta name="description" content="Découvrez nos pièces intemporelles, façonnées dans l'excellence." />
            </Head>
        
            <div className="min-h-screen bg-brandIvory">
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
                    {/* FILTERS SECTION */}
                    <div className="mb-12 border-b border-brandGold/20 pb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-2xl font-serif text-brandGold">
                                    {sortedProducts.length} {sortedProducts.length > 1 ? 'Créations' : 'Création'}
                                </h2>
                                {(selectedCategory || maxPrice) && (
                                    <p className="text-sm text-platinumGray mt-1">
                                        Filtres appliqués: {selectedCategory && `${getCategoryName(selectedCategory)}`} 
                                        {selectedCategory && maxPrice && ', '}
                                        {maxPrice && `Prix max ${maxPrice} MAD`}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                    className="flex items-center gap-2 px-4 py-2 border border-brandGold/30 rounded hover:bg-brandGold/5 transition"
                                >
                                    <FiFilter className="text-brandGold" />
                                    <span className="text-brandGold">Filtres</span>
                                    <FiChevronDown className={`text-brandGold transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="border border-brandGold/30 rounded bg-transparent p-2 text-brandGold focus:outline-none focus:ring-1 focus:ring-brandGold"
                                >
                                    <option value="latest">Plus récents</option>
                                    <option value="price-asc">Prix: croissant</option>
                                    <option value="price-desc">Prix: décroissant</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Collapsible Filter Panel */}
                        <AnimatePresence>
                            {isFiltersOpen && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-6 bg-white/50 rounded-lg shadow-sm">
                                        {/* Category Filter */}
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-brandGold mb-2">
                                                Catégorie
                                            </label>
                                            <select
                                                id="category"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full border border-brandGold/30 rounded bg-transparent p-2.5 text-platinumGray focus:outline-none focus:ring-1 focus:ring-brandGold"
                                            >
                                                <option value="">Toutes les catégories</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.slug} value={cat.slug}>
                                                        {getCategoryName(cat.slug)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Price Filter */}
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-brandGold mb-2">
                                                Prix Maximum (MAD)
                                            </label>
                                            <input
                                                type="number"
                                                id="price"
                                                placeholder="ex: 50000"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                                                className="w-full border border-brandGold/30 rounded bg-transparent p-2.5 text-platinumGray focus:outline-none focus:ring-1 focus:ring-brandGold"
                                            />
                                        </div>
                                        
                                        {/* Reset Filters Button */}
                                        <div className="flex items-end">
                                            <button 
                                                onClick={resetFilters}
                                                className="px-6 py-2.5 border border-brandGold/30 rounded hover:bg-brandGold/5 transition text-brandGold"
                                            >
                                                Réinitialiser les filtres
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                                {sortedProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}