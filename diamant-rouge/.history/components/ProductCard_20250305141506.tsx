// components/ProductCard.tsx

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "../contexts/WishlistContext";

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
    isWishlisted?: boolean;
};

export default function ProductCard({ product, locale, isWishlisted = false }: ProductCardProps) {
    const { addToWishlist, removeFromWishlist } = useWishlist();
    const [hovered, setHovered] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(isWishlisted);

    // Determine product name based on current locale
    const getProductName = () => {
        const translation = product.translations.find((t) => t.language === locale);
        return translation ? translation.name : product.translations[0]?.name || "Product Name";
    };

    // Handle wishlist toggle
    const handleWishlistToggle = () => {
        if (isInWishlist) {
            removeFromWishlist(product.id);
            setIsInWishlist(false);
        } else {
            addToWishlist(product.id);
            setIsInWishlist(true);
        }
    };

    return (
        <div 
            className="group relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Product Image */}
            <div className="relative overflow-hidden mb-5 aspect-square">
                <Link href={`/products/${product.id}`}>
                    <motion.div
                        initial={false}
                        animate={{ scale: hovered ? 1.05 : 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        <Image
                            src={product.images[0] || "/images/product-placeholder.jpg"}
                            alt={getProductName()}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </Link>
                
                {/* Wishlist heart icon - minimal elegant design */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleWishlistToggle();
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-opacity duration-300"
                    aria-label={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <Heart 
                        size={22} 
                        className={`transition-all duration-300 ${
                            isInWishlist 
                                ? "fill-burgundy stroke-burgundy" 
                                : "fill-transparent stroke-brandIvory hover:stroke-burgundy"
                        }`} 
                    />
                </button>
            </div>

            {/* Product Details - Left alignment */}
            <div className="px-0">
                {/* Product Name */}
                <h3 className="text-base font-serif text-richEbony mb-1.5">
                    {getProductName()}
                </h3>
                
                {/* Price */}
                <p className="text-sm text-platinumGray font-light mb-3.5">
                    {parseFloat(product.basePrice).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} MAD
                </p>

                {/* View Product Link - elegant styling */}
                <Link href={`/products/${product.id}`} className="inline-block">
                    <motion.span 
                        className="text-sm text-brandGold hover:text-burgundy transition-colors duration-300 relative group"
                        whileHover={{ x: 3 }}
                    >
                        Voir la création
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brandGold group-hover:w-full transition-all duration-300"></span>
                    </motion.span>
                </Link>
            </div>
        </div>
    );
}