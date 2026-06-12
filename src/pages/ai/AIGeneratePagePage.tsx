import { useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";

export default function AIGeneratePagePage() {
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<string[]>([]);

  const gen = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setBlocks(["Hero : Bannière avec votre logo et slogan", "Section produits phares (6 items)", "Section catégories en grille", "Témoignages clients", "Promotions du moment", "Footer avec contact et réseaux sociaux"]);
      setLoading(false);
    }, 1200);
  };

  return (
    <DashboardLayout type="vendor" title="Génération page boutique">
      <PageHeader title="Générer une page boutique" description="L'IA propose une structure de page commerciale prête à l'emploi." />
      <form onSubmit={gen} className="max-w-2xl space-y-4 p-6 rounded-lg border bg-card">
        <div><Label>Objectif de la page</Label><Input required className="mt-1" placeholder="Page d'accueil, promo Aïd, collection été..." /></div>
        <div><Label>Style souhaité</Label><Textarea rows={3} className="mt-1" placeholder="Minimaliste, chaleureux, dynamique..." /></div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Sparkles className="h-4 w-4 me-2" />}
          Générer la structure
        </Button>
        {blocks.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <Label className="mb-2 block">Structure proposée</Label>
            {blocks.map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md border bg-background">
                <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}</span>
                <span className="text-sm">{b}</span>
              </div>
            ))}
            <Button className="mt-3">Créer cette page</Button>
          </div>
        )}
      </form>
    </DashboardLayout>
  );
}
