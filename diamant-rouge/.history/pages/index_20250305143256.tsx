import Link from "next/link";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { prisma } from "../lib/prisma";
import { jwtVerify } from "jose";

import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";

/* ----------------------------------------------------------
   1. Server-Side Data Fetching
   ---------------------------------------------------------- */
export async function getServerSideProps(context: any) {
    let userId: number | null = null;
    let wishlist: number[] = [];

    try {
        // Parse session token
        const rawCookie = context.req.headers.cookie || "";
        let match =
            rawCookie.match(/next-auth\.session-token=([^;]+)/) ||
            rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);

        if (match) {
            const secret = process.env.NEXTAUTH_SECRET || "";
            const tokenStr = decodeURIComponent(match[1]);

            try {
                const { payload: decoded } = await jwtVerify(
                    tokenStr,
                    new TextEncoder().encode(secret)
                );
                if (decoded && typeof decoded === "object" && decoded.id) {
                    userId = Number(decoded.id);
                }
            } catch (tokenError) {
                console.warn("⚠ Token verification failed:", tokenError);
            }
        }

        // Fetch all products with their categories
        const featuredProducts = await prisma.product.findMany({
            include: { 
                translations: true, 
                variations: true,
                category: {
                    include: {
                        translations: true
                    }
                }
            },
            take: 12, // Increased for better selection
        });

        // If user is logged in, fetch their wishlist
        if (userId) {
            const wishlistItems = await prisma.wishlist.findMany({
                where: { userId },
                select: { productId: true },
            });
            wishlist = wishlistItems.map((item) => item.productId);
        }

        return {
            props: {
                products: JSON.parse(JSON.stringify(featuredProducts)),
                wishlist,
                locale: context.locale || "fr",
            },
        };
    } catch (error) {
        console.error("❌ Homepage Data Fetch Error:", error);
        return {
            props: { products: [], wishlist: [], locale: context.locale || "fr" },
        };
    }
}

/* ----------------------------------------------------------
   2. Hero Carousel Slides
   ---------------------------------------------------------- */
const slides = [
    {
        imageSrc: "/images/home/home-hero-01_2000x.jpg",
        heading: "Diamant Rouge",
        subheading: "Éclat Royal & Héritage Intemporel",
        actionLink: "/collections/signature",
        actionText: "Explorer la Collection",
        position: "right"
    },
    {
        imageSrc: "/images/liv_bra_emo_ron_020_bla_1_desktop.jpg",
        heading: "L'Essence de la Joaillerie",
        subheading: "Des pièces taillées pour sublimer chaque moment",
        actionLink: "/collections/bestsellers",
        actionText: "Découvrir",
        position: "left"
    },
    {
        imageSrc: "/images/clo_bdf_sym_eme_150_san_ros_1_desktop.jpg",
        heading: "Héritage Vivant",
        subheading: "La tradition à travers les siècles, pour vous",
        actionLink: "/the-house",
        actionText: "Notre Histoire",
        position: "center"
    },
];

// Product filter categories
const productCategories = [
    "Tous", "Bagues", "Colliers", "Bracelets", "Boucles d'oreilles", "Montres"
];

// Map filter names to category slugs
const filterToCategoryMap: Record<string, string> = {
    "Bagues": "rings",
    "Colliers": "necklaces",
    "Bracelets": "bracelets",
    "Boucles d'oreilles": "earrings",
    "Montres": "watches"
};

export default function HomePage({
    products,
    wishlist,
    locale,
}: {
    products: any[];
    wishlist: number[];
    locale: string;
}) {
    const [activeFilter, setActiveFilter] = useState("Tous");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const productsContainerRef = useRef<HTMLDivElement>(null);

    // Apply filtering when the active filter changes
    useEffect(() => {
        if (activeFilter === "Tous") {
            setFilteredProducts(products);
        } else {
            const categorySlug = filterToCategoryMap[activeFilter];
            setFilteredProducts(
                products.filter(product => 
                    product.category && product.category.slug === categorySlug
                )
            );
        }
    }, [activeFilter, products]);

    return (
        <>
            <NextSeo
                title="Diamant Rouge | Joaillerie de Luxe"
                description="Découvrez la joaillerie Diamant Rouge : des pièces intemporelles, un héritage royal et un artisanat d'exception à Casablanca."
            />

            {/* 
            ----------------------------------------------------
            ✨ 1. HERO CAROUSEL - Full width, clean presentation
            ----------------------------------------------------
            */}
            <HeroCarousel slides={slides} />

            {/* 
            ----------------------------------------------------
            💎 2. COLLECTIONS PRESTIGIEUSES - Horizontal product display
            ----------------------------------------------------
            */}
            <motion.section
                className="py-20 px-4 md:px-8 bg-brandIvory"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Section title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brandGold mb-4">
                        Collections Prestigieuses
                    </h2>
                    <div className="h-0.5 w-24 bg-brandGold/40 mx-auto mb-6"></div>
                    <p className="text-platinumGray max-w-2xl mx-auto">
                        Des créations d'exception qui révèlent votre élégance naturelle. 
                        Chaque pièce est une déclaration d'art et de raffinement.
                    </p>
                </div>

                {/* Filter tabs */}
                <div className="flex justify-center mb-10 overflow-x-auto pb-2">
                    <div className="flex space-x-1 md:space-x-2">
                        {productCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={`px-6 py-2 text-sm whitespace-nowrap transition-all duration-300 border ${
                                    activeFilter === category
                                        ? "border-brandGold bg-brandGold text-richEbony"
                                        : "border-brandGold/40 text-platinumGray hover:border-brandGold"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products grid - replacing carousel with elegant grid */}
                <div ref={productsContainerRef} className="container mx-auto">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-platinumGray">Aucun produit trouvé dans cette catégorie.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {filteredProducts.map((product) => (
                                <div key={product.id}>
                                    <ProductCard
                                        product={product}
                                        locale={locale}
                                        isWishlisted={wishlist.includes(product.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* View all collections button */}
                <div className="text-center mt-16">
                    <Link href="/collections">
                        <button className="px-10 py-3 border-2 border-brandGold text-brandGold hover:bg-brandGold hover:text-richEbony transition-all duration-300 tracking-wider">
                            Découvrir Toutes Nos Collections
                        </button>
                    </Link>
                </div>
            </motion.section>

            {/* Rest of the sections remain unchanged */}
            {/* Rest of your page content... */}
        </>
    );
}