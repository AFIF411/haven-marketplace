import { useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ShopResult = {
  name: string;
  tagline: string;
  description: string;
  categories: string[];
  colorPalette: { primary: string; secondary: string; accent: string };
  products: { name: string; description: string; priceRange: string; category: string }[];
  welcomeMessage: string;
};

export default function AIShopGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [shop, setShop] = useState<ShopResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShop(null);
    setImageUrl(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-generate", {
        body: { activityName, productType, description, generateImage: true },
      });
      if (error) throw error;
      setShop(data.shop);
      if (data.imageUrl) setImageUrl(`data:image/png;base64,${data.imageUrl}`);
      toast({ title: "Boutique générée ✨", description: "Découvrez la proposition à droite." });
    } catch (err: any) {
      toast({ title: "Erreur IA", description: err.message ?? "Impossible de générer", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="vendor" title="Générer boutique par IA">
      <PageHeader title="Assistant IA — Création de boutique" description="Décrivez votre activité, l'IA crée votre boutique en quelques secondes." />
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={generate} className="space-y-4">
              <div>
                <Label>Nom de votre activité</Label>
                <Input required value={activityName} onChange={e => setActivityName(e.target.value)} className="mt-1" placeholder="Ex : Artisanat kabyle" />
              </div>
              <div>
                <Label>Type de produits</Label>
                <Input required value={productType} onChange={e => setProductType(e.target.value)} className="mt-1" placeholder="Bijoux, vêtements traditionnels..." />
              </div>
              <div>
                <Label>Description (optionnel)</Label>
                <Textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="mt-1" placeholder="Votre style, vos valeurs, votre clientèle cible..." />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 me-2 animate-spin" /> : <Sparkles className="h-4 w-4 me-2" />}
                Générer ma boutique
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Aperçu
            </div>

            {!shop && !loading && (
              <div className="text-sm text-muted-foreground italic">Le résultat s'affichera ici après génération.</div>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Génération en cours (texte + image)…
              </div>
            )}

            {shop && (
              <div className="space-y-4">
                {imageUrl && (
                  <img src={imageUrl} alt={shop.name} className="w-full h-48 object-cover rounded-md border" />
                )}
                <div>
                  <h3 className="font-heading text-xl font-bold">{shop.name}</h3>
                  <p className="text-sm text-primary">{shop.tagline}</p>
                </div>
                <p className="text-sm text-muted-foreground">{shop.description}</p>

                <div className="flex items-center gap-2">
                  {[shop.colorPalette.primary, shop.colorPalette.secondary, shop.colorPalette.accent].map((c, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs">
                      <span className="w-5 h-5 rounded-full border" style={{ background: c }} />
                      {c}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-xs font-medium mb-1">Catégories</div>
                  <div className="flex flex-wrap gap-1">
                    {shop.categories.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium mb-2">Produits suggérés</div>
                  <div className="space-y-2">
                    {shop.products.map((p, i) => (
                      <div key={i} className="p-2 rounded-md border bg-muted/30 text-xs">
                        <div className="font-medium">{p.name} <span className="text-primary">· {p.priceRange}</span></div>
                        <div className="text-muted-foreground">{p.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-md bg-primary/5 border border-primary/20 text-sm italic">
                  « {shop.welcomeMessage} »
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
