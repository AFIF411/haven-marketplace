import { useState } from "react";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, RotateCcw } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useStockMovements } from "@/hooks/useSales";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const typeLabels: Record<string, string> = { in: "Entrée", out: "Sortie", sale: "Vente", adjustment: "Ajustement" };
const typeIcons: Record<string, typeof ArrowUpCircle> = { in: ArrowUpCircle, out: ArrowDownCircle, sale: ArrowDownCircle, adjustment: RotateCcw };

function StockMovementForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const { data: products } = useProducts();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ product_id: "", movement_type: "in", quantity: 1, reference: "", notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_id || !user) return;

    const qty = form.movement_type === "out" ? -Math.abs(form.quantity) : Math.abs(form.quantity);

    // Update stock
    const { data: prod } = await supabase.from("products").select("stock").eq("id", form.product_id).single();
    if (prod) {
      const newStock = Math.max(0, prod.stock + qty);
      await supabase.from("products").update({ stock: newStock }).eq("id", form.product_id);
    }

    // Record movement
    await supabase.from("stock_movements").insert({
      user_id: user.id,
      product_id: form.product_id,
      movement_type: form.movement_type,
      quantity: qty,
      reference: form.reference || null,
      notes: form.notes || null,
    });

    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["stock_movements"] });
    toast.success("Mouvement enregistré");
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Produit *</label>
        <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} required>
          <option value="">-- Sélectionner --</option>
          {(products || []).map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Type</label>
          <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.movement_type} onChange={e => setForm({ ...form, movement_type: e.target.value })}>
            <option value="in">Entrée</option>
            <option value="out">Sortie</option>
            <option value="adjustment">Ajustement</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Quantité *</label>
          <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} min={1} required />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Référence</label>
        <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="N° bon, facture..." />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Notes</label>
        <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}

export default function VendorStockPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: products } = useProducts();
  const { data: movements, isLoading } = useStockMovements();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState<"overview" | "movements">("overview");

  if (!user) return <Navigate to="/login" replace />;

  const lowStock = (products || []).filter(p => p.stock <= p.min_stock);
  const outOfStock = (products || []).filter(p => p.stock === 0);

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Gestion du stock</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="me-1 h-4 w-4" /> Mouvement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau mouvement de stock</DialogTitle>
            </DialogHeader>
            <StockMovementForm onSave={() => setDialogOpen(false)} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-xs text-muted-foreground">Total produits</p>
          <p className="font-heading text-2xl font-bold">{(products || []).length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-xs text-muted-foreground">En rupture</p>
          <p className="font-heading text-2xl font-bold text-destructive">{outOfStock.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-xs text-muted-foreground">Stock faible</p>
          <p className="font-heading text-2xl font-bold text-warning">{lowStock.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-xs text-muted-foreground">Mouvements récents</p>
          <p className="font-heading text-2xl font-bold">{(movements || []).length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button size="sm" variant={tab === "overview" ? "default" : "outline"} onClick={() => setTab("overview")}>Aperçu stock</Button>
        <Button size="sm" variant={tab === "movements" ? "default" : "outline"} onClick={() => setTab("movements")}>Mouvements</Button>
      </div>

      {tab === "overview" ? (
        <>
          <div className="relative max-w-sm mb-4">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-start px-4 py-2.5 font-medium">Produit</th>
                <th className="text-start px-4 py-2.5 font-medium">Code</th>
                <th className="text-end px-4 py-2.5 font-medium">Stock</th>
                <th className="text-end px-4 py-2.5 font-medium">Min</th>
                <th className="text-start px-4 py-2.5 font-medium">Statut</th>
              </tr></thead>
              <tbody>
                {(products || []).filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.code || "-"}</td>
                    <td className="px-4 py-3 text-end font-medium">{p.stock} {p.unit}</td>
                    <td className="px-4 py-3 text-end text-muted-foreground">{p.min_stock}</td>
                    <td className="px-4 py-3">
                      {p.stock === 0 ? <Badge variant="destructive">Rupture</Badge> :
                       p.stock <= p.min_stock ? <Badge variant="warning">Faible</Badge> :
                       <Badge variant="success">OK</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : (movements || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Aucun mouvement enregistré</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-start px-4 py-2.5 font-medium">Date</th>
                <th className="text-start px-4 py-2.5 font-medium">Produit</th>
                <th className="text-start px-4 py-2.5 font-medium">Type</th>
                <th className="text-end px-4 py-2.5 font-medium">Quantité</th>
                <th className="text-start px-4 py-2.5 font-medium">Réf.</th>
              </tr></thead>
              <tbody>
                {(movements || []).map((m: any) => {
                  const Icon = typeIcons[m.movement_type] || RotateCcw;
                  return (
                    <tr key={m.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(m.created_at).toLocaleDateString("fr-DZ")}</td>
                      <td className="px-4 py-3 font-medium">{m.products?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`h-3.5 w-3.5 ${m.quantity > 0 ? 'text-success' : 'text-destructive'}`} />
                          <span>{typeLabels[m.movement_type] || m.movement_type}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-end font-medium ${m.quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                        {m.quantity > 0 ? '+' : ''}{m.quantity}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{m.reference || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
