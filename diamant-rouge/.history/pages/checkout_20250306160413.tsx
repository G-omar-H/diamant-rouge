import { useCart } from "../contexts/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { jwtVerify } from "jose";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Package, ChevronRight, Lock, CreditCard, 
  Calendar, Award, MapPin, Truck, Phone, GiftIcon,
  ArrowLeft, ChevronDown, ChevronUp, Check, AlertCircle
} from "lucide-react";

type CheckoutProps = {
  userId: number | null;
  userAddress?: string;
  userCity?: string;
  userPostalCode?: string;
  userCountry?: string;
};

export default function CheckoutPage({
  userId,
  userAddress,
  userCity,
  userPostalCode,
  userCountry,
}: CheckoutProps) {
  const { cart, clearCart } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Checkout steps
  const STEPS = ["Livraison", "Paiement", "Confirmation"];
  const [currentStep, setCurrentStep] = useState(0);

  // Order summary toggle for mobile
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"CMI" | "COD" | "">("");

  // Shipping Option: "STORE", "PROFILE", or "NEW"
  const [shippingOption, setShippingOption] = useState<"STORE" | "PROFILE" | "NEW" | "">("");

  // Final shipping address state
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Additional options
  const [includeLuxuryPackaging, setIncludeLuxuryPackaging] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [giftMessage, setGiftMessage] = useState("");
  const [showGiftMessageField, setShowGiftMessageField] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Store address for pickup
  const storeAddress = "Diamant Rouge Boutique, 123 Rue de la Joaillerie, Casablanca";

  // Compute cart total using fallback from product.basePrice if item.price is undefined
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice =
      item.price !== undefined
        ? item.price
        : item.product && item.product.basePrice
          ? parseFloat(item.product.basePrice)
          : 0;
    return sum + itemPrice * item.quantity;
  }, 0);
  
  // Additional costs
  const luxuryPackagingFee = 290; // Fixed fee for luxury packaging
  const insuranceRate = 0.01; // 1% of subtotal
  const insuranceFee = includeInsurance ? Math.ceil(subtotal * insuranceRate) : 0;
  
  // Calculate final total
  const total = subtotal + 
               (includeLuxuryPackaging ? luxuryPackagingFee : 0) + 
               insuranceFee;

  // Format currency as MAD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(price);
  };

  // Update shipping address based on the selected option
  useEffect(() => {
    if (shippingOption === "STORE") {
      setShippingAddress(storeAddress);
      setCity("Casablanca");
      setPostalCode("20000");
      setCountry("Maroc");
    } else if (shippingOption === "PROFILE") {
      setShippingAddress(userAddress || "");
      setCity(userCity || "");
      setPostalCode(userPostalCode || "");
      setCountry(userCountry || "");
    } else if (shippingOption === "NEW") {
      setShippingAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
    }
  }, [shippingOption, userAddress, userCity, userPostalCode, userCountry]);

  // Handle form navigation
  const goToNextStep = () => {
    if (currentStep === 0) {
      if (!shippingOption) {
        setError("⚠ Veuillez sélectionner une option de livraison.");
        return;
      }
      if (shippingOption === "NEW") {
        if (!shippingAddress || !city || !postalCode || !country) {
          setError("⚠ Veuillez remplir tous les champs pour la livraison.");
          return;
        }
      }
      setError("");
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (!paymentMethod) {
        setError("⚠ Veuillez sélectionner un mode de paiement.");
        return;
      }
      setError("");
      setCurrentStep(2);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  async function handleCheckout() {
    if (currentStep !== 2) {
      goToNextStep();
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "CMI") {
        const res = await fetch("/api/payment/cmi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: Date.now().toString(),
            amount: total,
            customerEmail: "customer@example.com", // Replace with actual user email
          }),
        });
        const data = await res.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          setError("⚠ Erreur lors du paiement. Veuillez réessayer.");
        }
      } else {
        const res = await fetch("/api/order/place-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart,
            paymentMethod,
            shippingAddress,
            city,
            postalCode,
            country,
            includeLuxuryPackaging,
            includeInsurance,
            giftMessage: showGiftMessageField ? giftMessage : "",
            specialInstructions
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "⚠ Échec de la commande.");
          return;
        }
        clearCart();
        setCheckoutComplete(true);
      }
    } catch (err) {
      console.error(err);
      setError("⚠ Une erreur est survenue lors du traitement de votre commande.");
    } finally {
      setLoading(false);
    }
  }

  // ORDER COMPLETED PAGE
  if (checkoutComplete) {
    return (
      <>
        <NextSeo
          title="Diamant Rouge | Confirmation de Commande"
          description="Votre commande de bijoux de luxe a été confirmée. Merci de votre confiance."
        />
        <main className="bg-brandIvory min-h-screen py-16 px-6">
          <div className="max-w-3xl mx-auto bg-white shadow-luxury rounded-xl p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-burgundy" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-brandGold mb-3">
                Merci pour votre commande
              </h1>
              <p className="text-platinumGray text-lg">
                Votre commande a été confirmée et est en cours de préparation.
              </p>
            </div>
            
            <div className="border-t border-b border-platinumGray/10 py-8 my-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="font-serif text-richEbony mb-2">Numéro de Commande</h3>
                  <p className="text-brandGold font-medium">#DR{Math.floor(Math.random() * 100000)}</p>
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-richEbony mb-2">Date de Livraison</h3>
                  <p className="text-platinumGray">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-richEbony mb-2">Méthode de Paiement</h3>
                  <p className="text-platinumGray">
                    {paymentMethod === "CMI" ? "Carte Bancaire" : "Paiement à la Livraison"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="bg-brandGold/10 p-2.5 rounded-full">
                  <Truck size={20} className="text-brandGold" />
                </div>
                <div>
                  <h3 className="font-serif text-richEbony">Suivi de Commande</h3>
                  <p className="text-sm text-platinumGray">
                    Un email de confirmation avec les détails de votre commande vous a été envoyé.
                    Vous recevrez prochainement un autre email avec les informations de suivi.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-brandGold/10 p-2.5 rounded-full">
                  <Award size={20} className="text-brandGold" />
                </div>
                <div>
                  <h3 className="font-serif text-richEbony">Service Exclusif</h3>
                  <p className="text-sm text-platinumGray">
                    Votre bijou bénéficie de notre service après-vente exclusif, incluant nettoyage et entretien gratuits à vie.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                className="px-8 py-3 rounded-full bg-brandGold text-white hover:bg-burgundy transition duration-300 shadow-md flex items-center justify-center"
                onClick={() => router.push("/profile")}
              >
                Voir Mes Commandes
                <ChevronRight size={18} className="ml-1" />
              </button>
              <button
                className="px-8 py-3 rounded-full bg-richEbony/5 text-richEbony hover:bg-richEbony/10 transition duration-300"
                onClick={() => router.push("/")}
              >
                Retourner à l'Accueil
              </button>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-platinumGray mb-2">Besoin d'assistance?</p>
              <a 
                href="tel:+212522222222" 
                className="text-brandGold hover:text-burgundy transition-colors inline-flex items-center justify-center"
              >
                <Phone size={16} className="mr-2" />
                +212 5 22 22 22 22
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  // EMPTY CART PAGE
  if (cart.length === 0) {
    return (
      <>
        <NextSeo
          title="Diamant Rouge | Panier Vide"
          description="Votre panier Diamant Rouge est actuellement vide."
        />
        <main className="bg-brandIvory py-16 px-6 min-h-screen">
          <div className="max-w-4xl mx-auto text-center">
            <Image 
              src="/images/icons/empty-cart.svg" 
              width={120} 
              height={120} 
              alt="Panier Vide" 
              className="mx-auto mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-serif text-brandGold mb-4">Votre Panier est Vide</h1>
            <p className="text-platinumGray mb-8 max-w-md mx-auto">
              Découvrez notre collection exceptionnelle de bijoux de luxe et créations sur mesure.
            </p>
            <Link href="/collections">
              <button className="button-primary px-8 py-3 rounded-full inline-flex items-center">
                Découvrir nos Collections
                <ChevronRight size={18} className="ml-2" />
              </button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  // MAIN CHECKOUT PAGE
  return (
    <>
      <NextSeo
        title="Diamant Rouge | Finaliser votre Commande"
        description="Finalisez votre commande de bijoux d'exception Diamant Rouge en toute sécurité."
      />

      <main className="bg-brandIvory py-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-platinumGray flex items-center space-x-2">
              <Link href="/" className="hover:text-brandGold transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-brandGold transition-colors">
                Panier
              </Link>
              <span>/</span>
              <span className="text-brandGold">Commande</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-brandGold">
              Finaliser votre Commande
            </h1>
            <div className="h-px w-32 bg-gradient-to-r from-brandGold to-transparent mt-2"></div>
          </div>

          {/* Mobile Order Summary Toggle */}
          <div className="lg:hidden mb-6">
            <button 
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="w-full bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <Package size={20} className="text-brandGold mr-2" />
                <span className="font-medium text-richEbony">Récapitulatif de commande</span>
              </div>
              <div className="flex items-center">
                <span className="text-brandGold font-serif mr-3">{formatPrice(total)}</span>
                {showOrderSummary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
          </div>

          {/* Checkout Steps Progress */}
          <div className="mb-8 hidden md:block">
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div key={step} className="flex-1 text-center">
                  <div className="relative">
                    <div 
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                        currentStep >= index 
                          ? 'bg-brandGold text-white' 
                          : 'bg-richEbony/5 text-platinumGray'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`absolute top-5 left-[55%] w-full h-px ${
                        currentStep > index ? 'bg-brandGold' : 'bg-platinumGray/30'
                      }`}></div>
                    )}
                  </div>
                  <div className={`mt-2 text-sm ${
                    currentStep >= index ? 'text-brandGold' : 'text-platinumGray'
                  }`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Layout: Form + Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-luxury p-6 md:p-8">

                {/* Step 1: Shipping */}
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-serif text-richEbony mb-6">Informations de Livraison</h2>
                      
                      <div className="space-y-6">
                        {/* Shipping Options */}
                        <div className="space-y-4">
                          <label className="block text-richEbony font-medium">
                            Mode de Livraison
                          </label>
                          
                          <div className="space-y-4">
                            {/* Store Pickup Option */}
                            <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${
                              shippingOption === "STORE" 
                                ? "border-burgundy bg-burgundy/5 shadow-sm" 
                                : "border-platinumGray/30 hover:border-burgundy/30"
                            }`}>
                              <div className="flex items-start">
                                <input
                                  type="radio"
                                  name="shippingOption"
                                  value="STORE"
                                  checked={shippingOption === "STORE"}
                                  onChange={() => {
                                    setShippingOption("STORE");
                                    setError("");
                                  }}
                                  className="mt-1 mr-3 accent-burgundy h-4 w-4"
                                />
                                <div>
                                  <div className="flex items-center">
                                    <MapPin size={16} className="text-brandGold mr-2" />
                                    <span className="font-medium text-richEbony">Retrait en Boutique</span>
                                  </div>
                                  <p className="text-sm text-platinumGray mt-1 ml-6">
                                    Diamant Rouge Boutique, 123 Rue de la Joaillerie, Casablanca
                                  </p>
                                  <p className="text-xs text-brandGold mt-2 ml-6">
                                    Gratuit • Disponible dès demain
                                  </p>
                                </div>
                              </div>
                            </label>
                            
                            {/* Profile Address Option */}
                            {userId && (
                              <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${
                                shippingOption === "PROFILE" 
                                  ? "border-burgundy bg-burgundy/5 shadow-sm" 
                                  : "border-platinumGray/30 hover:border-burgundy/30"
                              }`}>
                                <div className="flex items-start">
                                  <input
                                    type="radio"
                                    name="shippingOption"
                                    value="PROFILE"
                                    checked={shippingOption === "PROFILE"}
                                    onChange={() => {
                                      setShippingOption("PROFILE");
                                      setError("");
                                    }}
                                    className="mt-1 mr-3 accent-burgundy h-4 w-4"
                                  />
                                  <div>
                                    <span className="font-medium text-richEbony">Livraison à mon adresse</span>
                                    
                                    {userAddress ? (
                                      <p className="text-sm text-platinumGray mt-1">
                                        {userAddress}, {userCity}, {userPostalCode}, {userCountry}
                                      </p>
                                    ) : (
                                      <p className="text-sm text-burgundy mt-1">
                                        (Aucune adresse enregistrée dans votre profil)
                                      </p>
                                    )}
                                    <p className="text-xs text-brandGold mt-2">
                                      Livraison express sous 24h
                                    </p>
                                  </div>
                                </div>
                              </label>
                            )}
                            
                            {/* New Address Option */}
                            <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${
                              shippingOption === "NEW" 
                                ? "border-burgundy bg-burgundy/5 shadow-sm" 
                                : "border-platinumGray/30 hover:border-burgundy/30"
                            }`}>
                              <div className="flex items-start">
                                <input
                                  type="radio"
                                  name="shippingOption"
                                  value="NEW"
                                  checked={shippingOption === "NEW"}
                                  onChange={() => {
                                    setShippingOption("NEW");
                                    setError("");
                                  }}
                                  className="mt-1 mr-3 accent-burgundy h-4 w-4"
                                />
                                <div>
                                  <span className="font-medium text-richEbony">Nouvelle adresse de livraison</span>
                                  <p className="text-sm text-platinumGray mt-1">
                                    Entrez une nouvelle adresse pour cette commande
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                        
                        {/* New Address Form */}
                        {shippingOption === "NEW" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 mt-6 pt-6 border-t border-platinumGray/10"
                          >
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-richEbony">
                                Adresse complète
                              </label>
                              <input
                                type="text"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                placeholder="Adresse de livraison"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-richEbony">
                                  Ville
                                </label>
                                <input
                                  type="text"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                  placeholder="Ville"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-richEbony">
                                  Code Postal
                                </label>
                                <input
                                  type="text"
                                  value={postalCode}
                                  onChange={(e) => setPostalCode(e.target.value)}
                                  className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                  placeholder="Code postal"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-richEbony">
                                Pays
                              </label>
                              <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                placeholder="Pays"
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Gift Options */}
                        <div className="mt-8 pt-6 border-t border-platinumGray/10">
                          <h3 className="text-lg font-serif text-richEbony mb-4">Options de Présentation</h3>
                          
                          <div className="space-y-4">
                            <label className="flex items-start">
                              <input
                                type="checkbox"
                                checked={includeLuxuryPackaging}
                                onChange={() => setIncludeLuxuryPackaging(!includeLuxuryPackaging)}
                                className="mt-1 mr-3 accent-burgundy h-4 w-4"
                              />
                              <div>
                                <div className="flex items-center">
                                  <GiftIcon size={16} className="text-brandGold mr-2" />
                                  <span className="font-medium text-richEbony">Écrin Diamant Rouge Signature</span>
                                </div>
                                <p className="text-sm text-platinumGray mt-1">
                                  Coffret en cuir véritable doublé de velours précieux avec certificat d'authenticité
                                </p>
                                <p className="text-xs text-brandGold mt-1">
                                  {formatPrice(luxuryPackagingFee)}
                                </p>
                              </div>
                            </label>
                            
                            <label className="flex items-start">
                              <input
                                type="checkbox"
                                checked={showGiftMessageField}
                                onChange={() => setShowGiftMessageField(!showGiftMessageField)}
                                className="mt-1 mr-3 accent-burgundy h-4 w-4"
                              />
                              <divimport { useCart } from "../contexts/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { jwtVerify } from "jose";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Package, ChevronRight, Lock, CreditCard, 
  Calendar, Award, MapPin, Truck, Phone, GiftIcon,
  ArrowLeft, ChevronDown, ChevronUp, Check, AlertCircle
} from "lucide-react";

type CheckoutProps = {
  userId: number | null;
  userAddress?: string;
  userCity?: string;
  userPostalCode?: string;
  userCountry?: string;
};

export default function CheckoutPage({
  userId,
  userAddress,
  userCity,
  userPostalCode,
  userCountry,
}: CheckoutProps) {
  const { cart, clearCart } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Checkout steps
  const STEPS = ["Livraison", "Paiement", "Confirmation"];
  const [currentStep, setCurrentStep] = useState(0);

  // Order summary toggle for mobile
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"CMI" | "COD" | "">("");

  // Shipping Option: "STORE", "PROFILE", or "NEW"
  const [shippingOption, setShippingOption] = useState<"STORE" | "PROFILE" | "NEW" | "">("");

  // Final shipping address state
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Additional options
  const [includeLuxuryPackaging, setIncludeLuxuryPackaging] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [giftMessage, setGiftMessage] = useState("");
  const [showGiftMessageField, setShowGiftMessageField] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Store address for pickup
  const storeAddress = "Diamant Rouge Boutique, 123 Rue de la Joaillerie, Casablanca";

  // Compute cart total using fallback from product.basePrice if item.price is undefined
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice =
      item.price !== undefined
        ? item.price
        : item.product && item.product.basePrice
          ? parseFloat(item.product.basePrice)
          : 0;
    return sum + itemPrice * item.quantity;
  }, 0);
  
  // Additional costs
  const luxuryPackagingFee = 290; // Fixed fee for luxury packaging
  const insuranceRate = 0.01; // 1% of subtotal
  const insuranceFee = includeInsurance ? Math.ceil(subtotal * insuranceRate) : 0;
  
  // Calculate final total
  const total = subtotal + 
               (includeLuxuryPackaging ? luxuryPackagingFee : 0) + 
               insuranceFee;

  // Format currency as MAD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(price);
  };

  // Update shipping address based on the selected option
  useEffect(() => {
    if (shippingOption === "STORE") {
      setShippingAddress(storeAddress);
      setCity("Casablanca");
      setPostalCode("20000");
      setCountry("Maroc");
    } else if (shippingOption === "PROFILE") {
      setShippingAddress(userAddress || "");
      setCity(userCity || "");
      setPostalCode(userPostalCode || "");
      setCountry(userCountry || "");
    } else if (shippingOption === "NEW") {
      setShippingAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
    }
  }, [shippingOption, userAddress, userCity, userPostalCode, userCountry]);

  // Handle form navigation
  const goToNextStep = () => {
    if (currentStep === 0) {
      if (!shippingOption) {
        setError("⚠ Veuillez sélectionner une option de livraison.");
        return;
      }
      if (shippingOption === "NEW") {
        if (!shippingAddress || !city || !postalCode || !country) {
          setError("⚠ Veuillez remplir tous les champs pour la livraison.");
          return;
        }
      }
      setError("");
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (!paymentMethod) {
        setError("⚠ Veuillez sélectionner un mode de paiement.");
        return;
      }
      setError("");
      setCurrentStep(2);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  async function handleCheckout() {
    if (currentStep !== 2) {
      goToNextStep();
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "CMI") {
        const res = await fetch("/api/payment/cmi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: Date.now().toString(),
            amount: total,
            customerEmail: "customer@example.com", // Replace with actual user email
          }),
        });
        const data = await res.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          setError("⚠ Erreur lors du paiement. Veuillez réessayer.");
        }
      } else {
        const res = await fetch("/api/order/place-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart,
            paymentMethod,
            shippingAddress,
            city,
            postalCode,
            country,
            includeLuxuryPackaging,
            includeInsurance,
            giftMessage: showGiftMessageField ? giftMessage : "",
            specialInstructions
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "⚠ Échec de la commande.");
          return;
        }
        clearCart();
        setCheckoutComplete(true);
      }
    } catch (err) {
      console.error(err);
      setError("⚠ Une erreur est survenue lors du traitement de votre commande.");
    } finally {
      setLoading(false);
    }
  }

  // ORDER COMPLETED PAGE
  if (checkoutComplete) {
    return (
      <>
        <NextSeo
          title="Diamant Rouge | Confirmation de Commande"
          description="Votre commande de bijoux de luxe a été confirmée. Merci de votre confiance."
        />
        <main className="bg-brandIvory min-h-screen py-16 px-6">
          <div className="max-w-3xl mx-auto bg-white shadow-luxury rounded-xl p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-burgundy" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-brandGold mb-3">
                Merci pour votre commande
              </h1>
              <p className="text-platinumGray text-lg">
                Votre commande a été confirmée et est en cours de préparation.
              </p>
            </div>
            
            <div className="border-t border-b border-platinumGray/10 py-8 my-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="font-serif text-richEbony mb-2">Numéro de Commande</h3>
                  <p className="text-brandGold font-medium">#DR{Math.floor(Math.random() * 100000)}</p>
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-richEbony mb-2">Date de Livraison</h3>
                  <p className="text-platinumGray">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-richEbony mb-2">Méthode de Paiement</h3>
                  <p className="text-platinumGray">
                    {paymentMethod === "CMI" ? "Carte Bancaire" : "Paiement à la Livraison"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="bg-brandGold/10 p-2.5 rounded-full">
                  <Truck size={20} className="text-brandGold" />
                </div>
                <div>
                  <h3 className="font-serif text-richEbony">Suivi de Commande</h3>
                  <p className="text-sm text-platinumGray">
                    Un email de confirmation avec les détails de votre commande vous a été envoyé.
                    Vous recevrez prochainement un autre email avec les informations de suivi.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-brandGold/10 p-2.5 rounded-full">
                  <Award size={20} className="text-brandGold" />
                </div>
                <div>
                  <h3 className="font-serif text-richEbony">Service Exclusif</h3>
                  <p className="text-sm text-platinumGray">
                    Votre bijou bénéficie de notre service après-vente exclusif, incluant nettoyage et entretien gratuits à vie.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                className="px-8 py-3 rounded-full bg-brandGold text-white hover:bg-burgundy transition duration-300 shadow-md flex items-center justify-center"
                onClick={() => router.push("/profile")}
              >
                Voir Mes Commandes
                <ChevronRight size={18} className="ml-1" />
              </button>
              <button
                className="px-8 py-3 rounded-full bg-richEbony/5 text-richEbony hover:bg-richEbony/10 transition duration-300"
                onClick={() => router.push("/")}
              >
                Retourner à l'Accueil
              </button>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-platinumGray mb-2">Besoin d'assistance?</p>
              <a 
                href="tel:+212522222222" 
                className="text-brandGold hover:text-burgundy transition-colors inline-flex items-center justify-center"
              >
                <Phone size={16} className="mr-2" />
                +212 5 22 22 22 22
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  // EMPTY CART PAGE
  if (cart.length === 0) {
    return (
      <>
        <NextSeo
          title="Diamant Rouge | Panier Vide"
          description="Votre panier Diamant Rouge est actuellement vide."
        />
        <main className="bg-brandIvory py-16 px-6 min-h-screen">
          <div className="max-w-4xl mx-auto text-center">
            <Image 
              src="/images/icons/empty-cart.svg" 
              width={120} 
              height={120} 
              alt="Panier Vide" 
              className="mx-auto mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-serif text-brandGold mb-4">Votre Panier est Vide</h1>
            <p className="text-platinumGray mb-8 max-w-md mx-auto">
              Découvrez notre collection exceptionnelle de bijoux de luxe et créations sur mesure.
            </p>
            <Link href="/collections">
              <button className="button-primary px-8 py-3 rounded-full inline-flex items-center">
                Découvrir nos Collections
                <ChevronRight size={18} className="ml-2" />
              </button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  // MAIN CHECKOUT PAGE
  return (
    <>
      <NextSeo
        title="Diamant Rouge | Finaliser votre Commande"
        description="Finalisez votre commande de bijoux d'exception Diamant Rouge en toute sécurité."
      />

      <main className="bg-brandIvory py-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-platinumGray flex items-center space-x-2">
              <Link href="/" className="hover:text-brandGold transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-brandGold transition-colors">
                Panier
              </Link>
              <span>/</span>
              <span className="text-brandGold">Commande</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-brandGold">
              Finaliser votre Commande
            </h1>
            <div className="h-px w-32 bg-gradient-to-r from-brandGold to-transparent mt-2"></div>
          </div>

          {/* Mobile Order Summary Toggle */}
          <div className="lg:hidden mb-6">
            <button 
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="w-full bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <Package size={20} className="text-brandGold mr-2" />
                <span className="font-medium text-richEbony">Récapitulatif de commande</span>
              </div>
              <div className="flex items-center">
                <span className="text-brandGold font-serif mr-3">{formatPrice(total)}</span>
                {showOrderSummary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
          </div>

          {/* Checkout Steps Progress */}
          <div className="mb-8 hidden md:block">
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div key={step} className="flex-1 text-center">
                  <div className="relative">
                    <div 
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                        currentStep >= index 
                          ? 'bg-brandGold text-white' 
                          : 'bg-richEbony/5 text-platinumGray'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`absolute top-5 left-[55%] w-full h-px ${
                        currentStep > index ? 'bg-brandGold' : 'bg-platinumGray/30'
                      }`}></div>
                    )}
                  </div>
                  <div className={`mt-2 text-sm ${
                    currentStep >= index ? 'text-brandGold' : 'text-platinumGray'
                  }`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Layout: Form + Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-luxury p-6 md:p-8">

                {/* Step 1: Shipping */}
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-serif text-richEbony mb-6">Informations de Livraison</h2>
                      
                      <div className="space-y-6">
                        {/* Shipping Options */}
                        <div className="space-y-4">
                          <label className="block text-richEbony font-medium">
                            Mode de Livraison
                          </label>
                          
                          <div className="space-y-4">
                            {/* Store Pickup Option */}
                            <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${
                              shippingOption === "STORE" 
                                ? "border-burgundy bg-burgundy/5 shadow-sm" 
                                : "border-platinumGray/30 hover:border-burgundy/30"
                            }`}>
                              <div className="flex items-start">
                                <input
                                  type="radio"
                                  name="shippingOption"
                                  value="STORE"
                                  checked={shippingOption === "STORE"}
                                  onChange={() => {
                                    setShippingOption("STORE");
                                    setError("");
                                  }}
                                  className="mt-1 mr-3 accent-burgundy h-4 w-4"
                                />
                                <div>
                                  <div className="flex items-center">
                                    <MapPin size={16} className="text-brandGold mr-2" />
                                    <span className="font-medium text-richEbony">Retrait en Boutique</span>
                                  </div>
                                  <p className="text-sm text-platinumGray mt-1 ml-6">
                                    Diamant Rouge Boutique, 123 Rue de la Joaillerie, Casablanca
                                  </p>
                                  <p className="text-xs text-brandGold mt-2 ml-6">
                                    Gratuit • Disponible dès demain
                                  </p>
                                </div>
                              </div>
                            </label>
                            
                            {/* Profile Address Option */}
                            {userId && (
                              <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${
                                shippingOption === "PROFILE" 
                                  ? "border-burgundy bg-burgundy/5 shadow-sm" 
                                  : "border-platinumGray/30 hover:border-burgundy/30"
                              }`}>
                                <div className="flex items-start">
                                  <input
                                    type="radio"
                                    name="shippingOption"
                                    value="PROFILE"
                                    checked={shippingOption === "PROFILE"}
                                    onChange={() => {
                                      setShippingOption("PROFILE");
                                      setError("");
                                    }}
                                    className="mt-1 mr-3 accent-burgundy h-4 w-4"
                                  />
                                  <div>
                                    <span className="font-medium text-richEbony">Livraison à mon adresse</span>
                                    
                                    {userAddress ? (
                                      <p className="text-sm text-platinumGray mt-1">
                                        {userAddress}, {userCity}, {userPostalCode}, {userCountry}
                                      </p>
                                    ) : (
                                      <p className="text-sm text-burgundy mt-1">
                                        (Aucune adresse enregistrée dans votre profil)
                                      </p>
                                    )}
                                    <p className="text-xs text-brandGold mt-2">
                                      Livraison express sous 24h
                                    </p>
                                  </div>
                                </div>
                              </label>
                            )}
                            
                            {/* New Address Option */}
                            <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${
                              shippingOption === "NEW" 
                                ? "border-burgundy bg-burgundy/5 shadow-sm" 
                                : "border-platinumGray/30 hover:border-burgundy/30"
                            }`}>
                              <div className="flex items-start">
                                <input
                                  type="radio"
                                  name="shippingOption"
                                  value="NEW"
                                  checked={shippingOption === "NEW"}
                                  onChange={() => {
                                    setShippingOption("NEW");
                                    setError("");
                                  }}
                                  className="mt-1 mr-3 accent-burgundy h-4 w-4"
                                />
                                <div>
                                  <span className="font-medium text-richEbony">Nouvelle adresse de livraison</span>
                                  <p className="text-sm text-platinumGray mt-1">
                                    Entrez une nouvelle adresse pour cette commande
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                        
                        {/* New Address Form */}
                        {shippingOption === "NEW" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 mt-6 pt-6 border-t border-platinumGray/10"
                          >
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-richEbony">
                                Adresse complète
                              </label>
                              <input
                                type="text"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                placeholder="Adresse de livraison"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-richEbony">
                                  Ville
                                </label>
                                <input
                                  type="text"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                  placeholder="Ville"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-richEbony">
                                  Code Postal
                                </label>
                                <input
                                  type="text"
                                  value={postalCode}
                                  onChange={(e) => setPostalCode(e.target.value)}
                                  className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                  placeholder="Code postal"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-richEbony">
                                Pays
                              </label>
                              <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                placeholder="Pays"
                              />
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Gift Options */}
                        <div className="mt-8 pt-6 border-t border-platinumGray/10">
                          <h3 className="text-lg font-serif text-richEbony mb-4">Options de Présentation</h3>
                          
                          <div className="space-y-4">
                            <label className="flex items-start">
                              <input
                                type="checkbox"
                                checked={includeLuxuryPackaging}
                                onChange={() => setIncludeLuxuryPackaging(!includeLuxuryPackaging)}
                                className="mt-1 mr-3 accent-burgundy h-4 w-4"
                              />
                              <div>
                                <div className="flex items-center">
                                  <GiftIcon size={16} className="text-brandGold mr-2" />
                                  <span className="font-medium text-richEbony">Écrin Diamant Rouge Signature</span>
                                </div>
                                <p className="text-sm text-platinumGray mt-1">
                                  Coffret en cuir véritable doublé de velours précieux avec certificat d'authenticité
                                </p>
                                <p className="text-xs text-brandGold mt-1">
                                  {formatPrice(luxuryPackagingFee)}
                                </p>
                              </div>
                            </label>
                            
                            <label className="flex items-start">
                              <input
                                type="checkbox"
                                checked={showGiftMessageField}
                                onChange={() => setShowGiftMessageField(!showGiftMessageField)}
                                className="mt-1 mr-3 accent-burgundy h-4 w-4"
                              />
                              <div