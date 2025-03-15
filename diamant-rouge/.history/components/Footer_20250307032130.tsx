import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Diamond, Instagram, Facebook, Twitter, Linkedin, ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage(data.message);
      setEmail("");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    
    <footer className="bg-brandIvory text-richEbony mt-auto">
      
      {/* Full-width Burgundy Newsletter Section */}
      
      <div className="w-full bg-burgundy py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative text-center">
            {/* Diamond accent */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <Diamond size={12} className="text-brandGold fill-brandGold" />
            </div>
            
            <div className="text-center">
              <h4 className="text-2xl md:text-4xl font-serif text-brandIvory mb-2">
                Rejoignez Le Cercle Rouge
              </h4>
              <div className="h-px w-56 mx-auto bg-brandGold/50 mb-6"></div>
              <p className="text-brandIvory/80 max-w-xl mx-auto mb-8 md:text-lg">
                Recevez en exclusivité nos invitations privées aux événements, nos nouvelles collections
                et l'inspiration de notre maison.
              </p>
              <form className="max-w-lg mx-auto" onSubmit={handleNewsletterSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      placeholder="Votre adresse e-mail"
                      className="w-full bg-burgundy/80 border border-brandGold/50 focus:border-brandGold text-brandIvory px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-brandGold transition-all duration-300 placeholder-brandIvory/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brandGold text-burgundy px-6 py-3 rounded-md hover:bg-brandIvory hover:text-burgundy transition duration-300 flex items-center justify-center group shadow-sm font-medium tracking-wide"
                  >
                    <span className="mr-2">S'inscrire</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
              {message && (
                <p className={`mt-4 text-sm ${message.includes("error") ? "text-brandIvory" : "text-brandGold"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative top border - mirrors header style */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-[1px] w-60 bg-gradient-to-r from-transparent via-brandGold to-transparent my-1.5 mt-16"></div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Diamond size={7} className="text-brandGold fill-brandGold" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/1/diamant-rouge-logo-full.svg" 
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={180}
                height={45}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-platinumGray text-sm leading-relaxed mb-6">
              Depuis 1967, Diamant Rouge façonne des pièces d'exception. Notre maison perpétue l'art de la haute joaillerie en alliant tradition et innovation.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} label="Instagram" />
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} label="Facebook" />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} label="LinkedIn" />
            </div>
          </div>

          {/* Collections */}
          <div className="col-span-1">
            <h5 className="font-serif text-brandGold mb-6 text-lg">Collections</h5>
            <ul className="space-y-3">
              <FooterLink href="/collections/bagues">Bagues</FooterLink>
              <FooterLink href="/collections/colliers">Colliers</FooterLink>
              <FooterLink href="/collections/bracelets">Bracelets</FooterLink>
              <FooterLink href="/collections/boucles">Boucles d'oreilles</FooterLink>
              <FooterLink href="/collections/signature">Collection Signature</FooterLink>
              <FooterLink href="/collections/bestsellers">Meilleures Ventes</FooterLink>
            </ul>
          </div>

          {/* Maison & Services */}
          <div className="col-span-1">
            <h5 className="font-serif text-brandGold mb-6 text-lg">La Maison</h5>
            <ul className="space-y-3">
              <FooterLink href="/the-house">Notre Histoire</FooterLink>
              <FooterLink href="/jewelry">Joaillerie</FooterLink>
              <FooterLink href="/appointments">Rendez-vous Privé</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/cart">Mon Panier</FooterLink>
              <FooterLink href="/wishlist">Mes Favoris</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h5 className="font-serif text-brandGold mb-6 text-lg">Contactez-nous</h5>
            <ul className="space-y-5">
              <li className="flex items-start">
                <MapPin size={18} className="text-brandGold mr-3 mt-1 flex-shrink-0" />
                <span className="text-platinumGray text-sm">
                  32 Avenue Hassan II, Casablanca, Maroc
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-brandGold mr-3 flex-shrink-0" />
                <a href="tel:+212555000111" className="text-platinumGray text-sm hover:text-brandGold transition-colors">
                  +212 555 000 111
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-brandGold mr-3 flex-shrink-0" />
                <a href="mailto:contact@diamantrouge.com" className="text-platinumGray text-sm hover:text-brandGold transition-colors">
                  contact@diamantrouge.com
                </a>
              </li>
              <li className="text-platinumGray text-sm mt-4">
                <span className="block mb-1 text-brandGold">Horaires d'ouverture:</span>
                Lundi - Samedi: 9h - 19h<br />
                Dimanche: Fermé
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-brandGold/20 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-6 md:mb-0 font-serif text-sm tracking-wide text-platinumGray">
            © {new Date().getFullYear()} Diamant Rouge Joaillerie. Tous droits réservés.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/terms" className="text-platinumGray hover:text-brandGold transition-colors">
              Conditions Générales
            </Link>
            <Link href="/privacy" className="text-platinumGray hover:text-brandGold transition-colors">
              Politique de Confidentialité
            </Link>
            <Link href="/mentions-legales" className="text-platinumGray hover:text-brandGold transition-colors">
              Mentions Légales
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative bottom accent - mirrors header style */}
      <div className="flex justify-center pb-4">
        <div className="relative">
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-brandGold/40 to-transparent my-1"></div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-richEbony/80 hover:text-brandGold transition-colors duration-300 group flex items-center"
      >
        <span className="w-0 h-[1px] bg-brandGold opacity-0 group-hover:w-2 group-hover:opacity-100 mr-0 group-hover:mr-2 transition-all duration-300"></span>
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-burgundy hover:text-brandGold hover:scale-110 transition-all duration-300"
      aria-label={label}
    >
      {icon}
    </a>
  );
}