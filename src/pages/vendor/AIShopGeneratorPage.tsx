import { useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AIShopGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult("Boutique générée : nom, description, 6 catégories, page d'accueil personnalisée et palette de couleurs prêtes.");
      toast({ title: "Boutique générée", description: "Vous pouvez maintenant la personnaliser." });
    }, 1500);
  };

  return (
    <DashboardLayout type="vendor" title="Générer boutique par IA">
      <PageHeader title="Assistant IA — Création de boutique" description="Décrivez votre activité, l'IA crée votre boutique en quelques secondes." />
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={generate} className="space-y-4">
              <div><Label>Nom de votre activité</Label><Input required className="mt-1" placeholder="Ex : Artisanat kabyle" /></div>
              <div><Label>Type de produits</Label><Input required className="mt-1" placeholder="Bijoux, vêtements traditionnels..." /></div>
              <div><Label>Description (optionnel)</Label><Textarea rows={4} className="mt-1" placeholder="Votre style, vos valeurs, votre clientèle cible..." /></div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Sparkles className="h-4 w-4 me-2" />}
                Générer ma boutique
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Aperçu</div>
            {result ? (
              <div className="text-sm text-muted-foreground p-4 rounded-md bg-primary/5 border border-primary/20">{result}</div>
            ) : (
              <div className="text-sm text-muted-foreground italic">Le résultat s'affichera ici après génération.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
