import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { NextSeo } from "next-seo";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, GiftIcon, Phone, Package, ArrowRight, HelpCircle, 
  Lock, CreditCard, Info, X, Truck, Calendar, Award
} from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [showInsuranceInfo, setShowInsuranceInfo] = useState(false);
  const [showPackagingInfo, setShowPackagingInfo] = useState(false);
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  // Add this state near the top of your component with other states
const [showSecurityModal, setShowSecurityModal] = useState(false);

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
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 shadow-md">
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
                          <div className="flex items-center border border-platinumGray/30 rounded-md overflow-hidden shadow-sm">
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
                              className="px-3 py-1.5 text-platinumGray hover:text-brandGold hover:bg-richEbony/5 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-4 py-1.5 text-sm font-medium text-richEbony bg-richEbony/5">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={async () => {
                                try {
                                  await updateQuantity(item.productId, item.variationId, item.quantity + 1);
                                } catch (error) {
                                  console.error("Error increasing quantity:", error);
                                }
                              }}
                              className="px-3 py-1.5 text-platinumGray hover:text-brandGold hover:bg-richEbony/5 transition-colors"
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
                        className="absolute top-4 right-4 text-platinumGray hover:text-burgundy transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-richEbony/5"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-luxury p-6 mb-8">
                <h3 className="text-xl font-serif text-richEbony mb-4">Informations de Livraison</h3>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-brandGold/10 p-2.5 rounded-full flex-shrink-0">
                      <Truck size={20} className="text-brandGold" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-richEbony mb-1">Livraison Privilège</h4>
                      <p className="text-sm text-platinumGray">
                        Livraison sécurisée avec signature et remise en main propre. Votre bijou est transporté 
                        dans un coffret scellé par un service spécialisé dans l'acheminement d'articles de valeur.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-brandGold/10 p-2.5 rounded-full flex-shrink-0">
                      <Calendar size={20} className="text-brandGold" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-richEbony mb-1">Délai de Livraison</h4>
                      <p className="text-sm text-platinumGray">
                        Les créations en stock sont expédiées sous 24h. Pour les pièces sur-mesure ou personnalisées, 
                        comptez entre 2 et 4 semaines selon la complexité de la réalisation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-brandGold/10 p-2.5 rounded-full flex-shrink-0">
                      <Award size={20} className="text-brandGold" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-richEbony mb-1">Garantie et Services</h4>
                      <p className="text-sm text-platinumGray">
                        Chaque création Diamant Rouge bénéficie d'une garantie à vie sur la structure du bijou et 
                        d'un service de nettoyage et polissage gratuit dans nos boutiques.
                      </p>
                    </div>
                  </div>
                </div>
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
                        className="ml-1.5 text-platinumGray hover:text-brandGold transition-colors"
                        onClick={() => setShowPackagingInfo(!showPackagingInfo)}
                      >
                        <Info size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="luxuryPackaging"
                          checked={includeLuxuryPackaging}
                          onChange={() => setIncludeLuxuryPackaging(!includeLuxuryPackaging)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border border-platinumGray/40 rounded peer-checked:bg-brandGold peer-checked:border-brandGold relative">
                          {includeLuxuryPackaging && (
                            <svg className="absolute inset-0 m-auto text-white w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </label>
                      <p className="text-richEbony">{formatPrice(luxuryPackagingFee)}</p>
                    </div>
                  </div>
                  
                  {showPackagingInfo && (
                    <motion.div 
                      initial={{opacity: 0, height: 0}}
                      animate={{opacity: 1, height: "auto"}}
                      exit={{opacity: 0, height: 0}}
                      className="bg-brandGold/5 rounded-md p-4 text-sm text-platinumGray mb-2"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-richEbony font-medium">Écrin signature Diamant Rouge</p>
                        <button 
                          onClick={() => setShowPackagingModal(true)} 
                          className="text-xs text-brandGold hover:underline"
                        >
                          Voir plus
                        </button>
                      </div>
                      <p className="mb-2">
                        Coffret en cuir véritable doublé de velours précieux, avec certificat d'authenticité et livret 
                        d'entretien dans une enveloppe de soie.
                      </p>
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <p className="text-platinumGray">Assurance transport</p>
                      <button 
                        className="ml-1.5 text-platinumGray hover:text-brandGold transition-colors"
                        onClick={() => setShowInsuranceInfo(!showInsuranceInfo)}
                      >
                        <Info size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="insurance"
                          checked={includeInsurance}
                          onChange={() => setIncludeInsurance(!includeInsurance)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border border-platinumGray/40 rounded peer-checked:bg-brandGold peer-checked:border-brandGold relative">
                          {includeInsurance && (
                            <svg className="absolute inset-0 m-auto text-white w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </label>
                      <p className="text-richEbony">{formatPrice(insuranceFee)}</p>
                    </div>
                  </div>
                  
                  {showInsuranceInfo && (
                    <motion.div 
                      initial={{opacity: 0, height: 0}}
                      animate={{opacity: 1, height: "auto"}}
                      exit={{opacity: 0, height: 0}}
                      className="bg-burgundy/5 rounded-md p-4 text-sm text-platinumGray"
                    >
                      <p className="text-richEbony font-medium mb-2">Protection complète pendant le transport</p>
                      <p>
                        L'assurance transport couvre la valeur intégrale de votre commande contre tout dommage ou perte 
                        pendant l'acheminement, et garantit un remplacement ou remboursement immédiat si nécessaire.
                      </p>
                    </motion.div>
                  )}

                  <div className="border-t border-b border-platinumGray/10 py-4 my-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-richEbony">Total</p>
                      <p className="font-serif text-xl text-brandGold">{formatPrice(total)}</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-4">
                  <Link href="/checkout" className="w-full">
                    <button className="w-full button-primary py-4 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
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
                  <p className="text-xs text-center text-platinumGray mb-4 font-medium">Paiements sécurisés</p>
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <div className="bg-white shadow-sm rounded-md p-1.5">
                      <Image src="/images/icons/visa.png" width={40} height={24} alt="Visa" className="h-6 w-auto" />
                    </div>
                    <div className="bg-white shadow-sm rounded-md p-1.5">
                      <Image src="/images/icons/mastercard.svg" width={40} height={24} alt="Mastercard" className="h-6 w-auto" />
                    </div>
                    <div className="bg-white shadow-sm rounded-md p-1.5">
                      <Image src="/images/icons/amex.png" width={40} height={24} alt="American Express" className="h-6 w-auto" />
                    </div>
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

     {/* Luxury Packaging Modal */}
<AnimatePresence>
  {showPackagingModal && (
    <motion.div
      className="fixed inset-0 bg-richEbony/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-brandIvory rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 30 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-brandGold">L'Art de l'Écrin Diamant Rouge</h2>
            <button 
              onClick={() => setShowPackagingModal(false)}
              className="text-platinumGray hover:text-richEbony transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-6">
            <Image 
              src="/images/packaging/luxury-box.jpg" 
              width={800} 
              height={400} 
              alt="Écrin Diamant Rouge" 
              className="w-full h-auto rounded-lg shadow-md mb-4"
            />
          </div>
          
          <div className="prose prose-sm max-w-none text-platinumGray mb-6">
            <p>
              Chaque création Diamant Rouge est présentée dans un écrin confectionné par nos maîtres artisans, 
              perpétuant la tradition d'excellence et d'élégance qui caractérise notre maison depuis sa fondation.
            </p>
            
            <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-richEbony font-medium mb-2">Matériaux Nobles</h3>
                <p className="text-sm">
                  Chaque écrin est réalisé en cuir véritable teint dans notre atelier, doublé de velours soyeux 
                  spécialement sélectionné pour protéger vos bijoux précieux et sublimer leur présentation.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-richEbony font-medium mb-2">Savoir-Faire Artisanal</h3>
                <p className="text-sm">
                  La fabrication de nos écrins nécessite plus de 20 étapes manuelles, témoignant 
                  du souci du détail et de la minutie qui caractérisent la maison Diamant Rouge.
                </p>
              </div>
            </div>
            
            <p>
              Votre écrin Diamant Rouge contient également:
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-brandGold mr-2">•</span>
                <span>Un certificat d'authenticité numéroté et signé par notre gemmologue en chef</span>
              </li>
              <li className="flex items-start">
                <span className="text-brandGold mr-2">•</span>
                <span>Un guide d'entretien personnalisé pour votre création</span>
              </li>
              <li className="flex items-start">
                <span className="text-brandGold mr-2">•</span>
                <span>Une pochette de voyage en soie pour protéger votre bijou lors de vos déplacements</span>
              </li>
              <li className="flex items-start">
                <span className="text-brandGold mr-2">•</span>
                <span>Un chiffon de polissage en microfibre spécialement conçu pour l'entretien de vos bijoux</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setShowPackagingModal(false)}
              className="bg-brandGold hover:bg-burgundy text-white px-6 py-2 rounded-full transition-colors shadow-md"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* Payment & Security Information Modal - Add this to enhance trust */}
<AnimatePresence>
  {showSecurityModal && (
    <motion.div
      className="fixed inset-0 bg-richEbony/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-brandIvory rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 30 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-brandGold">Sécurité des Paiements</h2>
            <button 
              onClick={() => setShowSecurityModal(false)}
              className="text-platinumGray hover:text-richEbony transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-brandGold/10 p-3 rounded-full">
                <Lock size={20} className="text-brandGold" />
              </div>
              <div>
                <h3 className="text-base font-medium text-richEbony mb-2">Cryptage SSL 256-bit</h3>
                <p className="text-sm text-platinumGray">
                  Toutes vos informations personnelles et coordonnées bancaires sont protégées par un 
                  cryptage SSL 256-bit, la norme de sécurité la plus élevée du marché, garantissant une 
                  confidentialité totale de vos données.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-brandGold/10 p-3 rounded-full">
                <CreditCard size={20} className="text-brandGold" />
              </div>
              <div>
                <h3 className="text-base font-medium text-richEbony mb-2">Paiements Sécurisés</h3>
                <p className="text-sm text-platinumGray">
                  Nous utilisons les protocoles 3D-Secure et disposons des certifications PCI-DSS pour 
                  assurer la sécurité de vos transactions. Vos données bancaires ne sont jamais stockées 
                  sur nos serveurs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-brandGold/10 p-3 rounded-full">
                <Shield size={20} className="text-brandGold" />
              </div>
              <div>
                <h3 className="text-base font-medium text-richEbony mb-2">Protection des Acheteurs</h3>
                <p className="text-sm text-platinumGray">
                  Diamant Rouge garantit la protection de votre achat avec une politique de remboursement 
                  intégral sous 30 jours si vous n'êtes pas entièrement satisfait de votre acquisition.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-platinumGray/20">
            <p className="text-sm text-platinumGray text-center mb-4">Diamant Rouge est certifié par</p>
            <div className="flex justify-center items-center space-x-6">
              <Image src="/images/icons/secure-payment-1.png" width={60} height={30} alt="Certification de sécurité" className="grayscale opacity-70" />
              <Image src="/images/icons/secure-payment-2.png" width={60} height={30} alt="Certification de sécurité" className="grayscale opacity-70" />
              <Image src="/images/icons/secure-payment-3.png" width={60} height={30} alt="Certification de sécurité" className="grayscale opacity-70" />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={() => setShowSecurityModal(false)}
              className="bg-brandGold hover:bg-burgundy text-white px-6 py-2 rounded-full transition-colors shadow-md"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
</>
);
}