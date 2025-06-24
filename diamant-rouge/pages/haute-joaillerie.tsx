import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Diamond } from "lucide-react";

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
          src="/images/haute-joaillerie-hero.jpg" 
          alt="Diamant Rouge Haute Joaillerie" 
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
          className="brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-2 sm:mb-4">Haute Joaillerie</h1>
          <div className="h-[1px] w-28 sm:w-32 md:w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent my-3 sm:my-4"></div>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl">L'art de la joaillerie marocaine d'exception</p>
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
                  src="/images/haute-joaillerie-collection1.jpg" 
                  alt="Collection Atlas" 
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="inline-block bg-brandGold/90 text-white px-4 py-2 text-sm tracking-wider">DÉCOUVRIR</span>
                </div>
              </div>
              <h4 className="text-xl font-serif text-richEbony text-center mb-1">Collection Atlas</h4>
              <p className="text-sm text-platinumGray text-center">Inspirée par les montagnes majestueuses du Maroc</p>
            </div>
            
            {/* Collection 2 */}
            <div className="group">
              <div className="relative h-80 overflow-hidden mb-4">
                <Image 
                  src="/images/haute-joaillerie-collection2.jpg" 
                  alt="Collection Zellige" 
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="inline-block bg-brandGold/90 text-white px-4 py-2 text-sm tracking-wider">DÉCOUVRIR</span>
                </div>
              </div>
              <h4 className="text-xl font-serif text-richEbony text-center mb-1">Collection Zellige</h4>
              <p className="text-sm text-platinumGray text-center">L'art géométrique ancestral réinventé</p>
            </div>
            
            {/* Collection 3 */}
            <div className="group">
              <div className="relative h-80 overflow-hidden mb-4">
                <Image 
                  src="/images/haute-joaillerie-collection3.jpg" 
                  alt="Collection Medina" 
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="inline-block bg-brandGold/90 text-white px-4 py-2 text-sm tracking-wider">DÉCOUVRIR</span>
                </div>
              </div>
              <h4 className="text-xl font-serif text-richEbony text-center mb-1">Collection Medina</h4>
              <p className="text-sm text-platinumGray text-center">L'âme des villes anciennes du Maroc</p>
            </div>
          </div>
        </div>
        
        {/* Savoir-Faire Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-brandGold mb-6">Notre Savoir-Faire</h3>
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
              PRENDRE RENDEZ-VOUS
            </Link>
          </div>
          <div className="relative h-[500px]">
            <Image 
              src="/images/haute-joaillerie-craftsmanship.jpg" 
              alt="Savoir-faire Diamant Rouge" 
              layout="fill"
              objectFit="cover"
              className="rounded-sm"
            />
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