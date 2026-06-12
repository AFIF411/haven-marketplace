import { useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AIGenerateDescriptionPage() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const gen = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setOutput("Découvrez ce produit authentique fabriqué avec soin selon les traditions algériennes. Qualité premium, finition soignée, idéal pour offrir ou se faire plaisir. Livraison rapide dans toutes les wilayas.");
      setLoading(false);
    }, 1200);
  };

  return (
    <DashboardLayout type="vendor" title="Génération description produit">
      <PageHeader title="Générer une description produit" description="L'IA rédige une description optimisée à partir des caractéristiques." />
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        <form onSubmit={gen} className="space-y-4 p-6 rounded-lg border bg-card">
          <div><Label>Nom du produit</Label><Input required className="mt-1" /></div>
          <div><Label>Caractéristiques (séparées par virgule)</Label><Textarea rows={4} required className="mt-1" placeholder="Cuir véritable, fait main, 3 coloris..." /></div>
          <div><Label>Ton</Label><Input className="mt-1" defaultValue="Premium et chaleureux" /></div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Sparkles className="h-4 w-4 me-2" />}
            Générer
          </Button>
        </form>
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Résultat</span>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copié" }); }}>
                <Copy className="h-4 w-4 me-1" />Copier
              </Button>
            )}
          </div>
          <Textarea value={output} onChange={e => setOutput(e.target.value)} rows={10} placeholder="La description générée apparaîtra ici..." />
        </div>
      </div>
    </DashboardLayout>
  );
}
