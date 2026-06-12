import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";

export default function PrivacyPage() {
  return (
    <MarketplaceLayout>
      <article className="container py-12 max-w-3xl prose prose-sm dark:prose-invert">
        <h1 className="font-heading text-3xl font-bold mb-6">Politique de confidentialité</h1>
        <p className="text-sm text-muted-foreground">Dernière mise à jour : juin 2026</p>
        <h2 className="font-heading text-xl font-semibold mt-8">Données collectées</h2>
        <p>Nous collectons : nom, email, téléphone, adresse de livraison, historique de commandes et préférences.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">Utilisation</h2>
        <p>Vos données servent à traiter vos commandes, vous contacter, améliorer le service et respecter nos obligations légales.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">Partage</h2>
        <p>Vos données sont partagées uniquement avec les vendeurs concernés par vos commandes et nos partenaires de livraison et paiement.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">Sécurité</h2>
        <p>Toutes les données sensibles sont chiffrées. Les paiements transitent via des canaux sécurisés.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">Vos droits</h2>
        <p>Vous pouvez à tout moment accéder, modifier ou supprimer vos données depuis votre profil, ou nous contacter à privacy@soukdz.com.</p>
        <h2 className="font-heading text-xl font-semibold mt-6">Cookies</h2>
        <p>Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience du site.</p>
      </article>
    </MarketplaceLayout>
  );
}
