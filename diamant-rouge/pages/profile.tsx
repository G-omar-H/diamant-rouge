import { prisma } from "../lib/prisma";
import { getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Package, ChevronDown, User, MapPin, Phone, Clock, CreditCard, Shield, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OrderPlus = {
    id: number;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    createdAt: string; // ISO string
    shippingAddress: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    orderItems: Array<{
        id: number;
        quantity: number;
        price: number;
        product: {
            id: number;
            sku: string;
            images: string[];
            translations: Array<{
                language: string;
                name: string;
            }>;
        };
    }>;
};

type ProfilePageProps = {
    orders: OrderPlus[];
    locale: string;

    // User profile data
    name: string | null;
    email: string;

    // Address fields
    address: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    phoneNumber: string | null;

    // Member status
    memberStatus: string;
    
    // Jewelry preferences
    preferredMetals: string[];
    preferredGemstones: string[];
    ringSize: string | null;
    braceletSize: string | null;
    necklaceLength: string | null;
};

export default function ProfilePage({
    orders,
    locale,
    name: initialName,
    email,
    address: initialAddress,
    city: initialCity,
    postalCode: initialPostal,
    country: initialCountry,
    phoneNumber: initialPhone,
    memberStatus,
    preferredMetals: initialPreferredMetals,
    preferredGemstones: initialPreferredGemstones,
    ringSize: initialRingSize,
    braceletSize: initialBraceletSize,
    necklaceLength: initialNecklaceLength,
}: ProfilePageProps) {
    // Debug: Log order statuses in client component
    console.log("🔍 Order statuses in client component:", orders.map(order => ({
        id: order.id,
        status: order.status,
        upperStatus: order.status.toUpperCase()
    })));
    
    // Use the locale provided by Next.js without forcing French as default
    const effectiveLocale = locale;
    
    // Personal information state
    const [name, setName] = useState(initialName || "");
    const [activeSection, setActiveSection] = useState("personal");

    // Address & phone state
    const [address, setAddress] = useState(initialAddress || "");
    const [city, setCity] = useState(initialCity || "");
    const [postalCode, setPostalCode] = useState(initialPostal || "");
    const [country, setCountry] = useState(initialCountry || "");
    const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");

    // Jewelry preferences
    const [ringSize, setRingSize] = useState(initialRingSize || "");
    const [braceletSize, setBraceletSize] = useState(initialBraceletSize || "");
    const [necklaceLength, setNecklaceLength] = useState(initialNecklaceLength || "");
    const [preferredMetals, setPreferredMetals] = useState<string[]>(initialPreferredMetals || []);
    const [preferredGemstones, setPreferredGemstones] = useState<string[]>(initialPreferredGemstones || []);

    // Form status
    const [updateMsg, setUpdateMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format date beautifully for orders
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(effectiveLocale === 'fr' ? 'fr-FR' : 'en-US', options);
    };

    // Format currency according to locale
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(effectiveLocale === 'fr' ? 'fr-MA' : 'en-US', {
            style: 'currency',
            currency: 'MAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Handle saving profile info
    async function handleSavePersonal(e: React.FormEvent) {
        e.preventDefault();
        setUpdateMsg("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                setUpdateMsg(effectiveLocale === 'fr' 
                    ? "Informations personnelles mises à jour avec succès" 
                    : "Personal information updated successfully");
            } else {
                setUpdateMsg(effectiveLocale === 'fr'
                    ? "Erreur lors de la mise à jour des informations"
                    : "Error updating information");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            setUpdateMsg(effectiveLocale === 'fr'
                ? "Une erreur est survenue lors de la mise à jour"
                : "An error occurred during the update");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Handle saving address & phone
    async function handleSaveAddress(e: React.FormEvent) {
        e.preventDefault();
        setUpdateMsg("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/user/update-address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, city, postalCode, country, phoneNumber }),
            });

            if (res.ok) {
                setUpdateMsg(effectiveLocale === 'fr'
                    ? "Adresse de livraison mise à jour avec succès"
                    : "Shipping address updated successfully");
            } else {
                setUpdateMsg(effectiveLocale === 'fr'
                    ? "Erreur lors de la mise à jour de l'adresse"
                    : "Error updating address");
            }
        } catch (error) {
            console.error("Update address/phone error:", error);
            setUpdateMsg(effectiveLocale === 'fr'
                ? "Une erreur est survenue lors de la mise à jour"
                : "An error occurred during the update");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Handle saving jewelry preferences (real implementation)
    async function handleSavePreferences(e: React.FormEvent) {
        e.preventDefault();
        setUpdateMsg("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/user/update-preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    preferredMetals,
                    preferredGemstones,
                    ringSize,
                    braceletSize,
                    necklaceLength
                }),
            });

            if (res.ok) {
                setUpdateMsg(effectiveLocale === 'fr'
                    ? "Préférences mises à jour avec succès"
                    : "Preferences updated successfully");
            } else {
                const data = await res.json();
                setUpdateMsg(data.error || (effectiveLocale === 'fr'
                    ? "Erreur lors de la mise à jour des préférences"
                    : "Error updating preferences"));
            }
        } catch (error) {
            console.error("Update preferences error:", error);
            setUpdateMsg(effectiveLocale === 'fr'
                ? "Une erreur est survenue lors de la mise à jour"
                : "An error occurred during the update");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Add benefits section as an option
    const handleViewBenefits = () => {
        setActiveSection("benefits");
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Enhanced elegant header section with member status badge */}
            <section className="profile-hero hero-section relative bg-gradient-to-r from-richEbony to-burgundy px-6 py-16 md:py-20 md:px-10 overflow-hidden">
                <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url("/images/diamond-pattern.png")',
                        backgroundSize: '300px',
                        backgroundRepeat: 'repeat',
                        opacity: 0.07
                    }}></div>
                </div>
                
                {/* Golden accent at top */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
                
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                    <div className="relative">
                        <h1 className="font-serif text-4xl md:text-5xl text-white tracking-wide mb-4">
                            {name ? 
                                effectiveLocale === 'fr' 
                                    ? `Bienvenue, ${name.split(' ')[0]}` 
                                    : `Welcome, ${name.split(' ')[0]}`
                                : effectiveLocale === 'fr'
                                    ? 'Votre Espace Personnel'
                                    : 'Your Personal Space'
                            }
                    </h1>
                        <div className="h-px w-32 bg-brandGold/80 mb-4"></div>
                        <p className="text-brandGold/90 font-light tracking-wider text-lg">
                            {effectiveLocale === 'fr' ?
                            'Gérez vos préférences et vos commandes' :
                            'Manage your preferences and orders'}
                    </p>
                        
                        {/* Subtle decoration */}
                        <div className="absolute -right-12 -bottom-12 w-24 h-24 rounded-full border border-brandGold/20 opacity-30"></div>
                    </div>
                    
                    {/* Member Status Badge - Enhanced */}
                    <div className="mt-8 md:mt-0">
                        <div className={`inline-flex items-center px-6 py-3.5 rounded-sm border ${
                            memberStatus === 'vip' ? 'bg-brandGold/90 text-richEbony border-brandGold' :
                            memberStatus === 'platinum' ? 'bg-platinumGray/80 text-white border-platinumGray/80' :
                            memberStatus === 'gold' ? 'bg-amber-300/80 text-richEbony border-amber-300/80' :
                            'bg-white/10 text-white border-white/20'
                        } transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="font-medium tracking-widest text-sm uppercase letter-spacing-wider">
                                {memberStatus === 'vip' && (effectiveLocale === 'fr' ? 'Client VIP' : 'VIP Client')}
                                {memberStatus === 'platinum' && (effectiveLocale === 'fr' ? 'Client Platine' : 'Platinum Client')}
                                {memberStatus === 'gold' && (effectiveLocale === 'fr' ? 'Client Or' : 'Gold Client')}
                                {memberStatus === 'regular' && (effectiveLocale === 'fr' ? 'Client Régulier' : 'Regular Client')}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content with improved spacing and luxury aesthetic */}
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 md:px-10">
                <div className="grid md:grid-cols-12 gap-12 md:gap-16">
                    {/* Side Navigation - Enhanced */}
                    <nav className="md:col-span-3">
                        <div className="sticky" style={{ top: 'calc(var(--current-header-height) + 2rem)' }}>
                            <h2 className="font-serif text-richEbony text-xl mb-3 flex items-center">
                                <span className="w-8 h-0.5 bg-brandGold mr-3"></span>
                                {effectiveLocale === 'fr' ? 'Votre Compte' : 'Your Account'}
                            </h2>
                            <div className="w-16 h-px bg-brandGold/30 mb-8"></div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setActiveSection("personal")}
                                    className={`flex items-center w-full px-5 py-3.5 text-left transition-all rounded-sm ${activeSection === "personal"
                                        ? "bg-gradient-to-r from-brandGold/10 to-brandGold/5 border-l-2 border-brandGold text-richEbony font-medium"
                                        : "text-platinumGray hover:bg-brandGold/5 hover:text-richEbony hover:border-l-2 hover:border-brandGold/30"
                                        }`}
                                >
                                    <User size={18} className={`mr-3 ${activeSection === "personal" ? "text-brandGold" : "text-platinumGray group-hover:text-brandGold/70"}`} />
                                    <span className="text-sm tracking-wide">
                                        {effectiveLocale === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveSection("address")}
                                    className={`flex items-center w-full px-5 py-3.5 text-left transition-all rounded-sm ${activeSection === "address"
                                        ? "bg-gradient-to-r from-brandGold/10 to-brandGold/5 border-l-2 border-brandGold text-richEbony font-medium"
                                        : "text-platinumGray hover:bg-brandGold/5 hover:text-richEbony hover:border-l-2 hover:border-brandGold/30"
                                        }`}
                                >
                                    <MapPin size={18} className={`mr-3 ${activeSection === "address" ? "text-brandGold" : "text-platinumGray group-hover:text-brandGold/70"}`} />
                                    <span className="text-sm tracking-wide">
                                        {effectiveLocale === 'fr' ? 'Adresse de Livraison' : 'Shipping Address'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveSection("preferences")}
                                    className={`flex items-center w-full px-5 py-3.5 text-left transition-all rounded-sm ${activeSection === "preferences"
                                        ? "bg-gradient-to-r from-brandGold/10 to-brandGold/5 border-l-2 border-brandGold text-richEbony font-medium"
                                        : "text-platinumGray hover:bg-brandGold/5 hover:text-richEbony hover:border-l-2 hover:border-brandGold/30"
                                        }`}
                                >
                                    <CreditCard size={18} className={`mr-3 ${activeSection === "preferences" ? "text-brandGold" : "text-platinumGray group-hover:text-brandGold/70"}`} />
                                    <span className="text-sm tracking-wide">
                                        {effectiveLocale === 'fr' ? 'Préférences Bijoux' : 'Jewelry Preferences'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveSection("orders")}
                                    className={`flex items-center w-full px-5 py-3.5 text-left transition-all rounded-sm ${activeSection === "orders"
                                        ? "bg-gradient-to-r from-brandGold/10 to-brandGold/5 border-l-2 border-brandGold text-richEbony font-medium"
                                        : "text-platinumGray hover:bg-brandGold/5 hover:text-richEbony hover:border-l-2 hover:border-brandGold/30"
                                        }`}
                                >
                                    <Package size={18} className={`mr-3 ${activeSection === "orders" ? "text-brandGold" : "text-platinumGray group-hover:text-brandGold/70"}`} />
                                    <span className="text-sm tracking-wide">
                                        {effectiveLocale === 'fr' ? 'Historique des Commandes' : 'Order History'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveSection("benefits")}
                                    className={`flex items-center w-full px-5 py-3.5 text-left transition-all rounded-sm ${activeSection === "benefits"
                                        ? "bg-gradient-to-r from-brandGold/10 to-brandGold/5 border-l-2 border-brandGold text-richEbony font-medium"
                                        : "text-platinumGray hover:bg-brandGold/5 hover:text-richEbony hover:border-l-2 hover:border-brandGold/30"
                                        }`}
                                >
                                    <Shield size={18} className={`mr-3 ${activeSection === "benefits" ? "text-brandGold" : "text-platinumGray group-hover:text-brandGold/70"}`} />
                                    <span className="text-sm tracking-wide">
                                        {effectiveLocale === 'fr' ? 'Avantages Membre' : 'Member Benefits'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content - with enhanced spacing and luxury details */}
                    <div className="md:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeSection === "personal" && (
                                <motion.div
                                    key="personal"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <div className="flex items-center justify-between mb-12">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {effectiveLocale === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSavePersonal} className="space-y-8">
                                        <div className="bg-white border border-brandGold/10 p-8 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                                            {/* Name field */}
                                            <div className="mb-8">
                                                <label className="block text-sm text-richEbony mb-3 font-medium">
                                                    {effectiveLocale === 'fr' ? 'Nom Complet' : 'Full Name'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white hover:border-brandGold/30"
                                                    placeholder={effectiveLocale === 'fr' ? 'Votre nom' : 'Your name'}
                                                />
                                            </div>

                                            {/* Email field (read-only) */}
                                            <div>
                                                <label className="block text-sm text-richEbony mb-3 font-medium">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    readOnly
                                                    className="w-full px-5 py-3.5 border border-brandGold/20 bg-brandIvory/30 text-platinumGray rounded-sm"
                                                />
                                                <p className="mt-3 text-xs text-platinumGray italic">
                                                    {effectiveLocale === 'fr'
                                                        ? 'Pour modifier votre adresse email, veuillez contacter notre service client'
                                                        : 'To change your email, please contact our customer service'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-8">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`px-8 py-3.5 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide shadow-subtle hover:shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                                    } group relative overflow-hidden`}
                                            >
                                                <span className="relative z-10">{effectiveLocale === 'fr' ? 'Enregistrer les Modifications' : 'Save Changes'}</span>
                                                <span className="absolute inset-0 bg-brandGold/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
                                            </button>

                                            {updateMsg && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-brandGold flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {updateMsg}
                                                </motion.p>
                                            )}
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeSection === "address" && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <div className="flex items-center justify-between mb-12">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {effectiveLocale === 'fr' ? 'Adresse de Livraison' : 'Shipping Address'}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSaveAddress} className="space-y-8">
                                        <div className="bg-white border border-brandGold/10 p-8 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Address field */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm text-richEbony mb-3 font-medium">
                                                        {effectiveLocale === 'fr' ? 'Adresse' : 'Address'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={address || ''}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={effectiveLocale === 'fr' ? 'Votre adresse' : 'Your address'}
                                                    />
                                                </div>

                                                {/* City field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-3 font-medium">
                                                        {effectiveLocale === 'fr' ? 'Ville' : 'City'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={city || ''}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={effectiveLocale === 'fr' ? 'Votre ville' : 'Your city'}
                                                    />
                                                </div>

                                                {/* Postal Code field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-3 font-medium">
                                                        {effectiveLocale === 'fr' ? 'Code Postal' : 'Postal Code'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={postalCode || ''}
                                                        onChange={(e) => setPostalCode(e.target.value)}
                                                        className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={effectiveLocale === 'fr' ? 'Code postal' : 'Postal code'}
                                                    />
                                                </div>

                                                {/* Country field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-3 font-medium">
                                                        {effectiveLocale === 'fr' ? 'Pays' : 'Country'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={country || ''}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                        className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={effectiveLocale === 'fr' ? 'Votre pays' : 'Your country'}
                                                    />
                                                </div>

                                                {/* Phone field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-3 font-medium">
                                                        {effectiveLocale === 'fr' ? 'Téléphone' : 'Phone Number'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={phoneNumber || ''}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={effectiveLocale === 'fr' ? 'Numéro de téléphone' : 'Phone number'}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-8">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`px-8 py-3.5 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide shadow-subtle hover:shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                {effectiveLocale === 'fr' ? 'Enregistrer les Modifications' : 'Save Changes'}
                                            </button>

                                            {updateMsg && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm text-brandGold flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {updateMsg}
                                                </motion.p>
                                            )}
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeSection === "preferences" && (
                                <motion.div
                                    key="preferences"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <div className="flex items-center justify-between mb-12">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {effectiveLocale === 'fr' ? 'Préférences Bijoux' : 'Jewelry Preferences'}
                                        </h2>
                                    </div>

                                    <form className="space-y-8">
                                        {/* Jewelry Sizes Card */}
                                        <div className="bg-white border border-brandGold/10 p-8 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                                            <h3 className="font-serif text-lg text-richEbony mb-4">
                                                {effectiveLocale === 'fr' ? 'Vos Mensurations' : 'Your Sizes'}
                                            </h3>
                                            
                                            <p className="text-platinumGray italic text-sm mb-6">
                                                {effectiveLocale === 'fr'
                                                    ? 'Enregistrez vos mesures pour faciliter vos prochaines commandes. Toutes nos créations peuvent être ajustées à vos mesures précises.'
                                                    : 'Save your measurements to facilitate your future orders. All our creations can be adjusted to your exact measurements.'}
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Ring Size */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm text-richEbony font-medium">
                                                        {effectiveLocale === 'fr' ? 'Taille de Bague' : 'Ring Size'}
                                                    </label>
                                                    <div className="relative">
                                                    <select
                                                            value={ringSize || ""}
                                                        onChange={(e) => setRingSize(e.target.value)}
                                                            className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white appearance-none pr-10"
                                                    >
                                                        <option value="">
                                                                {effectiveLocale === 'fr' ? 'Sélectionnez une taille' : 'Select a size'}
                                                        </option>
                                                        {[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].map((size) => (
                                                                <option key={size} value={size.toString()}>
                                                                    {size} - {effectiveLocale === 'fr' ? 'EU' : 'EU'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                            <ChevronDown size={16} className="text-platinumGray" />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-platinumGray">
                                                        {effectiveLocale === 'fr' ? 'Taille européenne standard' : 'Standard European size'}
                                                    </p>
                                                </div>

                                                {/* Bracelet Size */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm text-richEbony font-medium">
                                                        {effectiveLocale === 'fr' ? 'Tour de Poignet' : 'Bracelet Size'}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={braceletSize || ""}
                                                            onChange={(e) => setBraceletSize(e.target.value)}
                                                            className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                            placeholder={effectiveLocale === 'fr' ? 'Ex: 16cm' : 'E.g: 16cm'}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-platinumGray">
                                                        {effectiveLocale === 'fr' ? 'Mesurez votre poignet en cm' : 'Measure your wrist in cm'}
                                                    </p>
                                                </div>

                                                {/* Necklace Length */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm text-richEbony font-medium">
                                                        {effectiveLocale === 'fr' ? 'Longueur de Collier' : 'Necklace Length'}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={necklaceLength || ""}
                                                            onChange={(e) => setNecklaceLength(e.target.value)}
                                                            className="w-full px-5 py-3.5 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                            placeholder={effectiveLocale === 'fr' ? 'Ex: 42cm' : 'E.g: 42cm'}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-platinumGray">
                                                        {effectiveLocale === 'fr' ? 'Longueur préférée en cm' : 'Preferred length in cm'}
                                                    </p>
                                                    </div>
                                                </div>

                                            {/* Sizing Guide Link */}
                                            <div className="mt-6 pt-4 border-t border-brandGold/10">
                                                <Link href="/sizing-guide" className="flex items-center text-sm text-brandGold hover:text-burgundy transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    {effectiveLocale === 'fr' ? 'Consulter notre guide des tailles' : 'View our sizing guide'}
                                                        </Link>
                                                </div>
                                        </div>

                                        {/* Material Preferences Card */}
                                        <div className="bg-white border border-brandGold/10 p-8 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                                            <h3 className="font-serif text-lg text-richEbony mb-4">
                                                {effectiveLocale === 'fr' ? 'Métaux Précieux Préférés' : 'Preferred Precious Metals'}
                                            </h3>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {['Or Blanc', 'Or Jaune', 'Or Rose', 'Platine'].map(metal => (
                                                    <label key={metal} className={`relative flex items-center p-3 rounded-sm cursor-pointer transition-all ${
                                                        preferredMetals.includes(metal) 
                                                            ? 'bg-brandGold/10 border border-brandGold/30' 
                                                            : 'bg-white border border-brandGold/10 hover:border-brandGold/20'
                                                    }`}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-4 w-4 text-brandGold border-brandGold/30 rounded-sm focus:ring-0 focus:ring-offset-0"
                                                            checked={preferredMetals.includes(metal)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setPreferredMetals([...preferredMetals, metal]);
                                                                } else {
                                                                    setPreferredMetals(preferredMetals.filter(m => m !== metal));
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm ml-2 text-richEbony">
                                                            {metal}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gemstone Preferences Card */}
                                        <div className="bg-white border border-brandGold/10 p-8 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                                            <h3 className="font-serif text-lg text-richEbony mb-4">
                                                {effectiveLocale === 'fr' ? 'Pierres Précieuses Préférées' : 'Preferred Gemstones'}
                                            </h3>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {['Diamant', 'Rubis', 'Saphir', 'Émeraude', 'Perle', 'Opale', 'Topaze', 'Améthyste', 'Aigue-marine'].map(gem => (
                                                    <label key={gem} className={`relative flex items-center p-3 rounded-sm cursor-pointer transition-all ${
                                                        preferredGemstones.includes(gem) 
                                                            ? 'bg-brandGold/10 border border-brandGold/30' 
                                                            : 'bg-white border border-brandGold/10 hover:border-brandGold/20'
                                                    }`}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-4 w-4 text-brandGold border-brandGold/30 rounded-sm focus:ring-0 focus:ring-offset-0"
                                                            checked={preferredGemstones.includes(gem)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setPreferredGemstones([...preferredGemstones, gem]);
                                                                } else {
                                                                    setPreferredGemstones(preferredGemstones.filter(g => g !== gem));
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm ml-2 text-richEbony">
                                                            {gem}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Save Button & Feedback */}
                                        <div className="flex items-center justify-between mt-8">
                                            <button
                                                type="button"
                                                onClick={handleSavePreferences}
                                                disabled={isSubmitting}
                                                className={`px-8 py-3.5 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide shadow-subtle hover:shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {isSubmitting 
                                                    ? (effectiveLocale === 'fr' ? 'Enregistrement...' : 'Saving...') 
                                                    : (effectiveLocale === 'fr' ? 'Enregistrer les Préférences' : 'Save Preferences')}
                                            </button>

                                            {updateMsg && (
                                                <div className="flex items-center text-sm text-brandGold animate-fade-in">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {updateMsg}
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeSection === "orders" && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <div className="flex items-center justify-between mb-12">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {effectiveLocale === 'fr' ? 'Historique des Commandes' : 'Order History'}
                                        </h2>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="bg-white border border-brandGold/10 p-12 rounded-sm shadow-subtle text-center">
                                            <div className="flex justify-center mb-8">
                                                <div className="relative">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-platinumGray/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-brandGold/30 to-transparent rounded-full"></div>
                                                </div>
                                            </div>
                                            <p className="text-platinumGray mb-8 text-lg font-serif">
                                                {effectiveLocale === 'fr'
                                                    ? 'Vous n\'avez pas encore passé de commande.'
                                                    : 'You haven\'t placed any orders yet.'}
                                            </p>
                                            <Link href="/collections">
                                                <button className="px-8 py-4 bg-gradient-to-r from-brandGold to-brandGold/90 text-richEbony hover:from-burgundy hover:to-burgundy hover:text-white transition-all duration-300 font-medium tracking-wide relative group overflow-hidden">
                                                    <span className="relative z-10">
                                                        {effectiveLocale === 'fr' ? 'Découvrir Nos Collections' : 'Discover Our Collections'}
                                                    </span>
                                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-10">
                                            {orders.map((order) => (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)" }}
                                                    className="bg-white border border-brandGold/10 rounded-sm shadow-subtle hover:shadow-luxury overflow-hidden transition-all duration-500"
                                                >
                                                    {/* Golden corner accent */}
                                                    <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                                                        <div className="absolute transform rotate-45 bg-brandGold/30 w-12 h-1.5 -top-2 -right-2"></div>
                                                    </div>

                                                    {/* Order Header */}
                                                    <div className="p-8 border-b border-brandGold/10 relative">
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                                                            <div className="flex items-center">
                                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 ${
                                                                    order.status.toUpperCase() === 'DELIVERED' ? 'bg-emerald-50' : 
                                                                    order.status.toUpperCase() === 'SHIPPED' ? 'bg-blue-50' : 
                                                                    order.status.toUpperCase() === 'CONFIRMED' ? 'bg-amber-50' : 
                                                                    order.status.toUpperCase() === 'CANCELLED' ? 'bg-red-50' :
                                                                    'bg-gray-50'
                                                                } border ${
                                                                    order.status.toUpperCase() === 'DELIVERED' ? 'border-emerald-100' : 
                                                                    order.status.toUpperCase() === 'SHIPPED' ? 'border-blue-100' : 
                                                                    order.status.toUpperCase() === 'CONFIRMED' ? 'border-amber-100' : 
                                                                    order.status.toUpperCase() === 'CANCELLED' ? 'border-red-100' :
                                                                    'border-gray-100'
                                                                }`}>
                                                                    <Package size={20} className={`${
                                                                        order.status.toUpperCase() === 'DELIVERED' ? 'text-emerald-600' : 
                                                                        order.status.toUpperCase() === 'SHIPPED' ? 'text-blue-600' : 
                                                                        order.status.toUpperCase() === 'CONFIRMED' ? 'text-amber-600' : 
                                                                        order.status.toUpperCase() === 'CANCELLED' ? 'text-red-500' :
                                                                        'text-gray-400'
                                                                    }`} />
                                                                </div>
                                                        <div>
                                                                    <div className="flex items-center">
                                                                        <span className="text-base font-medium text-richEbony">
                                                                            {effectiveLocale === 'fr' ? 'Commande' : 'Order'} #{order.id}
                                                                        </span>
                                                                        <span className={`ml-4 inline-flex px-4 py-1.5 text-xs rounded-sm ${
                                                                            order.status.toUpperCase() === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                                            order.status.toUpperCase() === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                                            order.status.toUpperCase() === 'CONFIRMED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                                            order.status.toUpperCase() === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                            'bg-gray-50 text-gray-700 border border-gray-100'
                                                                        }`}>
                                                                            {order.status.toUpperCase() === 'DELIVERED' ? (effectiveLocale === 'fr' ? 'Livré' : 'Delivered') :
                                                                            order.status.toUpperCase() === 'SHIPPED' ? (effectiveLocale === 'fr' ? 'Expédié' : 'Shipped') :
                                                                            order.status.toUpperCase() === 'CONFIRMED' ? (effectiveLocale === 'fr' ? 'Confirmée' : 'Confirmed') :
                                                                            order.status.toUpperCase() === 'CANCELLED' ? (effectiveLocale === 'fr' ? 'Annulée' : 'Cancelled') :
                                                                            (effectiveLocale === 'fr' ? 'En attente' : 'Pending')}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-platinumGray mt-2">
                                                                {formatDate(order.createdAt)}
                                                            </p>
                                                                </div>
                                                        </div>

                                                            <div className="flex items-center space-x-8">
                                                                {/* Order Total */}
                                                        <div>
                                                                    <p className="text-xs text-platinumGray mb-1.5 uppercase tracking-wider">
                                                                        {effectiveLocale === 'fr' ? 'TOTAL' : 'TOTAL'}
                                                            </p>
                                                                    <p className="text-base font-medium text-richEbony">
                                                                {formatCurrency(order.totalAmount)}
                                                            </p>
                                                        </div>

                                                                {/* Payment Method */}
                                                        <div>
                                                                    <p className="text-xs text-platinumGray mb-1.5 uppercase tracking-wider">
                                                                        {effectiveLocale === 'fr' ? 'PAIEMENT' : 'PAYMENT'}
                                                                    </p>
                                                                    <div className="flex items-center">
                                                                        <CreditCard size={14} className="text-platinumGray mr-1.5" />
                                                                        <p className="text-sm text-platinumGray">
                                                                            {order.paymentMethod === 'CREDIT_CARD' ? (effectiveLocale === 'fr' ? 'Carte bancaire' : 'Credit card') :
                                                                            order.paymentMethod === 'BANK_TRANSFER' ? (effectiveLocale === 'fr' ? 'Virement' : 'Bank transfer') :
                                                                            order.paymentMethod === 'PAYPAL' ? 'PayPal' :
                                                                            order.paymentMethod === 'COD' ? (effectiveLocale === 'fr' ? 'Paiement à la livraison' : 'Cash on delivery') :
                                                                            order.paymentMethod}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                        </div>

                                                        <div className="md:ml-auto">
                                                            <Link href={`/order/${order.id}`}>
                                                                    <button className="group text-sm border border-brandGold/30 hover:border-brandGold bg-white hover:bg-brandGold/5 text-richEbony px-5 py-2.5 transition-all duration-300 flex items-center shadow-sm hover:shadow">
                                                                        {effectiveLocale === 'fr' ? 'Voir les détails' : 'View details'}
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                </button>
                                                            </Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Order Items */}
                                                    <div className="p-8 bg-gradient-to-br from-brandIvory/5 to-brandIvory/20">
                                                        <h4 className="text-sm font-medium text-platinumGray mb-6 uppercase tracking-wider flex items-center">
                                                            <span className="w-4 h-px bg-brandGold/40 mr-3"></span>
                                                            {effectiveLocale === 'fr' ? 'Articles commandés' : 'Ordered items'}
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                            {order.orderItems.map((item) => {
                                                                const productImage = item.product.images && item.product.images.length > 0
                                                                    ? item.product.images[0]
                                                                    : '/images/placeholder.jpg';

                                                                const productName = item.product.translations.find(t => t.language === effectiveLocale)?.name ||
                                                                    item.product.translations.find(t => t.language === 'fr')?.name ||
                                                                    'Création Diamant Rouge';

                                                                return (
                                                                    <motion.div 
                                                                        key={item.id} 
                                                                        whileHover={{ scale: 1.02 }}
                                                                        className="flex items-center p-4 bg-white border border-brandGold/10 rounded-sm hover:border-brandGold/30 transition-all duration-300 hover:shadow-sm"
                                                                    >
                                                                        <div className="w-20 h-20 bg-brandIvory/30 relative rounded-sm overflow-hidden flex-shrink-0">
                                                                            <Image
                                                                                src={productImage}
                                                                                alt={productName}
                                                                                fill
                                                                                className="object-cover"
                                                                                sizes="80px"
                                                                            />
                                                                        </div>
                                                                        <div className="ml-5">
                                                                            <p className="text-sm font-medium text-richEbony leading-tight line-clamp-2">
                                                                                {productName}
                                                                            </p>
                                                                            <div className="flex items-center justify-between mt-2">
                                                                                <p className="text-xs text-platinumGray">
                                                                                    {effectiveLocale === 'fr' ? 'Qté' : 'Qty'}: {item.quantity}
                                                                                </p>
                                                                                <p className="text-xs font-medium text-richEbony">
                                                                                    {formatCurrency(item.price)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </div>
                                                        
                                                        {/* Delivery Address */}
                                                        {order.shippingAddress && (
                                                            <div className="mt-8 pt-5 border-t border-brandGold/10 flex items-start">
                                                                <MapPin size={18} className="text-brandGold/60 mt-0.5 mr-3 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-xs font-medium text-platinumGray uppercase tracking-wider mb-1.5">
                                                                        {effectiveLocale === 'fr' ? 'Adresse de livraison' : 'Shipping address'}
                                                                    </p>
                                                                    <p className="text-sm text-richEbony">
                                                                        {order.shippingAddress}, {order.city}, {order.postalCode}, {order.country}
                                                                    </p>
                                                                </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeSection === "benefits" && (
                                            <motion.div
                                    key="benefits"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                            >
                                    <div className="flex items-center justify-between mb-12">
                                                    <h2 className="font-serif text-2xl text-richEbony">
                                            {effectiveLocale === 'fr' ? 'Vos Avantages Membre' : 'Your Member Benefits'}
                                                    </h2>
                                                </div>

                                    {/* Member Status Card */}
                                    <div className="bg-white border border-brandGold/10 p-8 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500 mb-8">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                                                            <div>
                                                                <h3 className="font-serif text-lg text-richEbony mb-2">
                                                    {effectiveLocale === 'fr' ? 'Statut Actuel' : 'Current Status'}
                                                                </h3>
                                                <p className="text-sm text-platinumGray mb-4">
                                                    {effectiveLocale === 'fr'
                                                        ? 'Votre statut détermine les avantages auxquels vous avez accès.'
                                                        : 'Your status determines the benefits you have access to.'}
                                                                </p>
                                                            </div>
                                            <div className={`px-6 py-3 rounded-sm ${
                                                memberStatus === 'vip' ? 'bg-brandGold text-richEbony' :
                                                memberStatus === 'platinum' ? 'bg-platinumGray/90 text-white' :
                                                memberStatus === 'gold' ? 'bg-amber-300/90 text-richEbony' :
                                                'bg-brandGold/10 text-platinumGray'
                                            }`}>
                                                <span className="font-medium uppercase tracking-wide text-sm">
                                                    {memberStatus === 'vip' && (effectiveLocale === 'fr' ? 'Client VIP' : 'VIP Client')}
                                                    {memberStatus === 'platinum' && (effectiveLocale === 'fr' ? 'Client Platine' : 'Platinum Client')}
                                                    {memberStatus === 'gold' && (effectiveLocale === 'fr' ? 'Client Or' : 'Gold Client')}
                                                    {memberStatus === 'regular' && (effectiveLocale === 'fr' ? 'Client Régulier' : 'Regular Client')}
                                                </span>
                                                            </div>
                                                        </div>
                                                        </div>

                                    {/* Benefits list by tier */}
                                    <div className="bg-gradient-to-br from-richEbony to-burgundy p-8 rounded-sm shadow-lg text-white relative overflow-hidden">
                                        {/* Background diamond pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute inset-0" style={{
                                                backgroundImage: 'url("/images/diamond-pattern.png")',
                                                backgroundSize: '200px',
                                                backgroundRepeat: 'repeat',
                                                opacity: 0.15
                                            }}></div>
                                                    </div>

                                        {/* Gold accent line */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandGold/80 via-brandGold to-brandGold/80"></div>
                                        
                                        <div className="relative z-10">
                                            <h3 className="font-serif text-xl text-brandGold mb-6">
                                                {effectiveLocale === 'fr' ? 'Vos Privilèges Exclusifs' : 'Your Exclusive Privileges'}
                                                                </h3>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                {/* Benefits for all members */}
                                                <div className="space-y-4">
                                                    <h4 className="text-brandGold font-medium text-sm uppercase tracking-wider">
                                                        {effectiveLocale === 'fr' ? 'Pour tous les membres' : 'For all members'}
                                                    </h4>
                                                    
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-5 h-5 rounded-full bg-brandGold/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                            <span className="text-brandGold text-xs">✓</span>
                                                        </div>
                                                        <p className="text-sm text-white/80">
                                                            {effectiveLocale === 'fr'
                                                                ? 'Accès à notre service client dédié' 
                                                                : 'Access to our dedicated customer service'}
                                                                </p>
                                                            </div>
                                                    
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-5 h-5 rounded-full bg-brandGold/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                            <span className="text-brandGold text-xs">✓</span>
                                                            </div>
                                                        <p className="text-sm text-white/80">
                                                            {effectiveLocale === 'fr'
                                                                ? 'Invitations aux événements saisonniers' 
                                                                : 'Invitations to seasonal events'}
                                                        </p>
                                                        </div>
                                                    
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-5 h-5 rounded-full bg-brandGold/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                            <span className="text-brandGold text-xs">✓</span>
                                                        </div>
                                                        <p className="text-sm text-white/80">
                                                            {effectiveLocale === 'fr'
                                                                ? 'Service d\'entretien annuel gratuit pour vos bijoux' 
                                                                : 'Free annual maintenance service for your jewelry'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Gold tier benefits */}
                                                {(memberStatus === 'gold' || memberStatus === 'platinum' || memberStatus === 'vip') && (
                                                    <div className="space-y-4">
                                                        <h4 className="text-amber-300 font-medium text-sm uppercase tracking-wider">
                                                            {effectiveLocale === 'fr' ? 'Avantages Or' : 'Gold Benefits'}
                                                        </h4>
                                                        
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-amber-300/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-amber-300 text-xs">✓</span>
                                                            </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Accès prioritaire aux nouvelles collections' 
                                                                    : 'Priority access to new collections'}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-amber-300/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-amber-300 text-xs">✓</span>
                                                            </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Service de gravure personnalisée offert' 
                                                                    : 'Complimentary engraving service'}
                                                            </p>
                                                            </div>

                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-amber-300/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-amber-300 text-xs">✓</span>
                                                            </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Livraison expresse gratuite' 
                                                                    : 'Free express shipping'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Platinum tier benefits */}
                                                {(memberStatus === 'platinum' || memberStatus === 'vip') && (
                                                    <div className="space-y-4 md:col-start-1">
                                                        <h4 className="text-platinumGray font-medium text-sm uppercase tracking-wider">
                                                            {effectiveLocale === 'fr' ? 'Avantages Platine' : 'Platinum Benefits'}
                                                        </h4>
                                                        
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-platinumGray/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-platinumGray text-xs">✓</span>
                                                                </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Invitations aux événements privés' 
                                                                    : 'Invitations to private events'}
                                                            </p>
                                                            </div>

                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-platinumGray/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-platinumGray text-xs">✓</span>
                                                            </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Service de styliste personnel' 
                                                                    : 'Personal stylist service'}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-platinumGray/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-platinumGray text-xs">✓</span>
                                                    </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Service de réparation prioritaire' 
                                                                    : 'Priority repair service'}
                                                            </p>
                                                </div>
                                                    </div>
                                                )}

                                                {/* VIP tier benefits */}
                                                {memberStatus === 'vip' && (
                                                    <div className="space-y-4">
                                                        <h4 className="text-brandGold font-medium text-sm uppercase tracking-wider">
                                                            {effectiveLocale === 'fr' ? 'Avantages VIP' : 'VIP Benefits'}
                                                        </h4>
                                                        
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-brandGold/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-brandGold text-xs">✓</span>
                                                            </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Accès aux collections exclusives limitées' 
                                                                    : 'Access to limited exclusive collections'}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-brandGold/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-brandGold text-xs">✓</span>
                                                            </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Service de conciergerie 24/7' 
                                                                    : '24/7 concierge service'}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-5 h-5 rounded-full bg-brandGold/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <span className="text-brandGold text-xs">✓</span>
                                                            </div>
                                                            <p className="text-sm text-white/80">
                                                                {effectiveLocale === 'fr'
                                                                    ? 'Rendez-vous privés avec notre maître joaillier' 
                                                                    : 'Private appointments with our master jeweler'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                        </div>

                                            {/* Upgrade prompt for non-VIP members */}
                                            {memberStatus !== 'vip' && (
                                                <div className="mt-8 pt-6 border-t border-white/10">
                                                    <div className="bg-black/20 p-4 rounded-sm">
                                                        <h4 className="text-brandGold font-medium mb-2">
                                                            {effectiveLocale === 'fr' ? 'Passez au niveau supérieur' : 'Upgrade your status'}
                                                        </h4>
                                                        <p className="text-sm text-white/80 mb-4">
                                                            {effectiveLocale === 'fr'
                                                                ? `Découvrez plus d'avantages exclusifs en passant au statut ${memberStatus === 'regular' ? 'Or' : memberStatus === 'gold' ? 'Platine' : 'VIP'}.`
                                                                : `Discover more exclusive benefits by upgrading to ${memberStatus === 'regular' ? 'Gold' : memberStatus === 'gold' ? 'Platinum' : 'VIP'} status.`}
                                                        </p>
                                                        <Link href="/membership-upgrade">
                                                            <button className="px-6 py-2.5 bg-transparent border border-brandGold text-brandGold hover:bg-brandGold/10 transition-colors duration-300 tracking-wide text-sm">
                                                                {effectiveLocale === 'fr' ? 'En savoir plus' : 'Learn more'}
                                                            </button>
                                                        </Link>
                                                        </div>
                                                </div>
                                            )}
                                                    </div>
                                                </div>

                                    {/* Additional services */}
                                    <div className="mt-8">
                                        <h3 className="font-serif text-lg text-richEbony mb-6">
                                            {effectiveLocale === 'fr' ? 'Services Additionnels' : 'Additional Services'}
                                                            </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Private Appointment */}
                                            <div className="bg-gradient-to-br from-white to-brandIvory/40 border border-brandGold/10 p-6 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-serif text-base text-richEbony mb-2">
                                                            {effectiveLocale === 'fr' ? 'Rendez-vous Privé' : 'Private Appointment'}
                                                        </h4>
                                                        <p className="text-sm text-platinumGray">
                                                            {effectiveLocale === 'fr'
                                                                ? 'Réservez un moment privilégié dans notre espace dédié pour découvrir nos créations en exclusivité.'
                                                                : 'Schedule a privileged moment in our dedicated space to discover our creations exclusively.'}
                                                            </p>
                                                        </div>
                                                    <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                                                        <Clock size={18} className="text-brandGold" />
                                                        </div>
                                                    </div>
                                                <div className="mt-6">
                                                    <Link href="/appointment">
                                                        <button className="w-full py-2.5 bg-white border border-brandGold/30 text-richEbony hover:bg-brandGold/5 hover:border-brandGold transition-all duration-300 tracking-wide text-sm">
                                                            {effectiveLocale === 'fr' ? 'Prendre Rendez-vous' : 'Schedule an Appointment'}
                                                            </button>
                                                        </Link>
                                                </div>
                                            </div>

                                            {/* Personal Stylist */}
                                            <div className="bg-gradient-to-br from-white to-brandIvory/40 border border-brandGold/10 p-6 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-serif text-base text-richEbony mb-2">
                                                            {effectiveLocale === 'fr' ? 'Votre Styliste Personnel' : 'Your Personal Stylist'}
                                                        </h4>
                                                        <p className="text-sm text-platinumGray">
                                                            {effectiveLocale === 'fr'
                                                                ? 'Bénéficiez des conseils personnalisés de nos experts joailliers pour sublimer votre élégance.'
                                                                : 'Get personalized advice from our jewelry experts to enhance your elegance.'}
                                                        </p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                                                        <User size={18} className="text-brandGold" />
                                                    </div>
                                                </div>
                                                <div className="mt-6">
                                                    <Link href="/stylist">
                                                        <button className="w-full py-2.5 bg-white border border-brandGold/30 text-richEbony hover:bg-brandGold/5 hover:border-brandGold transition-all duration-300 tracking-wide text-sm">
                                                            {effectiveLocale === 'fr' ? 'Contacter Votre Styliste' : 'Contact Your Stylist'}
                                                            </button>
                                                        </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    // Use the locale directly from context, which will be detected from browser
    const locale = context.locale;

    // Set cache control headers to prevent caching
    context.res.setHeader(
        'Cache-Control',
        'no-store, max-age=0, must-revalidate'
    );

    if (!session || !session.user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false,
            },
        };
    }

    try {
        // Check if user ID exists and handle potential type issues
        if (!session.user.id) {
            console.error("Session user ID is missing");
            return {
                redirect: {
                    destination: '/auth',
                    permanent: false,
                },
            };
        }

        // Ensure ID is in the correct format for Prisma
        const userId = typeof session.user.id === 'string' 
            ? parseInt(session.user.id, 10) 
            : session.user.id;

        // Fetch user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                address: true,
                city: true,
                postalCode: true,
                country: true,
                phoneNumber: true,
                memberStatus: true,
                preferredMetals: true,
                preferredGemstones: true,
                ringSize: true,
                braceletSize: true,
                necklaceLength: true,
                orders: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true,
                        paymentMethod: true,
                        shippingAddress: true,
                        city: true,
                        postalCode: true,
                        country: true,
                        orderItems: {
                            select: {
                                id: true,
                                quantity: true,
                                price: true,
                                product: {
                                    select: {
                                        id: true,
                                        sku: true,
                                        images: true,
                                        translations: {
                                            select: {
                                                language: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        }
                    },
                },
            },
        });

        if (!user) {
            console.error("User not found in database with ID:", userId);
            return {
                redirect: {
                    destination: '/auth',
                    permanent: false,
                },
            };
        }

        const { orders, ...userData } = user;
        
        // Log the order statuses to see their actual values
        console.log("📊 Order statuses from database:", orders.map(order => ({
            id: order.id,
            status: order.status,
            statusType: typeof order.status
        })));

        // Convert Decimal to regular numbers for JSON serialization
        const formattedOrders = orders.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
            totalAmount: Number(order.totalAmount),  // Convert Decimal to Number
            orderItems: order.orderItems.map(item => ({
                ...item,
                price: Number(item.price)  // Convert Decimal to Number
            }))
        }));

        return {
            props: {
                ...userData,
                orders: formattedOrders,
                locale,
            },
        };
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return {
            props: {
                name: session.user.name || null,
                email: session.user.email || '',
                orders: [],
                locale,
                address: null,
                city: null,
                postalCode: null,
                country: null,
                phoneNumber: null,
                memberStatus: 'regular',
                preferredMetals: [],
                preferredGemstones: [],
                ringSize: null,
                braceletSize: null,
                necklaceLength: null,
            },
        };
    }
}