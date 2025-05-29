import Head from 'next/head';
import { Diamond } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <>
      <Head>
        <title>Mentions Légales | Diamant Rouge Joaillerie</title>
        <meta name="description" content="Mentions légales et informations juridiques concernant le site Diamant Rouge Joaillerie." />
      </Head>

      <main className="bg-white pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-serif text-richEbony">Mentions Légales</h1>
            <div className="relative mt-4 flex justify-center">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-brandGold to-transparent"></div>
              <div className="absolute -bottom-[3px]">
                <Diamond size={7} className="text-brandGold fill-brandGold" />
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none text-platinumGray">
            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">1. Éditeur du Site</h2>
              <p>
                Le site www.diamantrouge.com (ci-après "le Site") est édité par :
              </p>
              <p>
                <strong>Diamant Rouge Joaillerie S.A.</strong><br />
                Société anonyme au capital de 500 000 dirhams<br />
                Siège social : 32 Avenue Hassan II, Casablanca, Maroc<br />
                Immatriculée au Registre du Commerce de Casablanca sous le numéro RC12345<br />
                Numéro de TVA intracommunautaire : MA123456789<br />
                Directeur de la publication : Mohammed El Fassi<br />
                Téléphone : +212 555 000 111<br />
                Email : contact@diamantrouge.com
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">2. Hébergement</h2>
              <p>
                Le Site est hébergé par :
              </p>
              <p>
                <strong>Vercel Inc.</strong><br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                États-Unis<br />
                https://vercel.com
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">3. Propriété Intellectuelle</h2>
              <p>
                L'ensemble des éléments figurant sur le Site (textes, images, logos, photographies, vidéos, sons, plans, etc.) sont protégés par les lois relatives à la propriété intellectuelle, notamment le droit d'auteur et le droit des marques.
              </p>
              <p>
                Ces éléments sont la propriété exclusive de Diamant Rouge Joaillerie ou de ses partenaires. Toute reproduction, représentation, utilisation, adaptation, modification, incorporation, traduction, commercialisation, partielle ou intégrale, sans l'autorisation préalable et écrite de Diamant Rouge Joaillerie, est strictement interdite et constitue un délit de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
              </p>
              <p>
                Les marques et logos figurant sur le Site sont des marques déposées par Diamant Rouge Joaillerie ou ses partenaires. Toute reproduction, imitation ou utilisation, totale ou partielle, de ces signes distinctifs sans l'autorisation expresse et préalable de Diamant Rouge Joaillerie ou de ses partenaires est prohibée et engage la responsabilité de son auteur.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">4. Liens Hypertextes</h2>
              <p>
                <strong>4.1 Liens vers notre Site</strong>
              </p>
              <p>
                Tout site Internet est autorisé à mettre en place un lien hypertexte vers le Site, à condition que ce lien s'ouvre dans une nouvelle fenêtre du navigateur et que le site qui établit ce lien ne soit pas de nature à nuire à l'image de Diamant Rouge Joaillerie.
              </p>
              <p>
                Diamant Rouge Joaillerie se réserve le droit de demander la suppression d'un lien si elle estime que le site source ne respecte pas ces conditions.
              </p>
              
              <p>
                <strong>4.2 Liens vers d'autres sites</strong>
              </p>
              <p>
                Le Site peut contenir des liens hypertextes vers d'autres sites Internet. Ces liens sont fournis à titre informatif uniquement. Diamant Rouge Joaillerie n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux pratiques de leurs exploitants en matière de protection des données personnelles.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">5. Protection des Données Personnelles</h2>
              <p>
                Diamant Rouge Joaillerie s'engage à respecter la confidentialité des informations personnelles que vous communiquez sur le Site.
              </p>
              <p>
                Pour en savoir plus sur la manière dont nous collectons, utilisons et protégeons vos données personnelles, veuillez consulter notre <a href="/privacy" className="text-brandGold hover:underline">Politique de Confidentialité</a>.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">6. Droit Applicable et Juridiction Compétente</h2>
              <p>
                Les présentes mentions légales sont régies par le droit marocain. En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les tribunaux de Casablanca seront seuls compétents.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">7. Crédits</h2>
              <p>
                <strong>Conception et réalisation :</strong> TheCyberQuery inc.<br />
                <strong>Photographies :</strong> Studio Lumière, sauf mention contraire<br />
                <strong>Illustrations :</strong> Salma Bennour<br />
                <strong>Rédaction :</strong> OGhazi
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">8. Contact</h2>
              <p>
                Pour toute question relative au Site ou aux présentes mentions légales, vous pouvez nous contacter :
              </p>
              <p>
                Par courrier : Diamant Rouge Joaillerie, 32 Avenue Hassan II, Casablanca, Maroc<br />
                Par téléphone : +212 555 000 111<br />
                Par email : contact@diamantrouge.com
              </p>
            </section>

            <div className="mt-16 text-center text-sm text-platinumGray/80">
              <p>Dernière mise à jour : 29 mai 2025</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
