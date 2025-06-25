// pages/index.tsx

import Link from "next/link";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import { useState, useRef, useMemo, useEffect } from "react";
import { prisma } from "../lib/prisma";
import { jwtVerify } from "jose";
import { serializeData } from "../lib/utils";

import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";

// Types for categories and translations for improved type safety
interface CategoryTranslation {
    id: number;
    language: string;
    name: string;
    categoryId: number;
}

interface Category {
    id: number;
    slug?: string;
    translations: CategoryTranslation[];
}

interface ProductTranslation {
    id: number;
    language: string;
    name: string;
    description: string;
    productId: number;
}

interface ProductVariation {
    id: number;
    variationType: string;
    variationValue: string;
    additionalPrice: string;
}

interface Product {
    id: number;
    sku: string;
    basePrice: string | number;
    categoryId?: number;
    category?: Category;
    translations: ProductTranslation[];
    variations: ProductVariation[];
    images: string[];
    featured: boolean;
}

// Define a type for the slide that matches the HeroCarousel component's Slide interface
interface Slide {
    imageSrc: string;
    heading: string;
    subheading: string;
    actionLink?: string;
    actionText?: string;
    position?: "left" | "right" | "center";
}

// Define the jewelry filter map type
type JewelryTypeMapType = {
    [key: string]: string[];
};

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

        // Fetch featured products with categories
        const featuredProducts = await prisma.product.findMany({
            where: { featured: true },  // Only get featured products
            include: { 
                translations: true, 
                variations: true,
                category: {
                    include: {
                        translations: true
                    }
                }
            },
            take: 12,
        });

        // If user is logged in, fetch their wishlist
        if (userId) {
            const wishlistItems = await prisma.wishlist.findMany({
                where: { userId },
                select: { productId: true },
            });
            wishlist = wishlistItems.map((item) => item.productId);
        }

        // Fetch all categories for filter
        const categories = await prisma.category.findMany({
            include: {
                translations: true
            }
        });

        // Extract unique product types from variations
        const allTypes = featuredProducts
            .flatMap(product => product.variations?.map(v => v.variationType) || [])
            .filter(Boolean);
        
        // Get unique values
        const productTypes = [...new Set(allTypes)];

        // Use our serialization utility to ensure everything is JSON-safe
        const serializedData = serializeData({
            products: featuredProducts,
            categories: categories,
            productTypes: productTypes,
            wishlist,
            locale: context.locale || "fr",
        });

        return {
            props: serializedData,
        };
    } catch (error) {
        console.error("❌ Homepage Data Fetch Error:", error);
        return {
            props: { 
                products: [], 
                categories: [],
                productTypes: [],
                wishlist: [], 
                locale: context.locale || "fr" 
            },
        };
    }
}

/* ----------------------------------------------------------
   2. Hero Carousel Slides
   ---------------------------------------------------------- */
const slides: Slide[] = [
    {
        imageSrc: "/images/amantys_showroom_vitrine_exterieur_bordeaux_3.jpg",
        heading: "Diamant Rouge",
        subheading: "Éclat Royal & Héritage Intemporel",
        actionLink: "/collections/signature",
        actionText: "Explorer la Collection",
        position: "right"
    },
    {
        imageSrc: "/images/amantys_header_category_page_bracelets_riviere_1_desktop.jpg",
        heading: "L'Essence de la Joaillerie",
        subheading: "Des pièces taillées pour sublimer chaque moment",
        actionLink: "/collections/bestsellers",
        actionText: "Découvrir",
        position: "left"
    },
    {
        imageSrc: "/images/liv_bag_mod_ron_050_dem_jau_1_desktop-1024x1024.jpg",
        heading: "Héritage Vivant",
        subheading: "La tradition à travers les siècles, pour vous",
        actionLink: "/the-house",
        actionText: "Notre Histoire",
        position: "center"
    },
    {
        imageSrc: "/images/Rectangle-1099.png",
        heading: "Créations Sur-Mesure",
        subheading: "Des pièces uniques pour des moments inoubliables",
        actionLink: "/appointments",
        actionText: "Prendre Rendez-vous"
    }
];

export default function HomePage({
    products,
    categories,
    productTypes,
    wishlist,
    locale,
}: {
    products: Product[];
    categories: Category[];
    productTypes: string[];
    wishlist: number[];
    locale: string;
}) {
    // Set the default language to French if not specified
    const currentLocale = locale || "fr";
    
    // State for category filter
    const [activeCategory, setActiveCategory] = useState("Tous");
    
    const carouselRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const [initialLoad, setInitialLoad] = useState(true);

    // Debug on first render to inspect products
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Product Categories:', categories.map(c => ({
                id: c.id,
                slug: c.slug,
                translations: c.translations.map(t => ({
                    language: t.language,
                    name: t.name
                }))
            })));
            
            // Log first 3 products as examples
            console.log('Example Products:', products.slice(0, 3).map(p => ({
                id: p.id,
                category: p.category?.slug,
                categoryId: p.categoryId,
                translations: p.translations?.map((t: ProductTranslation) => ({
                    language: t.language,
                    name: t.name?.substring(0, 30) + '...'
                })),
                variations: p.variations?.map((v: ProductVariation) => ({
                    type: v.variationType,
                    value: v.variationValue
                }))
            })));
        }
    }, [categories, products]);

    // Define jewelry categories
    const jewelryCategories = ["Tous", ...categories.map(cat => 
        cat.translations.find(t => t.language === currentLocale)?.name || cat.slug || "Category"
    )];

    // Updated filtered products logic
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Show all products when "Tous" is selected
            if (activeCategory === "Tous") return true;

            // Get the category name in current locale
            const productCategory = product.category?.translations.find(
                t => t.language === currentLocale
            )?.name || product.category?.slug;

            // Filter by category
            return productCategory === activeCategory;
        });
    }, [products, activeCategory, currentLocale]);

    // Handle filter change
    const handleFilterChange = (value: string) => {
        setActiveCategory(value);
        setInitialLoad(true);
        
        // Scroll the selected filter into view on mobile
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                if (filterRef.current) {
                    const selectedButton = Array.from(filterRef.current.querySelectorAll('button'))
                        .find(btn => btn.textContent === value);
                        
                    if (selectedButton) {
                        const container = filterRef.current;
                        const scrollLeft = selectedButton.offsetLeft - (container.offsetWidth / 2) + (selectedButton.offsetWidth / 2);
                        
                        container.scrollTo({
                            left: Math.max(0, scrollLeft),
                            behavior: 'smooth'
                        });
                    }
                }
            }
        }, 0);
    };

    // Scroll to section of carousel
    const scrollCarousel = (position: 'left' | 'center' | 'right') => {
        if (!carouselRef.current) return;
        
        const carousel = carouselRef.current;
        const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
        
        let targetPosition = 0;
        
        switch(position) {
            case 'left':
                // Scroll to 10% of total scroll width
                targetPosition = Math.min(scrollWidth * 0.1, 150);
                break;
            case 'center':
                // Scroll to middle
                targetPosition = scrollWidth / 2;
                break;
            case 'right':
                // Scroll to 90% of total scroll width
                targetPosition = Math.max(scrollWidth * 0.9, scrollWidth - 150);
                break;
        }
        
        carousel.scrollTo({
            left: targetPosition,
            behavior: 'smooth'
        });
    };
    
    // Position carousel initially to show products from center
    useEffect(() => {
        if (initialLoad && carouselRef.current && filteredProducts.length > 0) {
            // Center the carousel at first load
            setTimeout(() => {
                if (carouselRef.current) {
                    const firstScroll = Math.min(
                        (carouselRef.current.scrollWidth - carouselRef.current.clientWidth) / 4,
                        150
                    );
                    carouselRef.current.scrollLeft = firstScroll;
                    setInitialLoad(false);
                }
            }, 300); // Small delay to ensure DOM is ready
        }
    }, [filteredProducts, initialLoad]);

    return (
        <>
            <NextSeo
                title="Diamant Rouge | Joaillerie de Luxe depuis 1896"
                description="Découvrez notre collection de bijoux de luxe faits main. Bagues, colliers, bracelets et diamants d'exception pour des moments inoubliables."
                canonical="https://www.diamant-rouge.fr/"
            />

            {/* Hero Carousel - no additional hero-section class needed */}
            <HeroCarousel slides={slides} />

            {/* 
            ----------------------------------------------------
            💎 2. COLLECTIONS PRESTIGIEUSES - Full-width product carousel 
            ----------------------------------------------------
            */}
            <motion.section
                className="py-16 md:py-24 bg-white w-full overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Section title */}
                <div className="text-center mb-12 md:mb-16 px-4">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-brandGold mb-3 md:mb-4">
                        Collections Prestigieuses
                    </h2>
                    <div className="h-0.5 w-16 md:w-24 bg-brandGold/40 mx-auto mb-6 md:mb-8"></div>
                    <p className="text-platinumGray max-w-2xl mx-auto text-sm md:text-base px-2">
                        Des créations d'exception qui révèlent votre élégance naturelle. 
                        Chaque pièce est une déclaration d'art et de raffinement.
                    </p>
                </div>

                {/* Featured Products Section */}
                <section className="relative py-12 md:py-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Category Filter Buttons */}
                <div className="relative mb-8 md:mb-10 px-4 md:px-0">
                    <div className="flex justify-center">
                        <div ref={filterRef} className="relative w-full md:w-auto overflow-x-auto scrollbar-hide py-2 md:py-3 -mx-1 px-1 md:px-4">
                            <div className="flex space-x-2 md:space-x-4 min-w-max mx-auto">
                                        {jewelryCategories.map((category) => (
                                    <button
                                                key={category}
                                                onClick={() => handleFilterChange(category)}
                                        className={`px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm whitespace-nowrap transition-all duration-300 border rounded-full ${
                                                    activeCategory === category
                                                ? "border-brandGold bg-brandGold text-richEbony shadow-sm"
                                                : "border-brandGold/40 text-platinumGray hover:border-brandGold hover:bg-brandGold/5"
                                                } ${category === "Tous" ? "order-first" : ""}`}
                                    >
                                                {category}
                                    </button>
                                ))}
                            </div>
                            
                                    {/* Elegant fade effect for mobile */}
                            <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden"></div>
                        </div>
                    </div>
                </div>

                        {/* Products Display */}
                    <div className="px-4 md:px-6">
                        <div 
                            ref={carouselRef}
                            className="flex overflow-x-auto pb-10 pt-6 scrollbar-hide gap-6 md:gap-8 lg:gap-10 snap-x scroll-smooth"
                        >
                            {filteredProducts.length === 0 ? (
                                <div className="flex justify-center items-center w-full h-48">
                                    <p className="text-platinumGray text-center">
                                            Aucun produit ne correspond à cette catégorie. <br />
                                            Veuillez essayer une autre catégorie.
                                    </p>
                                </div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <div key={product.id} className="snap-start shrink-0">
                                        <div className="w-72 sm:w-80 md:w-72 lg:w-80 xl:w-96">
                                            <ProductCard
                                                product={product}
                                                locale={currentLocale}
                                                isWishlisted={wishlist.includes(product.id)}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    </div>
                </section>
                    
                {/* View All Button */}
                <div className="mt-8 md:mt-12 text-center px-4">
                    <Link 
                        href="/collections" 
                        className="inline-flex items-center px-8 py-3 text-sm md:text-base border border-brandGold text-brandGold hover:bg-brandGold hover:text-white transition-colors rounded-full"
                    >
                        <span>Voir toutes les collections</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </motion.section>

            {/* 
            ----------------------------------------------------
            🔶 3. LA MAISON DIAMANT ROUGE - Brand story & heritage 
            ----------------------------------------------------
            */}
            <motion.section
                className="py-16 md:py-24 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Background gradient with subtle pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-richEbony to-burgundy opacity-95 z-0"></div>
                <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-10 z-0"></div>
                
                <div className="container mx-auto px-4 md:px-10 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                        {/* Left: Brand story */}
                        <div className="md:w-1/2 order-2 md:order-1">
                            <div className="relative">
                                {/* Decorative frame - visible only on desktop */}
                                <div className="absolute -top-8 -left-8 w-24 h-24 border border-brandGold/40 hidden md:block"></div>
                                
                                {/* Mobile decorative element */}
                                <div className="flex justify-center mb-4 md:hidden">
                                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-brandGold/60 to-transparent"></div>
                                </div>
                                
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-brandGold mb-6 md:mb-8 text-center md:text-left">La Maison</h2>
                                
                                <p className="text-lg md:text-xl text-brandIvory/90 mb-6 md:mb-8 leading-relaxed text-center md:text-left">
                                    Fondée sur l'excellence et la passion des métiers d'art, Diamant Rouge perpétue 
                                    depuis des générations une quête de beauté absolue. Notre maison de joaillerie 
                                    marie tradition marocaine et vision contemporaine.
                                </p>
                                
                                <p className="text-base md:text-lg text-brandIvory/80 mb-8 md:mb-10 text-center md:text-left">
                                    Chaque création est le fruit d'un savoir-faire exigeant, où la 
                                    précision du geste et la noblesse des matériaux donnent vie à des pièces uniques.
                                </p>
                                
                                <div className="flex justify-center md:justify-start">
                                <Link href="/the-house">
                                        <button className="px-8 py-2.5 md:px-10 md:py-3 border border-brandGold text-brandGold hover:bg-brandGold hover:text-richEbony transition-colors duration-300 text-sm md:text-base">
                                        Notre Histoire
                                    </button>
                                </Link>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right: Image collage with overlapping effect */}
                        <div className="md:w-1/2 relative h-[400px] md:h-[600px] w-full mb-10 md:mb-0 order-1 md:order-2">
                            {/* Mobile-optimized image layout */}
                            <div className="absolute right-0 bottom-0 w-[75%] h-[80%]">
                                <Image 
                                                                    src="/images/home/Aurate_Early_Black_Friday-18kira_long_2_v333_1200x.jpg"
                                    alt="Artisan joaillier"
                                    fill
                                    sizes="(max-width: 768px) 75vw, 50vw"
                                    className="object-cover object-center border-4 md:border-8 border-richEbony"
                                />
                            </div>
                            <div className="absolute left-0 top-0 w-[60%] h-[60%] shadow-luxury">
                                <Image 
                                    src="/images/gemologist.jpg"
                                    alt="Boutique Diamant Rouge"
                                    fill
                                    sizes="(max-width: 768px) 60vw, 40vw"
                                    className="object-cover object-center border-4 md:border-8 border-richEbony"
                                />
                            </div>
                            
                            {/* Decorative elements - simplified for mobile */}
                            <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-12 h-12 md:w-20 md:h-20 border border-brandGold/40"></div>
                            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-10 h-10 md:w-16 md:h-16 border border-brandGold/40"></div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* 
            ----------------------------------------------------
            🏆 4. CRÉATIONS SUR-MESURE - Custom jewelry services 
            ----------------------------------------------------
            */}
            <motion.section
                className="py-14 md:py-20 px-4 md:px-10 lg:px-20 bg-brandIvory"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 relative overflow-hidden">
                        <div className="pb-[75%] md:pb-[56.25%] relative"> {/* 4:3 on mobile, 16:9 on desktop */}
                            <Image
                                src="/images/showroom.jpg"
                                alt="Atelier Diamant Rouge"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover absolute inset-0 hover-scale rounded-md md:rounded-none"
                            />
                            
                            {/* Architectural quote structure overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Bottom right architectural frame - desktop only */}
                                <div className="hidden md:block absolute bottom-0 right-0 w-[40%] h-[40%]">
                                    {/* Thin gold lines creating an open corner frame */}
                                    <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-brandGold to-transparent"></div>
                                    <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-brandGold to-transparent"></div>
                                    
                                    {/* Small decorative corner element */}
                                    <div className="absolute bottom-0 right-0 w-8 h-8">
                                        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-brandGold"></div>
                                        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-brandGold"></div>
                        </div>
                        
                                    {/* Quote text with asymmetrical placement - desktop */}
                                    <div className="absolute bottom-8 right-8 max-w-[95%] transform -translate-y-2 translate-x-[-15%]">
                                        <div className="relative">
                                            {/* Minimal text container */}
                                            <div className="bg-richEbony/70 backdrop-blur-[1px] p-4 border-l border-t border-brandGold/60">
                                                <p className="text-brandGold italic font-serif text-sm leading-relaxed">
                                "L'art de la joaillerie réside dans la capacité à transformer 
                                un rêve en une œuvre éternelle"
                            </p>
                                                
                                                {/* Subtle signature */}
                                                <div className="mt-2 flex items-center justify-end">
                                                    <div className="h-px w-5 bg-brandGold/50 mr-2"></div>
                                                    <p className="text-brandGold/90 font-serif text-sm">- Myara</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Mobile-optimized quote - minimalist design that preserves image visibility */}
                                <div className="md:hidden absolute bottom-0 left-0 right-0">
                                    {/* Elegant minimalist banner at bottom */}
                                    <div className="relative">
                                        {/* Semi-transparent bottom gradient overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-richEbony/80 to-transparent pointer-events-none"></div>
                                        
                                        {/* Small quote indicator */}
                                        <div className="absolute bottom-10 left-4 w-1 h-8 bg-brandGold/70"></div>
                                        
                                        {/* Simple bottom-aligned quote */}
                                        <div className="absolute bottom-3 left-8 right-4">
                                            <p className="text-brandGold/90 italic font-serif text-2xs leading-tight">
                                                "L'art de la joaillerie réside dans la capacité à transformer un rêve en une œuvre éternelle" <span className="text-brandGold/80 ml-1 font-serif">- Myara</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right: Text content */}
                    <div className="w-full md:w-1/2">
                        {/* Mobile centered title */}
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brandGold mb-4 md:mb-6">
                            Créations Sur-Mesure
                        </h2>
                            <div className="h-0.5 w-16 bg-brandGold mx-auto md:mx-0 mb-6 md:mb-8"></div>
                        </div>
                        
                        <p className="text-base md:text-lg text-platinumGray mb-5 md:mb-6 text-center md:text-left">
                            Au cœur de notre atelier, nos maîtres joailliers donnent vie à vos 
                            désirs les plus précieux. Une bague de fiançailles unique, 
                            un bijou commémoratif ou une pièce d'exception — nous créons l'extraordinaire.
                        </p>
                        
                        <p className="text-base md:text-lg text-platinumGray mb-8 md:mb-10 text-center md:text-left">
                            Chaque création sur-mesure est une invitation à participer au processus créatif, 
                            depuis l'esquisse jusqu'à l'écrin final.
                        </p>
                        
                        <div className="flex justify-center md:justify-start">
                        <Link href="/appointments">
                                <button className="button-primary text-sm md:text-base px-8 py-2.5 md:py-3">Prendre Rendez-vous</button>
                        </Link>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* 
----------------------------------------------------
🌟 6. NOS VALEURS - Value props with sticky scroll
----------------------------------------------------
*/}
<section className="relative">
  <div className="lg:flex">
    {/* Sticky heading column - narrower width */}
    <div className="lg:w-2/5 lg:sticky lg:top-[var(--header-height-scrolled)] lg:h-[calc(100vh-var(--header-height-scrolled))] bg-richEbony relative">
      <div className="block lg:hidden">
        {/* Mobile: Beautiful full-width header */}
        <div className="relative h-[50vh] w-full overflow-hidden">
          <Image
            src="/images/home/Holiday-03crop_1_1200x.jpg"
            alt="Nos valeurs"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Geometric art with proportional spacing - matching desktop */}
            <div className="absolute inset-[10%] flex items-center justify-center">
              {/* Rectangle with fine lines */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 h-[1px] md:h-[2px] bg-white/50"></div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] md:h-[2px] bg-white/50"></div>
                <div className="absolute left-0 top-0 bottom-0 w-[1px] md:w-[2px] bg-white/50"></div>
                <div className="absolute right-0 top-0 bottom-0 w-[1px] md:w-[2px] bg-white/50"></div>
                
                {/* Ellipse touching the midpoints */}
                <div className="absolute inset-0 rounded-full border-[1px] md:border-[2px] border-white/40"></div>
              </div>
              
              {/* Heading text - matched with desktop */}
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-thin text-white tracking-wide text-center relative z-10 px-4 max-w-[90%]">
                Joaillerie d'exception <br/>digne de celles <br/>et ceux qui la portent
              </h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop: Full-height sticky header */}
      <div className="hidden lg:block h-full w-full relative">
      <Image
        src="/images/home/Holiday-03crop_1_1200x.jpg"
        alt="Nos valeurs"
        fill
          sizes="40vw"
        className="object-cover"
          style={{ objectPosition: "center center" }}
      />
      <div className="absolute inset-0">
        {/* Geometric art with proportional spacing from image borders */}
        <div className="absolute inset-[10%] flex items-center justify-center">
          {/* Rectangle with fine lines */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50"></div>
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/50"></div>
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50"></div>
            
            {/* Ellipse touching the midpoints */}
            <div className="absolute inset-0 rounded-full border-[2px] border-white/40"></div>
          </div>
          
          {/* Heading text */}
            <h2 className="text-2xl lg:text-3xl font-thin text-white tracking-wide text-center relative z-10 px-4 max-w-[90%]">
            Joaillerie d'exception <br/>digne de celles <br/>et ceux qui la portent
          </h2>
          </div>
        </div>
      </div>
    </div>

    {/* Scrollable content column - wider width */}
    <div className="lg:w-3/5 bg-brandIvory text-richEbony">
      {/* Mobile sliding cards approach */}
      <div className="block lg:hidden">
        <div className="bg-brandIvory pt-4 pb-12">
          {/* Value cards - elegant sliding cards */}
          <div className="px-4 py-6">
            <div className="overflow-x-auto pb-4 flex snap-x snap-mandatory gap-4 scrollbar-hide">
              {/* Value card 1 */}
              <div className="flex-none w-[85%] snap-center bg-white rounded-sm shadow-mobile-subtle overflow-hidden border border-brandGold/10 transform transition-all duration-300 hover:shadow-luxury">
                <div className="relative w-full aspect-[5/3]">
                  <Image
                    src="/images/home/Aurate_Early_Black_Friday-15kira_3_v3_1200x.jpg"
                    alt="Qualité Exceptionnelle"
                    fill
                    sizes="85vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 text-center px-3 pb-1">
                    <h3 className="text-xl font-serif text-brandGold inline-block">
                      <span className="relative">
                        Qualité Exceptionnelle
                        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brandGold/50 to-transparent"></span>
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-platinumGray leading-relaxed">
                    L'or est notre passion, et nous mettons un point d'honneur à rester fidèles à nos racines. Notre or est durable, coulé, poli et perfectionné par des artisans de génération en génération.
                  </p>
                </div>
              </div>
              
              {/* Value card 2 */}
              <div className="flex-none w-[85%] snap-center bg-white rounded-sm shadow-mobile-subtle overflow-hidden border border-brandGold/10 transform transition-all duration-300 hover:shadow-luxury">
                <div className="relative w-full aspect-[5/3]">
                  <Image
                    src="/images/home/AurateWinter-29_1_v2_1200x.jpg"
                    alt="Prix Juste"
                    fill
                    sizes="85vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 text-center px-3 pb-1">
                    <h3 className="text-xl font-serif text-brandGold inline-block">
                      <span className="relative">
                        Prix Juste
                        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brandGold/50 to-transparent"></span>
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-platinumGray leading-relaxed">
                    Nous aimons l'or, mais pas les prix excessifs. Notre production locale, le recyclage des excédents et la fabrication sur commande vous garantissent le luxe sans la majoration.
                  </p>
                </div>
              </div>
              
              {/* Value card 3 */}
              <div className="flex-none w-[85%] snap-center bg-white rounded-sm shadow-mobile-subtle overflow-hidden border border-brandGold/10 transform transition-all duration-300 hover:shadow-luxury">
                <div className="relative w-full aspect-[5/3]">
                  <Image
                    src="/images/home/Aurate_Early_Black_Friday-18kira_long_2_v333_1200x.jpg"
                    alt="Éthique Irréprochable"
                    fill
                    sizes="85vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 text-center px-3 pb-1">
                    <h3 className="text-xl font-serif text-brandGold inline-block">
                      <span className="relative">
                        Éthique Irréprochable
                        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brandGold/50 to-transparent"></span>
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-platinumGray leading-relaxed">
                    L'approvisionnement éthique et la fabrication durable sont notre méthode. Tout ce que vous voyez est fabriqué à partir d'or recyclé et nos diamants sont soigneusement sélectionnés pour être sans conflit.
                  </p>
                </div>
              </div>
              
              {/* Value card 4 */}
              <div className="flex-none w-[85%] snap-center bg-white rounded-sm shadow-mobile-subtle overflow-hidden border border-brandGold/10 transform transition-all duration-300 hover:shadow-luxury">
                <div className="relative w-full aspect-[5/3]">
                  <Image
                    src="/images/home/Aurate_Early_Black_Friday-16_2_v3_1200x.jpg"
                    alt="Durabilité Inégalée"
                    fill
                    sizes="85vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 text-center px-3 pb-1">
                    <h3 className="text-xl font-serif text-brandGold inline-block">
                      <span className="relative">
                        Durabilité Inégalée
                        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brandGold/50 to-transparent"></span>
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-platinumGray leading-relaxed">
                    Des bijoux authentiques pour une vie authentique. Toutes nos créations sont conçues pour résister et briller au fil du temps. Et nous tenons parole : elles sont garanties à vie.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center items-center mt-2">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-brandGold/40 to-transparent"></div>
            <span className="mx-3 text-xs text-platinumGray">Glissez pour découvrir nos valeurs</span>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-brandGold/40 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Desktop version - original */}
      <div className="hidden lg:block">
      {/* Value prop 1 */}
        <div className="flex flex-col items-center">
        <div className="relative w-full aspect-[16/6]">
          <Image
            src="/images/home/Aurate_Early_Black_Friday-15kira_3_v3_1200x.jpg"
            alt="Qualité Exceptionnelle"
            fill
              sizes="60vw"
            className="object-cover object-center"
          />
        </div>
          <div className="py-16 px-10 sm:max-w-4xl text-center flex flex-col justify-center">
            <h3 className="text-3xl lg:text-4xl font-serif text-brandGold">Qualité Exceptionnelle</h3>
          <p className="mt-6 text-lg text-platinumGray">
            L'or est notre passion, et nous mettons un point d'honneur à rester fidèles à nos racines. Notre or est durable, coulé, poli et perfectionné par des artisans de génération en génération. Chaque création passe par un processus rigoureux de tests en 5 étapes pour que vous puissiez briller de mille feux et porter nos pièces en toute sérénité.
          </p>
        </div>
      </div>

      {/* Value prop 2 */}
        <div className="flex flex-col items-center">
        <div className="relative w-full aspect-[16/6]">
          <Image
            src="/images/home/AurateWinter-29_1_v2_1200x.jpg"
            alt="Prix Juste"
            fill
              sizes="60vw"
            className="object-cover object-center"
          />
        </div>
          <div className="py-16 px-10 sm:max-w-4xl text-center flex flex-col justify-center">
            <h3 className="text-3xl lg:text-4xl font-serif text-brandGold">Prix Juste</h3>
          <p className="mt-6 text-lg text-platinumGray">
            Nous aimons l'or, mais pas les prix excessifs. Notre production locale (sans taxes d'importation), le recyclage des excédents et la fabrication sur commande vous garantissent le luxe sans la majoration. Nous travaillons aussi dur que vous pour que votre investissement dure aussi longtemps que notre or.
          </p>
        </div>
      </div>

      {/* Value prop 3 */}
        <div className="flex flex-col items-center">
        <div className="relative w-full aspect-[16/6]">
          <Image
            src="/images/home/Aurate_Early_Black_Friday-18kira_long_2_v333_1200x.jpg"
            alt="Éthique Irréprochable"
            fill
              sizes="60vw"
            className="object-cover object-center"
          />
        </div>
          <div className="py-16 px-10 sm:max-w-4xl text-center flex flex-col justify-center">
            <h3 className="text-3xl lg:text-4xl font-serif text-brandGold">Éthique Irréprochable</h3>
          <p className="mt-6 text-lg text-platinumGray">
            L'approvisionnement éthique et la fabrication durable ne sont pas seulement notre devise, c'est notre méthode. Tout ce que vous voyez est fabriqué à partir d'or recyclé. Nos diamants sans conflit sont soigneusement sélectionnés pour maintenir la qualité et adhérer au Processus de Kimberley. Et nous parcourons le globe pour trouver nos perles et pierres précieuses auprès d'établissements familiaux qui soutiennent les communautés locales.
          </p>
        </div>
      </div>

      {/* Value prop 4 */}
        <div className="flex flex-col items-center">
        <div className="relative w-full aspect-[16/6]">
          <Image
            src="/images/home/Aurate_Early_Black_Friday-16_2_v3_1200x.jpg"
            alt="Durabilité Inégalée"
            fill
              sizes="60vw"
            className="object-cover object-center"
          />
        </div>
          <div className="py-16 px-10 sm:max-w-4xl text-center flex flex-col justify-center">
            <h3 className="text-3xl lg:text-4xl font-serif text-brandGold">Durabilité Inégalée</h3>
          <p className="mt-6 text-lg text-platinumGray">
            Des bijoux authentiques pour une vie authentique. Toutes nos créations sont conçues pour résister et briller quels que soient les aléas de la vie. Et nous tenons parole : elles sont garanties à vie. Faites pour durer, pour raconter une histoire, pour conserver un souvenir. Pour que vous puissiez les transmettre à vos enfants. Et à leurs enfants. Et peut-être aux leurs, s'ils ont de la chance.
          </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

           {/* 
            ----------------------------------------------------
            🎉 5. ÉVÉNEMENTS EXCLUSIFS - With elegant presentation
            ----------------------------------------------------
            */}
            <motion.section
                className="relative py-16 md:py-28 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/home/Aura/08a58c59664d--Aurate-Holiday-36kira-1v2.jpg"
                        alt="Événement Diamant Rouge"
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                    {/* Elegant overlay - slightly darker on mobile for better readability */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-richEbony/90 via-richEbony/70 to-richEbony/90 md:from-richEbony/90 md:via-richEbony/50 md:to-richEbony/90" />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-10 relative z-10">
                    <div className="max-w-lg mx-auto md:ml-auto md:mr-0 text-center md:text-right">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brandGold mb-4 md:mb-6">
                            Événements Exclusifs
                        </h3>
                        
                        {/* Decorative line - centered on mobile, right-aligned on desktop */}
                        <div className="h-0.5 w-16 bg-brandGold mx-auto md:ml-auto md:mr-0 mb-6 md:mb-8"></div>
                        
                        <p className="text-lg md:text-xl text-brandIvory/90 mb-6 md:mb-8 leading-relaxed">
                            Découvrez en avant-première nos collections lors de nos soirées privées.
                            Une expérience intime où le luxe se révèle dans chaque détail.
                        </p>
                        
                        <div className="bg-brandGold/10 backdrop-blur-sm border border-brandGold/30 p-5 md:p-6 mb-8 md:mb-10 rounded-sm md:rounded-none">
                            <h4 className="font-serif text-xl md:text-2xl text-brandGold mb-3">Dynastie Éblouissante</h4>
                            <p className="text-brandIvory mb-4 text-sm md:text-base">
                                Notre nouvelle collection sera dévoilée le 15 décembre
                                lors d'une soirée exclusive dans notre boutique de Casablanca.
                            </p>
                            <p className="text-xs md:text-sm text-brandIvory/70">
                                Sur invitation uniquement • Places limitées
                            </p>
                        </div>
                        
                        <div className="flex justify-center md:justify-end">
                        <Link href="/appointments">
                                <button className="px-8 py-2.5 md:py-3 bg-brandGold text-richEbony hover:bg-brandIvory transition-colors duration-300 tracking-wider text-sm md:text-base">
                                Demander une Invitation
                            </button>
                        </Link>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* CSS for hiding scrollbars */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Define the extremely small font size */}
            <style jsx global>{`
                .text-2xs {
                    font-size: 0.625rem;
                    line-height: 1rem;
                }
            `}</style>

        </>
    );
}