import { useState, useRef, useEffect } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Video, Users, Coffee, Diamond, ChevronDown, 
  User, UserPlus, Wine, GlassWater, Utensils
} from "lucide-react";

// Luxury Dropdown Component
const LuxuryDropdown = ({ options, value, onChange, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={dropdownRef}>
      <label className="flex items-center text-platinumGray mb-3 font-medium">
        {Icon && <Icon size={16} className="mr-2 text-brandGold" />}
        {label}
      </label>
      <div 
        className="w-full border border-gray-200 p-4 bg-transparent hover:border-brandGold/50 focus:border-brandGold rounded-sm cursor-pointer transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {selectedOption?.icon && (
              <selectedOption.icon size={18} className="mr-3 text-brandGold" />
            )}
            <span className="text-richEbony">{selectedOption?.label}</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-brandGold/10 flex items-center justify-center">
            <ChevronDown 
              size={14} 
              className={`text-brandGold transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
            />
          </div>
        </div>
      </div>
      
      {/* Animated dropdown with luxury styling */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 w-full mt-2 bg-white border border-brandGold/20 shadow-luxury rounded-sm"
          >
            {options.map((option) => (
              <div 
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center px-4 py-3 hover:bg-brandGold/5 cursor-pointer transition-colors duration-200 ${
                  option.value === value ? 'bg-brandGold/10' : ''
                }`}
              >
                {option.icon && <option.icon size={16} className={`mr-3 ${option.value === value ? 'text-brandGold' : 'text-platinumGray'}`} />}
                <span className={`${option.value === value ? 'text-brandGold' : 'text-richEbony'}`}>{option.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Elegant hover effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brandGold/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-brandGold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default function AppointmentPage() {
    const [selectedLocation, setSelectedLocation] = useState("casablanca");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [guests, setGuests] = useState(1);
    const [preferences, setPreferences] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
    };

    // Enhanced time slots with descriptions for a more luxurious experience
    const morningAppointments = [
        {
            time: "10:00",
            description: "Séance matinale avec champagne de bienvenue",
            availability: "Disponible"
        },
        {
            time: "11:30",
            description: "Consultation privée suivie d'un déjeuner léger",
            availability: "Disponible"
        }
    ];

    const afternoonAppointments = [
        {
            time: "14:00",
            description: "Présentation exclusive des nouvelles créations",
            availability: "Disponible"
        },
        {
            time: "15:30",
            description: "Rendez-vous thé & découverte",
            availability: "Disponible"
        },
        {
            time: "17:00",
            description: "Séance au crépuscule avec dégustation de vin",
            availability: "Disponible"
        }
    ];

    // Premium consultation types
    const consultationTypes = [
        {
            id: "discovery",
            title: "Découverte des Collections",
            description: "Exploration guidée de nos pièces signatures, accompagnée d'une présentation de l'histoire et l'artisanat derrière chaque création.",
            duration: "1h30",
            icon: Diamond
        },
        {
            id: "bespoke",
            title: "Création Sur-Mesure",
            description: "Rencontre avec un de nos maîtres joailliers pour imaginer une pièce unique, parfaitement adaptée à vos désirs et personnalité.",
            duration: "2h",
            icon: Diamond
        },
        {
            id: "bridal",
            title: "Collection Nuptiale",
            description: "Sélection privée de nos plus belles pièces de joaillerie nuptiale, dans une ambiance romantique et confidentielle.",
            duration: "1h30",
            icon: Diamond
        },
        {
            id: "investment",
            title: "Joaillerie d'Investissement",
            description: "Consultation avec notre expert en diamants et pierres précieuses pour des acquisitions de haute valeur dans une perspective patrimoniale.",
            duration: "2h",
            icon: Diamond
        }
    ];
    
    // Options for guest dropdown with icons
    const guestOptions = [
      { value: 1, label: "1 personne", icon: User },
      { value: 2, label: "2 personnes", icon: UserPlus },
      { value: 3, label: "3 personnes", icon: Users },
      { value: 4, label: "4 personnes", icon: Users }
    ];
    
    // Options for preferences dropdown with icons
    const preferenceOptions = [
      { value: "", label: "Sélectionnez une option", icon: null },
      { value: "champagne_rose", label: "Champagne Rosé", icon: Wine },
      { value: "champagne_brut", label: "Champagne Brut", icon: Wine },
      { value: "tea", label: "Thé et pâtisseries marocaines", icon: Coffee },
      { value: "coffee", label: "Café arabe et douceurs", icon: Coffee },
      { value: "none", label: "Aucune préférence", icon: Utensils }
    ];

    return (
        <>
            <NextSeo
                title="Rendez-vous Privé | Diamant Rouge"
                description="Entrez dans l'univers exclusif de Diamant Rouge avec un rendez-vous privé dans notre showroom à Casablanca ou une consultation virtuelle personnalisée."
                openGraph={{
                    title: "Rendez-vous Privé | Diamant Rouge",
                    description: "Entrez dans l'univers exclusif de Diamant Rouge avec un rendez-vous privé dans notre showroom à Casablanca ou une consultation virtuelle personnalisée.",
                }}
            />

            {/* Hero Section with asymmetrical layout to avoid covering the diamond */}
            <section className="relative h-[80vh] flex items-center">
                {/* Background Image */}
                <Image
                    src="/images/showroom.jpg"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    alt="Diamant Rouge Showroom"
                    className="z-0"
                    priority
                />
                {/* Refined asymmetrical gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-richEbony/90 via-richEbony/50 to-transparent z-0" />

                {/* Hero Content */}
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Text content positioned to the left */}
                        <motion.div
                            className="text-left"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <h1 className="text-5xl md:text-7xl font-serif text-brandIvory mb-4 leading-tight">
                                Un Moment <span className="text-brandGold">d'Exception</span>
                            </h1>
                            <p className="mt-4 text-xl text-brandIvory font-light">
                                Découvrez l'art de la haute joaillerie dans un cadre exclusif, où notre équipe d'experts vous accompagne dans votre quête de perfection.
                            </p>
                            <motion.div
                                className="mt-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <a href="#booking" className="inline-block px-8 py-3 bg-brandGold text-richEbony rounded-sm font-medium hover:bg-brandGold/90 transition-all duration-300 shadow-luxury">
                                    Réserver votre rendez-vous
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Decorative elements to the right */}
                        <motion.div
                            className="hidden md:flex justify-center items-center relative"
                            initial="hidden"
                            animate="visible"
                            variants={scaleIn}
                        >
                            <div className="w-64 h-64 rounded-full border-2 border-brandGold/30 absolute animate-drift"></div>
                            <div className="w-48 h-48 rounded-full border border-brandGold/50 absolute"></div>
                            <div className="w-32 h-32 rounded-full border border-brandGold/70 absolute"></div>
                            <div className="w-16 h-16 rounded-full bg-brandGold/20 absolute flex items-center justify-center">
                                <Diamond className="text-brandGold w-8 h-8" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Remaining sections remain unchanged until we get to the form section */}
            {/* Signature Experience Section */}
            <section className="bg-brandIvory py-24 px-6">
                {/* Content remains the same */}
            </section>

            {/* The Diamant Rouge Journey */}
            <section className="bg-white py-24 px-6">
                {/* Content remains the same */}
            </section>

            {/* Enhanced Booking Form */}
            <section id="booking" className="bg-brandIvory py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-serif text-brandGold mb-4">
                            Réserver Votre Rendez-vous
                        </h2>
                        <div className="w-24 h-0.5 bg-brandGold mx-auto mb-8"></div>
                        <p className="text-platinumGray max-w-3xl mx-auto">
                            Notre équipe de conseillers personnels vous accueillera pour une expérience sur-mesure, adaptée à vos souhaits et préférences.
                        </p>
                    </motion.div>

                    <div className="bg-white p-8 md:p-12 shadow-luxury max-w-4xl mx-auto">
                        <div className="border-b border-brandGold/20 pb-8 mb-12">
                            <p className="italic text-platinumGray text-sm mb-3">Une création Diamant Rouge</p>
                            <h3 className="text-2xl font-serif text-brandGold">Consultation Exclusive</h3>
                        </div>

                        {/* Steps 1-3 remain unchanged */}
                        
                        {/* Step 4: Additional Details with Custom Luxury Dropdowns */}
                        <div className="mb-16">
                            <h3 className="text-xl font-serif text-brandGold mb-8">4. Informations complémentaires</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Replace standard select with LuxuryDropdown */}
                                <LuxuryDropdown 
                                  label="Nombre de personnes"
                                  icon={Users}
                                  value={guests}
                                  onChange={setGuests}
                                  options={guestOptions}
                                />
                                
                                <LuxuryDropdown 
                                  label="Préférences particulières"
                                  icon={Coffee}
                                  value={preferences}
                                  onChange={setPreferences}
                                  options={preferenceOptions}
                                />
                            </div>

                            {/* Special Requests Field - Also enhanced to match */}
                            <div className="mt-10 relative group">
                                <label className="flex items-center text-platinumGray mb-3 font-medium">
                                    <Diamond size={16} className="mr-2 text-brandGold" />
                                    Demandes spéciales ou centres d'intérêt
                                </label>
                                <textarea
                                    className="w-full appearance-none border border-gray-200 p-4 bg-transparent hover:border-brandGold/50 focus:border-brandGold focus:ring-0 outline-none transition-all duration-300 rounded-sm min-h-[120px] text-richEbony"
                                    placeholder="Partagez-nous toute information qui pourrait nous aider à personnaliser votre visite"
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                ></textarea>
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brandGold/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-brandGold/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Concierge Note */}
                            <div className="mt-10 p-6 bg-brandGold/5 border border-brandGold/20 rounded-sm">
                                <div className="flex items-start">
                                    <div className="mr-4">
                                        <div className="w-10 h-10 rounded-full bg-brandGold/20 flex items-center justify-center">
                                            <Diamond size={18} className="text-brandGold" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-serif text-brandGold mb-2">Note de notre Concierge</h4>
                                        <p className="text-sm text-platinumGray">
                                            Pour les consultations sur-mesure, nous vous recommandons de prévoir au moins 2 heures afin de vous offrir l'attention exclusive que mérite votre projet. Notre équipe reste entièrement à votre disposition pour adapter l'horaire à vos contraintes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Submission */}
                        <div className="flex flex-col items-center">
                            <button
                                className="px-10 py-4 bg-brandGold text-richEbony rounded-sm font-medium hover:bg-brandGold/90 transition-all duration-300 shadow-luxury flex items-center"
                                disabled={!selectedType || !selectedDate || !selectedTime}
                            >
                                <span>Confirmer le rendez-vous</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>

                            <p className="text-xs text-platinumGray mt-6 text-center max-w-md">
                                En confirmant ce rendez-vous, vous acceptez d'être contacté(e) par notre équipe pour finaliser les détails de votre visite.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Remaining sections remain unchanged */}
            {/* Reassurance Section */}
            <section className="bg-white py-16 px-6">
                {/* Content remains the same */}
            </section>

            {/* Client Testimonials Section */}
            <section className="bg-white py-24 px-6">
                {/* Content remains the same */}
            </section>

            {/* FAQ Section */}
            <section className="bg-brandIvory py-24 px-6">
                {/* Content remains the same */}
            </section>

            {/* Contact CTA Section */}
            <section className="bg-white py-16 px-6 text-center">
                {/* Content remains the same */}
            </section>
        </>
    );
}