// pages/products/[id].tsx

import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useCart } from "../../contexts/CartContext";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";

type ProductTranslation = {
    language: string;
    name: string;
    description: string;
};

type ProductVariation = {
    id: number;
    variationType: string;
    variationValue: string;
    additionalPrice: string;
};

type ProductData = {
    id: number;
    sku: string;
    basePrice: string;
    images: string[];
    translations: ProductTranslation[];
    variations: ProductVariation[];
    categoryId?: number | null; // In case you store categoryId for matching
};

type ProductPageProps = {
    productData: ProductData | null;
    similarProducts: ProductData[];
    locale: string;
};

export default function ProductPage({
                                        productData,
                                        similarProducts,
                                        locale,
                                    }: ProductPageProps) {
    const { addToCart } = useCart();

    // ──────────────────────────────────────────
    // 1) Basic Checks
    // ──────────────────────────────────────────
    if (!productData) {
        return (
            <section className="py-12 px-6 section-dark">
                <h1 className="text-5xl font-serif text-brandGold mb-4">
                    Création Introuvable
                </h1>
                <p className="text-platinumGray">
                    La pièce que vous recherchez n’est plus disponible.
                </p>
            </section>
        );
    }

    // ──────────────────────────────────────────
    // 2) Translation
    // ──────────────────────────────────────────
    const productTranslation =
        productData.translations.find((t) => t.language === locale) ||
        productData.translations.find((t) => t.language === "fr") ||
        productData.translations.find((t) => t.language === "en");

    // ──────────────────────────────────────────
    // 3) Variation Selections
    // ──────────────────────────────────────────
    const [selectedVariations, setSelectedVariations] = useState<{
        [key: string]: ProductVariation;
    }>({});

    function updateVariation(variation: ProductVariation) {
        setSelectedVariations((prev) => ({
            ...prev,
            [variation.variationType]: variation,
        }));
    }

    // ──────────────────────────────────────────
    // 4) Pricing
    // ──────────────────────────────────────────
    const basePriceNum = parseFloat(productData.basePrice || "0");
    const additionalPriceSum = useMemo(() => {
        let sum = 0;
        Object.values(selectedVariations).forEach((v) => {
            sum += parseFloat(v.additionalPrice || "0");
        });
        return sum;
    }, [selectedVariations]);

    const totalPrice = basePriceNum + additionalPriceSum;

    // ──────────────────────────────────────────
    // 5) Selected Image
    // ──────────────────────────────────────────
    const [selectedImage, setSelectedImage] = useState(
        productData.images[0] || "/images/placeholder.jpg"
    );

    // ──────────────────────────────────────────
    // 6) Shipping Info (1 Month from Now)
    // ──────────────────────────────────────────
    const currentDate = new Date();
    const shippingDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
    );
    const shippingDateStr = shippingDate.toLocaleDateString(locale || "fr", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // ──────────────────────────────────────────
    // 7) Summary of Selections
    // ──────────────────────────────────────────
    const selectionSummary = Object.values(selectedVariations)
        .map((v) => `${v.variationType}: ${v.variationValue}`)
        .join(" | ");

    // ──────────────────────────────────────────
    // 8) Add to Cart
    // ──────────────────────────────────────────
    const handleAddToCart = () => {
        // If a primary variation is selected, get its id; otherwise, default to undefined.
        const primaryVariation = selectedVariations["diamondShape"] || undefined;
        addToCart({
          image: selectedImage,
          productId: productData.id,
          variationId: primaryVariation ? primaryVariation.id : undefined,
          sku: productData.sku,
          name: productTranslation?.name || "Bijou personnalisé",
          price: totalPrice,
          quantity: 1,
        });
      };
    return (
        <>
            <NextSeo
                title={`Diamant Rouge | ${productTranslation?.name}`}
                description={productTranslation?.description}
                openGraph={{
                    title: `Diamant Rouge | ${productTranslation?.name}`,
                    description: productTranslation?.description,
                }}
            />

            {/** ─────────────────────────────────────────
             MAIN PRODUCT SECTION
             ───────────────────────────────────────── */}
            <motion.section
                className="py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-16 text-left"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* LEFT: Images */}
                <div>
                    {/* Main Image */}
                    <div className="relative w-full h-auto mb-4">
                        <Image
                            src={selectedImage}
                            width={700}
                            height={700}
                            alt={productTranslation?.name || "Bijou Diamant Rouge"}
                            className="rounded-lg shadow-luxury"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 overflow-x-auto">
                        {productData.images.map((img, index) => {
                            const isSelected = selectedImage === img;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`border rounded-lg overflow-hidden ${
                                        isSelected ? "border-brandGold" : "border-transparent"
                                    }`}
                                >
                                    <Image
                                        src={img}
                                        width={80}
                                        height={80}
                                        alt={`Miniature ${index}`}
                                        className="object-cover"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: Info & Customization */}
                <div>
                    {/* Title & Price */}
                    <h1 className="text-4xl font-serif text-richEbony mb-2">
                        {productTranslation?.name}
                    </h1>
                    <p className="text-2xl text-brandGold font-bold mb-2">
                        {totalPrice.toFixed(2)} MAD
                    </p>
                    <hr className="border-platinumGray mb-4" />

                    {/* Description */}
                    <div className="text-platinumGray mb-6">
                        {productTranslation?.description}
                    </div>

                    {/* Material Details */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-richEbony mb-2">
                            Détails du Matériau
                        </h3>
                        <p className="text-platinumGray text-sm">
                            Chaque création Diamant Rouge est façonnée à partir de métaux
                            nobles et de pierres précieuses soigneusement sélectionnées.
                        </p>
                    </div>

                    {/* Personalization Options */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-richEbony mb-2">
                            Personnalisation
                        </h3>
                        {[
                            "diamondShape",
                            "carat",
                            "quality",
                            "coupe",
                            "metalColor",
                            "ringSize",
                        ].map((type) => {
                            const variationGroup = productData.variations.filter(
                                (v) => v.variationType === type
                            );
                            if (variationGroup.length === 0) return null;

                            return (
                                <div key={type} className="mb-4">
                                    <p className="font-medium text-sm text-richEbony mb-1">
                                        {getVariationLabel(type)}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {variationGroup.map((variation) => {
                                            const isSelected =
                                                selectedVariations[type]?.id === variation.id;
                                            return (
                                                <button
                                                    key={variation.id}
                                                    onClick={() => updateVariation(variation)}
                                                    className={`px-3 py-1 rounded-full border transition
                            ${
                                                        isSelected
                                                            ? "bg-burgundy text-brandIvory border-burgundy"
                                                            : "bg-brandIvory text-richEbony border-burgundy"
                                                    }
                          `}
                                                >
                                                    {variation.variationValue}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary of Selections */}
                    {selectionSummary && (
                        <div className="mb-6">
                            <p className="text-sm text-platinumGray">
                                <strong>Votre configuration:</strong> {selectionSummary}
                            </p>
                        </div>
                    )}

                    {/* Shipping Info */}
                    <div className="mb-6">
                        <p className="text-sm text-platinumGray">
                            Livraison estimée autour du {shippingDateStr}
                        </p>
                    </div>

                    {/* Paiement Sécurisé */}
                    <div className="flex items-center gap-2 bg-burgundy/10 p-3 rounded-md mb-4">
                        <p className="text-sm text-richEbony font-semibold">
                            Paiement Sécurisé
                        </p>
                        <Image
                            src="/images/icons/img.icons8.png"
                            width={40}
                            height={24}
                            alt="Visa"
                        />
                        <Image
                            src="/images/icons/mastercard-old.svg"
                            width={40}
                            height={24}
                            alt="Mastercard"
                        />
                    </div>

                    {/* Buttons: "Try in Showroom" & "Add to Cart" */}
                    <div className="flex flex-wrap gap-4">
                        <Link href="/appointments" passHref>
                            <button
                                className="
                  button-secondary
                  px-6 py-3
                  font-medium
                  rounded-full
                  transition
                  w-full sm:w-auto
                "
                            >
                                Essayer en Showroom
                            </button>
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            className="
                button-primary
                px-6 py-3
                font-medium
                rounded-full
                transition
                w-full sm:w-auto
              "
                        >
                            Ajouter au Panier ({totalPrice.toFixed(2)} MAD)
                        </button>
                    </div>
                </div>
            </motion.section>

            {/** ─────────────────────────────────────────
             SIMILAR PRODUCTS SECTION
             ───────────────────────────────────────── */}
            {similarProducts.length > 0 && (
                <motion.section
                    className="py-12 px-6 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-serif text-brandGold mb-6">
                        Vous aimerez peut-être
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                        {similarProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </motion.section>
            )}
        </>
    );
}

// Helper function to label your variation types in French
function getVariationLabel(type: string): string {
    switch (type) {
        case "diamondShape":
            return "Forme du diamant";
        case "carat":
            return "Carat";
        case "quality":
            return "Qualité";
        case "coupe":
            return "Coupe";
        case "metalColor":
            return "Couleur du métal";
        case "ringSize":
            return "Taille de bague";
        default:
            return type;
    }
}

/* ───────────────────────────────────────────────────────────────────────────
   ✅ getServerSideProps
   Fetch product, find similar products, pass to the page
──────────────────────────────────────────────────────────────────────────── */
export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = parseInt(context.params?.id as string, 10);
    if (isNaN(id)) return { notFound: true };

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            translations: true,
            variations: true,
            category: true, // if you have a category relation
        },
    });

    if (!product) {
        return { notFound: true };
    }

    // Convert Decimal fields to string
    const productData = {
        ...product,
        basePrice: product.basePrice.toString(),
        variations: product.variations.map((v) => ({
            ...v,
            additionalPrice: v.additionalPrice.toString(),
        })),
    };

    // ─────────────────────────────────────────────────
    // Fetch "Similar Products"
    // e.g. same category (excluding current product)
    // If product.categoryId is null, we can just pick random or top new arrivals
    let similarProducts = [];
    if (product.categoryId) {
        similarProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
            },
            take: 5,
            include: {
                translations: true,
                variations: true,
            },
        });
    } else {
        // fallback: just get some random products
        similarProducts = await prisma.product.findMany({
            where: {
                id: { not: product.id },
            },
            take: 5,
            include: {
                translations: true,
                variations: true,
            },
        });
    }

    // Convert decimals in similar products
    const similarProductsData = similarProducts.map((p) => ({
        ...p,
        basePrice: p.basePrice.toString(),
        variations: p.variations.map((v) => ({
            ...v,
            additionalPrice: v.additionalPrice.toString(),
        })),
    }));

    return {
        props: {
            productData: JSON.parse(JSON.stringify(productData)),
            similarProducts: JSON.parse(JSON.stringify(similarProductsData)),
            locale: context.locale || "fr",
        },
    };
};
