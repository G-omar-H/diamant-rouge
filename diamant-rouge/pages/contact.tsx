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
    
    // Form validation states
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes with validation
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };
    
    // Validate form field
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case "name":
                return value.trim().length < 2 ? "Veuillez entrer votre nom" : "";
            case "email":
                return !/^\S+@\S+\.\S+$/.test(value) ? "Veuillez entrer une adresse email valide" : "";
            case "phone":
                return value.trim() && !/^[\d\s\+\-\.\(\)]{9,}$/.test(value) ? "Veuillez entrer un numéro de téléphone valide" : "";
            case "message":
                return value.trim().length < 10 ? "Votre message doit contenir au moins 10 caractères" : "";
            default:
                return "";
        }
    };

    // Handle form submission with validation
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validate all fields
        const errors = {
            name: validateField("name", formData.name),
            email: validateField("email", formData.email),
            phone: validateField("phone", formData.phone),
            message: validateField("message", formData.message)
        };
        
        // Check if there are any errors
        const hasErrors = Object.values(errors).some(error => error !== "");
        
        if (hasErrors) {
            setFieldErrors(errors);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In production, this would call your API endpoint
            console.log("Form data submitted:", formData);
            
            setFormSubmitted(true);
            
            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Contact | Diamant Rouge</title>
                <meta name="description" content="Contactez Diamant Rouge pour des demandes sur-mesure, des informations sur nos collections ou pour prendre rendez-vous dans notre atelier au Maroc." />
            </Head>
            
            {/* Elegant Header Section */}
            <section className="bg-brandIvory pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-richEbony mb-6">Contactez-Nous</h1>
                    <div className="relative flex justify-center mb-6">
                        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Diamond size={8} className="text-brandGold fill-brandGold" />
                        </div>
                    </div>
                    <p className="text-lg md:text-xl text-platinumGray max-w-2xl mx-auto">Pour toutes vos questions et demandes personnalisées</p>
                </div>
            </section>
            
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-16 md:py-24 bg-white">
                {/* Intro */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
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
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                    {/* Contact Information */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="bg-gradient-to-b from-brandIvory/80 to-brandIvory/30 p-8 border border-brandGold/10 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                            <h3 className="heading-section">Nos Coordonnées</h3>
                            
                            <div className="space-y-8">
                                {/* Address */}
                                <div className="flex">
                                    <div className="mr-4">
                                        <div className="w-10 h-10 rounded-full bg-brandGold/10 flex items-center justify-center">
                                            <MapPin size={18} className="text-brandGold" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="heading-bullet">Notre Atelier</h4>
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
                                        <h4 className="heading-bullet">Téléphone</h4>
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
                                        <h4 className="heading-bullet">Email</h4>
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
                                        <h4 className="heading-bullet">Heures d'Ouverture</h4>
                                        <p className="text-platinumGray">Lundi - Vendredi: 10h - 19h</p>
                                        <p className="text-platinumGray">Samedi: 10h - 18h (Sur rendez-vous)</p>
                                        <p className="text-platinumGray">Dimanche: Fermé</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Google Maps Integration */}
                            <div className="mt-10 relative h-64 overflow-hidden rounded-sm border border-brandGold/10 shadow-md">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.583468317675!2d-7.625344423703507!3d33.59403414066145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d282e8f00001%3A0x66a75c2d2df21a8a!2sAv.%20Hassan%20II%2C%20Casablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1716982536772!5m2!1sen!2sus" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Emplacement de Diamant Rouge à Casablanca"
                                    className="filter grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                                <div className="absolute right-3 bottom-3">
                                    <a 
                                        href="https://maps.app.goo.gl/CMjfaFxcFpix9VL7A" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white text-richEbony text-sm hover:bg-brandGold hover:text-white transition-colors duration-300 shadow-sm border border-brandGold/10 flex items-center"
                                    >
                                        <MapPin size={14} className="mr-1" />
                                        Itinéraire
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Form */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div className="bg-white p-8 border border-brandGold/10 rounded-sm shadow-subtle hover:shadow-luxury transition-shadow duration-500">
                            <h3 className="heading-section">Envoyez-Nous un Message</h3>
                            
                            {formSubmitted ? (
                                <div className="text-center py-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brandGold/10 mb-6">
                                        <CheckCircle size={32} className="text-brandGold" />
                                    </div>
                                    <h4 className="heading-feature">Message Envoyé avec Succès</h4>
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
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-platinumGray mb-2">Nom Complet*</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onBlur={(e) => setFieldErrors(prev => ({ ...prev, name: validateField("name", e.target.value) }))}
                                                    className={`w-full px-4 py-3 border ${fieldErrors.name ? 'border-red-400' : 'border-brandGold/20'} rounded-sm focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all outline-none text-richEbony/90`}
                                                    required
                                                    disabled={isSubmitting}
                                                    placeholder="Votre nom complet"
                                                />
                                                {!fieldErrors.name && formData.name && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            {fieldErrors.name && (
                                                <p className="mt-1 text-red-500 text-xs">{fieldErrors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-platinumGray mb-2">Email*</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onBlur={(e) => setFieldErrors(prev => ({ ...prev, email: validateField("email", e.target.value) }))}
                                                    className={`w-full px-4 py-3 border ${fieldErrors.email ? 'border-red-400' : 'border-brandGold/20'} rounded-sm focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all outline-none text-richEbony/90`}
                                                    required
                                                    disabled={isSubmitting}
                                                    placeholder="votre@email.com"
                                                />
                                                {!fieldErrors.email && formData.email && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            {fieldErrors.email && (
                                                <p className="mt-1 text-red-500 text-xs">{fieldErrors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-platinumGray mb-2">Téléphone</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    onBlur={(e) => setFieldErrors(prev => ({ ...prev, phone: validateField("phone", e.target.value) }))}
                                                    className={`w-full px-4 py-3 border ${fieldErrors.phone ? 'border-red-400' : 'border-brandGold/20'} rounded-sm focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all outline-none text-richEbony/90`}
                                                    disabled={isSubmitting}
                                                    placeholder="+212 XX XXXXXXX"
                                                />
                                                {!fieldErrors.phone && formData.phone && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            {fieldErrors.phone && (
                                                <p className="mt-1 text-red-500 text-xs">{fieldErrors.phone}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-platinumGray mb-2">Sujet</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-brandGold/20 rounded-sm focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all outline-none text-richEbony/90 bg-white appearance-none"
                                                disabled={isSubmitting}
                                                style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23A8996E\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1.5em 1.5em" }}
                                            >
                                                <option value="">Sélectionnez un sujet</option>
                                                <option value="information">Demande d'information</option>
                                                <option value="appointment">Prise de rendez-vous</option>
                                                <option value="custom">Projet sur-mesure</option>
                                                <option value="other">Autre</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-platinumGray mb-2">Message*</label>
                                        <div className="relative">
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                onBlur={(e) => setFieldErrors(prev => ({ ...prev, message: validateField("message", e.target.value) }))}
                                                rows={5}
                                                className={`w-full px-4 py-3 border ${fieldErrors.message ? 'border-red-400' : 'border-brandGold/20'} rounded-sm focus:ring-1 focus:ring-brandGold focus:border-brandGold transition-all outline-none text-richEbony/90 resize-none`}
                                                required
                                                disabled={isSubmitting}
                                                placeholder="Comment pouvons-nous vous aider?"
                                            ></textarea>
                                            {!fieldErrors.message && formData.message && formData.message.length >= 10 && (
                                                <div className="absolute right-3 top-3 text-green-500">
                                                    <CheckCircle size={16} />
                                                </div>
                                            )}
                                        </div>
                                        {fieldErrors.message && (
                                            <p className="mt-1 text-red-500 text-xs">{fieldErrors.message}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-start my-4">
                                        <input
                                            type="checkbox"
                                            id="privacy"
                                            required
                                            className="mt-1 h-4 w-4 text-brandGold border-brandGold/30 rounded focus:ring-brandGold/50"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor="privacy" className="ml-2 text-sm text-platinumGray">
                                            J'accepte que mes données soient traitées conformément à la <a href="/privacy-policy" className="text-brandGold hover:underline">politique de confidentialité</a> de Diamant Rouge*
                                        </label>
                                    </div>
                                    
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-brandGold to-brandGold/90 text-white font-medium rounded-sm hover:from-brandGold/90 hover:to-brandGold transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Envoi en cours...
                                                </>
                                            ) : "Envoyer le Message"}
                                        </button>
                                    </div>
                                    
                                    <div className="text-xs text-platinumGray/80 mt-6">
                                        <p>* Champs obligatoires</p>
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
