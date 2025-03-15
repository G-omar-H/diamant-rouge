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
    <footer className="bg-richEbony text-platinumGray pt-16 mt-auto">
      {/* Decorative top border - mirrors header style */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-[1px] w-60 bg-gradient-to-r from-transparent via-brandGold to-transparent my-1.5"></div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Diamond size={7} className="text-brandGold fill-brandGold" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Newsletter Section - Integrated with premium styling */}
        <div className="mb-16 max-w-3xl mx-auto text-center">
          <h4 className="text-2xl md:text-3xl font-serif text-brandGold mb-4">
            Le Cercle Diamant Rouge
          </h4>
          <p className="text-brandIvory/80 max-w-xl mx-auto mb-6">
            Recevez en exclusivité nos invitations privées et découvrez nos créations en avant-première.
          </p>
          <form className="max-w-md mx-auto flex" onSubmit={handleNewsletterSubmit}>
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                className="w-full bg-richEbony border border-brandGold/30 text-brandIvory px-4 py-3 rounded-l-md focus:outline-none focus:border-brandGold transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-brandGold text-richEbony px-6 py-3 rounded-r-md hover:bg-brandGold/90 transition duration-300 flex items-center justify-center group"
            >
              <span className="mr-2">S'inscrire</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
          {message && (
            <p className={`mt-4 text-sm ${message.includes("error") ? "text-burgundy" : "text-brandGold"}`}>
              {message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/1/diamant-rouge-logo.svg" 
                alt="Diamant Rouge - Joaillerie de Luxe"
                width={180}
                height={45}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-brandIvory/70">
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
                <span className="text-brandIvory/80 text-sm">
                  32 Avenue Hassan II, Casablanca, Maroc
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-brandGold mr-3 flex-shrink-0" />
                <a href="tel:+212555000111" className="text-brandIvory/80 text-sm hover:text-brandGold transition-colors">
                  +212 555 000 111
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-brandGold mr-3 flex-shrink-0" />
                <a href="mailto:contact@diamantrouge.com" className="text-brandIvory/80 text-sm hover:text-brandGold transition-colors">
                  contact@diamantrouge.com
                </a>
              </li>
              <li className="text-brandIvory/80 text-sm mt-4">
                <span className="block mb-1 text-brandGold">Horaires d'ouverture:</span>
                Lundi - Samedi: 9h - 19h<br />
                Dimanche: Fermé
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-brandGold/20 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-6 md:mb-0 font-serif text-sm tracking-wide text-brandIvory/60">
            © {new Date().getFullYear()} Diamant Rouge Joaillerie. Tous droits réservés.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <Link href="/terms" className="text-brandIvory/60 hover:text-brandGold transition-colors">
              Conditions Générales
            </Link>
            <Link href="/privacy" className="text-brandIvory/60 hover:text-brandGold transition-colors">
              Politique de Confidentialité
            </Link>
            <Link href="/mentions-legales" className="text-brandIvory/60 hover:text-brandGold transition-colors">
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
        className="text-brandIvory/70 hover:text-brandGold transition-colors duration-300 group flex items-center"
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
      className="text-brandIvory/60 hover:text-brandGold hover:scale-110 transition-all duration-300"
      aria-label={label}
    >
      {icon}
    </a>
  );
}