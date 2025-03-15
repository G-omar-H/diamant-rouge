import { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Video, Users, Coffee, Diamond, ChevronDown } from "lucide-react";

export default function AppointmentPage() {
    const [selectedLocation, setSelectedLocation] = useState("casablanca");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [guests, setGuests] = useState(1);
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
                                    className={`p-6 border group transition-all duration-300 flex flex-col items-center text-center rounded-sm ${
                                        selectedLocation === "casablanca" 
                                            ? "border-brandGold bg-brandGold/5" 
                                            : "border-gray-200 hover:border-brandGold/50"
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                                        selectedLocation === "casablanca" 
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
                                    className={`p-6 border group transition-all duration-300 flex flex-col items-center text-center rounded-sm ${
                                        selectedLocation === "virtual" 
                                            ? "border-brandGold bg-brandGold/5" 
                                            : "border-gray-200 hover:border-brandGold/50"
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                                        selectedLocation === "virtual" 
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
                                        className={`flex items-start p-5 border cursor-pointer transition-all duration-300 rounded-sm ${
                                            selectedType === type.id 
                                                ? "border-brandGold bg-brandGold/5" 
                                                : "border-gray-200 hover:border-brandGold/30"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 transition-colors ${
                                            selectedType === type.id 
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
                                        Disponibilités du {new Date(selectedDate).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long'})}
                                    </h4>
                                    
                                    <div className="mb-6">
                                        <h5 className="text-sm font-medium text-platinumGray mb-3">Matinée</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {morningAppointments.map((slot) => (
                                                <div
                                                    key={slot.time}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={`flex flex-col p-4 border cursor-pointer transition-all duration-300 rounded-sm ${
                                                        selectedTime === slot.time 
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
                                                    className={`flex flex-col p-4 border cursor-pointer transition-all duration-300 rounded-sm ${
                                                        selectedTime === slot.time 
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
                        
                        {/* Step 4: Additional Details with Refined Select Inputs */}
                        <div className="mb-16">
                            <h3 className="text-xl font-serif text-brandGold mb-8">4. Informations complémentaires</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="relative group">
                                    <label className="flex items-center text-platinumGray mb-3 font-medium">
                                        <Users size={16} className="mr-2 text-brandGold" />
                                        Nombre de personnes
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none border border-gray-200 p-4 pr-10 bg-transparent focus:border-brandGold focus:ring-1 focus:ring-brandGold outline-none transition-all rounded-sm text-richEbony"
                                            value={guests}
                                            onChange={(e) => setGuests(Number(e.target.value))}
                                        >
                                            <option value={1}>1 personne</option>
                                            <option value={2}>2 personnes</option>
                                            <option value={3}>3 personnes</option>
                                            <option value={4}>4 personnes</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brandGold">
                                            <ChevronDown size={18} />
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent via-brandGold to-transparent group-hover:w-full transition-all duration-500"></div>
                                    </div>
                                </div>
                                
                                <div className="relative group">
                                    <label className="flex items-center text-platinumGray mb-3 font-medium">
                                        <Coffee size={16} className="mr-2 text-brandGold" />
                                        Préférences particulières
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none border border-gray-200 p-4 pr-10 bg-transparent focus:border-brandGold focus:ring-1 focus:ring-brandGold outline-none transition-all rounded-sm text-richEbony"
                                        >
                                            <option value="">Sélectionnez une option</option>
                                            <option value="champagne_rose">Champagne Rosé</option>
                                            <option value="champagne_brut">Champagne Brut</option>
                                            <option value="tea">Thé et pâtisseries marocaines</option>
                                            <option value="coffee">Café arabe et douceurs</option>
                                            <option value="none">Aucune préférence</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brandGold">
                                            <ChevronDown size={18} />
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent via-brandGold to-transparent group-hover:w-full transition-all duration-500">import { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Video, Users, Coffee, Diamond, ChevronDown } from "lucide-react";

export default function AppointmentPage() {
    const [selectedLocation, setSelectedLocation] = useState("casablanca");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [guests, setGuests] = useState(1);
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
                                    className={`p-6 border group transition-all duration-300 flex flex-col items-center text-center rounded-sm ${
                                        selectedLocation === "casablanca" 
                                            ? "border-brandGold bg-brandGold/5" 
                                            : "border-gray-200 hover:border-brandGold/50"
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                                        selectedLocation === "casablanca" 
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
                                    className={`p-6 border group transition-all duration-300 flex flex-col items-center text-center rounded-sm ${
                                        selectedLocation === "virtual" 
                                            ? "border-brandGold bg-brandGold/5" 
                                            : "border-gray-200 hover:border-brandGold/50"
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                                        selectedLocation === "virtual" 
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
                                        className={`flex items-start p-5 border cursor-pointer transition-all duration-300 rounded-sm ${
                                            selectedType === type.id 
                                                ? "border-brandGold bg-brandGold/5" 
                                                : "border-gray-200 hover:border-brandGold/30"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 transition-colors ${
                                            selectedType === type.id 
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