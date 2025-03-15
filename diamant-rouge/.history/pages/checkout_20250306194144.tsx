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
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${currentStep >= index
                          ? 'bg-brandGold text-white'
                          : 'bg-richEbony/5 text-platinumGray'
                        }`}
                    >
                      {index + 1}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`absolute top-5 left-[55%] w-full h-px ${currentStep > index ? 'bg-brandGold' : 'bg-platinumGray/30'
                        }`}></div>
                    )}
                  </div>
                  <div className={`mt-2 text-sm ${currentStep >= index ? 'text-brandGold' : 'text-platinumGray'
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
                            <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${shippingOption === "STORE"
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
                              <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${shippingOption === "PROFILE"
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
                            <label className={`block p-4 border rounded-lg transition-all cursor-pointer ${shippingOption === "NEW"
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
                              <div>
                                <span className="font-medium text-richEbony">Ajouter un message personnalisé</span>
                                <p className="text-sm text-platinumGray mt-1">
                                  Nous inscrirons votre message sur une carte calligraphiée à la main
                                </p>
                              </div>
                            </label>

                            {showGiftMessageField && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.3 }}
                                className="pl-7 mt-3"
                              >
                                <textarea
                                  value={giftMessage}
                                  onChange={(e) => setGiftMessage(e.target.value)}
                                  className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                                  placeholder="Votre message personnel (150 caractères maximum)"
                                  maxLength={150}
                                  rows={3}
                                ></textarea>
                                <p className="text-xs text-platinumGray mt-1 text-right">
                                  {giftMessage.length}/150 caractères
                                </p>
                              </motion.div>
                            )}

                            <label className="flex items-start">
                              <input
                                type="checkbox"
                                checked={includeInsurance}
                                onChange={() => setIncludeInsurance(!includeInsurance)}
                                className="mt-1 mr-3 accent-burgundy h-4 w-4"
                              />
                              <div>
                                <div className="flex items-center">
                                  <Shield size={16} className="text-brandGold mr-2" />
                                  <span className="font-medium text-richEbony">Assurance Transport Premium</span>
                                </div>
                                <p className="text-sm text-platinumGray mt-1">
                                  Couverture complète contre la perte, le vol et les dommages pendant la livraison
                                </p>
                                <p className="text-xs text-brandGold mt-1">
                                  {formatPrice(insuranceFee)} (1% de la valeur)
                                </p>
                              </div>
                            </label>
                          </div>

                          {/* Special Instructions */}
                          <div className="mt-6">
                            <label className="block text-sm font-medium text-richEbony mb-2">
                              Instructions Spéciales (facultatif)
                            </label>
                            <textarea
                              value={specialInstructions}
                              onChange={(e) => setSpecialInstructions(e.target.value)}
                              className="w-full p-3 bg-richEbony/5 rounded-lg border border-platinumGray/30 focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all"
                              placeholder="Instructions particulières pour votre livraison ou détails supplémentaires pour notre équipe"
                              rows={2}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Payment Method */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-serif text-richEbony mb-6">Méthode de Paiement</h2>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className={`block p-5 border rounded-lg transition-all cursor-pointer ${paymentMethod === "CMI"
                              ? "border-burgundy bg-burgundy/5 shadow-sm"
                              : "border-platinumGray/30 hover:border-burgundy/30"
                            }`}>
                            <div className="flex items-start">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="CMI"
                                checked={paymentMethod === "CMI"}
                                onChange={() => {
                                  setPaymentMethod("CMI");
                                  setError("");
                                }}
                                className="mt-1 mr-3 accent-burgundy h-4 w-4"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <CreditCard size={18} className="text-brandGold mr-2" />
                                    <span className="font-medium text-richEbony">Carte Bancaire</span>
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-6 w-10 bg-white rounded shadow-sm flex items-center justify-center">
                                      <Image
                                        src="/images/icons/visa.png"
                                        width={24}
                                        height={16}
                                        alt="Visa"
                                      />
                                    </div>
                                    <div className="h-6 w-10 bg-white rounded shadow-sm flex items-center justify-center">
                                      <Image
                                        src="/images/icons/mastercard.svg"
                                        width={24}
                                        height={16}
                                        alt="Mastercard"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-platinumGray mt-2">
                                  Paiement sécurisé avec cryptage SSL 256-bit. Vos informations bancaires ne sont pas stockées.
                                </p>

                                {paymentMethod === "CMI" && (
                                  <motion.divh3
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 pt-4 border-t border-platinumGray/10"
                                  >
                                    <p className="text-sm text-richEbony mb-3">
                                      Vous serez redirigé vers une page de paiement sécurisée après avoir confirmé votre commande.
                                    </p>
                                    <div className="flex items-center">
                                      <Lock size={16} className="text-brandGold mr-2" />
                                      <span className="text-xs text-platinumGray">
                                        Paiement sécurisé par CMI
                                      </span>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </label>

                          <label className={`block p-5 border rounded-lg transition-all cursor-pointer ${paymentMethod === "COD"
                              ? "border-burgundy bg-burgundy/5 shadow-sm"
                              : "border-platinumGray/30 hover:border-burgundy/30"
                            }`}>
                            <div className="flex items-start">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => {
                                  setPaymentMethod("COD");
                                  setError("");
                                }}
                                className="mt-1 mr-3 accent-burgundy h-4 w-4"
                              />
                              <div>
                                <div className="flex items-center">
                                  <Package size={18} className="text-brandGold mr-2" />
                                  <span className="font-medium text-richEbony">Paiement à la Livraison</span>
                                </div>
                                <p className="text-sm text-platinumGray mt-2">
                                  Réglez en espèces ou par carte bancaire au moment de la livraison de votre commande.
                                </p>

                                {paymentMethod === "COD" && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 pt-4 border-t border-platinumGray/10"
                                  >
                                    <div className="bg-burgundy/5 border border-burgundy/10 rounded p-3">
                                      <div className="flex items-start">
                                        <AlertCircle size={18} className="text-burgundy mr-2 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-richEbony">
                                          La commande sera préparée et vous sera livrée par notre service de livraison privé.
                                          Assurez-vous d'être disponible à l'adresse de livraison indiquée.
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-platinumGray/10">
                        <div className="flex justify-center">
                          <div className="flex items-center gap-1">
                            <Lock size={16} className="text-brandGold" />
                            <span className="text-sm text-platinumGray">Paiement 100% Sécurisé</span>
                          </div>
                        </div>
                        <div className="flex justify-center mt-3 gap-6">
                          <Image src="/images/icons/secure-payment-1.png" width={60} height={30} alt="Certification" className="h-6 w-auto opacity-50" />
                          <Image src="/images/icons/secure-payment-2.png" width={60} height={30} alt="Certification" className="h-6 w-auto opacity-50" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Review and Place Order */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-serif text-richEbony mb-6">Confirmation de Commande</h2>

                      <div className="space-y-8">
                        {/* Order Review */}
                        <div className="space-y-6">
                          {/* Shipping Details */}
                          <div className="bg-brandGold/5 rounded-lg p-5">
                            <div className="flex items-start">
                              <div className="p-2 bg-brandGold/20 rounded-full mr-4">
                                <MapPin size={18} className="text-brandGold" />
                              </div>
                              <div>
                                <h3 className="font-serif text-richEbony mb-1">Adresse de Livraison</h3>
                                <p className="text-sm text-platinumGray">
                                  {shippingOption === "STORE" ? (
                                    <>
                                      <span className="font-medium">Retrait en Boutique</span><br />
                                      {storeAddress}
                                    </>
                                  ) : (
                                    <>
                                      {shippingAddress}<br />
                                      {city}, {postalCode}<br />
                                      {country}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div className="bg-brandGold/5 rounded-lg p-5">
                            <div className="flex items-start">
                              <div className="p-2 bg-brandGold/20 rounded-full mr-4">
                                {paymentMethod === "CMI" ? (
                                  <CreditCard size={18} className="text-brandGold" />
                                ) : (
                                  <Package size={18} className="text-brandGold" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-serif text-richEbony mb-1">Méthode de Paiement</h3>
                                <p className="text-sm text-platinumGray">
                                  {paymentMethod === "CMI" ? (
                                    "Paiement par Carte Bancaire"
                                  ) : (
                                    "Paiement à la Livraison"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Options Overview */}
                          <div className="bg-brandGold/5 rounded-lg p-5">
                            <div className="flex items-start">
                              <div className="p-2 bg-brandGold/20 rounded-full mr-4">
                                <GiftIcon size={18} className="text-brandGold" />
                              </div>
                              <div>
                                <h3 className="font-serif text-richEbony mb-1">Options Sélectionnées</h3>
                                <ul className="text-sm text-platinumGray space-y-2 mt-2">
                                  <li className="flex items-center">
                                    <Check size={14} className="text-brandGold mr-2" />
                                    {includeLuxuryPackaging ? (
                                      "Écrin Diamant Rouge Signature inclus"
                                    ) : (
                                      <span className="line-through opacity-50">Écrin Diamant Rouge Signature</span>
                                    )}
                                  </li>
                                  <li className="flex items-center">
                                    <Check size={14} className="text-brandGold mr-2" />
                                    {includeInsurance ? (
                                      "Assurance Transport Premium incluse"
                                    ) : (
                                      <span className="line-through opacity-50">Assurance Transport Premium</span>
                                    )}
                                  </li>
                                  {showGiftMessageField && giftMessage && (
                                    <li className="flex items-start">
                                      <Check size={14} className="text-brandGold mr-2 mt-1" />
                                      <div>
                                        <span className="block">Message personnel inclus:</span>
                                        <p className="italic mt-1 text-platinumGray">"{giftMessage}"</p>
                                      </div>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Legal Acceptance */}
                        <div className="border-t border-b border-platinumGray/10 py-6 text-sm text-platinumGray">
                          <p className="mb-4">
                            En finalisant cette commande, vous acceptez nos{" "}
                            <Link href="/terms" className="text-brandGold hover:underline">
                              Conditions Générales de Vente
                            </Link>{" "}
                            et notre{" "}
                            <Link href="/privacy" className="text-brandGold hover:underline">
                              Politique de Confidentialité
                            </Link>.
                          </p>
                          <p>
                            Votre commande sera traitée avec le plus grand soin par nos artisans joailliers.
                            Chaque création Diamant Rouge est accompagnée d'un certificat d'authenticité.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  </AnimatePresence>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className="bg-burgundy/10 border border-burgundy/20 rounded-lg p-4 mt-6 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={18} className="text-burgundy mr-2 flex-shrink-0" />
                      <p className="text-sm text-burgundy">{error}</p>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between">
                    {currentStep > 0 ? (
                      <button
                        onClick={goToPreviousStep}
                        className="flex items-center text-platinumGray hover:text-brandGold transition-colors"
                        disabled={loading}
                      >
                        <ArrowLeft size={18} className="mr-1" />
                        Retour
                      </button>
                    ) : (
                      <Link href="/cart" className="flex items-center text-platinumGray hover:text-brandGold transition-colors">
                        <ArrowLeft size={18} className="mr-1" />
                        Retour au panier
                      </Link>
                    )}

                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      className={`px-8 py-3 rounded-full bg-brandGold text-white hover:bg-burgundy transition-all flex items-center justify-center shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                      {loading ? (
                        <>
                          <span className="mr-2">Traitement...</span>
                          <div className="w-5 h-5 border-2 border-t-2 border-white/30 border-t-white/100 rounded-full animate-spin"></div>
                        </>
                      ) : (
                        currentStep === 2 ? (
                          <>
                            <span className="mr-2">Confirmer la commande</span>
                            <div className="bg-white/20 rounded-full p-1">
                              <ChevronRight size={14} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="mr-2">Continuer</span>
                            <div className="bg-white/20 rounded-full p-1">
                              <ChevronRight size={14} className="text-white" />
                            </div>
                          </>
                        )
                      )}
                    </button>
                  </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className={`bg-white rounded-xl shadow-luxury p-6 md:p-8 ${!showOrderSummary && "lg:block hidden"
                }`}>
                <h2 className="text-2xl font-serif text-richEbony mb-6">Récapitulatif</h2>

                <div className="max-h-80 overflow-y-auto pr-2 space-y-4 mb-6">
                  {cart.map((item) => {
                    // Derive image from the CartItem first, then from the related product
                    const imageSrc =
                      item.image ||
                      (item.product && item.product.images && item.product.images[0]) ||
                      "/images/placeholder.jpg";

                    // Derive product name: use item.name if present; otherwise, try to get it from product translations
                    let productName = item.name;
                    if (!productName && item.product && item.product.translations) {
                      const translation =
                        item.product.translations.find((t) => t.language === "fr") ||
                        item.product.translations.find((t) => t.language === "en") ||
                        item.product.translations[0];
                      productName = translation?.name;
                    }

                    // Use item.price if available, otherwise fallback to the product's basePrice
                    const price =
                      item.price ?? (item.product ? parseFloat(item.product.basePrice) : 0);

                    return (
                      <div
                        key={`${item.productId}-${item.variationId || "default"}`}
                        className="flex gap-3 pb-4 border-b border-platinumGray/10"
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                          <Image
                            src={imageSrc}
                            width={64}
                            height={64}
                            alt={productName || "Bijou Diamant Rouge"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-richEbony line-clamp-1">
                            {productName || "Création Diamant Rouge"}
                          </h4>
                          <p className="text-xs text-platinumGray mt-1">
                            Quantité: {item.quantity}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-platinumGray">
                              {item.sku || (item.product ? item.product.sku : "N/A")}
                            </p>
                            <p className="text-sm text-brandGold font-medium">
                              {formatPrice(price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-platinumGray">Sous-total</p>
                    <p className="text-richEbony">{formatPrice(subtotal)}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-platinumGray">Écrin Diamant Rouge</p>
                    <p className={includeLuxuryPackaging ? "text-richEbony" : "text-platinumGray line-through"}>
                      {formatPrice(luxuryPackagingFee)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-platinumGray">Assurance transport</p>
                    <p className={includeInsurance ? "text-richEbony" : "text-platinumGray line-through"}>
                      {formatPrice(insuranceFee)}
                    </p>
                  </div>

                  {/* Livraison */}
                  <div className="flex justify-between items-center">
                    <p className="text-platinumGray">Livraison</p>
                    <p className="text-brandGold">Gratuite</p>
                  </div>

                  <div className="border-t border-b border-platinumGray/10 py-4 my-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-richEbony">Total</p>
                      <p className="font-serif text-xl text-brandGold">{formatPrice(total)}</p>
                    </div>
                    <p className="text-xs text-platinumGray mt-2 text-right">
                      TVA incluse
                    </p>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="border-t border-platinumGray/10 pt-6 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-brandGold/10 p-1.5 rounded-full mr-2">
                        <Truck size={14} className="text-brandGold" />
                      </div>
                      <p className="text-xs text-platinumGray">Livraison express sous 24h</p>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-brandGold/10 p-1.5 rounded-full mr-2">
                        <Shield size={14} className="text-brandGold" />
                      </div>
                      <p className="text-xs text-platinumGray">Paiements sécurisés</p>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-brandGold/10 p-1.5 rounded-full mr-2">
                        <Award size={14} className="text-brandGold" />
                      </div>
                      <p className="text-xs text-platinumGray">Certificat d'authenticité</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-platinumGray/10">
                    <p className="text-xs text-center text-platinumGray mb-3">Besoin d'assistance?</p>
                    <a
                      href="tel:+212522222222"
                      className="flex items-center justify-center text-sm text-burgundy hover:text-brandGold transition-colors"
                    >
                      <Phone size={16} className="mr-2" />
                      +212 5 22 22 22 22
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get user from session cookie
  const cookieName = process.env.JWT_COOKIE_NAME || "diamantRougeJwt";
  const token = context.req.cookies[cookieName];

  let userId = null;
  let userData = null;

  if (token) {
    try {
      // Verify and decode JWT
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      userId = payload.id as number;

      // Fetch user's address info from database
      userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          address: true,
          city: true,
          postalCode: true,
          country: true,
        },
      });
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  }

  return {
    props: {
      userId: userId,
      userAddress: userData?.address || null,
      userCity: userData?.city || null,
      userPostalCode: userData?.postalCode || null,
      userCountry: userData?.country || null,
    },
  };
};