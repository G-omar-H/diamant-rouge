import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Diamond } from "lucide-react";

export default function LaMaisonPage() {
  return (
    <>
      <Head>
        <title>La Maison | Diamant Rouge</title>
        <meta name="description" content="Découvrez l'histoire et les valeurs de la Maison Diamant Rouge - Un héritage joaillier marocain d'excellence fondé par la famille Miyara depuis 1957 à Fès." />
      </Head>
      
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image 
          src="/images/home/find-my-harry-winston.avif" 
          alt="La Maison Diamant Rouge" 
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-2 sm:mb-4">La Maison</h1>
          <div className="h-[1px] w-28 sm:w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent my-3 sm:my-4"></div>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl">Notre héritage d'excellence depuis 1957</p>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brandGold mb-4 sm:mb-6">Notre Histoire</h2>
            <div className="h-[1px] w-24 sm:w-32 bg-gradient-to-r from-brandGold via-brandGold to-transparent mb-4 sm:mb-6"></div>
            <p className="text-platinumGray leading-relaxed mb-4">
              Fondée à Fès en 1957, la Maison Diamant Rouge est née de la passion de Monsieur Miyara, 
              un maître joaillier visionnaire. Son ambition : perpétuer l'art séculaire de la joaillerie marocaine 
              en y apportant une touche de modernité, tout en préservant l'authenticité des techniques ancestrales.
            </p>
            <p className="text-platinumGray leading-relaxed mb-4">
              Au cœur de la médina de Fès, l'atelier familial s'est rapidement imposé comme une référence 
              pour les amateurs de haute joaillerie, attirés par le savoir-faire exceptionnel et la qualité 
              irréprochable des créations Miyara.
            </p>
            <p className="text-platinumGray leading-relaxed">
              Aujourd'hui, sous la direction artistique de Leila Miyara, fille du fondateur, Diamant Rouge 
              poursuit l'œuvre familiale avec passion et créativité, alliant héritage traditionnel et vision contemporaine 
              pour créer des pièces d'exception qui traversent les générations.
            </p>
          </div>
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] order-1 md:order-2 mb-6 md:mb-0">
            <Image 
              src="/images/home/5e4bfb93cc98e5e4bfb8b641fe_mohamed5.webp" 
              alt="Histoire de Diamant Rouge" 
              layout="fill"
              objectFit="cover"
              className="rounded-sm"
            />
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-brandGold text-center mb-8 sm:mb-12">Notre Parcours</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 h-full w-px bg-gradient-to-b from-brandGold/30 via-brandGold to-brandGold/30"></div>
            
            {/* Timeline Events */}
            <div className="space-y-10 sm:space-y-16 relative">
              {/* 1950 */}
              <div className="flex flex-row sm:flex-row items-start sm:items-center pl-10 sm:pl-0">
                <div className="hidden sm:block sm:w-1/2 sm:pr-12 sm:text-right">
                  <h4 className="heading-feature text-brandGold">1950</h4>
                  <h5 className="heading-bullet mb-2">Fondation</h5>
                  <p className="text-platinumGray">Fondation de la première bijouterie par Hassan Miyara à Fès, perpétuant une tradition familiale de joaillerie remontant à plusieurs générations.</p>
                </div>
                <div className="absolute left-0 sm:static sm:flex sm:items-center sm:justify-center sm:my-0">
                  <div className="w-8 h-8 sm:w-4 sm:h-4 rounded-full flex items-center justify-center bg-brandGold/20 sm:bg-brandGold z-10">
                    <div className="w-4 h-4 sm:hidden rounded-full bg-brandGold"></div>
                  </div>
                </div>
                <div className="sm:hidden mb-1">
                  <h4 className="heading-feature text-brandGold">1950</h4>
                  <h5 className="heading-bullet mb-2">Fondation</h5>
                  <p className="text-platinumGray">Fondation de la première bijouterie par Hassan Miyara à Fès, perpétuant une tradition familiale de joaillerie remontant à plusieurs générations.</p>
                </div>
                <div className="sm:w-1/2 sm:pl-12 sm:block hidden"></div>
              </div>
              
              {/* 1968 */}
              <div className="flex flex-row sm:flex-row items-start sm:items-center pl-10 sm:pl-0">
                <div className="sm:w-1/2 sm:pr-12 sm:text-right sm:block hidden"></div>
                <div className="absolute left-0 sm:static sm:flex sm:items-center sm:justify-center sm:my-0">
                  <div className="w-8 h-8 sm:w-4 sm:h-4 rounded-full flex items-center justify-center bg-brandGold/20 sm:bg-brandGold z-10">
                    <div className="w-4 h-4 sm:hidden rounded-full bg-brandGold"></div>
                  </div>
                </div>
                <div className="sm:w-1/2 sm:pl-12">
                  <h4 className="heading-feature text-brandGold">1968</h4>
                  <h5 className="heading-bullet mb-2">Première collection iconique</h5>
                  <p className="text-platinumGray">Création de la collection "Héritage de Fès", inspirée des motifs géométriques des zellige marocains, qui devient rapidement emblématique de la Maison.</p>
                </div>
              </div>
              
              {/* 1985 */}
              <div className="flex flex-row sm:flex-row items-start sm:items-center pl-10 sm:pl-0">
                <div className="hidden sm:block sm:w-1/2 sm:pr-12 sm:text-right">
                  <h4 className="heading-feature text-brandGold">1985</h4>
                  <h5 className="heading-bullet mb-2">Formation de Leila Miyara</h5>
                  <p className="text-platinumGray">Leila Miyara commence son apprentissage auprès de son père, s'imprégnant des techniques ancestrales tout en apportant un regard nouveau sur la joaillerie marocaine.</p>
                </div>
                <div className="absolute left-0 sm:static sm:flex sm:items-center sm:justify-center sm:my-0">
                  <div className="w-8 h-8 sm:w-4 sm:h-4 rounded-full flex items-center justify-center bg-brandGold/20 sm:bg-brandGold z-10">
                    <div className="w-4 h-4 sm:hidden rounded-full bg-brandGold"></div>
                  </div>
                </div>
                <div className="sm:hidden mb-1">
                  <h4 className="heading-feature text-brandGold">1985</h4>
                  <h5 className="heading-bullet mb-2">Formation de Leila Miyara</h5>
                  <p className="text-platinumGray">Leila Miyara commence son apprentissage auprès de son père, s'imprégnant des techniques ancestrales tout en apportant un regard nouveau sur la joaillerie marocaine.</p>
                </div>
                <div className="sm:w-1/2 sm:pl-12 sm:block hidden"></div>
              </div>
              
              {/* 2003 */}
              <div className="flex flex-row sm:flex-row items-start sm:items-center pl-10 sm:pl-0">
                <div className="sm:w-1/2 sm:pr-12 sm:text-right sm:block hidden"></div>
                <div className="absolute left-0 sm:static sm:flex sm:items-center sm:justify-center sm:my-0">
                  <div className="w-8 h-8 sm:w-4 sm:h-4 rounded-full flex items-center justify-center bg-brandGold/20 sm:bg-brandGold z-10">
                    <div className="w-4 h-4 sm:hidden rounded-full bg-brandGold"></div>
                  </div>
                </div>
                <div className="sm:w-1/2 sm:pl-12">
                  <h4 className="heading-feature text-brandGold">2003</h4>
                  <h5 className="heading-bullet mb-2">Nouvelle direction artistique</h5>
                  <p className="text-platinumGray">Leila Miyara prend officiellement la direction artistique de la Maison, insufflant une vision contemporaine tout en préservant l'héritage familial.</p>
                </div>
              </div>
              
              {/* 2023 */}
              <div className="flex flex-row sm:flex-row items-start sm:items-center pl-10 sm:pl-0">
                <div className="hidden sm:block sm:w-1/2 sm:pr-12 sm:text-right">
                  <h4 className="heading-feature text-brandGold">2023</h4>
                  <h5 className="heading-bullet mb-2">Innovation et tradition</h5>
                  <p className="text-platinumGray">Lancement de l'expérience numérique de Diamant Rouge, permettant de faire découvrir au monde entier le patrimoine joaillier unique de la famille Miyara.</p>
                </div>
                <div className="absolute left-0 sm:static sm:flex sm:items-center sm:justify-center sm:my-0">
                  <div className="w-8 h-8 sm:w-4 sm:h-4 rounded-full flex items-center justify-center bg-brandGold/20 sm:bg-brandGold z-10">
                    <div className="w-4 h-4 sm:hidden rounded-full bg-brandGold"></div>
                  </div>
                </div>
                <div className="sm:hidden mb-1">
                  <h4 className="heading-feature text-brandGold">2023</h4>
                  <h5 className="heading-bullet mb-2">Innovation et tradition</h5>
                  <p className="text-platinumGray">Lancement de l'expérience numérique de Diamant Rouge, permettant de faire découvrir au monde entier le patrimoine joaillier unique de la famille Miyara.</p>
                </div>
                <div className="sm:w-1/2 sm:pl-12 sm:block hidden"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Values Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-brandGold text-center mb-4 sm:mb-6">Nos Valeurs</h3>
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="relative">
              <div className="h-[1px] w-32 sm:w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Diamond size={8} className="text-brandGold fill-brandGold" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Excellence */}
            <div className="text-center p-5 sm:p-6 bg-gradient-to-b from-brandGold/5 to-transparent rounded-sm">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border border-brandGold/30">
                  <Diamond size={24} className="text-brandGold" />
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-serif text-brandGold mb-2 sm:mb-3">Excellence</h4>
              <p className="text-sm sm:text-base text-platinumGray">
                La recherche constante de la perfection dans chaque détail, de la conception à la finition, fidèle à la tradition artisanale de Fès transmise de génération en génération.
              </p>
            </div>
            
            {/* Authenticité */}
            <div className="text-center p-5 sm:p-6 bg-gradient-to-b from-brandGold/5 to-transparent rounded-sm">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border border-brandGold/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold">
                    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"></path>
                    <path d="M8.5 2h7"></path>
                    <path d="M14.5 16h-5"></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-serif text-brandGold mb-2 sm:mb-3">Authenticité</h4>
              <p className="text-sm sm:text-base text-platinumGray">
                Notre engagement à rester fidèles aux techniques ancestrales tout en les faisant évoluer avec délicatesse pour créer des pièces intemporelles.
              </p>
            </div>
            
            {/* Héritage */}
            <div className="text-center p-5 sm:p-6 bg-gradient-to-b from-brandGold/5 to-transparent rounded-sm">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border border-brandGold/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brandGold">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-serif text-brandGold mb-2 sm:mb-3">Héritage</h4>
              <p className="text-sm sm:text-base text-platinumGray">
                La transmission du savoir-faire familial qui se perpétue depuis 1957, enrichi par les innovations de chaque génération de la famille Miyara.
              </p>
            </div>
          </div>
        </div>
        
        {/* Founder Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-brandGold text-center mb-8 sm:mb-12">Notre Fondatrice</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] mb-4 md:mb-0">
                <Image 
                src="/images/home/founder.jpg" 
                alt="Leila Miyara" 
                  layout="fill"
                  objectFit="cover"
                className="rounded-sm"
                />
              </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-serif text-brandGold mb-2 sm:mb-3">Leila Miyara</h4>
              <p className="text-sm text-brandGold mb-4 sm:mb-6">Directrice Artistique & Héritière</p>
              <div className="h-[1px] w-24 sm:w-32 bg-gradient-to-r from-brandGold via-brandGold to-transparent mb-4 sm:mb-6"></div>
              <p className="text-platinumGray leading-relaxed mb-4">
                Fille du fondateur de Diamant Rouge, Leila Miyara a grandi au milieu des pierres précieuses et des métaux nobles. 
                Formée dès son plus jeune âge aux techniques traditionnelles de la joaillerie marocaine par son père, 
                elle a ensuite perfectionné son art en étudiant le design contemporain.
              </p>
              <p className="text-platinumGray leading-relaxed mb-4">
                Prenant la direction artistique de la Maison en 2003, Leila a su préserver l'héritage familial tout en 
                insufflant une vision moderne et audacieuse. Sa philosophie : honorer les racines tout en regardant vers l'avenir.
              </p>
              <p className="text-platinumGray leading-relaxed">
                "Notre histoire commence à Fès en 1957, mais chaque création raconte une nouvelle page de cette aventure familiale. 
                Je porte cet héritage avec fierté et responsabilité, consciente que nos bijoux sont des témoins de notre culture 
                qui traverseront le temps."
              </p>
            </div>
          </div>
        </div>
        
        {/* Atelier Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-brandGold text-center mb-4 sm:mb-6">Notre Atelier</h3>
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="relative">
              <div className="h-[1px] w-32 sm:w-40 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Diamond size={8} className="text-brandGold fill-brandGold" />
                </div>
              </div>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="text-platinumGray leading-relaxed mb-4">
                Au cœur de la médina de Fès, notre atelier perpétue les techniques ancestrales de la joaillerie marocaine. 
                C'est dans ce lieu chargé d'histoire que chaque création Diamant Rouge prend vie, entre les mains d'artisans 
                d'exception formés selon la tradition.
              </p>
              <p className="text-platinumGray leading-relaxed mb-4">
                L'atelier Miyara est à la fois un espace de création et de transmission. Les techniques séculaires 
                s'y transmettent de maître à apprenti, préservant ainsi un savoir-faire précieux qui se raréfie dans 
                notre monde moderne.
              </p>
              <p className="text-platinumGray leading-relaxed">
                Chaque bijou qui sort de notre atelier porte en lui l'âme de Fès et l'empreinte de cette longue 
                tradition d'excellence que la famille Miyara s'efforce de perpétuer depuis plus de six décennies.
              </p>
            </div>
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] order-1 md:order-2 mb-4 md:mb-0">
                    <Image 
                src="/images/home/atelier.jpg" 
                alt="Atelier Diamant Rouge" 
                      layout="fill"
                      objectFit="cover"
                className="rounded-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-richEbony/5 via-brandGold/10 to-richEbony/5 py-10 sm:py-16 px-4 rounded-sm">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-brandGold mb-4 sm:mb-6">Découvrez Notre Héritage</h3>
          <p className="text-platinumGray max-w-2xl mx-auto mb-6 sm:mb-8">
            Nous vous invitons à découvrir l'univers Diamant Rouge, où tradition fassi et excellence contemporaine se rencontrent pour créer des pièces d'exception qui traversent les générations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/haute-joaillerie"
              className="px-6 sm:px-8 py-3 bg-brandGold text-white hover:bg-brandGold/90 transition-colors duration-300 tracking-wider"
            >
              DÉCOUVRIR NOS COLLECTIONS
            </Link>
            <Link 
              href="/contact"
              className="px-6 sm:px-8 py-3 border border-brandGold text-brandGold hover:bg-brandGold/10 transition-colors duration-300 tracking-wider"
            >
              PRENDRE RENDEZ-VOUS
            </Link>
          </div>
        </div>
      </main>
    </>
  );
} 