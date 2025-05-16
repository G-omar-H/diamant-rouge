import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import ProductSkeleton from "../../components/ProductSkeleton";
import { NextSeo } from "next-seo";
import { useState, useEffect } from "react";

type CollectionProps = {
    categoryData: {
        slug: string;
        translations: {
            language: string;
            name: string;
            description: string | null;
        }[];
        products: {
            id: number;
            sku: string;
            basePrice: string;
            images: string[];
            createdAt: string;
            translations: {
                language: string;
                name: string;
            }[];
        }[];
    } | null;
    locale: string;
};

export default function CollectionPage({ categoryData, locale }: CollectionProps) {
    const [sortedProducts, setSortedProducts] = useState(categoryData?.products || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a slight loading delay for the skeleton UI
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!categoryData) {
        return (
            <section className="section-light min-h-screen flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-5xl font-serif text-brandGold mb-4">Collection Not Found</h1>
                <p className="text-platinumGray">
                    The collection you're looking for doesn't exist.
                </p>
            </section>
        );
    }

    const catTranslation =
        categoryData.translations.find((t) => t.language === locale) ||
        categoryData.translations.find((t) => t.language === "en");

    const handleSortChange = (sortOption: string) => {
        const sorted = [...(categoryData.products || [])];

        if (sortOption === "price-asc") {
            sorted.sort((a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice));
        } else if (sortOption === "price-desc") {
            sorted.sort((a, b) => parseFloat(b.basePrice) - parseFloat(a.basePrice));
        } else if (sortOption === "latest") {
            sorted.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        setSortedProducts(sorted);
    };

    return (
        <>
            <NextSeo
                title={`Diamant-Rouge | ${catTranslation?.name}`}
                description={
                    catTranslation?.description || "Discover our exclusive jewelry collections."
                }
                openGraph={{
                    title: `Diamant-Rouge | ${catTranslation?.name}`,
                    description:
                        catTranslation?.description || "Luxury jewelry collection by Diamant-Rouge.",
                }}
            />

            <section className="section-light py-12 px-6 max-w-7xl mx-auto min-h-screen">
                {/* Collection Title */}
                <h1 className="text-5xl font-serif text-brandGold mb-6">
                    {catTranslation?.name}
                </h1>
                <p className="text-xl text-platinumGray mb-8 leading-relaxed">
                    {catTranslation?.description}
                </p>

                {/* Sorting & Filters */}
                <ProductFilters onSortChange={handleSortChange} />

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                    {loading
                        ? [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                        : sortedProducts.length > 0
                            ? sortedProducts.map((product) => (
                                <div key={product.id} className="mx-auto w-64 sm:w-auto">
                                    <ProductCard product={product} locale={locale} />
                                </div>
                            ))
                            : (
                                <p className="text-center text-platinumGray col-span-3">
                                    No products found in this collection.
                                </p>
                            )}
                </div>
            </section>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params!;
    const locale = context.locale || "en";

    const rawCategoryData = await prisma.category.findUnique({
        where: { slug: slug as string },
        include: {
            translations: true,
            products: {
                include: {
                    translations: true,
                },
            },
        },
    });

    const categoryData = rawCategoryData
        ? JSON.parse(
            JSON.stringify({
                ...rawCategoryData,
                createdAt: rawCategoryData.createdAt
                    ? rawCategoryData.createdAt.toISOString()
                    : null,
                updatedAt: rawCategoryData.updatedAt
                    ? rawCategoryData.updatedAt.toISOString()
                    : null,
                products: rawCategoryData.products.map((product) => ({
                    ...product,
                    images: product.images || [],
                    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
                    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
                })),
            })
        )
        : null;

    return {
        props: {
            categoryData,
            locale,
        },
    };
};
