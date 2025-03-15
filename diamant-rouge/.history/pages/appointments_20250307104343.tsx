import { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Video } from "lucide-react";

export default function AppointmentPage() {
    const [selectedLocation, setSelectedLocation] = useState("casablanca");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    
    // Available time slots
    const availableTimes = ["10:00", "11:30", "14:00", "15:30", "17:00"];
    
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

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

            {/* Hero Section with luxurious imagery */}
            <section className="relative h-[80vh] flex items-center justify-center text-center">
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
                {/* Elegant Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-richEbony/80 via-burgundy/40 to-transparent z-0" />

                {/* Hero Content */}
                <motion.div 
                    className="relative z-10 px-6 max-w-4xl"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <h1 className="text-5xl md:text-7xl font-serif text-brandIvory mb-4">
                        Un Moment <span className="text-brandGold">d'Exception</span>
                    </h1>
                    <p className="mt-4 text-xl text-brandIvory max-w-3xl mx-auto font-light">
                        Découvrez l'art de la haute joaillerie dans un cadre exclusif, où notre équipe d'experts vous accompagne dans votre quête de perfection.
                    </p>
                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <a href="#booking" className="px-8 py-3 bg-brandGold text-richEbony rounded-sm font-medium hover:bg-brandGold/90 transition-all duration-300 shadow-luxury">
                            Réserver votre rendez-vous
                        </a>
                    </motion.div>
                </motion.div>
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

            {/* Booking Form */}
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
                            Choisissez l'expérience qui vous convient et entrez dans l'univers d'exception de Diamant Rouge.
                        </p>
                    </motion.div>

                    <div className="bg-white p-8 md:p-12 shadow-luxury max-w-4xl mx-auto">
                        {/* Step 1: Choose Location */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-serif text-brandGold mb-6">Sélectionnez le type de rendez-vous</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Casablanca Option */}
                                <button
                                    onClick={() => setSelectedLocation("casablanca")}
                                    className={`p-6 border transition-all duration-300 flex flex-col items-center text-center ${
                                        selectedLocation === "casablanca" 
                                            ? "border-brandGold bg-brandGold/5" 
                                            : "border-gray-200 hover:border-brandGold/50"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                                        selectedLocation === "casablanca" 
                                            ? "bg-brandGold text-white" 
                                            : "bg-gray-100 text-platinumGray"
                                    }`}>
                                        <MapPin size={20} />
                                    </div>
                                    <h4 className="text-lg font-medium text-richEbony mb-2">Showroom Casablanca</h4>
                                    <p className="text-sm text-platinumGray">
                                        Vivez l'expérience Diamant Rouge dans notre showroom exclusif à Casablanca
                                    </p>
                                </button>

                                {/* Virtual Option */}
                                <button
                                    onClick={() => setSelectedLocation("virtual")}
                                    className={`p-6 border transition-all duration-300 flex flex-col items-center text-center ${
                                        selectedLocation === "virtual" 
                                            ? "border-brandGold bg-brandGold/5" 
                                            : "border-gray-200 hover:border-brandGold/50"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                                        selectedLocation === "virtual" 
                                            ? "bg-brandGold text-white" 
                                            : "bg-gray-100 text-platinumGray"
                                    }`}>
                                        <Video size={20} />
                                    </div>
                                    <h4 className="text-lg font-medium text-richEbony mb-2">Consultation Virtuelle</h4>
                                    <p className="text-sm text-platinumGray">
                                        Découvrez nos créations d'exception depuis le confort de votre domicile
                                    </p>
                                </button>
                            </div>
                        </div>
                        
                        {/* Step 2: Appointment Type */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-serif text-brandGold mb-6">Choisissez votre consultation</h3>
                            
                            <select
                                className="w-full border border-gray-200 p-4 bg-transparent focus:border-brandGold focus:ring-1 focus:ring-brandGold outline-none transition-all"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="">Sélectionnez le type de consultation</option>
                                <option value="discovery">Découverte des Collections</option>
                                <option value="bespoke">Création Sur-Mesure</option>
                                <option value="bridal">Sélection Nuptiale</option>
                            </select>
                        </div>
                        
                        {/* Step 3: Choose Date and Time */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-serif text-brandGold mb-6">Sélectionnez date et heure</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-platinumGray mb-2">
                                        <Calendar size={16} className="mr-2" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 p-4 bg-transparent focus:border-brandGold focus:ring-1 focus:ring-brandGold outline-none transition-all"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="flex items-center text-platinumGray mb-2">
                                        <Clock size={16} className="mr-2" />
                                        Heure
                                    </label>
                                    <select
                                        className="w-full border border-gray-200 p-4 bg-transparent focus:border-brandGold focus:ring-1 focus:ring-brandGold outline-none transition-all"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                    >
                                        <option value="">Sélectionnez une heure</option>
                                        {availableTimes.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="text-center">
                            <Link href={`/booking?location=${selectedLocation}&type=${selectedType}&date=${selectedDate}&time=${selectedTime}`}>
                                <button
                                    className={`px-10 py-4 bg-brandGold text-white font-medium transition-all duration-300 ${
                                        selectedLocation && selectedType && selectedDate && selectedTime 
                                            ? "hover:bg-brandGold/90" 
                                            : "opacity-50 cursor-not-allowed"
                                    }`}
                                    disabled={!selectedLocation || !selectedType || !selectedDate || !selectedTime}
                                >
                                    Réserver Maintenant
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guarantee Section */}
            <section className="bg-richEbony py-16 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-3xl font-serif text-brandGold mb-4">
                        Notre Engagement
                    </h3>
                    <p className="text-brandIvory max-w-2xl mx-auto">
                        Chaque rendez-vous est complètement gratuit et sans engagement, vous garantissant une expérience aussi luxueuse que détendue. Notre seule ambition : vous faire découvrir l'excellence Diamant Rouge.
                    </p>
                </div>
            </section>
        </>
    );
}