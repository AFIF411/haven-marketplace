import { useState } from "react";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, type Client } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";
import { wilayas } from "@/data/mockData";

function ClientForm({ client, onSave, onCancel }: { client?: Client; onSave: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    wilaya: client?.wilaya || "",
    notes: client?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Nom *</label>
          <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Téléphone</label>
          <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0555 XX XX XX" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <input type="email" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Adresse</label>
          <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Wilaya</label>
          <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.wilaya} onChange={e => setForm({ ...form, wilaya: e.target.value })}>
            <option value="">-- Sélectionner --</option>
            {wilayas.map((w, i) => (
              <option key={w} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Notes</label>
          <input className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">{client ? "Mettre à jour" : "Ajouter"}</Button>
      </div>
    </form>
  );
}

export default function VendorClientsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | undefined>();

  if (!user) return <Navigate to="/login" replace />;

  const filtered = (clients || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: any) => {
    if (editClient) {
      await updateClient.mutateAsync({ id: editClient.id, ...data });
    } else {
      await createClient.mutateAsync(data);
    }
    setDialogOpen(false);
    setEditClient(undefined);
  };

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Clients</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditClient(undefined); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="me-1 h-4 w-4" /> Ajouter un client</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editClient ? "Modifier le client" : "Nouveau client"}</DialogTitle>
            </DialogHeader>
            <ClientForm client={editClient} onSave={handleSave} onCancel={() => { setDialogOpen(false); setEditClient(undefined); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} client(s)</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-medium">Aucun client</p>
          <p className="text-sm mt-1">Ajoutez votre premier client pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-card rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{c.name}</h3>
                  {c.wilaya && <p className="text-xs text-muted-foreground">{c.wilaya}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditClient(c); setDialogOpen(true); }}><Edit className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => confirm("Supprimer ?") && deleteClient.mutate(c.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {c.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3 w-3" />{c.phone}</div>}
                {c.email && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-3 w-3" />{c.email}</div>}
                {c.address && <p className="text-xs text-muted-foreground mt-1">{c.address}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
