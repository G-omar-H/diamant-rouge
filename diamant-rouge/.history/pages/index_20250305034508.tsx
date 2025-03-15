// pages/index.tsx

import Link from "next/link";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
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

        // Fetch featured products
        const featuredProducts = await prisma.product.findMany({
            include: { translations: true, variations: true },
            take: 6,
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
        imageSrc: "/images/image.png",
        heading: "Diamant Rouge",
        subheading: "Éclat Royal & Héritage Intemporel",
    },
    {
        imageSrc: "/images/liv_bra_emo_ron_020_bla_1_desktop.jpg",
        heading: "L’Essence de la Joaillerie",
        subheading: "Des pièces taillées pour sublimer chaque moment",
    },
    {
        imageSrc: "/images/clo_bdf_sym_eme_150_san_ros_1_desktop.jpg",
        heading: "Héritage Vivant",
        subheading: "La tradition à travers les siècles, pour vous",
    },
];

export default function HomePage({
                                     products,
                                     wishlist,
                                     locale,
                                 }: {
    products: any[];
    wishlist: number[];
    locale: string;
}) {
    return (
        <>
            <NextSeo
                title="Diamant Rouge | Joaillerie de Luxe"
                description="Découvrez la joaillerie Diamant Rouge : des pièces intemporelles, un héritage royal et un artisanat d’exception."
            />

            {/*
        ----------------------------------------------------
        ✨ 1. HERO CAROUSEL
        ----------------------------------------------------
      */}
            <HeroCarousel slides={slides} />

            {/*
        ----------------------------------------------------
        🔶 2. CRÉATIONS ROYALES (split: text left, image right)
        ----------------------------------------------------
      */}
            <motion.section
                className="section-light py-16 px-6 md:px-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Text (Left) */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-serif text-brandGold mb-4">
                            Créations Royales
                        </h2>
                        <p className="text-platinumGray mb-6 leading-relaxed">
                            Des joyaux inspirés par la splendeur d’autrefois, façonnés pour briller
                            aujourd’hui. Chaque pièce raconte une histoire de passion et de noblesse.
                        </p>
                        <Link href="/collections/tresors">
                            <button className="button-primary">Découvrir Nos Trésors</button>
                        </Link>
                    </div>
                    {/* Image (Right) */}
                    <div className="w-full md:w-1/2 relative overflow-hidden rounded-xl shadow-luxury">
                        <Image
                            src="/images/showroom.jpg"
                            alt="Showroom Diamant Rouge"
                            width={900}
                            height={600}
                            className="object-cover w-full h-full hover-scale"
                        />
                    </div>
                </div>
            </motion.section>

            {/*
        ----------------------------------------------------
        💎 3. PIÈCES INCONTOURNABLES (heading center, content fill)
        ----------------------------------------------------
      */}
            <motion.section
                className="section-light py-16 px-6 md:px-8 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-4xl font-serif text-brandGold mb-2">
                    Pièces Incontournables
                </h2>
                <p className="text-platinumGray max-w-2xl mx-auto mb-8">
                    Sélectionnées par les connaisseurs, ces créations incarnent le meilleur
                    de Diamant Rouge.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            locale={locale}
                            isWishlisted={wishlist.includes(product.id)}
                        />
                    ))}
                </div>
            </motion.section>

            {/*
        ----------------------------------------------------
        ⚜️ 4. HÉRITAGE & ARTISANAT (split: image left, text right)
        ----------------------------------------------------
      */}
            <motion.section
                className="section-dark py-16 px-6 md:px-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Image (Left) */}
                    <div className="w-full md:w-1/2 overflow-hidden rounded-xl shadow-luxury relative">
                        <Image
                            src="/images/gemologist.jpg"
                            alt="Atelier Diamant Rouge"
                            width={900}
                            height={600}
                            className="object-cover w-full h-full hover-scale"
                        />
                    </div>
                    {/* Text (Right) */}
                    <div className="w-full md:w-1/2 text-right">
                        <h3 className="text-3xl md:text-4xl font-serif text-brandGold mb-4">
                            Héritage & Artisanat
                        </h3>
                        <p className="text-brandIvory leading-relaxed mb-6">
                            Les secrets d’une tradition séculaire se révèlent dans chaque détail.
                            Nos artisans perpétuent un savoir-faire d’exception pour offrir des
                            bijoux uniques, reflet d’une passion inaltérable.
                        </p>
                        <Link href="/about">
                            <button className="button-secondary">En Savoir Plus</button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/*
        ----------------------------------------------------
        🎉 5. Événement Exclusif (full-width bg, text right)
        ----------------------------------------------------
      */}
            <motion.section
                className="relative py-16 px-6 md:px-8 overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/rings/08a58c59664d--Aurate-Holiday-36kira-1v2.jpg?v=1699501639"
                        alt="Événement Diamant Rouge"
                        fill
                        className="object-cover object-center"
                    />
                    {/* Burgundy Tint */}
                    <div className="absolute inset-0 bg-burgundy/40" />
                </div>

                {/* Text (Right-Aligned) */}
                <div className="relative z-10 flex flex-col items-end w-full ml-auto">
                    <h3 className="text-3xl md:text-4xl font-serif text-brandGold mb-4">
                        Événement Exclusif
                    </h3>
                    <p className="text-platinumGray mb-6 max-w-md text-right">
                        Participez à notre gala privé et découvrez la nouvelle collection
                        « Dynastie Éblouissante » avant tout le monde.
                    </p>
                    <Link href="/appointments">
                        <button className="button-primary">Réserver</button>
                    </Link>
                </div>
            </motion.section>

        </>
    );
}
