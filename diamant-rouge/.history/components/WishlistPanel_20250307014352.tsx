import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, HeartOff } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Product, ProductTranslation } from '@prisma/client';

type WishlistPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
};

type WishlistItemType = {
    id: number;
    userId: number;
    productId: number;
    product: Product & {
        translations: ProductTranslation[];
        images: string[];
    };
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD',
        maximumFractionDigits: 0,
    }).format(price);
};

const WishlistPanel = ({ isOpen, onClose, locale = 'fr' }: WishlistPanelProps) => {
    const { wishlist, removeFromWishlist, fetchWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        if (isOpen) {
            // Refresh wishlist data when panel opens
            fetchWishlist();

            // Prevent body scrolling when panel is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, fetchWishlist]);

    // Handle item removal from wishlist
    const handleRemove = (productId: number) => {
        removeFromWishlist(productId);
    };

    // Handle adding item to cart
    const handleAddToCart = (item: WishlistItemType) => {
        addToCart({
            productId: item.productId,
            product: item.product,
            quantity: 1
        });
    };

    // Get product name based on locale
    const getProductName = (item: WishlistItemType) => {
        const translation =
            item.product.translations.find(t => t.language === locale) ||
            item.product.translations.find(t => t.language === 'fr') ||
            item.product.translations[0];

        return translation ? translation.name : 'Bijou Diamant Rouge';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-richEbony z-40"
                        onClick={onClose}
                    />

                    {/* Wishlist panel */}
                    className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] lg:w-[480px] bg-white z-50 shadow-luxury flex flex-col"
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ type: 'tween', duration: 0.3 }}
>
                        {/* Header */}
                        <div className="border-b border-brandGold/10 p-5 bg-gradient-to-r from-brandIvory to-white flex items-center justify-between">
                            <div className="flex items-center">
                                <h3 className="font-serif text-xl text-richEbony">Mes Favoris</h3>
                                {wishlist.length > 0 && (
                                    <span className="ml-2 bg-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {wishlist.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-richEbony/5 transition-colors"
                                aria-label="Fermer"
                            >
                                <X size={20} className="text-richEbony" />
                            </button>
                        </div>


                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                            {wishlist.length > 0 ? (
                                wishlist.map((item: WishlistItemType) => {
                                    // Get primary image
                                    const imageSrc = item.product.images && item.product.images.length > 0
                                        ? item.product.images[0]
                                        : '/images/placeholder.jpg';

                                    // Get product price
                                    const price = parseFloat(item.product.basePrice.toString());

                                    return (
                                        <div
                                            key={item.productId}
                                            className="flex gap-4 pb-6 border-b border-platinumGray/10"
                                        >
                                            {/* Product image */}
                                            <div className="w-20 h-20 bg-brandIvory rounded-md overflow-hidden relative flex-shrink-0">
                                                <Link href={`/product/${item.productId}`}>
                                                    <div className="h-full">
                                                        <Image
                                                            src={imageSrc}
                                                            alt={getProductName(item)}
                                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                                            fill
                                                        />
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Product info */}
                                            <div className="flex-1">
                                                <Link href={`/product/${item.productId}`}>
                                                    <h4 className="font-medium text-richEbony hover:text-brandGold transition-colors line-clamp-1">
                                                        {getProductName(item)}
                                                    </h4>
                                                </Link>
                                                <p className="text-sm text-brandGold mt-1">{formatPrice(price)}</p>

                                                {/* Action buttons */}
                                                <div className="flex mt-3 gap-2">
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        className="flex items-center justify-center text-xs px-4 py-1.5 bg-richEbony/5 hover:bg-richEbony/10 text-richEbony rounded-sm transition-colors"
                                                    >
                                                        <ShoppingBag size={14} className="mr-1" />
                                                        Ajouter au panier
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(item.productId)}
                                                        className="flex items-center justify-center text-xs px-2 py-1.5 text-burgundy hover:bg-burgundy/5 rounded-sm transition-colors"
                                                        aria-label="Supprimer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <div className="w-16 h-16 bg-richEbony/5 rounded-full flex items-center justify-center mb-4">
                                        <HeartOff size={24} className="text-platinumGray" />
                                    </div>
                                    <h4 className="font-serif text-richEbony mb-2">Votre liste de favoris est vide</h4>
                                    <p className="text-sm text-platinumGray max-w-xs">
                                        Explorez nos collections et ajoutez vos pièces préférées à votre liste de favoris
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer with CTA */}
                        {wishlist.length > 0 && (
                            <div className="border-t border-platinumGray/10 p-5 bg-white">
                                <Link href="/collections">
                                    <button className="w-full py-3 bg-brandGold text-richEbony hover:bg-burgundy hover:text-white transition-colors duration-300 font-medium">
                                        Découvrir Plus de Créations
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WishlistPanel;