import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePromotions, promotionsApi } from "@/hooks/useMarketplace";
import { Tag, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SHOP_ID = "s1"; // mock vendor's shop

export default function VendorPromotionsPage() {
  const { data: promos, loading, reload } = usePromotions(SHOP_ID);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percent" as const, value: 10, minOrder: 0 });

  const handleCreate = async () => {
    if (!form.code) return toast.error("Code requis");
    await promotionsApi.create({
      shopId: SHOP_ID,
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      active: true,
    });
    toast.success("Promotion créée");
    setOpen(false);
    setForm({ code: "", type: "percent", value: 10, minOrder: 0 });
    reload();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await promotionsApi.update(id, { active });
    reload();
  };

  return (
    <DashboardLayout type="vendor" title="Promotions">
      <PageHeader
        title="Mes promotions"
        description="Codes promo et remises de votre boutique"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-2" />Nouvelle promotion</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle promotion</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2"><Label>Code</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="PROMO10" /></div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Pourcentage (%)</SelectItem>
                      <SelectItem value="fixed">Montant fixe (DZD)</SelectItem>
                      <SelectItem value="free_shipping">Livraison gratuite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Valeur</Label><Input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} /></div>
                  <div className="grid gap-2"><Label>Min. commande</Label><Input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })} /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={handleCreate}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-card rounded-lg border overflow-hidden">
        {loading ? <div className="p-6 text-sm text-muted-foreground">Chargement...</div>
        : (promos || []).length === 0 ? <EmptyState icon={<Tag className="h-10 w-10" />} title="Aucune promotion" description="Créez votre première promotion pour booster vos ventes." />
        : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(promos || []).map(p => (
                <TableRow key={p.id}>
                  <TableCell><Badge variant="outline" className="font-mono">{p.code}</Badge></TableCell>
                  <TableCell className="text-sm">{p.type === "percent" ? "%" : p.type === "fixed" ? "Fixe" : "Livraison"}</TableCell>
                  <TableCell>{p.type === "percent" ? `${p.value}%` : p.type === "fixed" ? `${p.value} DZD` : "—"}</TableCell>
                  <TableCell>{p.usedCount}{p.usageLimit ? ` / ${p.usageLimit}` : ""}</TableCell>
                  <TableCell><Switch checked={p.active} onCheckedChange={(v) => handleToggle(p.id, v)} /></TableCell>
                  <TableCell className="text-end">
                    <Button size="sm" variant="ghost" onClick={async () => { await promotionsApi.remove(p.id); toast.success("Supprimée"); reload(); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
