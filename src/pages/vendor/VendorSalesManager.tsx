import { useState } from "react";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Trash2, FileText } from "lucide-react";
import { useSales, useCreateSale, type SaleItem } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

const docTypeLabels: Record<string, string> = {
  invoice: "Facture", quote: "Devis", order: "Bon de commande", delivery: "Bon de livraison", direct: "Vente directe"
};
const statusLabels: Record<string, string> = {
  draft: "Brouillon", confirmed: "Confirmé", delivered: "Livré", cancelled: "Annulé"
};
const payStatusVariant: Record<string, "success" | "warning" | "destructive"> = {
  paid: "success", partial: "warning", unpaid: "destructive"
};
const payStatusLabels: Record<string, string> = {
  paid: "Payé", partial: "Partiel", unpaid: "Non payé"
};

function NewSaleForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const { data: products } = useProducts();
  const { data: clients } = useClients();
  const [docType, setDocType] = useState("invoice");
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<(SaleItem & { tempId: string })[]>([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [notes, setNotes] = useState("");

  const addItem = () => {
    setItems([...items, { tempId: crypto.randomUUID(), product_id: null, product_name: "", quantity: 1, unit_price: 0, total: 0 }]);
  };

  const updateItem = (tempId: string, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.tempId !== tempId) return item;
      const updated = { ...item, [field]: value };

      if (field === "product_id" && products) {
        const prod = products.find(p => p.id === value);
        if (prod) {
          updated.product_name = prod.name;
          updated.unit_price = prod.sale_price;
          updated.total = prod.sale_price * updated.quantity;
        }
      }
      if (field === "quantity" || field === "unit_price") {
        updated.total = updated.quantity * updated.unit_price;
      }
      return updated;
    }));
  };

  const removeItem = (tempId: string) => setItems(prev => prev.filter(i => i.tempId !== tempId));
  const total = items.reduce((s, i) => s + i.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    onSave({
      sale: {
        client_id: clientId || null,
        doc_type: docType,
        total,
        paid_amount: paidAmount,
        status: "confirmed",
        payment_mode: paymentMode,
        notes,
      },
      items: items.map(({ tempId, ...rest }) => rest),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Type de document</label>
          <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={docType} onChange={e => setDocType(e.target.value)}>
            {Object.entries(docTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Client</label>
          <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={clientId} onChange={e => setClientId(e.target.value)}>
            <option value="">-- Sans client --</option>
            {(clients || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Produits</label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 me-1" />Ligne</Button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 border rounded-md">Ajoutez des produits à la vente</p>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.tempId} className="flex gap-2 items-end">
                <div className="flex-1">
                  <select className="w-full h-9 px-2 rounded-md border bg-background text-sm" value={item.product_id || ""} onChange={e => updateItem(item.tempId, "product_id", e.target.value)}>
                    <option value="">Produit...</option>
                    {(products || []).map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} en stock)</option>)}
                  </select>
                </div>
                <input type="number" className="w-16 h-9 px-2 rounded-md border bg-background text-sm text-center" placeholder="Qté" value={item.quantity} onChange={e => updateItem(item.tempId, "quantity", +e.target.value)} min={1} />
                <input type="number" className="w-24 h-9 px-2 rounded-md border bg-background text-sm text-end" placeholder="Prix" value={item.unit_price} onChange={e => updateItem(item.tempId, "unit_price", +e.target.value)} min={0} />
                <span className="w-24 h-9 flex items-center justify-end text-sm font-medium">{formatDZD(item.total)}</span>
                <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-destructive shrink-0" onClick={() => removeItem(item.tempId)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between font-heading font-bold text-lg mb-3">
          <span>Total</span>
          <span>{formatDZD(total)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Montant payé (DA)</label>
            <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={paidAmount} onChange={e => setPaidAmount(+e.target.value)} min={0} max={total} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Mode de paiement</label>
            <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
              <option value="cash">Espèces</option>
              <option value="ccp">CCP / BaridiMob</option>
              <option value="card">Carte (CIB/Edahabia)</option>
              <option value="transfer">Virement</option>
              <option value="check">Chèque</option>
            </select>
          </div>
        </div>
        {total > 0 && paidAmount < total && (
          <p className="text-sm text-warning mt-2">Reste à payer : {formatDZD(total - paidAmount)}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Notes</label>
        <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[50px]" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={items.length === 0}>Enregistrer</Button>
      </div>
    </form>
  );
}

export default function VendorSalesManager() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: sales, isLoading } = useSales();
  const createSale = useCreateSale();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterPayment, setFilterPayment] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const filtered = (sales || []).filter(s => {
    const matchSearch = s.doc_number.toLowerCase().includes(search.toLowerCase()) ||
      (s.clients?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || s.doc_type === filterType;
    const matchPay = !filterPayment || s.payment_status === filterPayment;
    return matchSearch && matchType && matchPay;
  });

  const handleSave = async (data: any) => {
    await createSale.mutateAsync(data);
    setDialogOpen(false);
  };

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Ventes & Documents</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="me-1 h-4 w-4" /> Nouvelle vente</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle vente</DialogTitle>
            </DialogHeader>
            <NewSaleForm onSave={handleSave} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder="N° document ou client..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 px-3 rounded-md border text-sm bg-background" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Tous types</option>
          {Object.entries(docTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="h-9 px-3 rounded-md border text-sm bg-background" value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
          <option value="">Tous paiements</option>
          {Object.entries(payStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
          <p className="font-medium">Aucune vente</p>
          <p className="text-sm mt-1">Créez votre première vente</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-start px-4 py-2.5 font-medium">N° Document</th>
                <th className="text-start px-4 py-2.5 font-medium">Type</th>
                <th className="text-start px-4 py-2.5 font-medium">Client</th>
                <th className="text-start px-4 py-2.5 font-medium">Date</th>
                <th className="text-end px-4 py-2.5 font-medium">Total</th>
                <th className="text-end px-4 py-2.5 font-medium">Payé</th>
                <th className="text-start px-4 py-2.5 font-medium">Paiement</th>
                <th className="text-start px-4 py-2.5 font-medium">Statut</th>
              </tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3 font-mono text-xs text-primary">{s.doc_number}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{docTypeLabels[s.doc_type] || s.doc_type}</Badge></td>
                    <td className="px-4 py-3">{s.clients?.name || "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.sale_date}</td>
                    <td className="px-4 py-3 text-end font-medium">{formatDZD(s.total)}</td>
                    <td className="px-4 py-3 text-end">{formatDZD(s.paid_amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={payStatusVariant[s.payment_status] || "default"}>
                        {payStatusLabels[s.payment_status] || s.payment_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{statusLabels[s.status] || s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
