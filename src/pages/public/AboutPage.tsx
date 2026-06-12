import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { Store, Users, Globe, Sparkles } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Store, title: "Marketplace 100% algérienne", text: "Conçue pour les vendeurs et acheteurs locaux, dans les 58 wilayas." },
    { icon: Users, title: "Communauté de confiance", text: "Vendeurs vérifiés, avis clients authentiques." },
    { icon: Globe, title: "Bilingue FR / AR", text: "Une expérience adaptée à tous les utilisateurs algériens." },
    { icon: Sparkles, title: "Propulsé par l'IA", text: "Générez votre boutique, vos descriptions et vos pages en quelques clics." },
  ];
  return (
    <MarketplaceLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold">À propos de Souk DZ</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Souk DZ est la plateforme SaaS e-commerce qui permet à chaque vendeur algérien de créer sa boutique en ligne en quelques minutes, et à chaque client de découvrir le meilleur du commerce local.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          {values.map(v => (
            <div key={v.title} className="p-6 rounded-lg border bg-card">
              <v.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold text-lg">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </MarketplaceLayout>
  );
}
