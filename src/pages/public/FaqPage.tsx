import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Comment créer un compte vendeur ?", a: "Cliquez sur Inscription, choisissez « Vendeur », remplissez les informations de votre boutique et confirmez votre email." },
  { q: "Quels modes de paiement sont acceptés ?", a: "CCP, BaridiMob, carte Edahabia / CIB, et paiement à la livraison selon la boutique." },
  { q: "Combien de temps prend la livraison ?", a: "Entre 2 et 7 jours ouvrés selon la wilaya et la société de livraison choisie par le vendeur." },
  { q: "Puis-je retourner un produit ?", a: "Oui, sous 7 jours à compter de la réception, selon les conditions de chaque boutique." },
  { q: "Comment suivre ma commande ?", a: "Depuis Mon compte → Mes commandes, vous trouverez le numéro de suivi et le statut en temps réel." },
  { q: "Les vendeurs sont-ils vérifiés ?", a: "Oui, chaque boutique est validée manuellement par notre équipe avant publication." },
  { q: "Quels sont les frais pour les vendeurs ?", a: "Plusieurs plans SaaS sont disponibles. Voir la page Tarifs pour le détail." },
];

export default function FaqPage() {
  return (
    <MarketplaceLayout>
      <div className="container py-12 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold">Questions fréquentes</h1>
        <p className="text-muted-foreground mt-2">Tout ce qu'il faut savoir sur Souk DZ.</p>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-start">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </MarketplaceLayout>
  );
}
