import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Lightbulb, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  { icon: TrendingUp, type: "Croissance", text: "Ajoutez 3 produits dans la catégorie 'Accessoires' — forte demande ce mois.", color: "text-primary" },
  { icon: AlertCircle, type: "Stock", text: "5 produits ont un stock < 10 unités. Pensez à réapprovisionner.", color: "text-orange-500" },
  { icon: Sparkles, type: "Marketing", text: "Lancez une promotion -15% sur la collection été pour booster vos ventes.", color: "text-purple-500" },
  { icon: Lightbulb, type: "SEO", text: "12 produits n'ont pas de description détaillée. L'IA peut les générer en 1 clic.", color: "text-blue-500" },
];

export default function AISuggestionsPage() {
  return (
    <DashboardLayout type="vendor" title="Suggestions IA">
      <PageHeader title="Suggestions intelligentes" description="Recommandations personnalisées pour améliorer votre boutique." />
      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
        {suggestions.map((s, i) => (
          <div key={i} className="p-5 rounded-lg border bg-card">
            <div className="flex items-start gap-3">
              <s.icon className={`h-5 w-5 mt-0.5 ${s.color}`} />
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase">{s.type}</div>
                <p className="text-sm mt-1">{s.text}</p>
                <Button size="sm" variant="outline" className="mt-3">Appliquer</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
