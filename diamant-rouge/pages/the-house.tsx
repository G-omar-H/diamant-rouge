import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Diamond } from "lucide-react";

export default function LaMaisonPage() {
  return (
    <>
      <Head>
        <title>La Maison | Diamant Rouge</title>
        <meta name="description" content="Découvrez l'histoire et les valeurs de la Maison Diamant Rouge - Un héritage joaillier marocain d'excellence et d'innovation." />
      </Head>
      
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image 
          src="/images/la-maison-hero.jpg" 
          alt="La Maison Diamant Rouge" 
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">La Maison</h1>
          <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent my-4"></div>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">Notre héritage d'excellence marocaine</p>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-brandGold mb-6">Notre Histoire</h2>
            <div className="h-[1px] w-32 bg-gradient-to-r from-brandGold via-brandGold to-transparent mb-6"></div>
            <p className="text-platinumGray leading-relaxed mb-4">
              Fondée à Casablanca en 1978, la Maison Diamant Rouge est née de la passion de Youssef El Mansouri, 
              un visionnaire dans l'art de la joaillerie marocaine. Son rêve : créer des pièces d'exception qui 
              transcendent le temps, alliant savoir-faire artisanal marocain et design contemporain.
            </p>
            <p className="text-platinumGray leading-relaxed mb-4">
              Au fil des décennies, notre Maison a développé une signature unique, reconnaissable par son 
              approche audacieuse des formes et son attention méticuleuse aux détails. Des ateliers casablancais 
              aux vitrines internationales, Diamant Rouge est devenu synonyme d'excellence joaillière marocaine.
            </p>
            <p className="text-platinumGray leading-relaxed">
              Aujourd'hui, sous la direction artistique de Leila El Mansouri, fille du fondateur, Diamant Rouge 
              continue d'innover tout en préservant l'héritage artisanal qui a fait sa renommée.
            </p>
          </div>
          <div className="relative h-[500px] order-1 md:order-2">
            <Image 
              src="/images/la-maison-history.jpg" 
              alt="Histoire de Diamant Rouge" 
              layout="fill"
              objectFit="cover"
              className="rounded-sm"
            />
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold text-center mb-12">Notre Parcours</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-brandGold/30 via-brandGold to-brandGold/30"></div>
            
            {/* Timeline Events */}
            <div className="space-y-16 relative">
              {/* 1978 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h4 className="text-xl font-serif text-brandGold mb-2">1978</h4>
                  <h5 className="text-lg font-medium text-richEbony mb-2">Création de la Maison</h5>
                  <p className="text-platinumGray">Fondation de Diamant Rouge par Youssef El Mansouri dans le quartier historique des artisans à Casablanca.</p>
                </div>
                <div className="flex items-center justify-center my-4 md:my-0">
                  <div className="w-4 h-4 rounded-full bg-brandGold z-10"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:block hidden"></div>
              </div>
              
              {/* 1985 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right md:block hidden"></div>
                <div className="flex items-center justify-center my-4 md:my-0">
                  <div className="w-4 h-4 rounded-full bg-brandGold z-10"></div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h4 className="text-xl font-serif text-brandGold mb-2">1985</h4>
                  <h5 className="text-lg font-medium text-richEbony mb-2">Première collection iconique</h5>
                  <p className="text-platinumGray">Lancement de la collection "Étoile du Maghreb" qui établit la signature unique de la Maison.</p>
                </div>
              </div>
              
              {/* 1997 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h4 className="text-xl font-serif text-brandGold mb-2">1997</h4>
                  <h5 className="text-lg font-medium text-richEbony mb-2">Expansion internationale</h5>
                  <p className="text-platinumGray">Ouverture de la première boutique internationale à Paris, marquant le début d'une présence mondiale.</p>
                </div>
                <div className="flex items-center justify-center my-4 md:my-0">
                  <div className="w-4 h-4 rounded-full bg-brandGold z-10"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:block hidden"></div>
              </div>
              
              {/* 2010 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right md:block hidden"></div>
                <div className="flex items-center justify-center my-4 md:my-0">
                  <div className="w-4 h-4 rounded-full bg-brandGold z-10"></div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h4 className="text-xl font-serif text-brandGold mb-2">2010</h4>
                  <h5 className="text-lg font-medium text-richEbony mb-2">Nouvelle direction artistique</h5>
                  <p className="text-platinumGray">Leila El Mansouri prend la direction artistique, apportant une vision contemporaine tout en préservant l'héritage de la Maison.</p>
                </div>
              </div>
              
              {/* 2023 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h4 className="text-xl font-serif text-brandGold mb-2">2023</h4>
                  <h5 className="text-lg font-medium text-richEbony mb-2">Innovation numérique</h5>
                  <p className="text-platinumGray">Lancement de l'expérience numérique complète de Diamant Rouge, offrant une nouvelle façon de découvrir nos créations.</p>
                </div>
                <div className="flex items-center justify-center my-4 md:my-0">
                  <div className="w-4 h-4 rounded-full bg-brandGold z-10"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:block hidden"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold text-center mb-6">Nos Valeurs</h3>
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Diamond size={8} className="text-brandGold fill-brandGold" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Excellence */}
            <div className="text-center p-6 bg-gradient-to-b from-brandGold/5 to-transparent rounded-sm">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border border-brandGold/30">
                  <Diamond size={24} className="text-brandGold" />
                </div>
              </div>
              <h4 className="text-xl font-serif text-brandGold mb-3">Excellence</h4>
              <p className="text-platinumGray">
                La recherche constante de la perfection dans chaque détail, de la conception à la finition, fidèle à la tradition artisanale marocaine.
              </p>
            </div>
            
            {/* Créativité */}
            <div className="text-center p-6 bg-gradient-to-b from-brandGold/5 to-transparent rounded-sm">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border border-brandGold/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold">
                    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"></path>
                    <path d="M8.5 2h7"></path>
                    <path d="M14.5 16h-5"></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-xl font-serif text-brandGold mb-3">Créativité</h4>
              <p className="text-platinumGray">
                L'audace artistique qui nous pousse à allier les motifs traditionnels marocains avec des designs contemporains.
              </p>
            </div>
            
            {/* Héritage */}
            <div className="text-center p-6 bg-gradient-to-b from-brandGold/5 to-transparent rounded-sm">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border border-brandGold/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </div>
              <h4 className="text-xl font-serif text-brandGold mb-3">Héritage</h4>
              <p className="text-platinumGray">
                Notre engagement à préserver et célébrer les techniques ancestrales de la joaillerie marocaine dans chaque création.
              </p>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold text-center mb-12">Notre Équipe</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="relative h-72 overflow-hidden mb-4 rounded-sm">
                <Image 
                  src="/images/team-marie-laurent.jpg" 
                  alt="Leila El Mansouri" 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h4 className="text-xl font-serif text-richEbony mb-1">Leila El Mansouri</h4>
              <p className="text-sm text-brandGold mb-3">Directrice Artistique</p>
              <p className="text-platinumGray text-sm">
                Visionnaire créative qui dirige l'identité artistique de Diamant Rouge depuis 2010.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="relative h-72 overflow-hidden mb-4 rounded-sm">
                <Image 
                  src="/images/team-philippe-dubois.jpg" 
                  alt="Karim Tazi" 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h4 className="text-xl font-serif text-richEbony mb-1">Karim Tazi</h4>
              <p className="text-sm text-brandGold mb-3">Maître Joaillier</p>
              <p className="text-platinumGray text-sm">
                Expert dans les techniques traditionnelles marocaines, avec plus de 30 ans d'expérience dans la joaillerie de luxe.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="relative h-72 overflow-hidden mb-4 rounded-sm">
                <Image 
                  src="/images/team-sophie-mercier.jpg" 
                  alt="Nadia Bensouda" 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h4 className="text-xl font-serif text-richEbony mb-1">Nadia Bensouda</h4>
              <p className="text-sm text-brandGold mb-3">Directrice des Collections</p>
              <p className="text-platinumGray text-sm">
                Responsable du développement des nouvelles collections, fusionnant tradition marocaine et tendances contemporaines.
              </p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold text-center mb-12">Ce qu'ils Disent de Nous</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 bg-gradient-to-br from-brandGold/10 to-transparent rounded-sm relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold/20 absolute top-4 left-4">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
              </svg>
              <div className="relative z-10">
                <p className="text-platinumGray italic mb-6">
                  "Diamant Rouge représente parfaitement l'élégance et le savoir-faire marocain. Leurs créations allient avec brio la richesse de notre patrimoine et les tendances contemporaines."
                </p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image 
                      src="/images/testimonial-1.jpg" 
                      alt="Sofia Bennani" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-richEbony">Sofia Bennani</h5>
                    <p className="text-sm text-platinumGray">Magazine Luxury Maroc</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="p-8 bg-gradient-to-br from-brandGold/10 to-transparent rounded-sm relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold/20 absolute top-4 left-4">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
              </svg>
              <div className="relative z-10">
                <p className="text-platinumGray italic mb-6">
                  "Chaque bijou de Diamant Rouge raconte une histoire, celle d'un Maroc riche en traditions et résolument tourné vers l'avenir. Une marque qui fait honneur à notre artisanat."
                </p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image 
                      src="/images/testimonial-2.jpg" 
                      alt="Omar Alaoui" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-richEbony">Omar Alaoui</h5>
                    <p className="text-sm text-platinumGray">Critique de Mode</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-richEbony/5 via-brandGold/10 to-richEbony/5 py-16 px-4 rounded-sm">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold mb-6">Découvrez Notre Héritage</h3>
          <p className="text-platinumGray max-w-2xl mx-auto mb-8">
            Nous vous invitons à découvrir l'univers Diamant Rouge, où tradition marocaine et excellence contemporaine se rencontrent pour créer des pièces d'exception.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/haute-joaillerie"
              className="px-8 py-3 bg-brandGold text-white hover:bg-brandGold/90 transition-colors duration-300 tracking-wider"
            >
              DÉCOUVRIR NOS COLLECTIONS
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-3 border border-brandGold text-brandGold hover:bg-brandGold/10 transition-colors duration-300 tracking-wider"
            >
              PRENDRE RENDEZ-VOUS
            </Link>
          </div>
        </div>
      </main>
    </>
  );
} 