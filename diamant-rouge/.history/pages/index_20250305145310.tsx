// pages/index.tsx

import Link from "next/link";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import { useState, useRef, useMemo,  } from "react";
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

        // Fetch featured products with categories
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
            take: 12, // Increased for better selection across categories
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

        return {
            props: {
                products: JSON.parse(JSON.stringify(featuredProducts)),
                categories: JSON.parse(JSON.stringify(categories)),
                wishlist,
                locale: context.locale || "fr",
            },
        };
    } catch (error) {
        console.error("❌ Homepage Data Fetch Error:", error);
        return {
            props: { 
                products: [], 
                categories: [],
                wishlist: [], 
                locale: context.locale || "fr" 
            },
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

export default function HomePage({
    products,
    categories,
    wishlist,
    locale,
}: {
    products: any[];
    categories: any[];
    wishlist: number[];
    locale: string;
}) {
    const [activeFilter, setActiveFilter] = useState("Tous");
    const carouselRef = useRef<HTMLDivElement>(null);
    const [scrollLimits, setScrollLimits] = useState({ min: 0, max: 0 });

    // Generate product categories from fetched data
    const productCategories = useMemo(() => {
        const categoryNames = ["Tous"];
        
        // Get category names in the current locale
        categories.forEach(category => {
            const translation = category.translations.find(t => t.language === locale) || 
                                category.translations[0];
            if (translation) {
                categoryNames.push(translation.name);
            }
        });
        
        return categoryNames;
    }, [categories, locale]);

    // Filter products based on selected category
    const filteredProducts = useMemo(() => {
        if (activeFilter === "Tous") {
            return products;
        }
        
        return products.filter(product => {
            // Find the category translation that matches the active filter
            if (!product.category) return false;
            
            const categoryTranslation = product.category.translations.find(
                t => t.language === locale
            ) || product.category.translations[0];
            
            return categoryTranslation.name === activeFilter;
        });
    }, [products, activeFilter, locale]);

    // Function to scroll to center a product
    const scrollToCenter = (index: number) => {
        if (!carouselRef.current) return;
        
        const container = carouselRef.current;
        const items = container.querySelectorAll('.product-item');
        
        if (items.length === 0 || !items[index]) return;
        
        const item = items[index] as HTMLElement;
        const containerWidth = container.offsetWidth;
        const itemWidth = item.offsetWidth;
        
        // Calculate position to center the item
        const scrollPosition = item.offsetLeft - (containerWidth / 2) + (itemWidth / 2);
        
        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };
    
    // Calculate scroll limits after products are loaded or filtered
    useEffect(() => {
        if (!carouselRef.current || filteredProducts.length === 0) return;
        
        const container = carouselRef.current;
        const items = container.querySelectorAll('.product-item');
        
        if (items.length === 0) return;
        
        const firstItem = items[0] as HTMLElement;
        const lastItem = items[items.length - 1] as HTMLElement;
        const containerWidth = container.offsetWidth;
        const itemWidth = firstItem.offsetWidth;
        
        // Calculate the minimum scroll position (first item centered)
        const minScroll = firstItem.offsetLeft - (containerWidth / 2) + (itemWidth / 2);
        
        // Calculate the maximum scroll position (last item centered)
        const maxScroll = lastItem.offsetLeft - (containerWidth / 2) + (itemWidth / 2);
        
        setScrollLimits({ min: minScroll, max: maxScroll });
    }, [filteredProducts, activeFilter]);

    return (
        <>
            <NextSeo
                title="Diamant Rouge | Joaillerie de Luxe"
                description="Découvrez la joaillerie Diamant Rouge : des pièces intemporelles, un héritage royal et un artisanat d'exception à Casablanca."
            />

            <HeroCarousel slides={slides} />

            {/* 
            ----------------------------------------------------
            💎 2. COLLECTIONS PRESTIGIEUSES - Full-width product carousel 
            ----------------------------------------------------
            */}
            <motion.section
                className="py-20 bg-white w-full overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Section title */}
                <div className="text-center mb-12 px-4">
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
                <div className="flex justify-center mb-10 overflow-x-auto pb-3 custom-scrollbar px-4">
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

                {/* Products carousel - full width with scroll limits */}
                <div className="relative w-full">
                    {/* Full-width container */}
                    <div className="w-full relative">
                        <div 
                            ref={carouselRef}
                            className="flex overflow-x-auto custom-scrollbar snap-x scroll-smooth pb-8"
                            style={{
                                scrollbarGutter: 'stable',
                                paddingLeft: 'calc(50% - 160px)',
                                paddingRight: 'calc(50% - 160px)'
                            }}
                        >
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                    <div 
                                        key={product.id} 
                                        className="product-item flex-none w-80 mx-4 snap-center"
                                    >
                                        <ProductCard
                                            product={product}
                                            locale={locale}
                                            isWishlisted={wishlist.includes(product.id)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-10 text-platinumGray">
                                    <p>Aucun produit trouvé dans cette catégorie.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Navigation dots */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {filteredProducts.length > 0 && (
                            <>
                                <button 
                                    onClick={() => scrollToCenter(0)} 
                                    className="w-2 h-2 rounded-full bg-brandGold/60 hover:bg-brandGold transition-colors"
                                    aria-label="Scroll to first product"
                                />
                                
                                {filteredProducts.length > 3 && (
                                    <button 
                                        onClick={() => scrollToCenter(Math.floor(filteredProducts.length / 2))} 
                                        className="w-2 h-2 rounded-full bg-brandGold/60 hover:bg-brandGold transition-colors"
                                        aria-label="Scroll to middle products"
                                    />
                                )}
                                
                                {filteredProducts.length > 1 && (
                                    <button 
                                        onClick={() => scrollToCenter(filteredProducts.length - 1)} 
                                        className="w-2 h-2 rounded-full bg-brandGold/60 hover:bg-brandGold transition-colors"
                                        aria-label="Scroll to last product"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* View all collections button */}
                <div className="text-center mt-12 px-4">
                    <Link href="/collections">
                        <button className="px-10 py-3 border-2 border-brandGold text-brandGold hover:bg-brandGold hover:text-richEbony transition-all duration-300 tracking-wider">
                            Découvrir Toutes Nos Collections
                        </button>
                    </Link>
                </div>
            </motion.section>

            {/* Add custom scrollbar styling */}
            <style jsx global>{`
                /* Custom scrollbar styling */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                    width: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(209, 213, 219, 0.1);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(169, 138, 95, 0.5);
                    border-radius: 2px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(169, 138, 95, 0.8);
                }
                
                /* For Firefox */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(169, 138, 95, 0.5) rgba(209, 213, 219, 0.1);
                }
                
                /* Make sure the scrollbar is properly sized */
                .custom-scrollbar {
                    --scrollbar-thumb-size: calc(
                        (100% - (50% - 160px) * 2) / (100% / var(--scrollbar-track-size, 100%))
                    );
                }
                
                /* Subtle product hover effect */
                .product-item {
                    transition: transform 0.3s ease;
                }
                
                .product-item:hover {
                    transform: translateY(-3px);
                }
                
                /* Snap alignment */
                .snap-center {
                    scroll-snap-align: center;
                }
            `}</style>
       

            {/* 
            ----------------------------------------------------
            🔶 3. LA MAISON DIAMANT ROUGE - Brand story & heritage 
            ----------------------------------------------------
            */}
            <motion.section
                className="py-24 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Background gradient with subtle pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-richEbony to-burgundy opacity-95 z-0"></div>
                <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-10 z-0"></div>
                
                <div className="container mx-auto px-6 md:px-10 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                        {/* Left: Brand story */}
                        <div className="md:w-1/2">
                            <div className="relative">
                                {/* Decorative frame */}
                                <div className="absolute -top-8 -left-8 w-24 h-24 border border-brandGold/40"></div>
                                
                                <h2 className="text-5xl md:text-6xl font-serif text-brandGold mb-8">La Maison</h2>
                                
                                <p className="text-xl text-brandIvory/90 mb-8 leading-relaxed">
                                    Fondée sur l'excellence et la passion des métiers d'art, Diamant Rouge perpétue 
                                    depuis des générations une quête de beauté absolue. Notre maison de joaillerie 
                                    marie tradition marocaine et vision contemporaine.
                                </p>
                                
                                <p className="text-lg text-brandIvory/80 mb-10">
                                    Chaque création est le fruit d'un savoir-faire exigeant, où la 
                                    précision du geste et la noblesse des matériaux donnent vie à des pièces uniques.
                                </p>
                                
                                <Link href="/the-house">
                                    <button className="px-10 py-3 border border-brandGold text-brandGold hover:bg-brandGold hover:text-richEbony transition-colors duration-300">
                                        Notre Histoire
                                    </button>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Right: Image collage with overlapping effect */}
                        <div className="md:w-1/2 relative h-[600px]">
                            <div className="absolute right-0 bottom-0 w-3/4 h-4/5">
                                <Image 
                                    src="/images/gemologist.jpg"
                                    alt="Artisan joaillier"
                                    fill
                                    className="object-cover object-center border-8 border-richEbony"
                                />
                            </div>
                            <div className="absolute left-0 top-0 w-3/5 h-3/5 shadow-luxury">
                                <Image 
                                    src="/images/showroom.jpg"
                                    alt="Boutique Diamant Rouge"
                                    fill
                                    className="object-cover object-center border-8 border-richEbony"
                                />
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute -bottom-4 -left-4 w-20 h-20 border border-brandGold/40"></div>
                            <div className="absolute -top-4 -right-4 w-16 h-16 border border-brandGold/40"></div>
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
                className="py-20 px-6 md:px-10 lg:px-20 bg-brandIvory"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 relative overflow-hidden">
                        <div className="pb-[56.25%] relative"> {/* 16:9 aspect ratio */}
                            <Image
                                src="/images/showroom.jpg"
                                alt="Atelier Diamant Rouge"
                                fill
                                className="object-cover absolute inset-0 hover-scale"
                            />
                        </div>
                        
                        {/* Floating quote */}
                        <div className="absolute -bottom-6 -right-6 md:bottom-6 md:right-6 bg-brandGold/90 p-6 max-w-xs shadow-luxury">
                            <p className="text-richEbony italic font-serif">
                                "L'art de la joaillerie réside dans la capacité à transformer 
                                un rêve en une œuvre éternelle"
                            </p>
                            <p className="text-right mt-2 text-richEbony/80 font-medium">- Fondateur</p>
                        </div>
                    </div>
                    
                    {/* Right: Text content */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-serif text-brandGold mb-6">
                            Créations Sur-Mesure
                        </h2>
                        <div className="h-0.5 w-16 bg-brandGold mb-8"></div>
                        
                        <p className="text-lg text-platinumGray mb-6">
                            Au cœur de notre atelier, nos maîtres joailliers donnent vie à vos 
                            désirs les plus précieux. Une bague de fiançailles unique, 
                            un bijou commémoratif ou une pièce d'exception — nous créons l'extraordinaire.
                        </p>
                        
                        <p className="text-lg text-platinumGray mb-10">
                            Chaque création sur-mesure est une invitation à participer au processus créatif, 
                            depuis l'esquisse jusqu'à l'écrin final.
                        </p>
                        
                        <Link href="/appointments">
                            <button className="button-primary">Prendre Rendez-vous</button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* 
            ----------------------------------------------------
            🎉 5. ÉVÉNEMENTS EXCLUSIFS - With elegant presentation
            ----------------------------------------------------
            */}
            <motion.section
                className="relative py-28 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/rings/08a58c59664d--Aurate-Holiday-36kira-1v2.jpg"
                        alt="Événement Diamant Rouge"
                        fill
                        className="object-cover object-center"
                    />
                    {/* Elegant overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-richEbony/90 via-richEbony/50 to-richEbony/90" />
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 md:px-10 relative z-10">
                    <div className="max-w-lg ml-auto">
                        <h3 className="text-4xl md:text-5xl font-serif text-brandGold mb-6">
                            Événements Exclusifs
                        </h3>
                        
                        <div className="h-0.5 w-16 bg-brandGold mb-8"></div>
                        
                        <p className="text-xl text-brandIvory/90 mb-8 leading-relaxed">
                            Découvrez en avant-première nos collections lors de nos soirées privées.
                            Une expérience intime où le luxe se révèle dans chaque détail.
                        </p>
                        
                        <div className="bg-brandGold/10 backdrop-blur-sm border border-brandGold/30 p-6 mb-10">
                            <h4 className="font-serif text-2xl text-brandGold mb-3">Dynastie Éblouissante</h4>
                            <p className="text-brandIvory mb-4">
                                Notre nouvelle collection sera dévoilée le 15 décembre
                                lors d'une soirée exclusive dans notre boutique de Casablanca.
                            </p>
                            <p className="text-sm text-brandIvory/70">
                                Sur invitation uniquement • Places limitées
                            </p>
                        </div>
                        
                        <Link href="/appointments">
                            <button className="px-10 py-3 bg-brandGold text-richEbony hover:bg-brandIvory transition-colors duration-300 tracking-wider">
                                Demander une Invitation
                            </button>
                        </Link>
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
        </>
    );
}