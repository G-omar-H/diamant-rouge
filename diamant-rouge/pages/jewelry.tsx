import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Diamond, ArrowRight } from "lucide-react";

export default function HauteJoailleriePage() {
  return (
    <>
      <Head>
        <title>Haute Joaillerie | Diamant Rouge</title>
        <meta name="description" content="Découvrez notre collection exclusive de Haute Joaillerie marocaine - Des créations uniques qui allient excellence artisanale et design contemporain." />
      </Head>
      
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
        <Image 
          src="/images/home/largeherod_l2_hj_ra_4_prod.webp" 
          alt="Haute Joaillerie Diamant Rouge" 
          fill
          sizes="100vw"
          priority
          className="brightness-[0.85] object-cover object-center sm:object-center md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-2 sm:mb-4">Haute Joaillerie</h1>
          <div className="h-[1px] w-28 sm:w-32 md:w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent my-3 sm:my-4"></div>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl">L'art d'excellence selon la tradition marocaine</p>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-serif text-brandGold mb-6">L'Excellence Joaillière Marocaine</h2>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Diamond size={8} className="text-brandGold fill-brandGold" />
              </div>
            </div>
          </div>
          <p className="text-platinumGray leading-relaxed mb-6">
            Notre collection Haute Joaillerie incarne le sommet de notre savoir-faire marocain, où chaque pièce est une œuvre d'art unique. 
            Créées dans nos ateliers de Casablanca par nos maîtres joailliers, ces créations exceptionnelles allient l'excellence artisanale 
            à l'innovation créative.
          </p>
          <p className="text-platinumGray leading-relaxed">
            Des pierres précieuses soigneusement sélectionnées aux motifs inspirés du riche patrimoine marocain, chaque bijou raconte une histoire 
            d'élégance intemporelle et d'exclusivité.
          </p>
        </div>
        
        {/* Featured Collections */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold text-center mb-12">Collections Signature</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Collection 1 */}
            <div className="group">
              <div className="relative h-80 overflow-hidden mb-4">
                <Image 
                  src="/images/Collections/Royale/royale.jpg" 
                  alt="Collection Royale" 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-700 group-hover:scale-105 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="inline-block bg-brandGold/90 text-white px-4 py-2 text-sm tracking-wider">DÉCOUVRIR</span>
                </div>
              </div>
              <h4 className="text-xl font-serif text-richEbony text-center mb-1">Collection Royale</h4>
              <p className="text-sm text-platinumGray text-center">Inspirée par l'héritage royal du Maroc</p>
            </div>
            
            {/* Collection 2 */}
            <div className="group">
              <div className="relative h-80 overflow-hidden mb-4">
                <Image 
                  src="/images/Collections/Sahara/Multi-COLOUR-JEWELLERY-BANNER_7.jpg" 
                  alt="Collection Sahara" 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-700 group-hover:scale-105 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="inline-block bg-brandGold/90 text-white px-4 py-2 text-sm tracking-wider">DÉCOUVRIR</span>
                </div>
              </div>
              <h4 className="text-xl font-serif text-richEbony text-center mb-1">Collection Sahara</h4>
              <p className="text-sm text-platinumGray text-center">Les motifs du désert marocain</p>
            </div>
            
            {/* Collection 3 */}
            <div className="group">
              <div className="relative h-80 overflow-hidden mb-4">
                <Image 
                  src="/images/Collections/Fes/fes.jpg" 
                  alt="Collection Fès" 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-700 group-hover:scale-105 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="inline-block bg-brandGold/90 text-white px-4 py-2 text-sm tracking-wider">DÉCOUVRIR</span>
                </div>
              </div>
              <h4 className="text-xl font-serif text-richEbony text-center mb-1">Collection Fès</h4>
              <p className="text-sm text-platinumGray text-center">L'artisanat raffiné de la ville impériale</p>
            </div>
          </div>
        </div>
        
        {/* Savoir-Faire Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-brandGold mb-6">Notre Savoir-Faire d'Exception</h3>
            <div className="h-[1px] w-32 bg-gradient-to-r from-brandGold via-brandGold to-transparent mb-6"></div>
            <p className="text-platinumGray leading-relaxed mb-4">
              Chaque création Diamant Rouge est le fruit d'un processus minutieux où l'excellence artisanale marocaine 
              rencontre l'innovation créative. De l'esquisse initiale à la pièce finale, nos maîtres joailliers 
              perpétuent un héritage séculaire de techniques traditionnelles transmises de génération en génération.
            </p>
            <p className="text-platinumGray leading-relaxed mb-6">
              La sélection des pierres précieuses est réalisée avec la plus grande rigueur, garantissant 
              des gemmes d'une qualité exceptionnelle. Chaque monture est façonnée à la main selon des techniques 
              ancestrales marocaines, assurant la perfection de chaque détail et le confort optimal du bijou.
            </p>
            <Link 
              href="/appointments"
              className="inline-block px-8 py-3 border border-brandGold text-brandGold hover:bg-brandGold hover:text-white transition-colors duration-300 tracking-wider"
            >
              RÉSERVER UNE PRÉSENTATION PRIVÉE
            </Link>
          </div>
          <div className="relative h-[500px]">
            <Image 
              src="/images/home/ate_bdf_art_cou_300_dem_bla_22.jpg" 
              alt="Savoir-faire exceptionnel Diamant Rouge" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-sm object-cover"
            />
          </div>
        </div>
        
        {/* Materials Section */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold text-center mb-12">Gemmes et Matériaux Précieux</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Material 1 */}
            <div className="bg-gradient-to-b from-richEbony/5 to-transparent p-8 rounded-sm group hover:bg-gradient-to-b hover:from-brandGold/10 transition-all duration-500">
              <div className="mb-6 relative">
                <div className="w-16 h-16 flex items-center justify-center border border-brandGold rounded-sm group-hover:bg-brandGold/5 transition-all duration-500">
                  <Diamond size={30} className="text-brandGold" />
                </div>
                <div className="absolute w-8 h-8 -top-2 -right-2 border-t-2 border-r-2 border-brandGold/40"></div>
                <div className="absolute w-8 h-8 -bottom-2 -left-2 border-b-2 border-l-2 border-brandGold/40"></div>
              </div>
              <h4 className="text-xl font-serif text-brandGold mb-3">Diamants d'Exception</h4>
              <p className="text-platinumGray mb-4">
                Nous sélectionnons uniquement les diamants les plus rares et les plus purs, certifiés selon les normes les plus strictes.
                Chaque pierre est choisie pour son éclat, sa pureté et sa taille parfaite.
              </p>
            </div>
            
            {/* Material 2 */}
            <div className="bg-gradient-to-b from-richEbony/5 to-transparent p-8 rounded-sm group hover:bg-gradient-to-b hover:from-brandGold/10 transition-all duration-500">
              <div className="mb-6 relative">
                <div className="w-16 h-16 flex items-center justify-center border border-brandGold rounded-sm group-hover:bg-brandGold/5 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m7 8 2.1-2.8a3 3 0 0 1 4.8 0L16 8"></path>
                    <path d="M5 14h14"></path>
                    <path d="m7 16 4 4"></path>
                    <path d="m13 16 4 4"></path>
                  </svg>
                </div>
                <div className="absolute w-8 h-8 -top-2 -right-2 border-t-2 border-r-2 border-brandGold/40"></div>
                <div className="absolute w-8 h-8 -bottom-2 -left-2 border-b-2 border-l-2 border-brandGold/40"></div>
              </div>
              <h4 className="text-xl font-serif text-brandGold mb-3">Pierres Précieuses Rares</h4>
              <p className="text-platinumGray mb-4">
                Rubis, saphirs et émeraudes sont soigneusement sourcés auprès de fournisseurs responsables.
                Chaque gemme est choisie pour sa couleur profonde, sa clarté et sa brillance exceptionnelle.
              </p>
            </div>
            
            {/* Material 3 */}
            <div className="bg-gradient-to-b from-richEbony/5 to-transparent p-8 rounded-sm group hover:bg-gradient-to-b hover:from-brandGold/10 transition-all duration-500">
              <div className="mb-6 relative">
                <div className="w-16 h-16 flex items-center justify-center border border-brandGold rounded-sm group-hover:bg-brandGold/5 transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold">
                    <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"></path>
                    <path d="M4 11h16v-1a2 2 0 0 0-2-2H6"></path>
                  </svg>
                </div>
                <div className="absolute w-8 h-8 -top-2 -right-2 border-t-2 border-r-2 border-brandGold/40"></div>
                <div className="absolute w-8 h-8 -bottom-2 -left-2 border-b-2 border-l-2 border-brandGold/40"></div>
              </div>
              <h4 className="text-xl font-serif text-brandGold mb-3">Or 18 Carats</h4>
              <p className="text-platinumGray mb-4">
                Nous travaillons exclusivement avec l'or 18 carats dans ses nuances les plus riches - jaune, blanc et rose.
                Notre or est façonné selon les techniques traditionnelles marocaines pour obtenir un éclat incomparable.
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-richEbony/5 via-brandGold/10 to-richEbony/5 py-16 px-4 rounded-sm">
          <h3 className="text-2xl md:text-3xl font-serif text-brandGold mb-6">Découvrez Notre Collection</h3>
          <p className="text-platinumGray max-w-2xl mx-auto mb-8">
            Nous vous invitons à découvrir nos créations d'exception dans notre boutique de Casablanca ou lors d'un rendez-vous privé.
            Nos experts joailliers seront ravis de vous guider dans votre découverte de l'univers Diamant Rouge.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/appointments"
              className="px-8 py-3 bg-brandGold text-white hover:bg-brandGold/90 transition-colors duration-300 tracking-wider"
            >
              PRENDRE RENDEZ-VOUS
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-3 border border-brandGold text-brandGold hover:bg-brandGold/10 transition-colors duration-300 tracking-wider"
            >
              NOUS CONTACTER
            </Link>
          </div>
        </div>
      </main>
    </>
  );
} 