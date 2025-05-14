import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Eye, HeartOff, LogIn, Mail, Lock, User } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Product, ProductTranslation } from '@prisma/client';
import { redirectToAuth } from '../lib/authUtils';
import { signIn } from 'next-auth/react';

type WishlistPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    locale: string;
};

// Use the type from WishlistContext
type WishlistItemType = {
    id?: number;
    userId?: number;
    productId: number;
    product?: Product & {
        translations: ProductTranslation[];
        images?: string[];
    };
};

const WishlistPanel = ({ isOpen, onClose, locale = 'fr' }: WishlistPanelProps) => {
    const { wishlist, removeFromWishlist, isAuthenticated } = useWishlist();
    
    // Added states for authentication form
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const isLogin = authMode === 'login';
    const isSignup = authMode === 'signup';

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
    
    // Clear form when closing panel
    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setName('');
            setError('');
            setAuthMode('login');
        }
    }, [isOpen]);

    const handleRemove = (productId: number) => {
        removeFromWishlist(productId);
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Handle login with NextAuth
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password
                });

                if (result?.error) {
                    setError('Identifiants incorrects. Veuillez réessayer.');
                }
            } else if (isSignup) {
                // Handle signup with API
                if (!name) {
                    setError('Veuillez saisir votre nom');
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name })
                });

                const data = await response.json();

                if (!response.ok) {
                    // Better error handling for different scenarios
                    if (response.status === 409 || data.error?.includes('existe déjà') || data.error?.includes('already exists')) {
                        setError('Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.');
                        return;
                    }
                    throw new Error(data.error || 'Une erreur est survenue lors de la création de votre compte');
                }

                // Auto login after successful signup
                const loginResult = await signIn('credentials', {
                    redirect: false,
                    email,
                    password
                });

                if (loginResult?.error) {
                    setError('Compte créé avec succès. Veuillez vous connecter.');
                    setAuthMode('login');
                }
            }
        } catch (err: any) {
            console.error('Authentication error:', err);
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (mode: string) => {
        setAuthMode(mode);
        setError('');
    };

    const getProductName = (item: WishlistItemType) => {
        if (!item.product || !item.product.translations || item.product.translations.length === 0) {
            return 'Création Diamant Rouge';
        }

        const translation =
            item.product.translations.find(t => t.language === locale) ||
            item.product.translations.find(t => t.language === 'fr') ||
            item.product.translations[0];

        return translation ? translation.name : 'Création Diamant Rouge';
    };

    // Extract material info from product name or description
    const getMaterialInfo = (item: WishlistItemType) => {
        if (!item.product || !item.product.translations || item.product.translations.length === 0) {
            return 'Or 18 carats, pierres précieuses sélectionnées';
        }

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
                    {/* Refined backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.90 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-0 bg-richEbony z-40"
                        onClick={onClose}
                    />

                    {/* Sophisticated panel */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full sm:w-[460px] md:w-[500px] bg-white z-50 shadow-luxury flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 100, damping: 25, mass: 1 }}
                    >
                        {/* Refined header */}
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

                        {/* Refined content with horizontal layout */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide pt-8 pb-6 px-10">
                            {!isAuthenticated ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    className="flex flex-col items-center justify-center h-full text-center py-12"
                                >
                                    <div className="w-16 h-16 bg-brandIvory/40 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <LogIn size={24} className="text-brandGold/70" />
                                    </div>
                                    
                                    <h4 className="font-serif text-xl text-richEbony mb-4">
                                        {isLogin ? 'Connectez-vous à Votre Compte' : 'Créez Votre Compte'}
                                    </h4>
                                    
                                    <p className="text-sm text-platinumGray max-w-xs leading-relaxed mb-8">
                                        {isLogin ? 
                                            'Accédez à votre collection privée pour retrouver vos créations favorites.' : 
                                            'Rejoignez Diamant Rouge pour sauvegarder vos créations préférées.'}
                                    </p>
                                    
                                    {error && (
                                        <div className="bg-burgundy/10 text-burgundy text-sm py-3 px-4 rounded mb-6 w-full max-w-sm">
                                            {error}
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handleSubmit} className="w-full max-w-sm">
                                        {/* Name field - only for signup */}
                                        {isSignup && (
                                            <div className="mb-4">
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-platinumGray">
                                                        <User size={18} />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Votre nom"
                                                        className="w-full pl-10 pr-4 py-3 border border-brandGold/30 focus:border-brandGold focus:outline-none bg-white"
                                                        required={isSignup}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    
                                        {/* Email field */}
                                        <div className="mb-4">
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-platinumGray">
                                                    <Mail size={18} />
                                                </span>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Adresse email"
                                                    className="w-full pl-10 pr-4 py-3 border border-brandGold/30 focus:border-brandGold focus:outline-none bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Password field */}
                                        <div className="mb-6">
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-platinumGray">
                                                    <Lock size={18} />
                                                </span>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Mot de passe"
                                                    className="w-full pl-10 pr-4 py-3 border border-brandGold/30 focus:border-brandGold focus:outline-none bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Submit button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full py-3.5 bg-richEbony text-white hover:bg-burgundy transition-all duration-300 tracking-wide ${loading ? 'opacity-70 cursor-wait' : ''}`}
                                        >
                                            {loading ? 'Traitement en cours...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
                                        </button>
                                    </form>
                                    
                                    {/* Switch between login and signup */}
                                    <div className="mt-6 text-sm text-platinumGray">
                                        {isLogin ? (
                                            <p>
                                                Nouveau client ?{' '}
                                                <button
                                                    onClick={() => switchMode('signup')}
                                                    className="text-brandGold underline hover:text-richEbony transition-colors"
                                                >
                                                    Créer un compte
                                                </button>
                                            </p>
                                        ) : (
                                            <p>
                                                Déjà client ?{' '}
                                                <button
                                                    onClick={() => switchMode('login')}
                                                    className="text-brandGold underline hover:text-richEbony transition-colors"
                                                >
                                                    Se connecter
                                                </button>
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Forgot password link - only for login */}
                                    {isLogin && (
                                        <div className="mt-4">
                                            <Link href="/auth?mode=forgotPassword" className="text-xs text-platinumGray hover:text-brandGold transition-colors">
                                                Mot de passe oublié ?
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            ) : wishlist.length > 0 ? (
                                <div className="space-y-8">
                                    {wishlist.map((item: WishlistItemType) => {
                                        const imageSrc = item.product && item.product.images && item.product.images.length > 0
                                            ? item.product.images[0]
                                            : '/images/placeholder.jpg';

                                        return (
                                            <motion.div
                                                key={item.productId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="group pb-8 border-b border-brandGold/10 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex gap-6">
                                                    {/* Image prominently positioned left */}
                                                    <Link href={`/products/${item.productId}`} onClick={onClose} className="block flex-shrink-0">
                                                        <div className="w-32 h-40 bg-brandIvory/30 overflow-hidden relative shadow-sm">
                                                            <motion.div 
                                                                className="h-full w-full"
                                                                whileHover={{ scale: 1.03 }}
                                                                transition={{ duration: 0.7, ease: "easeOut" }}
                                                            >
                                                                <Image
                                                                    src={imageSrc}
                                                                    alt={getProductName(item)}
                                                                    className="object-cover"
                                                                    fill
                                                                    sizes="(max-width: 768px) 128px, 128px"
                                                                    priority
                                                                />
                                                            </motion.div>
                                                        </div>
                                                    </Link>

                                                    {/* Content elegantly positioned right */}
                                                    <div className="flex flex-col flex-1 justify-between">
                                                        <div>
                                                            <Link href={`/products/${item.productId}`} onClick={onClose}>
                                                                <h4 className="font-serif text-richEbony hover:text-brandGold transition-colors duration-300 text-lg leading-tight">
                                                                    {getProductName(item)}
                                                                </h4>
                                                            </Link>
                                                            
                                                            <p className="text-platinumGray text-sm italic font-light mt-2 leading-relaxed">
                                                                {getMaterialInfo(item)}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex justify-between items-center mt-4">
                                                            <Link href={`/products/${item.productId}`} onClick={onClose}>
                                                                <button className="flex items-center justify-center text-xs px-6 py-2.5 bg-white text-richEbony border border-brandGold/30 hover:border-brandGold hover:bg-brandGold/5 transition-all duration-300 tracking-wide">
                                                                    <Eye size={14} className="mr-2 text-brandGold" />
                                                                    Voir la création
                                                                </button>
                                                            </Link>
                                                            
                                                            {/* Refined minimalist removal button */}
                                                            <button
                                                                onClick={() => handleRemove(item.productId)}
                                                                className="text-xs px-3 py-1 text-platinumGray hover:text-burgundy transition-all duration-300 tracking-wide opacity-60 hover:opacity-100"
                                                                aria-label="Retirer de la collection"
                                                            >
                                                                Retirer
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
                                    <div className="w-20 h-20 bg-brandIvory/40 rounded-full flex items-center justify-center mb-6 shadow-sm">
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

                        {/* Elegant footer */}
                        {isAuthenticated && wishlist.length > 0 && (
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