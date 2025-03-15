// pages/collections/index.tsx

import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import type { Product } from "@prisma/client";

type CollectionPageProps = {
    products: Array<Product & { category?: { slug: string } | null }>;
    categories: string[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        // 1) Fetch categories from the Category table
        const categoryRecords = await prisma.category.findMany({
            select: { slug: true },
        });

        // 2) Fetch all products, including the Category slug
        const products = await prisma.product.findMany({
            include: {
                translations: true,
                variations: true,
                category: {
                    select: { slug: true },
                },
            },
        });

        // 3) Convert to JSON for Next.js
        return {
            props: {
                products: JSON.parse(JSON.stringify(products)),
                categories: categoryRecords.map((cat) => cat.slug),
            },
        };
    } catch (error) {
        console.error("❌ Error fetching collections:", error);
        return {
            props: { products: [], categories: [] },
        };
    }
};

export default function CollectionsPage({
                                            products,
                                            categories,
                                        }: CollectionPageProps) {
    // ---------- FILTER STATES ----------
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");

    // ---------- FILTERED PRODUCTS ----------
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

    return (
        <div className="min-h-screen bg-brandIvory text-richEbony">
            {/* PAGE HEADER */}
            <header className="py-16 px-6 text-center">
                <h1 className="text-5xl font-serif text-brandGold mb-4">Nos Collections</h1>
                <p className="text-platinumGray">
                    Découvrez nos pièces intemporelles, façonnées dans l’excellence.
                </p>
            </header>

            {/* FILTERS SECTION */}
            <section className="px-6 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6">
                    {/* Category Filter */}
                    <div className="flex flex-col">
                        <label htmlFor="category" className="text-sm mb-1 text-platinumGray">
                            Catégorie
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input-field w-48"
                        >
                            <option value="">Toutes</option>
                            {categories.map((catSlug) => (
                                <option key={catSlug} value={catSlug}>
                                    {catSlug}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Filter (max price) */}
                    <div className="flex flex-col">
                        <label htmlFor="price" className="text-sm mb-1 text-platinumGray">
                            Prix Max (MAD)
                        </label>
                        <input
                            type="number"
                            id="price"
                            placeholder="ex: 50000"
                            value={maxPrice}
                            onChange={(e) =>
                                setMaxPrice(e.target.value ? Number(e.target.value) : "")
                            }
                            className="input-field w-48"
                        />
                    </div>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <motion.section
                className="px-6 py-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 text-platinumGray">
                        <h2 className="text-2xl font-serif text-brandGold mb-4">
                            Aucun produit trouvé
                        </h2>
                        <p className="text-platinumGray">
                            Essayez d’ajuster vos filtres ou revenez plus tard.
                        </p>
                    </div>
                ) : (
                    // Increase columns at larger breakpoints to fit more cards on the same row
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </motion.section>
        </div>
    );
}
