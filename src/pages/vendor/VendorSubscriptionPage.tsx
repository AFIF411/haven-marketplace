import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  { name: "Starter", price: "0", products: "10", current: false, features: ["10 produits", "Boutique de base", "Support email"] },
  { name: "Pro", price: "2 500", products: "200", current: true, features: ["200 produits", "Page builder", "Promotions", "Analytics", "Support prioritaire"] },
  { name: "Business", price: "7 500", products: "Illimité", current: false, features: ["Produits illimités", "IA avancée", "Multi-utilisateurs", "API", "Support 24/7"] },
];

export default function VendorSubscriptionPage() {
  return (
    <DashboardLayout type="vendor" title="Abonnement SaaS">
      <div className="max-w-5xl">
        <h2 className="font-heading text-xl font-semibold">Votre plan actuel : <span className="text-primary">Pro</span></h2>
        <p className="text-sm text-muted-foreground mt-1">Prochaine facturation : 1er juillet 2026 — 2 500 DA</p>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {plans.map(p => (
            <div key={p.name} className={`p-6 rounded-lg border bg-card ${p.current ? "border-primary ring-1 ring-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold">{p.name}</h3>
                {p.current && <Badge>Actif</Badge>}
              </div>
              <div className="mt-3"><span className="text-3xl font-bold">{p.price}</span><span className="text-sm text-muted-foreground"> DA / mois</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map(f => <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>)}
              </ul>
              <Button className="w-full mt-6" variant={p.current ? "outline" : "default"} disabled={p.current}>
                {p.current ? "Plan actuel" : "Choisir"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
