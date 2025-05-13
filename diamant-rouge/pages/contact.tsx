// pages/contact.tsx
import Head from "next/head";
import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";
import { Diamond, MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would call your API endpoint
        console.log("Form data submitted:", formData);
        
        setIsSubmitting(false);
        setFormSubmitted(true);
        
        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
        });
    };

    return (
        <>
            <Head>
                <title>Contact | Diamant Rouge</title>
                <meta name="description" content="Contactez Diamant Rouge pour des demandes sur-mesure, des informations sur nos collections ou pour prendre rendez-vous dans notre atelier au Maroc." />
            </Head>
            
            {/* Hero Section */}
            <section className="relative h-[50vh] w-full overflow-hidden">
                <Image 
                    src="/images/contact-hero.jpg" 
                    alt="Contactez Diamant Rouge" 
                    layout="fill"
                    objectFit="cover"
                    priority
                    className="brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Contactez-Nous</h1>
                    <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent my-4"></div>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl">Pour toutes vos questions et demandes personnalisées</p>
                </div>
            </section>
            
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                {/* Intro */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-serif text-brandGold mb-6">Notre Équipe à Votre Service</h2>
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Diamond size={8} className="text-brandGold fill-brandGold" />
                            </div>
                        </div>
                    </div>
                    <p className="text-platinumGray leading-relaxed">
                        Que vous souhaitiez en savoir plus sur nos créations, prendre rendez-vous pour une consultation personnalisée, 
                        ou discuter d'un projet sur-mesure, notre équipe est à votre écoute pour vous accompagner 
                        dans votre démarche avec toute l'attention que vous méritez.
                    </p>
                </div>

                {/* Contact Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Contact Information */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="bg-gradient-to-b from-brandIvory/50 to-white p-8 border border-brandGold/10 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                            <h3 className="text-2xl font-serif text-brandGold mb-6">Nos Coordonnées</h3>
                            
                            <div className="space-y-8">
                                {/* Address */}
                                <div className="flex">
                                    <div className="mr-4">
                                        <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                                            <MapPin size={18} className="text-brandGold" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-richEbony font-medium mb-1">Notre Atelier</h4>
                                        <p className="text-platinumGray mb-1">45 Avenue Hassan II</p>
                                        <p className="text-platinumGray">Casablanca 20250, Maroc</p>
                                    </div>
                                </div>
                                
                                {/* Phone */}
                                <div className="flex">
                                    <div className="mr-4">
                                        <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                                            <Phone size={18} className="text-brandGold" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-richEbony font-medium mb-1">Téléphone</h4>
                                        <p className="text-platinumGray">+212 5 22 43 XX XX</p>
                                        <p className="text-platinumGray">+212 6 61 XX XX XX</p>
                                    </div>
                                </div>
                                
                                {/* Email */}
                                <div className="flex">
                                    <div className="mr-4">
                                        <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                                            <Mail size={18} className="text-brandGold" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-richEbony font-medium mb-1">Email</h4>
                                        <p className="text-platinumGray">contact@diamant-rouge.ma</p>
                                        <p className="text-platinumGray">info@diamant-rouge.ma</p>
                                    </div>
                                </div>
                                
                                {/* Hours */}
                                <div className="flex">
                                    <div className="mr-4">
                                        <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                                            <Clock size={18} className="text-brandGold" />
                                        </div>
                                    </div>
                    <div>
                                        <h4 className="text-richEbony font-medium mb-1">Heures d'Ouverture</h4>
                                        <p className="text-platinumGray">Lundi - Vendredi: 10h - 19h</p>
                                        <p className="text-platinumGray">Samedi: 10h - 18h (Sur rendez-vous)</p>
                                        <p className="text-platinumGray">Dimanche: Fermé</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Map or Image */}
                            <div className="mt-10 relative h-48 overflow-hidden rounded-sm border border-brandGold/10">
                                <Image 
                                    src="/images/map-placeholder.jpg" 
                                    alt="Emplacement de Diamant Rouge à Casablanca" 
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-all duration-300">
                                    <a 
                                        href="https://maps.google.com" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white text-richEbony text-sm hover:bg-brandGold hover:text-white transition-colors duration-300"
                                    >
                                        Voir sur Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Form */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div className="bg-white p-8 border border-brandGold/10 rounded-sm shadow-subtle transition-shadow duration-500">
                            <h3 className="text-2xl font-serif text-brandGold mb-6">Envoyez-Nous un Message</h3>
                            
                            {formSubmitted ? (
                                <div className="text-center py-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brandGold/10 mb-6">
                                        <CheckCircle size={32} className="text-brandGold" />
                                    </div>
                                    <h4 className="text-xl font-serif text-richEbony mb-3">Message Envoyé avec Succès</h4>
                                    <p className="text-platinumGray mb-6">
                                        Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                                    </p>
                                    <button 
                                        onClick={() => setFormSubmitted(false)} 
                                        className="px-6 py-2 border border-brandGold text-brandGold hover:bg-brandGold hover:text-white transition-colors duration-300"
                                    >
                                        Envoyer un Nouveau Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm text-richEbony mb-2 font-medium">
                                                Nom Complet <span className="text-brandGold">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white hover:border-brandGold/30"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        
                                        {/* Email Field */}
                    <div>
                                            <label htmlFor="email" className="block text-sm text-richEbony mb-2 font-medium">
                                                Email <span className="text-brandGold">*</span>
                                            </label>
                        <input
                                                id="email"
                                                name="email"
                            type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white hover:border-brandGold/30"
                                                placeholder="Votre email"
                                            />
                                        </div>
                                        
                                        {/* Phone Field */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm text-richEbony mb-2 font-medium">
                                                Téléphone
                                            </label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white hover:border-brandGold/30"
                                                placeholder="Votre numéro de téléphone"
                        />
                    </div>
                                        
                                        {/* Subject Field */}
                                        <div>
                                            <label htmlFor="subject" className="block text-sm text-richEbony mb-2 font-medium">
                                                Sujet <span className="text-brandGold">*</span>
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white hover:border-brandGold/30 appearance-none"
                                            >
                                                <option value="" disabled>Sélectionnez un sujet</option>
                                                <option value="information">Demande d'information</option>
                                                <option value="appointment">Rendez-vous</option>
                                                <option value="custom">Création sur-mesure</option>
                                                <option value="press">Presse et média</option>
                                                <option value="other">Autre</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {/* Message Field */}
                    <div>
                                        <label htmlFor="message" className="block text-sm text-richEbony mb-2 font-medium">
                                            Message <span className="text-brandGold">*</span>
                                        </label>
                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-brandGold/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm bg-white hover:border-brandGold/30 h-40"
                                            placeholder="Détaillez votre demande ici..."
                        ></textarea>
                                    </div>
                                    
                                    {/* Privacy Policy */}
                                    <div className="flex items-start mt-4">
                                        <input
                                            type="checkbox"
                                            id="privacy"
                                            className="mt-1 h-4 w-4 text-brandGold border-brandGold/30 rounded focus:ring-brandGold/50"
                                            required
                                        />
                                        <label htmlFor="privacy" className="ml-2 text-sm text-platinumGray">
                                            J'accepte que mes données soient traitées conformément à la <a href="/privacy-policy" className="text-brandGold hover:underline">politique de confidentialité</a> de Diamant Rouge.
                                        </label>
                                    </div>
                                    
                                    {/* Submit Button */}
                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-8 py-3.5 bg-richEbony text-white hover:bg-brandGold transition-colors duration-300 font-medium tracking-wide shadow-subtle hover:shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} group relative overflow-hidden`}
                                        >
                                            <span className="relative z-10">
                                                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                                            </span>
                                            <span className="absolute inset-0 bg-brandGold transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Privacy Notice */}
                <div className="mt-20 text-center max-w-3xl mx-auto">
                    <h3 className="text-2xl font-serif text-brandGold mb-6">Votre Confidentialité Nous Importe</h3>
                    <p className="text-platinumGray text-sm leading-relaxed mb-6">
                        Toutes les données personnelles que vous partagez avec nous sont traitées avec le plus grand soin et conformément 
                        aux règlementations en vigueur. Nous les utilisons uniquement pour répondre à vos demandes et améliorer nos services.
                        Pour en savoir plus, consultez notre <a href="/privacy-policy" className="text-brandGold hover:underline">politique de confidentialité</a>.
                    </p>
                </div>
            </main>
        </>
    );
}
