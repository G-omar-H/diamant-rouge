import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import { useState, useMemo, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
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
    const { showToast } = useToast();
    const mainImageRef = useRef<HTMLDivElement>(null);
    const breadcrumbRef = useRef<HTMLDivElement>(null);
    
    // Reset selected image when product changes
    useEffect(() => {
      if (productData && productData.images && productData.images.length > 0) {
        setSelectedImage(productData.images[0]);
      }
      
      // Reset all state when product changes
      setSelectedVariations({});
      setIsZoomed(false);
      setShowCertificateModal(false);
      setShowExpertAuthenticationModal(false);
      setActiveTab("description");
      
    }, [productData?.id]); // Depend on product ID to reset when product changes
    
    // Measure and apply exact header height
    useEffect(() => {
      const applyHeaderHeight = () => {
        // Get the current header element
        const header = document.querySelector('header');
        if (header && breadcrumbRef.current) {
          // Set the top padding to exactly the header height plus a small buffer
          const headerHeight = header.getBoundingClientRect().height;
          breadcrumbRef.current.style.paddingTop = `${headerHeight}px`;
        }
      };
      
      // Apply immediately and on scroll/resize
      applyHeaderHeight();
      
      // Also apply after a short delay to ensure measurements are accurate after complete render
      const timeoutId = setTimeout(applyHeaderHeight, 100);
      
      // Set up mutation observer to detect DOM changes in the header
      if (typeof MutationObserver !== 'undefined') {
        const header = document.querySelector('header');
        if (header) {
          const observer = new MutationObserver(applyHeaderHeight);
          observer.observe(header, { 
            attributes: true, 
            childList: true, 
            subtree: true 
          });
          
          return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
            window.removeEventListener('resize', applyHeaderHeight);
            window.removeEventListener('scroll', applyHeaderHeight);
          };
        }
      }
      
      window.addEventListener('resize', applyHeaderHeight);
      window.addEventListener('scroll', applyHeaderHeight);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', applyHeaderHeight);
        window.removeEventListener('scroll', applyHeaderHeight);
      };
    }, []);
    
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
  
    const productName = productTranslation?.name || "Création";
    const productDescription = productTranslation?.description || "";
  
    // States
    const [selectedVariations, setSelectedVariations] = useState<{
      [key: string]: ProductVariation;
    }>({});
    const [selectedImage, setSelectedImage] = useState(
      productData.images[0] || "/images/placeholder.jpg"
    );
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [touchZooming, setTouchZooming] = useState(false);
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [showExpertAuthenticationModal, setShowExpertAuthenticationModal] = useState(false); // Add missing state
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

  // Enhanced zoom functionality
  const handleImageZoom = (e: MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    
    const {left, top, width, height} = mainImageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    
    setZoomPosition({ x, y });
    setIsZoomed(true);
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !mainImageRef.current) return;
    
    const {left, top, width, height} = mainImageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    
    setZoomPosition({ x, y });
  };
  
  // Touch-based zoom for mobile
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!mainImageRef.current || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const {left, top, width, height} = mainImageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - top) / height) * 100));
    
    setZoomPosition({ x, y });
    setTouchZooming(true);
    setIsZoomed(true);
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchZooming || !mainImageRef.current || e.touches.length !== 1) return;
    
    // Prevent default to stop page scrolling
    e.preventDefault();
    
    const touch = e.touches[0];
    const {left, top, width, height} = mainImageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - top) / height) * 100));
    
    setZoomPosition({ x, y });
  };
  
  const handleZoomEnd = () => {
    setIsZoomed(false);
    setTouchZooming(false);
  };

  // Add to Cart
  const handleAddToCart = () => {
    const primaryVariation = selectedVariations["diamondShape"] || undefined;
    const cartItem = {
      productId: productData.id,
      variationId: primaryVariation ? String(primaryVariation.id) : undefined,
      quantity: 1,
      // These fields are used for the local cart display but not sent to the server
      sku: productData.sku,
      name: productTranslation?.name || "Bijou personnalisé",
      price: totalPrice,
      image: selectedImage,
    };
    
    console.log("Adding item to cart:", cartItem);
    addToCart(cartItem);
    
    // Show success toast notification
    showToast(
      `${productTranslation?.name || "Bijou"} ajouté au panier`,
      "cart"
    );
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

      {/* Breadcrumb navigation with ref for dynamic height adjustment */}
      <div ref={breadcrumbRef} className="bg-brandIvory px-4 md:px-6 text-xs md:text-sm product-breadcrumb">
        <div className="max-w-7xl mx-auto">
          <nav className="text-platinumGray flex items-center space-x-2 py-3 md:py-4">
            <Link href="/" className="hover:text-brandGold transition-colors">Accueil</Link>
            <span className="text-platinumGray/50">/</span>
            <Link href="/collections" className="hover:text-brandGold transition-colors">Collections</Link>
            <span className="text-platinumGray/50">/</span>
            <span className="text-brandGold">{productTranslation?.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product display */}
      <motion.section 
        className="bg-brandIvory pt-0 pb-12 md:pb-20 px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Mobile-only product title - refined elegant typography */}
          <div className="block lg:hidden mb-5 mt-1">
            <h1 className="text-2xl md:text-3xl font-serif text-richEbony leading-snug">
              {productTranslation?.name}
            </h1>
            <div className="h-[1px] w-24 bg-gradient-to-r from-brandGold to-transparent mt-2.5"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20">
            
            {/* LEFT COLUMN: Product Gallery - refined for all devices */}
            <div className="space-y-4 md:space-y-5">
              {/* Enhanced Main Image with Magnifying Glass Zoom */}
              <div 
                className="relative overflow-hidden rounded-md md:rounded-lg shadow-luxury cursor-zoom-in aspect-square md:aspect-[4/3]"
                ref={mainImageRef}
                onClick={handleImageZoom}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleZoomEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleZoomEnd}
              >
                <Image
                  src={selectedImage}
                  width={1200}
                  height={900}
                  alt={productTranslation?.name || "Bijou Diamant Rouge"}
                  className="w-full h-full object-cover"
                  priority
                />
                
                {/* Magnifying Glass Overlay */}
                {isZoomed && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div 
                      className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shadow-xl border-2 border-white/80 pointer-events-none"
                      style={{
                        top: `calc(${zoomPosition.y}% - 18px)`,
                        left: `calc(${zoomPosition.x}% - 18px)`,
                        backgroundImage: `url(${selectedImage})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '300% 300%',
                        backgroundRepeat: 'no-repeat',
                        transform: 'scale(1.0)',
                        zIndex: 10
                      }}
                    />
                  </div>
                )}
                
                {!isZoomed && (
                  <motion.button 
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute bottom-3 right-3 bg-richEbony/70 text-brandIvory p-1.5 rounded-full backdrop-blur-sm"
                  >
                    <ZoomIn size={18} />
                  </motion.button>
                )}
              </div>

              {/* Thumbnails - refined for touch with better visual feedback */}
              <div className="flex gap-2.5 md:gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
                {productData.images.map((img, index) => {
                  const isSelected = selectedImage === img;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative border-2 rounded-md overflow-hidden flex-none snap-center transition-all ${
                        isSelected ? "border-brandGold ring-2 ring-brandGold/30" : "border-transparent hover:border-brandGold/40"
                      }`}
                    >
                      <div className="relative h-18 w-18 md:h-20 md:w-20">
                      <Image
                        src={img}
                          fill
                        alt={`${productTranslation?.name} - Vue ${index + 1}`}
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brandGold/10"></div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Product badges - elegant scrolling with refined design */}
              <div className="flex overflow-x-auto gap-3 py-1.5 scrollbar-hide">
                <div className="flex-none flex items-center space-x-2 text-xs text-platinumGray bg-gradient-to-br from-richEbony/5 to-richEbony/10 px-3.5 py-2 rounded-full whitespace-nowrap border border-richEbony/5">
                  <BadgeCheck size={14} className="text-brandGold" />
                  <span>Certifié GIA</span>
                </div>
                <div className="flex-none flex items-center space-x-2 text-xs text-platinumGray bg-gradient-to-br from-richEbony/5 to-richEbony/10 px-3.5 py-2 rounded-full whitespace-nowrap border border-richEbony/5">
                  <Shield size={14} className="text-brandGold" />
                  <span>Authentique</span>
                </div>
                <div className="flex-none flex items-center space-x-2 text-xs text-platinumGray bg-gradient-to-br from-richEbony/5 to-richEbony/10 px-3.5 py-2 rounded-full whitespace-nowrap border border-richEbony/5">
                  <Award size={14} className="text-brandGold" />
                  <span>Fait main</span>
                </div>
              </div>

              {/* Expert consultation banner - refined for elegance */}
              <div className="hidden md:block bg-gradient-to-br from-burgundy/5 to-burgundy/10 border border-burgundy/20 rounded-lg p-5 mt-6">
                <h3 className="text-burgundy font-serif text-lg mb-2">Consultation experte privée</h3>
                <p className="text-sm text-richEbony/80 mb-3 leading-relaxed">
                  Pour une expérience personnalisée, nos experts diamantaires sont à votre disposition pour vous guider dans votre choix.
                </p>
                <motion.button 
                  onClick={handleRequestAppointment}
                  className="flex items-center text-sm text-burgundy hover:text-brandGold transition-all"
                  whileHover={{ x: 3 }}
                >
                  <Phone size={14} className="mr-1" /> 
                  <span>Prendre rendez-vous</span>
                </motion.button>
              </div>
            </div>
            
            {/* RIGHT COLUMN: Product Details - refined and polished */}
            <div className="space-y-5 md:space-y-7">
              {/* Product Name Section - Updated for luxury display */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brandGold mb-3 font-medium">
                  {productName}
                </h1>
                
                {/* SKU and Reference shown elegantly */}
                <p className="text-xs text-platinumGray/80 uppercase tracking-wider">
                  Réf: {productData.sku}
                </p>
              </div>

              {/* Price display - More elegant and prominent */}
              <div className="mb-8">
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl md:text-3xl font-light text-brandGold">
                    {formattedPrice}
                  </span>
                  {additionalPriceSum > 0 && (
                    <span className="ml-2 text-sm text-platinumGray italic">
                      (Prix incluant vos options)
                    </span>
                  )}
                </div>
              </div>

              {/* Product Description - More elegant display with better typography */}
              <div className="mb-8">
                <p className="text-platinumGray leading-relaxed">
                  {productDescription}
                </p>
              </div>

              {/* Tabs for different content sections - refined scrolling and indicators */}
              <div>
                <div className="flex border-b border-platinumGray/20 overflow-x-auto pb-0.5 scrollbar-hide">
                  {["description", "details", "certificate"].map((tab) => (
                  <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 mr-6 text-sm font-medium whitespace-nowrap transition-colors relative ${
                        activeTab === tab 
                          ? 'text-brandGold' 
                        : 'text-platinumGray hover:text-richEbony'
                    }`}
                  >
                      {tab === "description" && "Description"}
                      {tab === "details" && "Détails & Matériaux"}
                      {tab === "certificate" && "Certification"}
                      {activeTab === tab && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brandGold"
                          layoutId="activeTabIndicator"
                        />
                      )}
                  </button>
                  ))}
                </div>
                
                <div className="pt-4">
                  {activeTab === 'description' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="prose prose-sm max-w-none text-platinumGray"
                    >
                      <p className="leading-relaxed mb-4 text-sm md:text-base">{productTranslation?.description}</p>
                      <p className="leading-relaxed text-sm md:text-base">
                        Cette pièce d'exception incarne l'excellence et le savoir-faire de la maison Diamant Rouge. 
                        Façonnée dans nos ateliers parisiens par nos maîtres joailliers, chaque détail a été pensé 
                        pour créer une œuvre intemporelle qui traversera les générations.
                      </p>
                    </motion.div>
                  )}
                  
                  {activeTab === 'details' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
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
                        <p className="text-sm text-platinumGray leading-relaxed">
                          Entièrement réalisée à la main dans nos ateliers selon des techniques traditionnelles 
                          de haute joaillerie, perpétuant un savoir-faire ancestral combiné aux technologies 
                          de pointe pour une finition parfaite.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-richEbony mb-2">Entretien</h3>
                        <p className="text-sm text-platinumGray leading-relaxed">
                          Nous recommandons un nettoyage professionnel annuel pour maintenir l'éclat de votre bijou. 
                          Entre-temps, un nettoyage doux avec un chiffon en microfibre suffit pour préserver sa beauté.
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {activeTab === 'certificate' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <BadgeCheck size={24} className="text-brandGold flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-sm font-medium text-richEbony mb-1">Certification internationale</h3>
                          <p className="text-sm text-platinumGray mb-3 leading-relaxed">
                            Chaque diamant est accompagné d'un certificat GIA (Gemological Institute of America) 
                            garantissant son authenticité et ses caractéristiques précises.
                          </p>
                          <motion.button
                            onClick={() => setShowCertificateModal(true)}
                            className="text-sm text-brandGold hover:underline flex items-center"
                            whileHover={{ x: 3 }}
                          >
                            Voir le certificat <ArrowRight size={14} className="ml-1" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="border-t border-platinumGray/10 pt-4 mt-4">
                        <h3 className="text-sm font-medium text-richEbony mb-2">Garanties Diamant Rouge</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check size={16} className="text-brandGold mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-platinumGray leading-relaxed">
                              Garantie à vie contre tout défaut de fabrication
                            </p>
                          </li>
                          <li className="flex items-start">
                            <Check size={16} className="text-brandGold mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-platinumGray leading-relaxed">
                              Service de nettoyage et polissage gratuit à vie
                            </p>
                          </li>
                          <li className="flex items-start">
                            <Check size={16} className="text-brandGold mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-platinumGray leading-relaxed">
                              Assurance joaillerie offerte la première année
                            </p>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Personalization Options - elegant cards with improved selection visual feedback */}
              <div className="mt-7">
                <h3 className="text-base md:text-lg font-serif text-richEbony mb-4">
                  Votre Création Personnalisée
                </h3>
                
                <div className="space-y-4">
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
                      <div key={type} className="mb-4">
                        <p className="font-medium text-sm text-richEbony mb-2">
                        {getVariationLabel(type)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variationGroup.map((variation) => {
                          const isSelected =
                            selectedVariations[type]?.id === variation.id;
                          return (
                              <motion.button
                              key={variation.id}
                              onClick={() => updateVariation(variation)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className={`px-3.5 py-2 md:px-4 md:py-2 rounded-md border transition-all text-sm ${
                                isSelected
                                  ? "bg-burgundy text-brandIvory border-burgundy shadow-md"
                                  : "bg-brandIvory text-richEbony border-platinumGray/30 hover:border-burgundy/50"
                              }`}
                            >
                              {variation.variationValue}
                              </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Selection Summary - refined styling */}
              {selectionSummary && (
                <div className="bg-gradient-to-br from-richEbony/5 to-richEbony/8 p-3.5 md:p-4 rounded-md">
                  <h4 className="text-sm font-medium text-richEbony mb-1.5 md:mb-2">Votre configuration personnalisée</h4>
                  <p className="text-xs md:text-sm text-platinumGray">{selectionSummary}</p>
                </div>
              )}

              {/* Shipping and Services - elegant icons with more touch-friendly spacing */}
              <div className="space-y-3 md:space-y-3 border-t border-b border-platinumGray/10 py-4 md:py-4">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-brandGold/10 flex items-center justify-center mr-3">
                    <Package size={14} className="text-brandGold" />
                  </div>
                  <p className="text-xs md:text-sm text-platinumGray">
                    Livraison sécurisée offerte avec remise en main propre
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-brandGold/10 flex items-center justify-center mr-3">
                    <Calendar size={14} className="text-brandGold" />
                  </div>
                  <p className="text-xs md:text-sm text-platinumGray">
                    Livraison estimée le {shippingDateStr}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-brandGold/10 flex items-center justify-center mr-3">
                    <RefreshCw size={14} className="text-brandGold" />
                  </div>
                  <p className="text-xs md:text-sm text-platinumGray">
                    Retours acceptés sous 30 jours
                  </p>
                </div>
              </div>

              {/* Desktop Payment Security - now only visible on desktop */}
              <div className="hidden md:block">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Shield size={16} className="text-brandGold" />
                    <p className="text-sm font-medium text-richEbony">Paiement Sécurisé</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image src="/images/icons/visa.png" width={36} height={22} alt="Visa" className="opacity-80 hover:opacity-100 transition-opacity" />
                    <Image src="/images/icons/mastercard.svg" width={36} height={22} alt="Mastercard" className="opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              {/* Action Buttons - elegant desktop buttons */}
              <div className="hidden lg:flex flex-col sm:flex-row gap-4 pt-2">
                <motion.button
                  onClick={handleAddToCart}
                  className="button-primary py-3 px-8 rounded-full flex-1 transition-all"
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(169, 138, 95, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ajouter au Panier
                </motion.button>
                <motion.button
                  onClick={handleRequestAppointment}
                  className="button-secondary py-3 px-8 rounded-full flex-1 transition-all"
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Réserver un Essayage
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mobile: Inline action section - between product details and craftsmanship */}
      <div className="block lg:hidden bg-gradient-to-b from-brandIvory to-richEbony/5 py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Price with subtle divider */}
          <div className="mb-5 text-center">
            <p className="font-serif text-xl text-brandGold mb-2">{formattedPrice}</p>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-brandGold/30 to-transparent mx-auto"></div>
          </div>
          
          {/* Payment methods for trust and authority */}
          <div className="flex justify-center items-center mb-5">
            <div className="flex items-center space-x-3 bg-richEbony/5 px-4 py-2 rounded-full">
              <Shield size={14} className="text-brandGold" />
              <span className="text-xs text-platinumGray">Paiement sécurisé</span>
              <div className="flex items-center space-x-2 ml-1">
                <Image src="/images/icons/visa.png" width={28} height={18} alt="Visa" className="opacity-80" />
                <Image src="/images/icons/mastercard.svg" width={28} height={18} alt="Mastercard" className="opacity-80" />
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col gap-3.5">
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.98 }}
              className="button-primary py-3.5 w-full rounded-sm text-sm shadow-luxury"
            >
              Ajouter au Panier
            </motion.button>
            <motion.button
              onClick={handleRequestAppointment}
              whileTap={{ scale: 0.98 }}
              className="button-secondary py-3.5 w-full rounded-sm text-sm flex items-center justify-center"
            >
              <Phone size={16} className="mr-2" />
              Réserver un Essayage
            </motion.button>
          </div>
        </div>
      </div>

      {/* Craftsmanship Section - refined visual elements */}
      <section className="bg-gradient-to-b from-richEbony to-richEbony/95 text-brandIvory py-14 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-brandGold mb-4 md:mb-6">L'Art de la Haute Joaillerie</h2>
          <div className="h-px w-20 md:w-24 bg-gradient-to-r from-transparent via-brandGold/40 to-transparent mx-auto mb-5 md:mb-6"></div>
          <p className="text-brandIvory/80 mb-8 md:mb-10 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Chaque création Diamant Rouge est le fruit d'un savoir-faire d'exception, 
            perpétué par nos maîtres artisans qui consacrent des centaines d'heures 
            à la réalisation de pièces uniques.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-6 md:mt-12">
            <motion.div 
              className="text-center"
              whileHover={{ y: -4 }}
            >
              <div className="bg-gradient-to-br from-brandGold/15 to-brandGold/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-brandGold/20">
                <Diamond size={22} className="text-brandGold" />
              </div>
              <h3 className="font-serif text-brandGold text-lg mb-2">Gemmes d'exception</h3>
              <p className="text-brandIvory/70 text-sm leading-relaxed px-1">
                Sélectionnées à la main par nos experts gemmologues pour leur pureté et leur éclat extraordinaire.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ y: -4 }}
            >
              <div className="bg-gradient-to-br from-brandGold/15 to-brandGold/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-brandGold/20">
                <Star size={22} className="text-brandGold" />
              </div>
              <h3 className="font-serif text-brandGold text-lg mb-2">Excellence artisanale</h3>
              <p className="text-brandIvory/70 text-sm leading-relaxed px-1">
                Façonnées par les mains expertes de nos maîtres joailliers selon des techniques traditionnelles.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ y: -4 }}
            >
              <div className="bg-gradient-to-br from-brandGold/15 to-brandGold/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-brandGold/20">
                <Award size={22} className="text-brandGold" />
              </div>
              <h3 className="font-serif text-brandGold text-lg mb-2">Création intemporelle</h3>
              <p className="text-brandIvory/70 text-sm leading-relaxed px-1">
                Des pièces d'exception conçues pour traverser les générations et devenir des héritages familiaux.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Créations Associées - Matching Home Page Implementation */}
      {similarProducts.length > 0 && (
        <section className="py-12 md:py-20 px-4 md:px-6 bg-brandIvory">
          <div className="max-w-7xl mx-auto">
            {/* Simple heading */}
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-serif text-brandGold mb-3">
                Créations Associées
              </h2>
              <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-brandGold/50 to-transparent mx-auto"></div>
            </div>
            
            {/* Using exact same structure as homepage featured products */}
            <div>
              <div 
                className="flex overflow-x-auto custom-scrollbar snap-x scroll-smooth gap-4 md:gap-6 lg:gap-8 pb-6 md:pb-8"
              >
                {similarProducts.slice(0, 4).map((product) => (
                  <div 
                    key={product.id} 
                    className="product-item flex-none w-64 sm:w-72 md:w-80 snap-start"
                  >
                    <ProductCard 
                      product={product} 
                      locale={locale} 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Simple button */}
            <div className="text-center mt-6">
              <Link href="/collections">
                <button className="px-6 py-2.5 border border-brandGold text-brandGold hover:bg-brandGold hover:text-richEbony transition-all duration-300 rounded-sm text-sm">
                  Explorer toutes nos collections
                </button>
              </Link>
            </div>
          </div>
        </section>
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
  
  
  // Server-side data fetching
// Replace the getServerSideProps function with this:
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params || {};
    const locale = context.locale || "fr";
  
    try {
      // Fix the query to match your schema
      const productData = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          translations: true,
          variations: true
        }
      });
  
      if (!productData) {
        return { props: { productData: null, similarProducts: [], locale } };
      }
  
      // Transform the product data
      const transformedProduct = {
        id: productData.id,
        sku: productData.sku,
        basePrice: productData.basePrice.toString(),
        images: productData.images, // Correctly use the string array
        translations: productData.translations.map((t) => ({
          language: t.language,
          name: t.name,
          description: t.description
        })),
        variations: productData.variations.map((v) => ({
          id: v.id,
          variationType: v.variationType,
          variationValue: v.variationValue,
          additionalPrice: v.additionalPrice.toString()
        })),
        categoryId: productData.categoryId
      };
  
      // Fix the similar products query too
      const similarProducts = await prisma.product.findMany({
        where: {
          categoryId: productData.categoryId,
          id: { not: productData.id }
        },
        include: {
          translations: true,
        },
        take: 4
      });
  
      const transformedSimilarProducts = similarProducts.map((product) => ({
        id: product.id,
        sku: product.sku,
        basePrice: product.basePrice.toString(),
        images: product.images, // Use the direct array
        translations: product.translations.map((t) => ({
          language: t.language,
          name: t.name,
          description: t.description
        })),
        variations: [],
        categoryId: product.categoryId
      }));
  
      return {
        props: {
          productData: transformedProduct,
          similarProducts: transformedSimilarProducts,
          locale
        }
      };
    } catch (error) {
      console.error("Error fetching product:", error instanceof Error ? error.message : String(error));
      return { 
        props: { 
          productData: null, 
          similarProducts: [], 
          locale,
          error: "Failed to fetch product" 
        } 
      };
    }
  };

{/* Add scrollbar hiding styles at the bottom of the page */}
<style jsx global>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .shadow-up-xl {
    box-shadow: 0 -4px 25px -5px rgba(0, 0, 0, 0.1), 0 -10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  /* Elegant tap highlight for mobile */
  @media (max-width: 768px) {
    button, a {
      -webkit-tap-highlight-color: transparent;
    }
  }
  
  /* Smooth focus transitions */
  button:focus, a:focus {
    outline: none;
    transition: all 0.3s ease;
  }
  
  /* Enhanced loading transitions */
  img {
    transition: opacity 0.3s ease;
  }

  /* Custom scrollbar styling */
  .custom-scrollbar::-webkit-scrollbar {
    height: 4px;
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(209, 213, 219, 0.1);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(169, 138, 95, 0.5);
    border-radius: 2px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(169, 138, 95, 0.8);
  }
  
  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(169, 138, 95, 0.5) rgba(209, 213, 219, 0.1);
  }
  
  /* Subtle product hover effect */
  .product-item {
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  
  .product-item:hover {
    transform: translateY(-3px);
  }
  
  /* Snap alignment */
  .snap-start {
    scroll-snap-align: start;
  }
`}</style>