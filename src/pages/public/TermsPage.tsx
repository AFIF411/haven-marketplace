import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";

export default function TermsPage() {
  return (
    <MarketplaceLayout>
      <article className="container py-12 max-w-3xl prose prose-sm dark:prose-invert">
        <h1 className="font-heading text-3xl font-bold mb-6">Conditions d'utilisation</h1>
        <p className="text-sm text-muted-foreground">Dernière mise à jour : juin 2026</p>
        <h2 className="font-heading text-xl font-semibold mt-8">1. Objet</h2>
        <p>Les présentes conditions régissent l'utilisation de la plateforme OneClick Tijara par les visiteurs, clients et vendeurs.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">2. Compte utilisateur</h2>
        <p>Vous êtes responsable de la confidentialité de vos identifiants. Toute activité sur votre compte est sous votre responsabilité.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">3. Boutiques et produits</h2>
        <p>Les vendeurs s'engagent à publier des produits conformes à la loi algérienne et à honorer les commandes reçues.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">4. Paiement</h2>
        <p>Les paiements sont sécurisés et traités par nos partenaires bancaires (CIB, Edahabia, BaridiMob, CCP).</p>
        <h2 className="font-heading text-xl font-semibold mt-6">5. Livraison et retour</h2>
        <p>Les conditions de livraison sont définies par chaque boutique. Les retours sont possibles sous 7 jours.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">6. Responsabilité</h2>
        <p>OneClick Tijara agit en tant qu'intermédiaire entre vendeurs et acheteurs et ne saurait être tenu responsable des litiges directs.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">7. Modification</h2>
        <p>OneClick Tijara se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements importants.</p>
      </article>
    </MarketplaceLayout>
  );
}
