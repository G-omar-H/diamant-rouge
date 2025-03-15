import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import { useState, useMemo, useRef } from "react";
import { useCart } from "../../contexts/CartContext";
import { NextSeo } from "next-seo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { 
  Shield, BadgeCheck, Package, ZoomIn, 
  ArrowRight, Calendar, Star, Award, Check, 
  RefreshCw, Phone, Diamond
} from "lucide-react";

// Types remain the same
type ProductTranslation = {
  language: string;
  name: string;
  description: string;
};

type ProductVariation = {
  id: number;
  variationType: string;
  variationValue: string;
  additionalPrice: string;
};

type ProductData = {
  id: number;
  sku: string;
  basePrice: string;
  images: string[];
  translations: ProductTranslation[];
  variations: ProductVariation[];
  categoryId?: number | null;
};

type ProductPageProps = {
  productData: ProductData | null;
  similarProducts: ProductData[];
  locale: string;
};

export default function ProductPage({
  productData,
  similarProducts,
  locale,
}: ProductPageProps) {
  const { addToCart } = useCart();
  const mainImageRef = useRef<HTMLDivElement>(null);
  
  // Error state handling
  if (!productData) {
    return (
      <section className="py-24 px-6 section-ivory text-center">
        <div className="max-w-4xl mx-auto">
          <Diamond size={48} className="mx-auto text-brandGold mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif text-brandGold mb-6">
            Création Introuvable
          </h1>
          <p className="text-platinumGray text-lg mb-8">
            La pièce que vous recherchez n'est malheureusement plus dans notre collection.
          </p>
          <Link href="/collections" className="button-primary inline-flex items-center px-8 py-3 rounded-full">
            Découvrir nos collections
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    );
  }

  // Translation
  const productTranslation =
    productData.translations.find((t) => t.language === locale) ||
    productData.translations.find((t) => t.language === "fr") ||
    productData.translations.find((t) => t.language === "en");

  // States
  const [selectedVariations, setSelectedVariations] = useState<{
    [key: string]: ProductVariation;
  }>({});
  const [selectedImage, setSelectedImage] = useState(
    productData.images[0] || "/images/placeholder.jpg"
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Variation handling
  function updateVariation(variation: ProductVariation) {
    setSelectedVariations((prev) => ({
      ...prev,
      [variation.variationType]: variation,
    }));
  }

  // Pricing
  const basePriceNum = parseFloat(productData.basePrice || "0");
  const additionalPriceSum = useMemo(() => {
    let sum = 0;
    Object.values(selectedVariations).forEach((v) => {
      sum += parseFloat(v.additionalPrice || "0");
    });
    return sum;
  }, [selectedVariations]);

  const totalPrice = basePriceNum + additionalPriceSum;
  
  // Format price to look more luxurious
  const formattedPrice = new Intl.NumberFormat('fr-MA', { 
    style: 'currency', 
    currency: 'MAD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(totalPrice);

  // Shipping date
  const currentDate = new Date();
  const shippingDate = new Date(
    currentDate.setMonth(currentDate.getMonth() + 1)
  );
  const shippingDateStr = shippingDate.toLocaleDateString(locale || "fr", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Selection summary
  const selectionSummary = Object.values(selectedVariations)
    .map((v) => `${getVariationLabel(v.variationType)}: ${v.variationValue}`)
    .join(" • ");

  // Handle zoom functionality
  const handleImageZoom = (e: React.MouseEvent) => {
    if (!mainImageRef.current || isZoomed) return;
    
    const {left, top, width, height} = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    mainImageRef.current.style.transformOrigin = `${x}% ${y}%`;
    setIsZoomed(true);
  };
  
  const handleZoomEnd = () => {
    setIsZoomed(false);
    if (mainImageRef.current) {
      mainImageRef.current.style.transform = 'scale(1)';
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    const primaryVariation = selectedVariations["diamondShape"] || undefined;
    addToCart({
      image: selectedImage,
      productId: productData.id,
      variationId: primaryVariation ? primaryVariation.id : undefined,
      sku: productData.sku,
      name: productTranslation?.name || "Bijou personnalisé",
      price: totalPrice,
      quantity: 1,
    });
  };

  // Request appointment
  const handleRequestAppointment = () => {
    // Add tracking for appointment requests
    window.location.href = `/appointments?product=${productData.id}`;
  };

  return (
    <>
      <NextSeo
        title={`Diamant Rouge | ${productTranslation?.name}`}
        description={productTranslation?.description?.substring(0, 160)}
        openGraph={{
          title: `Diamant Rouge | ${productTranslation?.name}`,
          description: productTranslation?.description?.substring(0, 160),
          images: [
            {
              url: productData.images[0] || "",
              width: 1200,
              height: 630,
              alt: productTranslation?.name,
            },
          ],
        }}
      />

      {/* Breadcrumb navigation */}
      <div className="bg-brandIvory pt-6 pb-2 px-6 text-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="text-platinumGray flex items-center space-x-2">
            <Link href="/" className="hover:text-brandGold transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-brandGold transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-brandGold">{productTranslation?.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product display */}
      <motion.section 
        className="bg-brandIvory pt-8 pb-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* LEFT COLUMN: Product Gallery */}
            <div className="space-y-6">
              {/* Main Image with Zoom */}
              <div 
                className="relative overflow-hidden rounded-lg shadow-luxury cursor-zoom-in"
                ref={mainImageRef}
                onClick={handleImageZoom}
                onMouseLeave={handleZoomEnd}
                style={{
                  transition: 'transform 0.3s ease-out',
                  transform: isZoomed ? 'scale(1.75)' : 'scale(1)'
                }}
              >
                <Image
                  src={selectedImage}
                  width={800}
                  height={800}
                  alt={productTranslation?.name || "Bijou Diamant Rouge"}
                  className="w-full h-auto"
                  priority
                />
                {!isZoomed && (
                  <button className="absolute bottom-4 right-4 bg-richEbony/80 text-brandIvory p-2 rounded-full">
                    <ZoomIn size={18} />
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {productData.images.map((img, index) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`border-2 rounded-md overflow-hidden transition-all ${
                        isSelected ? "border-brandGold ring-2 ring-brandGold/20" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img}
                        width={100}
                        height={100}
                        alt={`${productTranslation?.name} - Vue ${index + 1}`}
                        className="object-cover w-20 h-20"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Product badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <div className="flex items-center space-x-2 text-xs text-platinumGray bg-richEbony/5 px-3 py-1.5 rounded-full">
                  <BadgeCheck size={14} className="text-brandGold" />
                  <span>Certifié GIA</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-platinumGray bg-richEbony/5 px-3 py-1.5 rounded-full">
                  <Shield size={14} className="text-brandGold" />
                  <span>Authentique</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-platinumGray bg-richEbony/5 px-3 py-1.5 rounded-full">
                  <Award size={14} className="text-brandGold" />
                  <span>Fait main</span>
                </div>
              </div>

              {/* Expert consultation banner */}
              <div className="bg-burgundy/10 border border-burgundy/20 rounded-lg p-5 mt-8">
                <h3 className="text-burgundy font-serif text-lg mb-2">Consultation experte privée</h3>
                <p className="text-sm text-richEbony mb-3">
                  Pour une expérience personnalisée, nos experts diamantaires sont à votre disposition pour vous guider dans votre choix.
                </p>
                <button 
                  onClick={handleRequestAppointment}
                  className="flex items-center text-sm text-burgundy hover:text-brandGold transition-colors"
                >
                  <Phone size={14} className="mr-1" /> 
                  <span>Prendre rendez-vous</span>
                </button>
              </div>
            </div>
            
            {/* RIGHT COLUMN: Product Details */}
            <div className="space-y-8">
              {/* Product title and price */}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-richEbony mb-3">
                  {productTranslation?.name}
                </h1>
                <p className="text-3xl font-serif text-brandGold mb-4">
                  {formattedPrice}
                </p>
                <div className="h-px w-32 bg-gradient-to-r from-brandGold via-brandGold to-transparent mb-6"></div>
              </div>

              {/* Tabs for different content sections */}
              <div>
                <div className="flex border-b border-platinumGray/20">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`pb-2 mr-6 text-sm font-medium transition-colors ${
                      activeTab === 'description' 
                        ? 'text-brandGold border-b-2 border-brandGold' 
                        : 'text-platinumGray hover:text-richEbony'
                    }`}
                  >
                    Description
                  </button>
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 mr-6 text-sm font-medium transition-colors ${
                      activeTab === 'details' 
                        ? 'text-brandGold border-b-2 border-brandGold' 
                        : 'text-platinumGray hover:text-richEbony'
                    }`}
                  >
                    Détails & Matériaux
                  </button>
                  <button 
                    onClick={() => setActiveTab('certificate')}
                    className={`pb-2 text-sm font-medium transition-colors ${
                      activeTab === 'certificate' 
                        ? 'text-brandGold border-b-2 border-brandGold' 
                        : 'text-platinumGray hover:text-richEbony'
                    }`}
                  >
                    Certification
                  </button>
                </div>
                
                <div className="pt-6">
                  {activeTab === 'description' && (
                    <div className="prose prose-sm max-w-none text-platinumGray">
                      <p className="leading-relaxed mb-4">{productTranslation?.description}</p>
                      <p className="leading-relaxed">
                        Cette pièce d'exception incarne l'excellence et le savoir-faire de la maison Diamant Rouge. 
                        Façonnée dans nos ateliers parisiens par nos maîtres joailliers, chaque détail a été pensé 
                        pour créer une œuvre intemporelle qui traversera les générations.
                      </p>
                    </div>
                  )}
                  
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-richEbony mb-2">Matériaux précieux</h3>
                        <p className="text-sm text-platinumGray mb-1">
                          • Or 18 carats éthiquement sourcé
                        </p>
                        <p className="text-sm text-platinumGray mb-1">
                          • Diamants naturels de la plus haute qualité
                        </p>
                        <p className="text-sm text-platinumGray">
                          • Chaque pierre sélectionnée à la main par nos gemmologues experts
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-richEbony mb-2">Fabrication</h3>
                        <p className="text-sm text-platinumGray">
                          Entièrement réalisée à la main dans nos ateliers selon des techniques traditionnelles 
                          de haute joaillerie, perpétuant un savoir-faire ancestral combiné aux technologies 
                          de pointe pour une finition parfaite.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-richEbony mb-2">Entretien</h3>
                        <p className="text-sm text-platinumGray">
                          Nous recommandons un nettoyage professionnel annuel pour maintenir l'éclat de votre bijou. 
                          Entre-temps, un nettoyage doux avec un chiffon en microfibre suffit pour préserver sa beauté.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'certificate' && (
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <BadgeCheck size={32} className="text-brandGold flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-richEbony mb-1">Certification internationale</h3>
                          <p className="text-sm text-platinumGray mb-3">
                            Chaque diamant est accompagné d'un certificat GIA (Gemological Institute of America) 
                            garantissant son authenticité et ses caractéristiques précises.
                          </p>
                          <button
                            onClick={() => setShowCertificateModal(true)}
                            className="text-sm text-brandGold hover:underline flex items-center"
                          >
                            Voir le certificat <ArrowRight size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-t border-platinumGray/10 pt-4 mt-4">
                        <h3 className="text-sm font-medium text-richEbony mb-2">Garanties Diamant Rouge</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check size={16} className="text-brandGold mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-platinumGray">
                              Garantie à vie contre tout défaut de fabrication
                            </p>
                          </li>
                          <li className="flex items-start">
                            <Check size={16} className="text-brandGold mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-platinumGray">
                              Service de nettoyage et polissage gratuit à vie
                            </p>
                          </li>
                          <li className="flex items-start">
                            <Check size={16} className="text-brandGold mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-platinumGray">
                              Assurance joaillerie offerte la première année
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Personalization Options */}
              <div>
                <h3 className="text-lg font-serif text-richEbony mb-4">
                  Votre Création Personnalisée
                </h3>
                
                {[
                  "diamondShape",
                  "carat",
                  "quality",
                  "coupe",
                  "metalColor",
                  "ringSize",
                ].map((type) => {
                  const variationGroup = productData.variations.filter(
                    (v) => v.variationType === type
                  );
                  if (variationGroup.length === 0) return null;

                  return (
                    <div key={type} className="mb-6">
                      <p className="font-medium text-richEbony mb-2">
                        {getVariationLabel(type)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variationGroup.map((variation) => {
                          const isSelected =
                            selectedVariations[type]?.id === variation.id;
                          return (
                            <button
                              key={variation.id}
                              onClick={() => updateVariation(variation)}
                              className={`px-4 py-2 rounded-md border transition-all ${
                                isSelected
                                  ? "bg-burgundy text-brandIvory border-burgundy shadow-md"
                                  : "bg-brandIvory text-richEbony border-platinumGray/30 hover:border-burgundy/50"
                              }`}
                            >
                              {variation.variationValue}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selection Summary */}
              {selectionSummary && (
                <div className="bg-richEbony/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-richEbony mb-2">Votre configuration personnalisée</h4>
                  <p className="text-sm text-platinumGray">{selectionSummary}</p>
                </div>
              )}

              {/* Shipping and Services */}
              <div className="space-y-3 border-t border-b border-platinumGray/10 py-4">
                <div className="flex items-center">
                  <Package size={18} className="text-brandGold mr-3" />
                  <p className="text-sm text-platinumGray">
                    Livraison sécurisée offerte avec remise en main propre
                  </p>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="text-brandGold mr-3" />
                  <p className="text-sm text-platinumGray">
                    Livraison estimée le {shippingDateStr}
                  </p>
                </div>
                <div className="flex items-center">
                  <RefreshCw size={18} className="text-brandGold mr-3" />
                  <p className="text-sm text-platinumGray">
                    Retours acceptés sous 30 jours
                  </p>
                </div>
              </div>

              {/* Payment Security */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <Shield size={18} className="text-brandGold" />
                    <p className="text-sm font-medium text-richEbony">Paiement Sécurisé</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image src="/images/icons/img.icons8.png" width={40} height={24} alt="Visa" />
                    <Image src="/images/icons/mastercard-old.svg" width={40} height={24} alt="Mastercard" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="button-primary py-3 px-8 rounded-full flex-1"
                >
                  Ajouter au Panier
                </button>
                <button
                  onClick={handleRequestAppointment}
                  className="button-secondary py-3 px-8 rounded-full flex-1"
                >
                  Réserver un Essayage
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Craftsmanship Section */}
      <section className="bg-richEbony text-brandIvory py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-brandGold mb-6">L'Art de la Haute Joaillerie</h2>
          <p className="text-brandIvory/80 mb-8 max-w-2xl mx-auto">
            Chaque création Diamant Rouge est le fruit d'un savoir-faire d'exception, 
            perpétué par nos maîtres artisans qui consacrent des centaines d'heures 
            à la réalisation de pièces uniques.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-brandGold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Diamond size={24} className="text-brandGold" />
              </div>
              <h3 className="font-serif text-brandGold text-lg mb-2">Gemmes d'exception</h3>
              <p className="text-brandIvory/70 text-sm">
                Sélectionnées à la main par nos experts gemmologues pour leur pureté et leur éclat extraordinaire.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brandGold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-brandGold" />
              </div>
              <h3 className="font-serif text-brandGold text-lg mb-2">Excellence artisanale</h3>
              <p className="text-brandIvory/70 text-sm">
                Façonnées par les mains expertes de nos maîtres joailliers selon des techniques traditionnelles.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brandGold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="text-brandGold" />
              </div>
              <h3 className="font-serif text-brandGold text-lg mb-2">Création intemporelle</h3>
              <p className="text-brandIvory/70 text-sm">
                Des pièces d'exception conçues pour traverser les générations et devenir des héritages familiaux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <motion.section
          className="py-16 px-6 bg-brandIvory text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-brandGold mb-2">
              Vous Pourriez Aussi Aimer
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-brandGold to-transparent mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {similarProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12">
              <Link href="/collections" className="button-secondary inline-flex items-center px-8 py-3 rounded-full">
                Voir toutes nos collections
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificateModal && (
          <motion.div 
            className="fixed inset-0 bg-richEbony/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
                  <h3 className="text-xl font-serif text-brandGold">Certificat d'Authenticité</h3>
                  <button 
                    onClick={() => setShowCertificateModal(false)}
                    className="text-platinumGray hover:text-richEbony"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-6">
                  <Image 
                    src="/images/sample-certificate.jpg" 
                    width={800} 
                    height={500} 
                    alt="Certificat GIA"
                    className="w-full h-auto rounded-md shadow-sm"
                    />
                    
                    <div className="bg-brandGold/5 border border-brandGold/20 rounded-lg p-6 mt-4">
                      <h4 className="text-lg font-serif text-brandGold mb-3">Caractéristiques de la pierre</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-richEbony font-medium mb-1">Laboratoire</p>
                          <p className="text-platinumGray">GIA (Gemological Institute of America)</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Numéro de certificat</p>
                          <p className="text-platinumGray">GIA 2185694237</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Forme et taille</p>
                          <p className="text-platinumGray">Rond Brillant</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Poids</p>
                          <p className="text-platinumGray">3.01 carats</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Couleur</p>
                          <p className="text-platinumGray">F (Incolore exceptionnel+)</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Pureté</p>
                          <p className="text-platinumGray">VS1 (Très légères inclusions)</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Taille</p>
                          <p className="text-platinumGray">Excellente</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Polissage</p>
                          <p className="text-platinumGray">Excellent</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Symétrie</p>
                          <p className="text-platinumGray">Excellente</p>
                        </div>
                        <div>
                          <p className="text-richEbony font-medium mb-1">Fluorescence</p>
                          <p className="text-platinumGray">Aucune</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-platinumGray mt-6">
                      La certification GIA est reconnue mondialement comme la norme d'excellence en matière de 
                      certification de diamants. Le certificat accompagne votre achat et confirme l'authenticité 
                      et la qualité exceptionnelle de votre pierre.
                    </p>
                    
                    <div className="flex justify-end mt-6">
                      <a 
                        href="/documents/sample-certificate.pdf" 
                        download
                        className="button-secondary px-6 py-2 rounded-md text-sm flex items-center"
                      >
                        Télécharger le certificat
                        <ArrowRight size={16} className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Expert Authentication Modal */}
        <AnimatePresence>
          {showExpertAuthenticationModal && (
            <motion.div 
              className="fixed inset-0 bg-richEbony/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
                    <h3 className="text-xl font-serif text-brandGold">Processus d'Authentification Diamant Rouge</h3>
                    <button 
                      onClick={() => setShowExpertAuthenticationModal(false)}
                      className="text-platinumGray hover:text-richEbony"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-burgundy font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="text-richEbony font-medium mb-2">Sélection Experte</h4>
                        <p className="text-platinumGray text-sm">
                          Nos gemmologues experts voyagent à travers le monde pour sélectionner uniquement les diamants 
                          et pierres précieuses de la plus haute qualité. Moins de 2% des pierres examinées répondent 
                          à nos critères d'excellence.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-burgundy font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="text-richEbony font-medium mb-2">Certification Indépendante</h4>
                        <p className="text-platinumGray text-sm">
                          Chaque diamant est soumis à une évaluation rigoureuse par des laboratoires de certification 
                          indépendants de renommée mondiale (GIA, HRD ou IGI) qui vérifient et documentent ses caractéristiques.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-burgundy font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="text-richEbony font-medium mb-2">Fabrication Artisanale</h4>
                        <p className="text-platinumGray text-sm">
                          Nos maîtres joailliers, formés dans la tradition des grandes maisons européennes, créent chaque pièce à la main 
                          dans nos ateliers. Ce processus méticuleux garantit une finition parfaite et une attention aux moindres détails.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-burgundy font-medium">4</span>
                      </div>
                      <div>
                        <h4 className="text-richEbony font-medium mb-2">Contrôle Qualité Rigoureux</h4>
                        <p className="text-platinumGray text-sm">
                          Avant d'être présentée à notre clientèle, chaque création passe par une inspection finale minutieuse 
                          réalisée par notre directeur artistique et notre chef joaillier pour garantir une perfection absolue.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative py-4">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-brandGold/30 to-transparent"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brandIvory px-4">
                        <Diamond size={16} className="text-brandGold" />
                      </div>
                    </div>
                    
                    <p className="text-center font-serif text-burgundy text-sm">
                      "Chaque création Diamant Rouge est le fruit d'une quête incessante de perfection, 
                      perpétuant l'excellence de notre héritage joaillier depuis plus d'un demi-siècle."
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
  
  // Helper function to get human-readable variation labels
  function getVariationLabel(type: string): string {
    const labels: { [key: string]: string } = {
      diamondShape: "Forme du diamant",
      carat: "Carat",
      quality: "Qualité",
      coupe: "Taille",
      metalColor: "Couleur du métal",
      ringSize: "Taille de bague",
      metalType: "Type de métal",
      stoneColor: "Couleur de la pierre",
      setting: "Sertissage",
      engraving: "Gravure"
    };
  
    return labels[type] || type;
  }

  const [showExpertAuthenticationModal, setShowExpertAuthenticationModal] = useState(false);

  
  // Server-side data fetching
  export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params || {};
    const locale = context.locale || "fr";
    
    if (!id || typeof id !== 'string') {
      console.warn('Invalid product ID parameter');
      return { props: { productData: null, similarProducts: [], locale } };
    }
  
    try {
      // Safely parse the ID as a number
      const productId = parseInt(id, 10);
      
      if (isNaN(productId)) {
        console.warn(`Could not parse product ID: ${id}`);
        return { props: { productData: null, similarProducts: [], locale } };
      }
  
      // Fetch product data with proper error handling
      const productData = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          translations: true,
          variations: true,
          images: {
            select: { imageUrl: true }
          }
        }
      });
  
      if (!productData) {
        return { props: { productData: null, similarProducts: [], locale } };
      }
  
      // Transform data safely for the frontend
      const transformedProduct = {
        id: productData.id,
        sku: productData.sku || "",
        basePrice: productData.basePrice ? productData.basePrice.toString() : "0",
        images: productData.images ? productData.images.map((img) => img.imageUrl || "") : [],
        translations: productData.translations ? productData.translations.map((t) => ({
          language: t.language || "",
          name: t.name || "",
          description: t.description || ""
        })) : [],
        variations: productData.variations ? productData.variations.map((v) => ({
          id: v.id,
          variationType: v.variationType || "",
          variationValue: v.variationValue || "",
          additionalPrice: v.additionalPrice ? v.additionalPrice.toString() : "0"
        })) : [],
        categoryId: productData.categoryId
      };
  
      // Fetch similar products with proper error handling
      let transformedSimilarProducts = [];
      
      if (productData.categoryId) {
        const similarProducts = await prisma.product.findMany({
          where: {
            categoryId: productData.categoryId,
            id: { not: productData.id }
          },
          include: {
            translations: true,
            images: {
              take: 1,
              select: { imageUrl: true }
            }
          },
          take: 4
        }).catch(err => {
          console.warn('Error fetching similar products:', err);
          return [];
        });
  
        if (similarProducts && similarProducts.length > 0) {
          transformedSimilarProducts = similarProducts.map(product => ({
            id: product.id,
            sku: product.sku || "",
            basePrice: product.basePrice ? product.basePrice.toString() : "0",
            images: product.images ? product.images.map(img => img.imageUrl || "") : [],
            translations: product.translations ? product.translations.map(t => ({
              language: t.language || "",
              name: t.name || "",
              description: t.description || ""
            })) : [],
            variations: [],
            categoryId: product.categoryId
          }));
        }
      }
  
      return {
        props: {
          productData: transformedProduct,
          similarProducts: transformedSimilarProducts,
          locale
        }
      };
    } catch (error) {
      console.error("Error in getServerSideProps:", error);
      return { 
        props: { 
          productData: null, 
          similarProducts: [], 
          locale,
          error: error instanceof Error ? error.message : "Unknown error"
        } 
      };
    }
  };