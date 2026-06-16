import { FormEvent, useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";
import { useAddresses, addressesApi } from "@/hooks/useMarketplace";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { WilayaSelect } from "@/components/common/WilayaSelect";
import { toast } from "@/hooks/use-toast";
import type { Address } from "@/types/marketplace";
import { EmptyState } from "@/components/common/EmptyState";

type FormState = {
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  commune: string;
  wilaya: string;
  isDefault: boolean;
};

const empty: FormState = {
  label: "Maison", firstName: "", lastName: "", phone: "",
  street: "", commune: "", wilaya: "", isDefault: false,
};

export default function ClientAddressesPage() {
  const { t } = useTranslation();
  const { data: addresses, reload } = useAddresses();
  const [editing, setEditing] = useState<Address | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Address | null>(null);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (a: Address) => {
    setEditing(a);
    setForm({
      label: a.label ?? "", firstName: a.firstName, lastName: a.lastName, phone: a.phone,
      street: a.street, commune: a.commune, wilaya: a.wilaya, isDefault: !!a.isDefault,
    });
    setOpen(true);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.street || !form.commune || !form.wilaya) {
      toast({ title: "Adresse incomplète", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await addressesApi.update(editing.id, form);
        toast({ title: "Adresse mise à jour" });
      } else {
        await addressesApi.create({ ...form, userId: "current" });
        toast({ title: "Adresse ajoutée" });
      }
      await reload();
      setOpen(false);
    } catch (err) {
      toast({ title: "Erreur", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await addressesApi.remove(pendingDelete.id);
      await reload();
      toast({ title: "Adresse supprimée" });
    } catch (err) {
      toast({ title: "Erreur", description: (err as Error).message, variant: "destructive" });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <DashboardLayout type="client" title={t("sidebar.myAccount")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">{t("client.myAddresses")}</h1>
        <Button size="sm" onClick={openCreate}><Plus className="me-1 h-4 w-4" /> {t("common.add")}</Button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <EmptyState title="Aucune adresse" description="Ajoute une adresse de livraison pour gagner du temps au checkout." actionLabel={t("common.add")} onAction={openCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {addresses.map(a => (
            <div key={a.id} className={`bg-card rounded-lg border p-4 ${a.isDefault ? 'border-primary' : ''}`}>
              {a.isDefault && <span className="text-xs text-primary font-medium">{t("common.default")}</span>}
              <p className="font-medium text-sm mt-1">{a.firstName} {a.lastName}</p>
              <p className="text-sm text-muted-foreground">{a.street}</p>
              <p className="text-sm text-muted-foreground">{a.commune}, {a.wilaya}</p>
              <p className="text-xs text-muted-foreground mt-1">📞 {a.phone}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(a)}><Edit className="h-3 w-3 me-1" /> {t("common.edit")}</Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(a)} aria-label="Supprimer"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Modifier l'adresse" : "Nouvelle adresse"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <Input placeholder="Libellé (Maison, Bureau…)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input required placeholder="Prénom" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
              <Input required placeholder="Nom" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <Input required placeholder="Téléphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input required placeholder="Adresse / rue" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input required placeholder="Commune" value={form.commune} onChange={e => setForm({ ...form, commune: e.target.value })} />
              <WilayaSelect value={form.wilaya} onValueChange={(v) => setForm({ ...form, wilaya: v })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
              Définir comme adresse par défaut
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
              <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : t("common.save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette adresse ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est définitive.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
