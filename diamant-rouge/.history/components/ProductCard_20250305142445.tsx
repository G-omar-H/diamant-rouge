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
    
    // Get image source with fallback
    const imageSrc = product.images && product.images.length > 0 
        ? product.images[0] 
        : "/images/product-placeholder.jpg";

    return (
        <div 
            className="group relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Product Image - with explicit height to ensure visibility */}
            <div className="relative overflow-hidden mb-5 aspect-[1/1]">
                <Link href={`/products/${product.id}`} className="block h-full w-full">
                    <div className="relative h-full w-full">
                        {/* Fallback div in case Image fails */}
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">Image</span>
                        </div>
                        
                        {/* Fixed height/width Image component */}
                        <Image
                            src={imageSrc}
                            alt={getProductName()}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover z-10"
                            priority
                        />
                        
                        {/* Hover effect overlay */}
                        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 z-20 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                </Link>
            </div>

            {/* Product Details - Left alignment with wishlist inline */}
            <div className="px-0">
                {/* Product Name and Wishlist icon in the same row */}
                <div className="flex justify-between items-start mb-1.5">
                    <h3 className="text-base font-serif text-richEbony">
                        {getProductName()}
                    </h3>
                    
                    {/* Wishlist heart icon - no background, minimal design */}
                    <button
                        onClick={handleWishlistToggle}
                        className="ml-2 flex-shrink-0"
                        aria-label={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        <Heart 
                            size={18} 
                            className={`transition-all duration-300 ${
                                isInWishlist 
                                    ? "fill-burgundy stroke-burgundy" 
                                    : "fill-transparent stroke-platinumGray hover:stroke-burgundy"
                            }`} 
                        />
                    </button>
                </div>
                
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