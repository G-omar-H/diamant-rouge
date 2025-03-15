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
    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
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
        <motion.div
            className="group relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Product Image - with refined hover effect */}
            <div className="relative overflow-hidden mb-6 aspect-[1/1]">
                <Link href={`/products/${product.id}`} className="block h-full w-full">
                    <div className="relative h-full w-full">
                        {/* Fallback div in case Image fails */}
                        <div className="absolute inset-0 bg-brandIvory/50 flex items-center justify-center">
                            <span className="text-platinumGray font-light italic">Image</span>
                        </div>
                        
                        {/* Main Product Image */}
                        <Image
                            src={imageSrc}
                            alt={getProductName()}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover z-10 transition-transform duration-700 ease-out"
                            style={{
                                transform: hovered ? 'scale(1.05)' : 'scale(1)'
                            }}
                            priority
                        />
                        
                        {/* Luxury hover effect - subtle gold gradient overlay */}
                        <div 
                            className="absolute inset-0 bg-gradient-to-t from-brandGold/10 to-transparent opacity-0 transition-opacity duration-500 z-20 group-hover:opacity-100"
                        />
                        
                        {/* Wishlist button - positioned on top right corner with more elegant styling */}
                        <button
                            onClick={handleWishlistToggle}
                            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-brandIvory/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-sm"
                            aria-label={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                            <Heart 
                                size={16} 
                                className={`transition-all duration-300 ${
                                    isInWishlist 
                                        ? "fill-burgundy stroke-burgundy" 
                                        : "fill-transparent stroke-brandGold"
                                }`} 
                            />
                        </button>
                    </div>
                </Link>
            </div>

            {/* Product Details - Refined typography and spacing */}
            <div className="px-0">
                {/* Product Name */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-base font-serif text-platinumGray hover:text-brandGold transition-colors duration-300 mb-2">
                        {getProductName()}
                    </h3>
                </Link>
                
                {/* Price - More elegant styling */}
                <p className="text-sm font-light text-platinumGray mb-4">
                    <span className="font-normal text-brandGold">
                        {parseFloat(product.basePrice).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} MAD
                    </span>
                </p>

                {/* View Product Link - Refined styling */}
                <Link href={`/products/${product.id}`} className="inline-block">
                    <span className="relative group overflow-hidden inline-flex items-center">
                        <span className="text-sm text-platinumGray group-hover:text-brandGold transition-colors duration-300">
                            Voir la création
                        </span>
                        <span className="absolute bottom-0 left-0 w-full h-px bg-brandGold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </span>
                </Link>
            </div>
        </motion.div>
    );
}