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
    
    // New for jewelry preferences (would require schema updates)
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
}: ProfilePageProps) {
    // Personal information state
    const [name, setName] = useState(initialName || "");
    const [activeSection, setActiveSection] = useState("personal");

    // Address & phone state
    const [address, setAddress] = useState(initialAddress || "");
    const [city, setCity] = useState(initialCity || "");
    const [postalCode, setPostalCode] = useState(initialPostal || "");
    const [country, setCountry] = useState(initialCountry || "");
    const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");
    
    // Jewelry preferences (placeholder UI for future implementation)
    const [ringSize, setRingSize] = useState("");
    const [braceletSize, setBraceletSize] = useState("");
    const [necklaceLength, setNecklaceLength] = useState("");
    
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
        return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', options);
    };
    
    // Format currency according to locale
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
            style: 'currency',
            currency: 'EUR',
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
                setUpdateMsg("Informations personnelles mises à jour avec succès");
            } else {
                setUpdateMsg("Erreur lors de la mise à jour des informations");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            setUpdateMsg("Une erreur est survenue lors de la mise à jour");
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
                setUpdateMsg("Adresse de livraison mise à jour avec succès");
            } else {
                setUpdateMsg("Erreur lors de la mise à jour de l'adresse");
            }
        } catch (error) {
            console.error("Update address/phone error:", error);
            setUpdateMsg("Une erreur est survenue lors de la mise à jour");
        } finally {
            setIsSubmitting(false);
        }
    }
    
    // Handle saving jewelry preferences (placeholder for future implementation)
    async function handleSavePreferences(e: React.FormEvent) {
        e.preventDefault();
        setUpdateMsg("Préférences enregistrées avec succès");
        // Future implementation would call an API endpoint to store these preferences
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Elegant header section */}
            <section className="relative bg-gradient-to-r from-richEbony to-burgundy py-20 px-6 md:px-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-serif text-4xl md:text-5xl text-white tracking-wide mb-2">
                        {name ? `Bienvenue, ${name.split(' ')[0]}` : 'Votre Espace Personnel'}
                    </h1>
                    <p className="text-brandGold/90 font-light tracking-wider">
                        {locale === 'fr' ? 
                            'Gérez vos préférences et vos commandes' : 
                            'Manage your preferences and orders'}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 md:px-10">
                <div className="grid md:grid-cols-12 gap-12">
                    {/* Side Navigation */}
                    <nav className="md:col-span-3">
                        <div className="sticky top-24">
                            <h2 className="font-serif text-richEbony text-xl mb-8">
                                {locale === 'fr' ? 'Votre Compte' : 'Your Account'}
                            </h2>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={() => setActiveSection("personal")}
                                    className={`flex items-center w-full px-3 py-2.5 text-left transition-all ${
                                        activeSection === "personal"
                                            ? "bg-brandGold/5 border-l-2 border-brandGold text-richEbony"
                                            : "text-platinumGray hover:bg-brandGold/5"
                                    }`}
                                >
                                    <User size={18} className="mr-3 opacity-70" />
                                    <span className="text-sm">
                                        {locale === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
                                    </span>
                                </button>
                                
                                <button
                                    onClick={() => setActiveSection("address")}
                                    className={`flex items-center w-full px-3 py-2.5 text-left transition-all ${
                                        activeSection === "address"
                                            ? "bg-brandGold/5 border-l-2 border-brandGold text-richEbony"
                                            : "text-platinumGray hover:bg-brandGold/5"
                                    }`}
                                >
                                    <MapPin size={18} className="mr-3 opacity-70" />
                                    <span className="text-sm">
                                        {locale === 'fr' ? 'Adresse de Livraison' : 'Shipping Address'}
                                    </span>
                                </button>
                                
                                <button
                                    onClick={() => setActiveSection("preferences")}
                                    className={`flex items-center w-full px-3 py-2.5 text-left transition-all ${
                                        activeSection === "preferences"
                                            ? "bg-brandGold/5 border-l-2 border-brandGold text-richEbony"
                                            : "text-platinumGray hover:bg-brandGold/5"
                                    }`}
                                >
                                    <CreditCard size={18} className="mr-3 opacity-70" />
                                    <span className="text-sm">
                                        {locale === 'fr' ? 'Préférences Bijoux' : 'Jewelry Preferences'}
                                    </span>
                                </button>
                                
                                <button
                                    onClick={() => setActiveSection("orders")}
                                    className={`flex items-center w-full px-3 py-2.5 text-left transition-all ${
                                        activeSection === "orders"
                                            ? "bg-brandGold/5 border-l-2 border-brandGold text-richEbony"
                                            : "text-platinumGray hover:bg-brandGold/5"
                                    }`}
                                >
                                    <Package size={18} className="mr-3 opacity-70" />
                                    <span className="text-sm">
                                        {locale === 'fr' ? 'Historique des Commandes' : 'Order History'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className="md:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeSection === "personal" && (
                                <motion.div
                                    key="personal"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {locale === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
                                        </h2>
                                    </div>
                                    
                                    <form onSubmit={handleSavePersonal} className="space-y-6">
                                        <div className="bg-white border border-brandGold/10 p-6 rounded-sm shadow-sm">
                                            {/* Name field */}
                                            <div className="mb-6">
                                                <label className="block text-sm text-richEbony mb-2 font-medium">
                                                    {locale === 'fr' ? 'Nom Complet' : 'Full Name'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white"
                                                    placeholder={locale === 'fr' ? 'Votre nom' : 'Your name'}
                                                />
                                            </div>
                                            
                                            {/* Email field (read-only) */}
                                            <div>
                                                <label className="block text-sm text-richEbony mb-2 font-medium">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-brandGold/20 bg-brandIvory/30 text-platinumGray rounded-sm"
                                                />
                                                <p className="mt-2 text-xs text-platinumGray italic">
                                                    {locale === 'fr' 
                                                        ? 'Pour modifier votre adresse email, veuillez contacter notre service client' 
                                                        : 'To change your email, please contact our customer service'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`px-6 py-3 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide ${
                                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                                }`}
                                            >
                                                {locale === 'fr' ? 'Enregistrer les Modifications' : 'Save Changes'}
                                            </button>
                                            
                                            {updateMsg && (
                                                <p className="text-sm text-brandGold animate-fade-in">
                                                    {updateMsg}
                                                </p>
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
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {locale === 'fr' ? 'Adresse de Livraison' : 'Shipping Address'}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSaveAddress} className="space-y-6">
                                        <div className="bg-white border border-brandGold/10 p-6 rounded-sm shadow-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Address field */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Adresse' : 'Address'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={address || ''}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={locale === 'fr' ? 'Votre adresse' : 'Your address'}
                                                    />
                                                </div>

                                                {/* City field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Ville' : 'City'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={city || ''}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={locale === 'fr' ? 'Votre ville' : 'Your city'}
                                                    />
                                                </div>

                                                {/* Postal Code field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Code Postal' : 'Postal Code'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={postalCode || ''}
                                                        onChange={(e) => setPostalCode(e.target.value)}
                                                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={locale === 'fr' ? 'Code postal' : 'Postal code'}
                                                    />
                                                </div>

                                                {/* Country field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Pays' : 'Country'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={country || ''}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={locale === 'fr' ? 'Votre pays' : 'Your country'}
                                                    />
                                                </div>

                                                {/* Phone field */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Téléphone' : 'Phone Number'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={phoneNumber || ''}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                        placeholder={locale === 'fr' ? 'Numéro de téléphone' : 'Phone number'}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`px-6 py-3 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide ${
                                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                                }`}
                                            >
                                                {locale === 'fr' ? 'Enregistrer les Modifications' : 'Save Changes'}
                                            </button>
                                            
                                            {updateMsg && (
                                                <p className="text-sm text-brandGold animate-fade-in">
                                                    {updateMsg}
                                                </p>
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
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {locale === 'fr' ? 'Préférences Bijoux' : 'Jewelry Preferences'}
                                        </h2>
                                    </div>

                                    <form onSubmit={handleSavePreferences} className="space-y-6">
                                        <div className="bg-white border border-brandGold/10 p-6 rounded-sm shadow-sm">
                                            <p className="text-platinumGray italic text-sm mb-6">
                                                {locale === 'fr' 
                                                    ? 'Enregistrez vos mesures pour faciliter vos prochaines commandes. Toutes nos créations peuvent être ajustées à vos mesures précises.' 
                                                    : 'Save your measurements to facilitate your future orders. All our creations can be adjusted to your exact measurements.'}
                                            </p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Ring Size */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Taille de Bague' : 'Ring Size'}
                                                    </label>
                                                    <select
                                                        value={ringSize}
                                                        onChange={(e) => setRingSize(e.target.value)}
                                                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white appearance-none"
                                                    >
                                                        <option value="">
                                                            {locale === 'fr' ? 'Sélectionnez une taille' : 'Select a size'}
                                                        </option>
                                                        {[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].map((size) => (
                                                            <option key={size} value={size}>
                                                                {size} - {locale === 'fr' ? 'EU' : 'EU'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Bracelet Size */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Tour de Poignet' : 'Bracelet Size'}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={braceletSize}
                                                            onChange={(e) => setBraceletSize(e.target.value)}
                                                            className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                            placeholder={locale === 'fr' ? 'En centimètres' : 'In centimeters'}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Necklace Length */}
                                                <div>
                                                    <label className="block text-sm text-richEbony mb-2 font-medium">
                                                        {locale === 'fr' ? 'Longueur de Collier' : 'Necklace Length'}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={necklaceLength}
                                                            onChange={(e) => setNecklaceLength(e.target.value)}
                                                            className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm"
                                                            placeholder={locale === 'fr' ? 'En centimètres' : 'In centimeters'}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Request sizing guide */}
                                                <div className="md:col-span-2 mt-3">
                                                    <p className="text-sm text-platinumGray">
                                                        {locale === 'fr' 
                                                            ? 'Vous souhaitez connaître votre taille exacte?' 
                                                            : 'Want to know your exact size?'}
                                                        <Link href="/contact" className="text-brandGold hover:text-burgundy ml-1 underline decoration-dotted underline-offset-2">
                                                            {locale === 'fr' 
                                                                ? 'Demandez notre guide de mesures personnalisé' 
                                                                : 'Request our personalized sizing guide'}
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide"
                                            >
                                                {locale === 'fr' ? 'Enregistrer les Préférences' : 'Save Preferences'}
                                            </button>
                                            
                                            {updateMsg && (
                                                <p className="text-sm text-brandGold animate-fade-in">
                                                    {updateMsg}
                                                </p>
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
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-serif text-2xl text-richEbony">
                                            {locale === 'fr' ? 'Historique des Commandes' : 'Order History'}
                                        </h2>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="bg-white border border-brandGold/10 p-8 rounded-sm shadow-sm text-center">
                                            <p className="text-platinumGray mb-4">
                                                {locale === 'fr' 
                                                    ? 'Vous n\'avez pas encore passé de commande.' 
                                                    : 'You haven\'t placed any orders yet.'}
                                            </p>
                                            <Link href="/collections">
                                                <button className="px-6 py-3 bg-brandGold text-richEbony hover:bg-burgundy hover:text-white transition-all duration-300 font-medium tracking-wide">
                                                    {locale === 'fr' ? 'Découvrir Nos Collections' : 'Discover Our Collections'}
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            // Complete the order history section first
{orders.map((order) => (
    <div 
        key={order.id} 
        className="bg-white border border-brandGold/10 rounded-sm shadow-sm overflow-hidden"
    >
        <div className="p-6 border-b border-brandGold/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p className="text-xs text-platinumGray mb-1 tracking-wider">
                    {locale === 'fr' ? 'COMMANDE PASSÉE LE' : 'ORDER PLACED ON'}
                </p>
                <p className="text-sm font-medium">
                    {formatDate(order.createdAt)}
                </p>
            </div>
            
            <div>
                <p className="text-xs text-platinumGray mb-1 tracking-wider">
                    {locale === 'fr' ? 'TOTAL' : 'TOTAL'}
                </p>
                <p className="text-sm font-medium">
                    {formatCurrency(order.totalAmount)}
                </p>
            </div>
            
            <div>
                <p className="text-xs text-platinumGray mb-1 tracking-wider">
                    {locale === 'fr' ? 'STATUT' : 'STATUS'}
                </p>
                <span className={`inline-flex px-3 py-1 text-xs rounded-sm ${
                    order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                    order.status === 'processing' ? 'bg-amber-50 text-amber-700' :
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-50 text-gray-700'
                }`}>
                    {order.status === 'completed' ? (locale === 'fr' ? 'Complétée' : 'Completed') :
                     order.status === 'processing' ? (locale === 'fr' ? 'En traitement' : 'Processing') :
                     order.status === 'shipped' ? (locale === 'fr' ? 'Expédiée' : 'Shipped') :
                     (locale === 'fr' ? 'En attente' : 'Pending')}
                </span>
            </div>
            
            <div className="md:ml-auto">
                <Link href={`/order/${order.id}`}>
                    <button className="text-sm border border-brandGold/20 hover:border-brandGold bg-white hover:bg-brandGold/5 text-richEbony px-4 py-2 transition-all duration-300">
                        {locale === 'fr' ? 'Voir les détails' : 'View details'}
                    </button>
                </Link>
            </div>
        </div>
        
        <div className="p-6">
            <div className="flex items-center flex-wrap gap-5">
                {order.orderItems.slice(0, 3).map((item) => {
                    const productImage = item.product.images && item.product.images.length > 0
                        ? item.product.images[0]
                        : '/images/placeholder.jpg';
                        
                    const productName = item.product.translations.find(t => t.language === locale)?.name ||
                                     item.product.translations.find(t => t.language === 'fr')?.name ||
                                     'Création Diamant Rouge';
                    
                    return (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-brandIvory/30 relative rounded-sm overflow-hidden flex-shrink-0">
                                <Image
                                    src={productImage}
                                    alt={productName}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-richEbony leading-tight">
                                    {productName}
                                </p>
                                <p className="text-xs text-platinumGray mt-1">
                                    {locale === 'fr' ? 'Quantité' : 'Quantity'}: {item.quantity}
                                </p>
                            </div>
                        </div>
                    );
                })}
                
                {order.orderItems.length > 3 && (
                    <div className="text-sm text-brandGold">
                        +{order.orderItems.length - 3} {locale === 'fr' ? 'autres créations' : 'more items'}
                    </div>
                )}
            </div>
        </div>
    </div>
))}

{/* Add luxury features for high-end clientele */}

{/* VIP Concierge Services Section */}
<motion.div
    key="concierge"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    className="mt-16"
>
    <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl text-richEbony">
            {locale === 'fr' ? 'Services Exclusifs' : 'Exclusive Services'}
        </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Private Appointment */}
        <div className="bg-gradient-to-br from-white to-brandIvory/40 border border-brandGold/10 p-6 rounded-sm shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-serif text-lg text-richEbony mb-2">
                        {locale === 'fr' ? 'Rendez-vous Privé' : 'Private Appointment'}
                    </h3>
                    <p className="text-sm text-platinumGray">
                        {locale === 'fr' 
                            ? 'Réservez un moment privilégié dans notre espace dédié pour découvrir nos nouvelles créations en avant-première.' 
                            : 'Schedule a privileged moment in our dedicated space to discover our new creations before anyone else.'}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                    <Clock size={18} className="text-brandGold" />
                </div>
            </div>
            <div className="mt-6">
                <Link href="/appointment">
                    <button className="w-full py-2.5 bg-white border border-brandGold/30 text-richEbony hover:bg-brandGold/5 hover:border-brandGold transition-all duration-300 tracking-wide text-sm">
                        {locale === 'fr' ? 'Prendre Rendez-vous' : 'Schedule an Appointment'}
                    </button>
                </Link>
            </div>
        </div>

        {/* Personal Stylist */}
        <div className="bg-gradient-to-br from-white to-brandIvory/40 border border-brandGold/10 p-6 rounded-sm shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-serif text-lg text-richEbony mb-2">
                        {locale === 'fr' ? 'Votre Styliste Personnel' : 'Your Personal Stylist'}
                    </h3>
                    <p className="text-sm text-platinumGray">
                        {locale === 'fr' 
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
                        {locale === 'fr' ? 'Contacter Votre Styliste' : 'Contact Your Stylist'}
                    </button>
                </Link>
            </div>
        </div>
    </div>
    
    {/* Special Dates & Occasions */}
    <div className="mt-6 bg-white border border-brandGold/10 p-6 rounded-sm shadow-sm">
        <h3 className="font-serif text-lg text-richEbony mb-4">
            {locale === 'fr' ? 'Dates Importantes' : 'Important Dates'}
        </h3>
        
        <p className="text-sm text-platinumGray mb-5">
            {locale === 'fr' 
                ? 'Enregistrez vos dates importantes pour recevoir des suggestions personnalisées et ne jamais manquer une occasion spéciale.' 
                : 'Save your important dates to receive personalized suggestions and never miss a special occasion.'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-richEbony mb-2 font-medium">
                        {locale === 'fr' ? 'Anniversaire' : 'Birthday'}
                    </label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white"
                    />
                </div>
                
                <div>
                    <label className="block text-sm text-richEbony mb-2 font-medium">
                        {locale === 'fr' ? 'Anniversaire de Mariage' : 'Wedding Anniversary'}
                    </label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white"
                    />
                </div>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm text-richEbony mb-2 font-medium">
                        {locale === 'fr' ? 'Autre Date Spéciale' : 'Other Special Date'}
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="date"
                            className="flex-1 px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white"
                        />
                        <input
                            type="text"
                            placeholder={locale === 'fr' ? 'Description' : 'Description'}
                            className="flex-1 px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white"
                        />
                    </div>
                </div>
                
                <div className="pt-7 flex justify-end">
                    <button className="px-6 py-2.5 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide text-sm">
                        {locale === 'fr' ? 'Enregistrer les Dates' : 'Save Dates'}
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    {/* Material and Gemstone Preferences */}
    <div className="mt-6 bg-white border border-brandGold/10 p-6 rounded-sm shadow-sm">
        <h3 className="font-serif text-lg text-richEbony mb-4">
            {locale === 'fr' ? 'Préférences de Matériaux' : 'Material Preferences'}
        </h3>
        
        <p className="text-sm text-platinumGray mb-5">
            {locale === 'fr' 
                ? 'Indiquez vos préférences pour recevoir des suggestions parfaitement adaptées à votre style.' 
                : 'Indicate your preferences to receive suggestions perfectly suited to your style.'}
        </p>
        
        <div className="space-y-5">
            <div>
                <label className="block text-sm text-richEbony mb-3 font-medium">
                    {locale === 'fr' ? 'Métaux Précieux Préférés' : 'Preferred Precious Metals'}
                </label>
                <div className="flex flex-wrap gap-3">
                    {['Or Blanc', 'Or Jaune', 'Or Rose', 'Platine'].map(metal => (
                        <label key={metal} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-brandGold border-brandGold/30 rounded-sm focus:ring-0 focus:ring-offset-0" 
                            />
                            <span className="text-sm text-platinumGray group-hover:text-richEbony transition-colors">
                                {metal}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div>
                <label className="block text-sm text-richEbony mb-3 font-medium">
                    {locale === 'fr' ? 'Pierres Précieuses Préférées' : 'Preferred Gemstones'}
                </label>
                <div className="flex flex-wrap gap-3">
                    {['Diamant', 'Rubis', 'Saphir', 'Émeraude', 'Perle', 'Opale'].map(gem => (
                        <label key={gem} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="form-checkbox h-4 w-4 text-brandGold border-brandGold/30 rounded-sm focus:ring-0 focus:ring-offset-0" 
                            />
                            <span className="text-sm text-platinumGray group-hover:text-richEbony transition-colors">
                                {gem}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="pt-2 flex justify-end">
                <button className="px-6 py-2.5 bg-richEbony text-white hover:bg-burgundy transition-colors duration-300 font-medium tracking-wide text-sm">
                    {locale === 'fr' ? 'Enregistrer les Préférences' : 'Save Preferences'}
                </button>
            </div>
        </div>
    </div>
    
    {/* Exclusive Access */}
    <div className="mt-6 bg-gradient-to-br from-burgundy/90 to-richEbony p-6 rounded-sm shadow-md text-white">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-serif text-lg text-brandGold mb-3">
                    {locale === 'fr' ? 'Accès Exclusif' : 'Exclusive Access'}
                </h3>
                <p className="text-sm text-white/80 max-w-lg">
                    {locale === 'fr' 
                        ? 'En tant que client privilégié, vous avez accès à nos collections privées et événements exclusifs. Découvrez nos prochains rendez-vous privés.' 
                        : 'As a privileged client, you have access to our private collections and exclusive events. Discover our upcoming private appointments.'}
                </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brandGold/20 flex items-center justify-center">
                <Shield size={20} className="text-brandGold" />
            </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <Link href="/private-collections">
                <button className="px-6 py-2.5 bg-transparent border border-brandGold/40 text-brandGold hover:bg-brandGold/10 transition-all duration-300 tracking-wide text-sm whitespace-nowrap">
                    {locale === 'fr' ? 'Collections Privées' : 'Private Collections'}
                </button>
            </Link>
            <Link href="/events">
                <button className="px-6 py-2.5 bg-transparent border border-white/30 text-white hover:bg-white/10 transition-all duration-300 tracking-wide text-sm whitespace-nowrap">
                    {locale === 'fr' ? 'Événements VIP' : 'VIP Events'}
                </button>
            </Link>
            <div className="ml-auto hidden sm:block">
                <span className="text-xs text-brandGold/80 uppercase tracking-wider">
                    {locale === 'fr' ? 'STATUT MEMBRE' : 'MEMBER STATUS'}
                </span>
                <p className="text-brandGold font-medium">
                    {locale === 'fr' ? 'Client Privilégié' : 'Privileged Client'}
                </p>
            </div>
        </div>
    </div>
</motion.div>

{/* Close the orders animatePresence and main content div */}
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const locale = context.locale || 'fr';

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        // Fetch user data
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                address: true,
                city: true,
                postalCode: true,
                country: true,
                phoneNumber: true,
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
                        },
                    },
                },
            },
        });

        const { orders, ...userData } = user;

        // Format dates for serialization
        const formattedOrders = orders.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
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
                name: session.user.name,
                email: session.user.email,
                orders: [],
                locale,
                address: null,
                city: null,
                postalCode: null,
                country: null,
                phoneNumber: null,
            },
        };
        </div>
        </motion.div>
    }
    
}