import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Eye, Trash2, HeartOff } from 'lucide-react';
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

const WishlistPanel = ({ isOpen, onClose, locale = 'fr' }: WishlistPanelProps) => {
    const { wishlist, removeFromWishlist } = useWishlist();

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

    const getProductName = (item: WishlistItemType) => {
        const translation =
            item.product.translations.find(t => t.language === locale) ||
            item.product.translations.find(t => t.language === 'fr') ||
            item.product.translations[0];

        return translation ? translation.name : 'Création Diamant Rouge';
    };

    // Extract material info from product name or description
    const getMaterialInfo = (item: WishlistItemType) => {
        const translation =
            item.product.translations.find(t => t.language === locale) ||
            item.product.translations.find(t => t.language === 'fr') ||
            item.product.translations[0];
        
        // Extract material info from description or use default
        if (translation && translation.description) {
            // Try to extract material info from first sentence of description
            const firstSentence = translation.description.split('.')[0];
            if (firstSentence.toLowerCase().includes('or') || 
                firstSentence.toLowerCase().includes('diamant') ||
                firstSentence.toLowerCase().includes('platine')) {
                return firstSentence;
            }
        }
        
        // Default elegant materials text based on product name patterns
        const name = translation?.name.toLowerCase() || '';
        if (name.includes('diamant')) {
            return 'Or blanc 18 carats, diamants taille brillant';
        } else if (name.includes('rubis')) {
            return 'Or jaune 18 carats, rubis de Birmanie';
        } else if (name.includes('saphir')) {
            return 'Or blanc 18 carats, saphirs bleus du Cachemire';
        } else if (name.includes('émeraude')) {
            return 'Or jaune 18 carats, émeraudes de Colombie';
        }
        
        return 'Or 18 carats, pierres précieuses sélectionnées';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Elegant solid backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.85 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 bg-richEbony z-40"
                        onClick={onClose}
                    />

                    {/* Refined wishlist panel */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full sm:w-[460px] md:w-[500px] bg-white z-50 shadow-luxury flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 100, damping: 25, mass: 1 }}
                    >
                        {/* Elevated header */}
                        <div className="py-8 px-10 border-b border-brandGold/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif text-2xl text-richEbony tracking-wide">
                                        Collection Privée
                                    </h3>
                                    <p className="text-xs tracking-wider text-platinumGray/80 mt-1 font-light">
                                        CRÉATIONS SÉLECTIONNÉES
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-richEbony/5 transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X size={20} className="text-richEbony" />
                                </button>
                            </div>
                        </div>

                        {/* Refined content presentation emphasizing images */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide pt-8 pb-6 px-10">
                            {wishlist.length > 0 ? (
                                <div className="space-y-10">
                                    {wishlist.map((item: WishlistItemType) => {
                                        const imageSrc = item.product.images && item.product.images.length > 0
                                            ? item.product.images[0]
                                            : '/images/placeholder.jpg';

                                        return (
                                            <motion.div
                                                key={item.productId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="group"
                                            >
                                                <div className="space-y-5">
                                                    {/* Prominent image presentation */}
                                                    <div className="w-full h-60 bg-white overflow-hidden relative shadow-sm">
                                                        <Link href={`/products/${item.productId}`}>
                                                            <motion.div 
                                                                className="h-full w-full"
                                                                whileHover={{ scale: 1.02 }}
                                                                transition={{ duration: 0.7, ease: "easeOut" }}
                                                            >
                                                                <Image
                                                                    src={imageSrc}
                                                                    alt={getProductName(item)}
                                                                    className="object-cover"
                                                                    fill
                                                                    sizes="(max-width: 768px) 100vw, 500px"
                                                                    priority
                                                                />
                                                            </motion.div>
                                                        </Link>
                                                    </div>

                                                    {/* Product details */}
                                                    <div className="space-y-2 px-1">
                                                        <Link href={`/product/${item.productId}`}>
                                                            <h4 className="font-serif text-richEbony hover:text-brandGold transition-colors duration-300 text-lg">
                                                                {getProductName(item)}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-platinumGray text-sm italic font-light">
                                                            {getMaterialInfo(item)}
                                                        </p>
                                                        
                                                        <div className="flex justify-between items-center pt-3 group-hover:opacity-100 transition-opacity">
                                                            <Link href={`/product/${item.productId}`}>
                                                                <button className="flex items-center justify-center text-xs px-6 py-2.5 bg-white text-richEbony border border-brandGold/30 hover:border-brandGold hover:bg-brandGold/5 transition-all duration-300 tracking-wide">
                                                                    <Eye size={14} className="mr-2 text-brandGold" />
                                                                    Voir la création
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleRemove(item.productId)}
                                                                className="flex items-center justify-center text-xs p-2 text-platinumGray hover:text-burgundy transition-all duration-300 opacity-40 hover:opacity-100"
                                                                aria-label="Retirer de la collection"
                                                            >
                                                                <Trash2 size={14} />
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
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <HeartOff size={26} className="text-platinumGray/70" />
                                    </div>
                                    <h4 className="font-serif text-xl text-richEbony mb-3">
                                        Votre collection privée est vide
                                    </h4>
                                    <p className="text-sm text-platinumGray max-w-xs leading-relaxed">
                                        Explorez nos œuvres d'exception et sélectionnez les créations qui éveilleront votre sensibilité.
                                    </p>
                                    <Link href="/collections" className="mt-8">
                                        <button className="px-8 py-3.5 bg-richEbony text-white hover:bg-burgundy transition-all duration-300 tracking-wide">
                                            Découvrir la collection
                                        </button>
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Refined minimalist footer */}
                        {wishlist.length > 0 && (
                            <div className="border-t border-brandGold/10 py-8 px-10 bg-white">
                                <Link href="/collections" className="block">
                                    <button className="w-full py-4 bg-richEbony text-white hover:bg-burgundy transition-all duration-300 tracking-wide text-sm">
                                        Découvrir d'autres créations d'exception
                                    </button>
                                </Link>
                                <p className="text-center text-xs text-platinumGray mt-5 font-light tracking-wide">
                                    Chaque création est accompagnée de son certificat d'authenticité
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