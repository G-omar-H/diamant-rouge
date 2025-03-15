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

    {/* Hero Section - Preserving the central diamond feature */}
<section className="relative h-[80vh] flex items-center">
  {/* Background Image - No overlay */}
  <Image
    src="/images/showroom.jpg"
    layout="fill"
    objectFit="cover"
    objectPosition="center"
    alt="Diamant Rouge Showroom"
    className="z-0"
    priority
  />
  
  {/* Hero Content - Positioned on the left side to avoid covering the diamond */}
  <div className="container mx-auto px-6 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Text content with subtle backdrop */}
      <motion.div
        className="text-left"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="backdrop-blur-sm bg-richEbony/10 p-8 border border-brandGold/10 shadow-luxury inline-block">
          <h1 className="text-5xl md:text-7xl font-serif text-brandIvory mb-4 leading-tight drop-shadow-md">
            Un Moment <span className="text-brandGold">d'Exception</span>
          </h1>
          <p className="mt-4 text-xl text-brandIvory font-light drop-shadow-sm">
            Découvrez l'art de la haute joaillerie dans un cadre exclusif, où notre équipe d'experts vous accompagne dans votre quête de perfection.
          </p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <a 
              href="#booking" 
              className="group inline-flex items-center border-2 border-brandGold px-7 py-3 bg-transparent hover:bg-brandGold/20 text-brandGold transition-all duration-500 shadow-sm"
            >
              <span className="font-serif tracking-wider">Réserver votre rendez-vous</span>
              <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Empty right side to preserve the diamond in the center */}
      <div className="hidden md:block"></div>
    </div>
  </div>
</section>

            {/* Signature Experience Section */}
            <section className="bg-brandIvory py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-serif text-brandGold mb-4">
                            L'Expérience Diamant Rouge
                        </h2>
                        <div className="w-24 h-0.5 bg-brandGold mx-auto mb-8"></div>
                        <p className="text-platinumGray max-w-3xl mx-auto">
                            Chaque rendez-vous est une immersion dans notre univers d'excellence et de raffinement, où nos experts vous guident à travers nos collections exceptionnelles.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Experience Card 1 */}
                        <motion.div
                            className="text-center"
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                        >
                            <div className="w-20 h-20 rounded-full bg-brandGold/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-serif text-brandGold">1</span>
                            </div>
                            <h3 className="text-xl font-serif text-brandGold mb-4">Consultation Personnalisée</h3>
                            <p className="text-platinumGray">
                                Une rencontre exclusive avec nos gemmologues experts qui vous guideront parmi nos créations les plus précieuses.
                            </p>
                        </motion.div>

                        {/* Experience Card 2 */}
                        <motion.div
                            className="text-center"
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-20 h-20 rounded-full bg-brandGold/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-serif text-brandGold">2</span>
                            </div>
                            <h3 className="text-xl font-serif text-brandGold mb-4">Découverte des Créations</h3>
                            <p className="text-platinumGray">
                                Essayez nos pièces d'exception et découvrez comment elles subliment votre élégance naturelle.
                            </p>
                        </motion.div>

                        {/* Experience Card 3 */}
                        <motion.div
                            className="text-center"
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="w-20 h-20 rounded-full bg-brandGold/10 flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl font-serif text-brandGold">3</span>
                            </div>
                            <h3 className="text-xl font-serif text-brandGold mb-4">Création Sur-Mesure</h3>
                            <p className="text-platinumGray">
                                Explorez les possibilités infinies de la création sur-mesure pour donner vie à votre vision personnelle.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Diamant Rouge Journey */}
            <section className="bg-white py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                        >
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-24 h-24 border border-brandGold"></div>
                                <Image
                                    src="/images/gemologist.jpg"
                                    width={600}
                                    height={500}
                                    className="w-full relative z-10 shadow-luxury"
                                    alt="Diamant Rouge Gemologist"
                                />
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 border border-brandGold"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-3xl font-serif text-brandGold mb-6">
                                Un Savoir-Faire d'Exception
                            </h3>
                            <div className="w-16 h-0.5 bg-brandGold mb-8"></div>
                            <p className="text-platinumGray mb-8">
                                Nos artisans joailliers perpétuent un héritage d'excellence et de savoir-faire pour créer des pièces d'exception qui traverseront les générations. Chaque création est le reflet de notre passion pour la perfection.
                            </p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brandGold mt-2 mr-3"></div>
                                    <p className="text-platinumGray">
                                        <span className="font-medium">Séance privée</span> avec un maître gemmologue
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brandGold mt-2 mr-3"></div>
                                    <p className="text-platinumGray">
                                        Découvrez l'art et la science derrière chaque diamant
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brandGold mt-2 mr-3"></div>
                                    <p className="text-platinumGray">
                                        Essayage exclusif de nos créations les plus précieuses
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brandGold mt-2 mr-3"></div>
                                    <p className="text-platinumGray">
                                        Personnalisation sur-mesure avec nos experts
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
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


                        {/* Step 1: Choose Location */}
                        <div className="mb-16">
                            <h3 className="text-xl font-serif text-brandGold mb-8">1. Choisissez l'expérience qui vous convient</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Casablanca Option */}
                                <button
                                    onClick={() => setSelectedLocation("casablanca")}
                                    className={`p-6 border group transition-all duration-300 flex flex-col items-center text-center rounded-sm ${selectedLocation === "casablanca"
                                        ? "border-brandGold bg-brandGold/5"
                                        : "border-gray-200 hover:border-brandGold/50"
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${selectedLocation === "casablanca"
                                        ? "bg-brandGold text-white"
                                        : "bg-gray-100 text-platinumGray group-hover:bg-brandGold/20"
                                        }`}>
                                        <MapPin size={24} />
                                    </div>
                                    <h4 className="text-base font-serif text-richEbony mb-2">Showroom Casablanca</h4>
                                    <p className="text-sm text-platinumGray">
                                        Vivez l'expérience Diamant Rouge dans notre showroom exclusif, avec service d'accueil personnalisé et rafraîchissements.
                                    </p>
                                    <p className="text-xs text-brandGold mt-4 font-medium italic">
                                        Anfa Place, Boulevard de la Corniche
                                    </p>
                                </button>

                                {/* Virtual Option */}
                                <button
                                    onClick={() => setSelectedLocation("virtual")}
                                    className={`p-6 border group transition-all duration-300 flex flex-col items-center text-center rounded-sm ${selectedLocation === "virtual"
                                        ? "border-brandGold bg-brandGold/5"
                                        : "border-gray-200 hover:border-brandGold/50"
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${selectedLocation === "virtual"
                                        ? "bg-brandGold text-white"
                                        : "bg-gray-100 text-platinumGray group-hover:bg-brandGold/20"
                                        }`}>
                                        <Video size={24} />
                                    </div>
                                    <h4 className="text-base font-serif text-richEbony mb-2">Consultation Virtuelle</h4>
                                    <p className="text-sm text-platinumGray">
                                        Découvrez nos créations depuis le confort de votre domicile. Un coffret de présentation peut vous être envoyé avant la consultation.
                                    </p>
                                    <p className="text-xs text-brandGold mt-4 font-medium italic">
                                        Vidéoconférence privée
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Step 2: Appointment Type */}
                        <div className="mb-16">
                            <h3 className="text-xl font-serif text-brandGold mb-8">2. Sélectionnez votre type de consultation</h3>

                            <div className="grid gap-4">
                                {consultationTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`flex items-start p-5 border cursor-pointer transition-all duration-300 rounded-sm ${selectedType === type.id
                                            ? "border-brandGold bg-brandGold/5"
                                            : "border-gray-200 hover:border-brandGold/30"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 transition-colors ${selectedType === type.id
                                            ? "bg-brandGold text-white"
                                            : "bg-gray-100 text-platinumGray"
                                            }`}>
                                            <type.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium text-base text-richEbony">{type.title}</h4>
                                                <span className="text-xs bg-brandGold/10 text-brandGold px-2 py-1 rounded">
                                                    {type.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm text-platinumGray">{type.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 3: Choose Date and Time */}
                        <div className="mb-16">
                            <h3 className="text-xl font-serif text-brandGold mb-8">3. Choisissez une date et une heure</h3>

                            <div className="mb-10">
                                <label className="flex items-center text-platinumGray mb-4 font-medium">
                                    <Calendar size={16} className="mr-2 text-brandGold" />
                                    Date de votre consultation
                                </label>
                                <div className="relative group">
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 p-4 bg-transparent focus:border-brandGold focus:ring-1 focus:ring-brandGold outline-none transition-all rounded-sm text-richEbony"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-brandGold to-transparent group-hover:w-full transition-all duration-300"></div>
                                </div>
                                <p className="mt-2 text-xs text-platinumGray italic">
                                    Notre showroom est ouvert du Mardi au Samedi
                                </p>
                            </div>

                            {selectedDate && (
                                <div>
                                    <h4 className="font-medium text-platinumGray mb-4 flex items-center">
                                        <Clock size={16} className="mr-2 text-brandGold" />
                                        Disponibilités du {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                    </h4>

                                    <div className="mb-6">
                                        <h5 className="text-sm font-medium text-platinumGray mb-3">Matinée</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {morningAppointments.map((slot) => (
                                                <div
                                                    key={slot.time}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={`flex flex-col p-4 border cursor-pointer transition-all duration-300 rounded-sm ${selectedTime === slot.time
                                                        ? "border-brandGold bg-brandGold/5"
                                                        : "border-gray-200 hover:border-brandGold/30"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-richEbony text-base">{slot.time}</span>
                                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                            {slot.availability}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-platinumGray">{slot.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="text-sm font-medium text-platinumGray mb-3">Après-midi</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {afternoonAppointments.map((slot) => (
                                                <div
                                                    key={slot.time}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={`flex flex-col p-4 border cursor-pointer transition-all duration-300 rounded-sm ${selectedTime === slot.time
                                                        ? "border-brandGold bg-brandGold/5"
                                                        : "border-gray-200 hover:border-brandGold/30"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-richEbony text-base">{slot.time}</span>
                                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                            {slot.availability}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-platinumGray">{slot.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

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


            {/* Reassurance Section */}
            <section className=" py-16 px-6 bg-burgundy">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        className="mb-12"
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-serif text-brandGold mb-4">
                            Notre Engagement
                        </h2>
                        <div className="w-24 h-0.5 bg-brandGold mx-auto mb-8"></div>
                        <p className="text-platinumGray max-w-2xl mx-auto">
                            Chaque rendez-vous est complètement gratuit et sans engagement, vous garantissant une expérience aussi luxueuse que détendue. Notre seule ambition : vous faire découvrir l'excellence Diamant Rouge.
                        </p>
                    </motion.div>
                </div>
            </section>


            {/* FAQ Section */}
            <section className="bg-brandIvory py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-serif text-brandGold mb-4">
                            Questions Fréquentes
                        </h2>
                        <div className="w-24 h-0.5 bg-brandGold mx-auto mb-8"></div>
                    </motion.div>

                    <div className="space-y-6">
                        <div className="border-b border-brandGold/20 pb-6">
                            <h4 className="text-base font-serif text-brandGold mb-3">
                                Comment se déroule un rendez-vous privé ?
                            </h4>
                            <p className="text-platinumGray">
                                Chaque consultation commence par un accueil personnalisé avec une boisson de bienvenue. Votre conseiller dédié vous guidera ensuite à travers les collections adaptées à vos préférences. Vous aurez tout le temps nécessaire pour essayer les pièces et poser vos questions dans un cadre confidentiel et luxueux.
                            </p>
                        </div>

                        <div className="border-b border-brandGold/20 pb-6">
                            <h4 className="text-base font-serif text-brandGold mb-3">
                                Puis-je modifier ou annuler mon rendez-vous ?
                            </h4>
                            <p className="text-platinumGray">
                                Bien sûr, nous comprenons que votre emploi du temps peut changer. Nous vous demandons simplement de nous prévenir au moins 24 heures à l'avance afin que nous puissions réorganiser au mieux votre visite.
                            </p>
                        </div>

                        <div className="border-b border-brandGold/20 pb-6">
                            <h4 className="text-base font-serif text-brandGold mb-3">
                                Comment fonctionnent les consultations virtuelles ?
                            </h4>
                            <p className="text-platinumGray">
                                Nos consultations virtuelles sont réalisées via une plateforme sécurisée avec un lien privé que nous vous envoyons. Pour une expérience optimale, nous pouvons vous faire parvenir au préalable une sélection de pièces dans un coffret scellé, accompagnée d'une loupe gemmologique pour apprécier tous les détails.
                            </p>
                        </div>

                        <div className="border-b border-brandGold/20 pb-6">
                            <h4 className="text-base font-serif text-brandGold mb-3">
                                Quels sont les délais pour une création sur-mesure ?
                            </h4>
                            <p className="text-platinumGray">
                                Chaque création sur-mesure est unique et nécessite un temps de réalisation variable. En général, comptez entre 4 et 12 semaines selon la complexité du design, le sourcing des pierres et les finitions souhaitées. Votre conseiller vous communiquera un calendrier précis lors de votre consultation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="bg-white py-16 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-serif text-brandGold mb-6">
                            Besoin d'Assistance Personnalisée?
                        </h3>
                        <p className="text-platinumGray max-w-2xl mx-auto mb-10">
                            Notre équipe de concierges est à votre disposition pour toute demande spécifique ou pour organiser une expérience entièrement sur-mesure.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                            <a href="tel:+212522000000" className="flex items-center text-brandGold hover:text-burgundy transition-colors">
                                <span className="border border-brandGold rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </span>
                                +212 522 000 000
                            </a>
                            <a href="mailto:concierge@diamantrouge.com" className="flex items-center text-brandGold hover:text-burgundy transition-colors">
                                <span className="border border-brandGold rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </span>
                                concierge@diamantrouge.com
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}