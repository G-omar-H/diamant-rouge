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
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleRemove = (productId: number) => {
        removeFromWishlist(productId);
    };

    const handleAddToCart = (item: WishlistItemType) => {
        addToCart({
            productId: item.productId,
            product: item.product,
            quantity: 1
        });
    };

    const getProductName = (item: WishlistItemType) => {
        const translation =
            item.product.translations.find(t => t.language === locale) ||
            item.product.translations.find(t => t.language === 'fr') ||
            item.product.translations[0];

        return translation ? translation.name : 'Création Diamant Rouge';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Refined backdrop with subtle gradient */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.65 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-0 bg-gradient-to-br from-richEbony to-burgundy/90 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Elegant wishlist panel */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] lg:w-[480px] bg-gradient-to-br from-white to-brandIvory/60 z-50 shadow-luxury flex flex-col"
                        initial={{ x: '100%', opacity: 0.9 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.9 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    >
                        {/* Refined header with luxury positioning */}
                        <div className="py-7 px-8 border-b border-brandGold/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif text-2xl text-richEbony tracking-wide">
                                        Collection Personnelle
                                    </h3>
                                    <p className="text-xs tracking-wider text-platinumGray mt-1 font-light">
                                        VOS PIÈCES SÉLECTIONNÉES AVEC SOIN
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/50 transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X size={20} className="text-richEbony" />
                                </button>
                            </div>
                            {wishlist.length > 0 && (
                                <p className="text-sm text-platinumGray/80 mt-3 italic font-light">
                                    {wishlist.length} {wishlist.length === 1 ? 'pièce' : 'pièces'} exquise{wishlist.length > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {/* Elegant content presentation */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide py-6 px-8">
                            {wishlist.length > 0 ? (
                                <div className="space-y-8">
                                    {wishlist.map((item: WishlistItemType) => {
                                        const imageSrc = item.product.images && item.product.images.length > 0
                                            ? item.product.images[0]
                                            : '/images/placeholder.jpg';

                                        const price = parseFloat(item.product.basePrice.toString());

                                        return (
                                            <motion.div
                                                key={item.productId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="group"
                                            >
                                                <div className="flex gap-5 pb-8 border-b border-brandGold/10">
                                                    {/* Refined product image presentation */}
                                                    <div className="w-24 h-24 bg-gradient-to-br from-white to-brandIvory rounded-md overflow-hidden relative flex-shrink-0 shadow-sm">
                                                        <Link href={`/product/${item.productId}`}>
                                                            <motion.div 
                                                                className="h-full"
                                                                whileHover={{ scale: 1.03 }}
                                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                            >
                                                                <Image
                                                                    src={imageSrc}
                                                                    alt={getProductName(item)}
                                                                    className="object-cover"
                                                                    fill
                                                                    sizes="(max-width: 768px) 96px, 96px"
                                                                />
                                                            </motion.div>
                                                        </Link>
                                                    </div>

                                                    {/* Elegant product information */}
                                                    <div className="flex-1">
                                                        <Link href={`/product/${item.productId}`}>
                                                            <h4 className="font-serif text-richEbony hover:text-brandGold transition-colors duration-300 line-clamp-1 text-base">
                                                                {getProductName(item)}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-brandGold font-medium mt-1.5">{formatPrice(price)}</p>
                                                        
                                                        <div className="flex mt-4 gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleAddToCart(item)}
                                                                className="flex items-center justify-center text-xs px-5 py-2 bg-brandGold/10 hover:bg-brandGold/20 text-richEbony border border-brandGold/30 hover:border-brandGold transition-colors duration-300 tracking-wide"
                                                            >
                                                                <ShoppingBag size={14} className="mr-2 text-brandGold" />
                                                                Acquérir
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemove(item.productId)}
                                                                className="flex items-center justify-center text-xs px-3 py-2 text-platinumGray hover:text-burgundy border border-transparent hover:border-burgundy/20 transition-all duration-300"
                                                                aria-label="Supprimer"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    className="flex flex-col items-center justify-center h-full text-center py-16"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-white to-brandIvory rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <HeartOff size={26} className="text-platinumGray/70" />
                                    </div>
                                    <h4 className="font-serif text-xl text-richEbony mb-3">Votre collection attend d'être créée</h4>
                                    <p className="text-sm text-platinumGray/80 max-w-xs leading-relaxed">
                                        Explorez notre univers d'exception et sélectionnez les créations qui reflètent votre raffinement et personnalité.
                                    </p>
                                    <Link href="/collections" className="mt-8">
                                        <button className="px-8 py-3 bg-gradient-to-r from-brandGold to-brandGold/90 text-white hover:from-burgundy hover:to-burgundy/90 transition-all duration-300 shadow-sm tracking-wide text-sm">
                                            Découvrir nos collections
                                        </button>
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Refined footer with luxury CTAs */}
                        {wishlist.length > 0 && (
                            <div className="border-t border-brandGold/20 py-8 px-8 bg-gradient-to-br from-white to-brandIvory/30">
                                <Link href="/collections">
                                    <button className="w-full py-3.5 bg-gradient-to-r from-brandGold to-brandGold/90 text-white hover:from-burgundy hover:to-burgundy/90 transition-all duration-300 shadow-md tracking-wide">
                                        Enrichir Ma Collection
                                    </button>
                                </Link>
                                <p className="text-center text-xs text-platinumGray/80 mt-4 italic font-light tracking-wide">
                                    Créations exclusives de haute joaillerie
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WishlistPanel;