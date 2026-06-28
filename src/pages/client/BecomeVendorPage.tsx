import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Store, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { wilayas } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

export default function BecomeVendorPage() {
  const { user, roles, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    wilaya: "Alger",
    phone: "",
    category: "fashion",
  });

  if (!user) return <Navigate to="/login" replace />;
  if (roles.includes("vendeur")) return <Navigate to="/vendor" replace />;

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast({ title: "Nom de boutique requis", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.rpc("become_vendeur", {
      _name: form.name.trim(),
      _description: form.description.trim() || null,
      _wilaya: form.wilaya,
      _phone: form.phone.trim() || null,
      _category: form.category,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    await refreshRoles();
    toast({ title: "Boutique créée !", description: "Bienvenue dans l'espace vendeur." });
    navigate("/vendor", { replace: true });
  };

  return (
    <DashboardLayout type="client" title="Devenir vendeur">
      <div className="max-w-2xl">
        <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/20 rounded-lg mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold mb-1">Ouvrez votre boutique en ligne</h2>
            <p className="text-sm text-muted-foreground">
              Vendez vos produits sur OneClick Tijara. Votre boutique sera créée en statut « en attente »
              et activée après validation par notre équipe.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 bg-card border rounded-lg p-6">
          <div>
            <Label htmlFor="name">Nom de la boutique *</Label>
            <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Artisan Cuir Alger" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Présentez votre boutique en quelques lignes" rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wilaya">Wilaya *</Label>
              <select id="wilaya" value={form.wilaya} onChange={(e) => set("wilaya", e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                {wilayas.map((w, i) => (
                  <option key={w} value={w}>{String(i + 1).padStart(2, "0")} - {w}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="category">Catégorie principale</Label>
              <select id="category" value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background text-sm">
                <option value="fashion">Mode</option>
                <option value="home">Maison</option>
                <option value="craft">Artisanat</option>
                <option value="food">Alimentation</option>
                <option value="electronics">Électronique</option>
                <option value="beauty">Beauté</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone de contact</Label>
            <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+213 ..." />
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : (<>Créer ma boutique <ArrowRight className="ms-1 h-4 w-4" /></>)}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
