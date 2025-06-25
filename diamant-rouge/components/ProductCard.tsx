import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "../contexts/WishlistContext";
import { useToast } from "../contexts/ToastContext";

type ProductTranslation = {
    language: string;
    name: string;
    description?: string; // Added for description
    materialDescription?: string; // For material information
};

type ProductCardProps = {
    product: {
        id: number;
        sku: string;
        basePrice: string | number;  // Updated to accept both string and number
        images: string[];
        translations: ProductTranslation[];
        material?: string; // Added direct material property
        variations?: any[]; // Add variations to check if product has multiple options
    };
    locale: string;
    isWishlisted?: boolean;
};

export default function ProductCard({ product, locale, isWishlisted = false }: ProductCardProps) {
    const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
    const { showToast } = useToast();
    const [hovered, setHovered] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(isWishlisted);
    
    // Update local wishlist state when global wishlist changes
    useEffect(() => {
        const isProductInWishlist = wishlist.some(item => item.productId === product.id);
        setIsInWishlist(isProductInWishlist);
    }, [wishlist, product.id]);

    // Get product name based on current locale with French fallback
    const getProductName = () => {
        const translation = product.translations.find((t) => t.language === locale);
        
        // If translation for current locale not found, try French as fallback
        if (!translation) {
            const frenchTranslation = product.translations.find((t) => t.language === 'fr');
            if (frenchTranslation) return frenchTranslation.name;
        }
        
        return translation ? translation.name : product.translations[0]?.name || "Bijou";
    };

    // Get product description preview for hover state
    const getDescriptionPreview = () => {
        const translation = product.translations.find((t) => t.language === locale);
        
        // If translation for current locale not found, try French as fallback
        if (!translation || !translation.description) {
            const frenchTranslation = product.translations.find((t) => t.language === 'fr');
            if (frenchTranslation?.description) {
                // Return short preview of description
                return frenchTranslation.description.length > 60 
                    ? frenchTranslation.description.substring(0, 60) + '...'
                    : frenchTranslation.description;
            }
        }
        
        if (translation?.description) {
            return translation.description.length > 60
                ? translation.description.substring(0, 60) + '...'
                : translation.description;
        }
        
        return "";
    };

    // Get material information if available
    const getMaterialInfo = () => {
        // Try to get from translations first
        const translation = product.translations.find((t) => t.language === locale);
        
        // If translation for current locale not found, try French as fallback
        if (!translation || !translation.materialDescription) {
            const frenchTranslation = product.translations.find((t) => t.language === 'fr');
            if (frenchTranslation?.materialDescription) return frenchTranslation.materialDescription;
        }
        
        if (translation?.materialDescription) return translation.materialDescription;
        
        // Fall back to direct material property if available
        return product.material || "";
    };

    // Handle wishlist toggle
    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isInWishlist) {
            removeFromWishlist(product.id);
            setIsInWishlist(false);
            showToast("Bijou retiré des favoris", "wishlist");
        } else {
            addToWishlist(product.id);
            setIsInWishlist(true);
            showToast("Bijou ajouté aux favoris", "wishlist");
        }
    };
    
    // Get image source with fallback
    const imageSrc = product.images && product.images.length > 0 
        ? product.images[0] 
        : "/images/product-placeholder.jpg";
        
    const materialInfo = getMaterialInfo();
    
    // Check if product has variations
    const hasVariations = product.variations && product.variations.length > 0;

    return (
        <motion.div
            className="group relative product-card-mobile"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Product Image - with refined hover effect */}
            <div className="relative overflow-hidden mb-4 md:mb-6 aspect-[4/5]">
                <Link 
                    href={`/products/${product.id}`} 
                    locale={locale}
                    className="block h-full w-full"
                >
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
                        
                        {/* Luxury hover effect - subtle gold gradient overlay with description preview */}
                        <div 
                            className="absolute inset-0 bg-gradient-to-t from-brandGold/20 to-transparent opacity-0 transition-opacity duration-500 z-20 group-hover:opacity-100 flex flex-col justify-end p-3"
                        >
                            {/* Description preview on hover */}
                            {hovered && (
                                <div className="description-preview text-xs text-platinumGray bg-white/80 p-2 rounded backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    {getDescriptionPreview()}
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Product Details - Refined typography and spacing */}
            <div className="px-1 text-left">
                {/* Product Name and Favorite Button Row */}
                <div className="flex items-center justify-between mb-1.5">
                    <Link 
                        href={`/products/${product.id}`} 
                        locale={locale}
                        className="flex-1"
                    >
                        <h3 className="font-serif text-lg text-brandGold hover:text-burgundy transition-colors duration-300">
                            {getProductName()}
                        </h3>
                    </Link>
                    
                    {/* Wishlist button - Clean minimal style */}
                    <button
                        onClick={handleWishlistToggle}
                        className="p-1 transition-all duration-300 transform hover:scale-110 flex-shrink-0"
                        aria-label={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        <Heart 
                            size={18} 
                            className={`transition-all duration-300 ${
                                isInWishlist 
                                    ? "fill-burgundy stroke-burgundy" 
                                    : "fill-transparent stroke-brandGold hover:stroke-burgundy"
                            }`} 
                        />
                    </button>
                </div>
                
                {/* Material Information */}
                {materialInfo && (
                    <p className="text-xs font-light italic text-platinumGray mb-2">
                        {materialInfo}
                    </p>
                )}
                
                {/* Price - More elegant styling with "Starting at" for variations */}
                <p className="text-sm font-light text-platinumGray mb-3">
                    {hasVariations && <span className="italic mr-1">À partir de </span>}
                    <span className="font-normal text-brandGold">
                        {parseFloat(product.basePrice.toString()).toLocaleString('fr-FR', { minimumFractionDigits: 0 })} MAD
                    </span>
                </p>

                {/* View Product Link - Refined, simpler for mobile */}
                <div className="mt-2">
                    <Link 
                        href={`/products/${product.id}`}
                        locale={locale}
                        className="block md:inline-block text-sm text-platinumGray hover:text-brandGold transition-colors duration-300 border border-platinumGray/30 hover:border-brandGold/50 px-4 py-2 md:py-1.5 rounded-sm w-full md:w-auto"
                    >
                        Voir la création
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}