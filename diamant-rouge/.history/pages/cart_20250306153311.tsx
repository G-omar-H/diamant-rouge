import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import { Shield, GiftIcon, Phone, Package, ArrowRight, HelpCircle, Lock, CreditCard, Info } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [showInsuranceInfo, setShowInsuranceInfo] = useState(false);

  // Calculate total using either the cart item price or fallback to product.basePrice
  const subtotal = cart.reduce((sum, item) => {
    const price = item.price ?? (item.product ? parseFloat(item.product.basePrice) : 0);
    return sum + price * item.quantity;
  }, 0);

  // Add luxury packaging (optional)
  const luxuryPackagingFee = 290;
  const [includeLuxuryPackaging, setIncludeLuxuryPackaging] = useState(true);
  
  // Insurance (optional)
  const insuranceRate = 0.01; // 1% of subtotal
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const insuranceFee = includeInsurance ? Math.ceil(subtotal * insuranceRate) : 0;
  
  // Calculate final total
  const total = subtotal + 
               (includeLuxuryPackaging ? luxuryPackagingFee : 0) + 
               insuranceFee;

  // Format currency as MAD
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(price);
  };

  if (cart.length === 0) {
    return (
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
              <ArrowRight size={18} className="ml-2" />
            </button>
          </Link>
          <div className="mt-16 border-t border-platinumGray/10 pt-8">
            <h2 className="text-xl font-serif text-brandGold mb-4">Besoin d'Assistance?</h2>
            <p className="text-platinumGray mb-4">
              Nos experts diamantaires sont à votre disposition pour vous guider dans votre choix.
            </p>
            <a href="tel:+212522222222" className="text-brandGold hover:text-burgundy flex items-center justify-center transition-colors">
              <Phone size={18} className="mr-2" />
              +212 5 22 22 22 22
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <NextSeo
        title="Diamant Rouge | Votre Panier"
        description="Votre sélection de bijoux d'exception chez Diamant Rouge, maison de haute joaillerie au Maroc."
      />

      <main className="bg-brandIvory py-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm text-platinumGray flex items-center space-x-2">
              <Link href="/" className="hover:text-brandGold transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-brandGold transition-colors">Collections</Link>
              <span>/</span>
              <span className="text-brandGold">Panier</span>
            </nav>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Left column: Cart items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-serif text-richEbony">
                  Votre Panier 
                  <span className="text-platinumGray ml-2 text-lg">({cart.length} {cart.length === 1 ? 'article' : 'articles'})</span>
                </h1>
                <button
                  onClick={clearCart}
                  className="text-sm text-platinumGray hover:text-burgundy transition-colors"
                >
                  Vider le panier
                </button>
              </div>

              <div className="space-y-6 mb-8">
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
                  const price = item.price ?? (item.product ? parseFloat(item.product.basePrice) : 0);

                  return (
                    <motion.div
                      key={item.id || `${item.productId}-${item.variationId || "default"}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-lg p-6 shadow-luxury flex gap-6 relative"
                    >
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={imageSrc}
                          width={120}
                          height={120}
                          alt={productName || "Bijou Diamant Rouge"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl text-richEbony mb-1">
                          {productName || "Création Diamant Rouge"}
                        </h3>
                        <p className="text-xs text-platinumGray mb-3">
                          Réf: {item.sku || (item.product ? item.product.sku : "N/A")}
                        </p>

                        {/* Show variations if any */}
                        {item.variationId && (
                          <p className="text-sm text-platinumGray mb-3">
                            {/* Display variation details if available */}
                            Personnalisation: Or blanc 18k, Diamant 1.2ct
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-platinumGray/30 rounded-md">
  <button 
    onClick={async () => {
      if (item.quantity > 1) {
        try {
          await updateQuantity(item.productId, item.variationId, item.quantity - 1);
        } catch (error) {
          console.error("Error decreasing quantity:", error);
        }
      }
    }}
    className="px-3 py-1 text-platinumGray hover:text-burgundy"
    disabled={item.quantity <= 1}
  >
    -
  </button>
  <span className="px-3 py-1 text-sm text-richEbony">{item.quantity}</span>
  <button 
    onClick={async () => {
      try {
        await updateQuantity(item.productId, item.variationId, item.quantity + 1);
      } catch (error) {
        console.error("Error increasing quantity:", error);
      }
    }}
    className="px-3 py-1 text-platinumGray hover:text-burgundy"
  >
    +
  </button>
</div>
                          <p className="font-serif text-lg text-brandGold">
                            {formatPrice(price)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variationId)}
                        className="absolute top-4 right-4 text-platinumGray hover:text-burgundy transition-colors"
                      >
                        ✕
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Assistance Section */}
              <div className="bg-burgundy/5 border border-burgundy/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-burgundy/10 p-3 rounded-full">
                    <Phone size={24} className="text-burgundy" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-burgundy mb-2">Besoin d'Assistance Personnalisée?</h3>
                    <p className="text-sm text-richEbony mb-3">
                      Notre équipe d'experts joailliers est à votre disposition pour vous accompagner dans votre choix.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href="tel:+212522222222" 
                        className="inline-flex items-center text-sm text-burgundy hover:text-brandGold transition-colors"
                      >
                        <Phone size={16} className="mr-2" />
                        +212 5 22 22 22 22
                      </a>
                      <Link href="/contact" className="inline-flex items-center text-sm text-burgundy hover:text-brandGold transition-colors">
                        <HelpCircle size={16} className="mr-2" />
                        Demander un conseil
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Order summary */}
            <div>
              <div className="bg-white rounded-lg shadow-luxury p-6 sticky top-24">
                <h2 className="text-2xl font-serif text-richEbony mb-6">Récapitulatif</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-platinumGray">Sous-total</p>
                    <p className="text-richEbony">{formatPrice(subtotal)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <p className="text-platinumGray">Écrin Diamant Rouge</p>
                      <button 
                        className="ml-1 text-platinumGray hover:text-brandGold"
                        onClick={() => {}} // Show information modal about packaging
                      >
                        <Info size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="luxuryPackaging"
                        checked={includeLuxuryPackaging}
                        onChange={() => setIncludeLuxuryPackaging(!includeLuxuryPackaging)}
                        className="accent-brandGold"
                      />
                      <p className="text-richEbony">{formatPrice(luxuryPackagingFee)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <p className="text-platinumGray">Assurance transport</p>
                      <button 
                        className="ml-1 text-platinumGray hover:text-brandGold"
                        onClick={() => setShowInsuranceInfo(!showInsuranceInfo)}
                      >
                        <Info size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="insurance"
                        checked={includeInsurance}
                        onChange={() => setIncludeInsurance(!includeInsurance)}
                        className="accent-brandGold"
                      />
                      <p className="text-richEbony">{formatPrice(insuranceFee)}</p>
                    </div>
                  </div>
                  
                  {showInsuranceInfo && (
                    <motion.div 
                      initial={{opacity: 0, height: 0}}
                      animate={{opacity: 1, height: "auto"}}
                      exit={{opacity: 0, height: 0}}
                      className="bg-burgundy/5 rounded-md p-3 text-xs text-platinumGray"
                    >
                      L'assurance transport couvre la valeur intégrale de votre commande contre tout dommage ou perte 
                      pendant l'acheminement, et garantit un remplacement ou remboursement immédiat si nécessaire.
                    </motion.div>
                  )}

                  <div className="border-t border-platinumGray/10 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-richEbony">Total</p>
                      <p className="font-serif text-xl text-brandGold">{formatPrice(total)}</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-4">
                  <Link href="/checkout" className="w-full">
                    <button className="w-full button-primary py-4 rounded-full flex items-center justify-center">
                      Finaliser ma Commande
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </Link>
                  
                  <Link href="/collections" className="w-full">
                    <button className="w-full button-secondary py-3 rounded-full">
                      Continuer mes Achats
                    </button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-8 pt-6 border-t border-platinumGray/10">
                  <p className="text-xs text-center text-platinumGray mb-4">Paiements sécurisés</p>
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <Image src="/images/icons/visa.png" width={40} height={24} alt="Visa" />
                    <Image src="/images/icons/mastercard.svg" width={40} height={24} alt="Mastercard" />
                    <Image src="/images/icons/amex.png" width={40} height={24} alt="American Express" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center">
                      <Lock size={14} className="text-brandGold mr-2" />
                      <span className="text-platinumGray">Paiement crypté SSL</span>
                    </div>
                    <div className="flex items-center">
                      <Shield size={14} className="text-brandGold mr-2" />
                      <span className="text-platinumGray">Authentification garantie</span>
                    </div>
                    <div className="flex items-center">
                      <Package size={14} className="text-brandGold mr-2" />
                      <span className="text-platinumGray">Livraison assurée</span>
                    </div>
                    <div className="flex items-center">
                      <GiftIcon size={14} className="text-brandGold mr-2" />
                      <span className="text-platinumGray">Cadeaux de luxe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}