import Head from 'next/head';
import { Diamond } from 'lucide-react';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Conditions Générales | Diamant Rouge Joaillerie</title>
        <meta name="description" content="Conditions générales de vente et d'utilisation du site Diamant Rouge Joaillerie." />
      </Head>

      <main className="bg-white pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-serif text-richEbony">Conditions Générales</h1>
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
              <h2 className="text-2xl font-serif text-brandGold mb-6">1. Introduction</h2>
              <p>
                Les présentes conditions générales de vente s'appliquent à toutes les commandes passées sur le site internet de Diamant Rouge Joaillerie (ci-après "le Site") accessible à l'adresse www.diamantrouge.com.
              </p>
              <p>
                Le Site est édité par la société Diamant Rouge Joaillerie, société anonyme au capital de 500 000 dirhams, dont le siège social est situé au 32 Avenue Hassan II, Casablanca, Maroc, immatriculée au Registre du Commerce de Casablanca sous le numéro RC12345.
              </p>
              <p>
                Ces conditions générales de vente peuvent être modifiées à tout moment. Les conditions applicables sont celles en vigueur au jour de la commande.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">2. Produits et Prix</h2>
              <p>
                Les produits proposés à la vente sont ceux qui figurent sur le Site. Chaque produit est accompagné d'une description détaillée. Les photographies des produits sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec le produit proposé, notamment en ce qui concerne les couleurs.
              </p>
              <p>
                Les prix indiqués sur le Site sont en dirhams marocains, toutes taxes comprises. Ils tiennent compte de la TVA applicable au jour de la commande. Diamant Rouge Joaillerie se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de l'enregistrement de la commande.
              </p>
              <p>
                Les prix ne comprennent pas les frais de livraison, qui sont facturés en supplément et indiqués avant la validation de la commande.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">3. Commandes</h2>
              <p>
                Pour passer commande, le client suit les étapes suivantes :
              </p>
              <ul>
                <li>Sélection des articles et ajout au panier</li>
                <li>Validation du contenu du panier</li>
                <li>Identification ou création d'un compte client</li>
                <li>Choix du mode de livraison</li>
                <li>Choix du mode de paiement et validation du paiement</li>
              </ul>
              <p>
                La confirmation de la commande par le client vaut acceptation des présentes conditions générales de vente.
              </p>
              <p>
                Diamant Rouge Joaillerie se réserve le droit de refuser toute commande pour des motifs légitimes, notamment en cas de problème de paiement, de problème de livraison en raison des informations communiquées, de commande anormale ou de suspicion de fraude.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">4. Paiement</h2>
              <p>
                Le paiement s'effectue en ligne par carte bancaire via un système sécurisé. Les cartes acceptées sont Visa, Mastercard et American Express.
              </p>
              <p>
                La commande est validée après confirmation du paiement. En cas de refus par la banque, la commande est automatiquement annulée.
              </p>
              <p>
                Pour certaines commandes importantes, un acompte peut être demandé. Dans ce cas, la commande ne sera traitée qu'après réception de l'acompte.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">5. Livraison</h2>
              <p>
                Diamant Rouge Joaillerie propose plusieurs modes de livraison :
              </p>
              <ul>
                <li>Livraison standard (3-5 jours ouvrables)</li>
                <li>Livraison express (1-2 jours ouvrables)</li>
                <li>Retrait en boutique (disponible sous 24h)</li>
              </ul>
              <p>
                Les délais de livraison sont donnés à titre indicatif. Un retard de livraison par rapport aux délais indiqués ne peut donner lieu à aucune pénalité ou annulation de la commande.
              </p>
              <p>
                En cas de retard important, Diamant Rouge Joaillerie s'engage à en informer le client dans les meilleurs délais.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">6. Droit de Rétractation</h2>
              <p>
                Conformément à la législation en vigueur, le client dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p>
                Pour exercer ce droit, le client doit notifier sa décision de rétractation par écrit (email ou courrier) avant l'expiration du délai de 14 jours et retourner le produit dans son état d'origine, complet (emballage, accessoires, notice...) et accompagné d'une copie de la facture d'achat.
              </p>
              <p>
                Les frais de retour sont à la charge du client. Le remboursement sera effectué dans un délai de 14 jours à compter de la réception du produit retourné, en utilisant le même moyen de paiement que celui utilisé pour la transaction initiale.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">7. Garanties</h2>
              <p>
                Tous les produits vendus par Diamant Rouge Joaillerie bénéficient de la garantie légale de conformité et de la garantie des vices cachés.
              </p>
              <p>
                En cas de non-conformité d'un produit vendu, il pourra être retourné à Diamant Rouge Joaillerie qui le reprendra, l'échangera ou le remboursera. Toute réclamation doit être effectuée par écrit (email ou courrier) dans un délai de 30 jours après la réception du produit.
              </p>
              <p>
                En outre, Diamant Rouge Joaillerie offre une garantie commerciale sur certains produits, dont les conditions sont précisées sur la fiche produit et/ou le certificat de garantie fourni avec le produit.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">8. Responsabilité</h2>
              <p>
                Diamant Rouge Joaillerie ne saurait être tenue pour responsable des dommages résultant d'une mauvaise utilisation du produit acheté.
              </p>
              <p>
                De même, Diamant Rouge Joaillerie ne saurait être tenue pour responsable de l'inexécution du contrat en cas de rupture de stock ou d'indisponibilité du produit, de force majeure, de perturbation ou grève totale ou partielle notamment des services postaux et moyens de transport et/ou communications.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">9. Propriété Intellectuelle</h2>
              <p>
                Tous les éléments du Site, qu'ils soient visuels ou sonores, y compris la technologie sous-jacente, sont protégés par le droit d'auteur, des marques ou des brevets. Ils sont la propriété exclusive de Diamant Rouge Joaillerie.
              </p>
              <p>
                Toute reproduction, adaptation ou traduction, même partielle, du Site est strictement interdite sans l'accord préalable écrit de Diamant Rouge Joaillerie.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-brandGold mb-6">10. Droit Applicable et Litiges</h2>
              <p>
                Les présentes conditions générales de vente sont soumises au droit marocain. En cas de litige, les tribunaux de Casablanca seront seuls compétents.
              </p>
              <p>
                Toutefois, préalablement à tout recours au juge arbitral ou étatique, le client est invité à contacter le service client de Diamant Rouge Joaillerie pour tenter de résoudre à l'amiable tout différend.
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
