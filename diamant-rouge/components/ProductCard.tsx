// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../contexts/WishlistContext";
import { useState } from "react";

type ProductTranslation = {
    language: string;
    name: string;
};

type ProductCardProps = {
    product: {
        id: number;
        sku: string;
        basePrice: string;
        images: string[];
        translations: ProductTranslation[];
    };
    locale: string;
};

export default function ProductCard({ product, locale }: ProductCardProps) {
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [hovered, setHovered] = useState(false);

    // Determine product name based on current locale
    const productTranslation =
        product.translations.find((t) => t.language === locale) ||
        product.translations.find((t) => t.language === "fr") || // fallback to French
        product.translations.find((t) => t.language === "en");   // fallback to English

    // Check if product is in the user's wishlist
    const isInWishlist = wishlist.some((item) => item.productId === product.id);

    // Toggle wishlist status
    async function handleWishlist() {
        if (isInWishlist) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product.id);
        }
    }

    return (
        <div
            className="relative overflow-hidden hover-scale transition-transform duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ---------- Product Image ---------- */}
            <Link href={`/products/${product.id}`} passHref>
                <div className="relative w-full h-[320px] cursor-pointer">
                    <Image
                        src={
                            product.images.length > 0
                                ? product.images[0]
                                : "/images/placeholder.jpg"
                        }
                        alt={productTranslation?.name || "Bijou de luxe"}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            {/* ---------- Text & Favorite Button ---------- */}
            <div className="mt-2 px-2 text-left">
                <div className="flex items-center justify-between">
                    {/* Product Title */}
                    <h3 className="text-base font-serif text-richEbony">
                        {productTranslation?.name}
                    </h3>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlist}
                        className={`p-1 rounded-full transition-all duration-300
              ${
                            isInWishlist
                                ? "bg-burgundy text-brandIvory"
                                : "bg-brandIvory text-burgundy border border-burgundy"
                        }
            `}
                        title="Ajouter aux favoris"
                    >
                        {isInWishlist ? "❤️" : "🤍"}
                    </button>
                </div>

                {/* Price */}
                <p className="text-sm text-platinumGray mt-1">
                    À partir de {parseFloat(product.basePrice).toFixed(2)} MAD
                </p>

                {/* ---------- "Voir la création" Button ---------- */}
                <div className="mt-4 flex justify-center">
                    <Link href={`/products/${product.id}`} passHref>
                        <button
                            className={`
                px-6 py-2 text-sm 
                border border-brandGold text-brandGold 
                hover:bg-brandGold hover:text-richEbony
                rounded-full transition duration-300
              `}
                        >
                            Voir la création
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
