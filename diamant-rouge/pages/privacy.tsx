import Head from 'next/head';
import { Diamond } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité | Diamant Rouge Joaillerie</title>
        <meta name="description" content="Notre politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles." />
      </Head>

      <main className="bg-white pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-serif text-richEbony">Politique de Confidentialité</h1>
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
              <h2 className="text-2xl font-serif text-brandGold mb-6">Introduction</h2>
              <p>
                Chez Diamant Rouge Joaillerie, nous accordons une grande importance à la protection de votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles lorsque vous utilisez notre site web et nos services.
              </p>
              <p>
                En utilisant notre site web (www.diamantrouge.com) et nos services, vous acceptez les pratiques décrites dans cette politique de confidentialité. Nous vous encourageons à la lire attentivement pour comprendre nos pratiques concernant vos informations personnelles.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">1. Collecte des Informations</h2>
              <p>
                Nous collectons plusieurs types d'informations vous concernant, notamment :
              </p>
              <ul>
                <li>
                  <strong>Informations que vous nous fournissez :</strong> Lorsque vous créez un compte, effectuez un achat, remplissez un formulaire, participez à un concours, répondez à une enquête, ou lorsque vous nous contactez, nous pouvons vous demander votre nom, adresse e-mail, adresse postale, numéro de téléphone, informations de paiement, et d'autres informations personnelles.
                </li>
                <li>
                  <strong>Informations collectées automatiquement :</strong> Lorsque vous naviguez sur notre site, nous pouvons recueillir automatiquement certaines informations techniques, telles que votre adresse IP, type de navigateur, pages visitées, temps passé sur le site, et autres données de navigation.
                </li>
                <li>
                  <strong>Informations provenant d'autres sources :</strong> Nous pouvons également obtenir des informations vous concernant à partir d'autres sources, comme les réseaux sociaux si vous interagissez avec nous sur ces plateformes.
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">2. Utilisation des Informations</h2>
              <p>
                Nous utilisons les informations que nous collectons pour :
              </p>
              <ul>
                <li>Traiter vos commandes et gérer votre compte</li>
                <li>Vous fournir les produits et services que vous avez demandés</li>
                <li>Améliorer notre site web et nos services</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Vous informer sur nos produits, services et promotions (si vous avez consenti à recevoir ces communications)</li>
                <li>Répondre à vos questions et demandes</li>
                <li>Prévenir les activités frauduleuses et assurer la sécurité de notre site</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">3. Partage des Informations</h2>
              <p>
                Nous ne vendons pas vos informations personnelles à des tiers. Cependant, nous pouvons partager vos informations dans les situations suivantes :
              </p>
              <ul>
                <li>
                  <strong>Prestataires de services :</strong> Nous pouvons partager vos informations avec des prestataires de services qui nous aident à exploiter notre site web, à traiter les paiements, à livrer les produits, à envoyer des communications ou à fournir d'autres services.
                </li>
                <li>
                  <strong>Partenaires commerciaux :</strong> Nous pouvons partager certaines informations avec nos partenaires commerciaux pour vous proposer certains produits, services ou promotions.
                </li>
                <li>
                  <strong>Conformité légale :</strong> Nous pouvons divulguer vos informations si la loi l'exige ou si nous croyons de bonne foi qu'une telle action est nécessaire pour respecter la loi, protéger nos droits ou ceux d'autrui, enquêter sur une fraude, ou répondre à une demande gouvernementale.
                </li>
                <li>
                  <strong>Transfert d'entreprise :</strong> Si Diamant Rouge Joaillerie fait l'objet d'une fusion, acquisition ou vente d'actifs, vos informations personnelles pourraient faire partie des actifs transférés.
                </li>
              </ul>
              <p>
                Dans tous les cas, nous exigeons que les tiers qui reçoivent vos informations s'engagent à les traiter conformément à notre politique de confidentialité.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">4. Cookies et Technologies Similaires</h2>
              <p>
                Nous utilisons des cookies et d'autres technologies similaires pour améliorer votre expérience sur notre site, analyser comment il est utilisé, et personnaliser notre marketing.
              </p>
              <p>
                Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous avertir lorsqu'un cookie est envoyé. Cependant, certaines fonctionnalités de notre site pourraient ne pas fonctionner correctement si vous désactivez les cookies.
              </p>
              <p>
                Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre <a href="/cookie-policy" className="text-brandGold hover:underline">Politique de Cookies</a>.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">5. Sécurité des Données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération et la destruction.
              </p>
              <p>
                Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée. Par conséquent, bien que nous nous efforcions de protéger vos informations personnelles, nous ne pouvons pas garantir leur sécurité absolue.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">6. Conservation des Données</h2>
              <p>
                Nous conservons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette politique de confidentialité, sauf si une période de conservation plus longue est requise ou permise par la loi.
              </p>
              <p>
                Lorsque nous n'avons plus besoin de vos informations personnelles, nous les supprimons ou les anonymisons de manière sécurisée.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">7. Vos Droits</h2>
              <p>
                En fonction de votre lieu de résidence, vous pouvez disposer de certains droits concernant vos informations personnelles, notamment :
              </p>
              <ul>
                <li>Le droit d'accéder à vos informations personnelles</li>
                <li>Le droit de rectifier vos informations personnelles</li>
                <li>Le droit de supprimer vos informations personnelles</li>
                <li>Le droit de limiter le traitement de vos informations personnelles</li>
                <li>Le droit de vous opposer au traitement de vos informations personnelles</li>
                <li>Le droit à la portabilité des données</li>
                <li>Le droit de retirer votre consentement à tout moment</li>
              </ul>
              <p>
                Pour exercer ces droits, veuillez nous contacter en utilisant les coordonnées fournies à la fin de cette politique.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">8. Modifications de la Politique de Confidentialité</h2>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente sera toujours disponible sur notre site web, avec la date de la dernière mise à jour.
              </p>
              <p>
                Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la façon dont nous protégeons vos informations.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">9. Contact</h2>
              <p>
                Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité ou la façon dont nous traitons vos informations personnelles, veuillez nous contacter :
              </p>
              <p>
                Diamant Rouge Joaillerie<br />
                32 Avenue Hassan II<br />
                Casablanca, Maroc<br />
                Email: privacy@diamantrouge.com<br />
                Téléphone: +212 555 000 111
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
