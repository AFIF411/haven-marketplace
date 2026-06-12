import { useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";

export default function AIGenerateCategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState<string[]>([]);

  const gen = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setCats(["Vêtements traditionnels", "Bijoux artisanaux", "Décoration", "Accessoires", "Cadeaux", "Nouveautés"]);
      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout type="vendor" title="Génération catégories">
      <PageHeader title="Suggérer des catégories" description="L'IA propose des catégories adaptées à votre type de boutique." />
      <form onSubmit={gen} className="max-w-2xl space-y-4 p-6 rounded-lg border bg-card">
        <div><Label>Type de boutique</Label><Input required className="mt-1" placeholder="Ex : artisanat algérien, mode femme, électronique..." /></div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Sparkles className="h-4 w-4 me-2" />}
          Proposer des catégories
        </Button>
        {cats.length > 0 && (
          <div className="pt-4 border-t">
            <Label className="mb-3 block">Catégories suggérées</Label>
            <div className="flex flex-wrap gap-2">
              {cats.map(c => <Badge key={c} variant="outline" className="text-sm py-1.5 px-3">{c}</Badge>)}
            </div>
            <Button className="mt-4" variant="outline">Importer dans ma boutique</Button>
          </div>
        )}
      </form>
    </DashboardLayout>
  );
}
