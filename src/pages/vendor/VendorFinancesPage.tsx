import { useState } from "react";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, DollarSign, TrendingUp, AlertCircle, CreditCard } from "lucide-react";
import { useSales, usePayments } from "@/hooks/useSales";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";
import { formatDZD } from "@/data/mockData";
import { businessStore } from "@/lib/mocks/businessStore";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const payModeLabels: Record<string, string> = {
  cash: "Espèces", ccp: "CCP / BaridiMob", card: "CIB/Edahabia", transfer: "Virement", check: "Chèque",
};

function AddPaymentForm({ sale, onDone }: { sale: any; onDone: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const remaining = sale.total - sale.paid_amount;
  const [amount, setAmount] = useState(remaining);
  const [mode, setMode] = useState("cash");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > remaining) return;
    setLoading(true);
    try {
      businessStore.addPayment(sale.id, amount, mode, notes);
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["all_payments"] });
      toast.success("Paiement enregistré");
      onDone();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
        <div className="flex justify-between"><span>Document :</span><span className="font-mono font-medium">{sale.doc_number}</span></div>
        <div className="flex justify-between"><span>Total :</span><span className="font-medium">{formatDZD(sale.total)}</span></div>
        <div className="flex justify-between"><span>Déjà payé :</span><span>{formatDZD(sale.paid_amount)}</span></div>
        <div className="flex justify-between font-bold text-primary"><span>Reste à payer :</span><span>{formatDZD(remaining)}</span></div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Montant (DA)</label>
        <input type="number" className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={amount} onChange={e => setAmount(+e.target.value)} min={1} max={remaining} step="0.01" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Mode de paiement</label>
        <select className="w-full h-10 px-3 rounded-md border bg-background text-sm" value={mode} onChange={e => setMode(e.target.value)}>
          {Object.entries(payModeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Notes</label>
        <textarea className="w-full px-3 py-2 rounded-md border bg-background text-sm min-h-[50px]" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>Annuler</Button>
        <Button type="submit" disabled={loading || amount <= 0 || amount > remaining}>
          {loading ? "..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

function PaymentHistory({ saleId }: { saleId: string }) {
  const { data: payments, isLoading } = usePayments(saleId);

  if (isLoading) return <p className="text-sm text-muted-foreground py-2">Chargement...</p>;
  if (!payments?.length) return <p className="text-sm text-muted-foreground py-2">Aucun paiement</p>;

  return (
    <div className="space-y-2">
      {payments.map((p: any) => (
        <div key={p.id} className="flex items-center justify-between bg-secondary/30 rounded-md px-3 py-2 text-sm">
          <div>
            <span className="font-medium">{formatDZD(p.amount)}</span>
            <span className="text-muted-foreground mx-2">·</span>
            <span className="text-muted-foreground">{payModeLabels[p.payment_mode] || p.payment_mode}</span>
          </div>
          <span className="text-xs text-muted-foreground">{p.payment_date}</span>
        </div>
      ))}
    </div>
  );
}

export default function VendorFinancesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: sales, isLoading } = useSales();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<"pay" | "history" | null>(null);

  // Fetch all payments for stats
  const { data: allPayments } = useQuery({
    queryKey: ["all_payments"],
    queryFn: async () => businessStore.listPayments(),
    enabled: !!user,
  });

  if (!user) return <Navigate to="/login" replace />;

  const totalSales = (sales || []).reduce((s, sale) => s + sale.total, 0);
  const totalPaid = (sales || []).reduce((s, sale) => s + sale.paid_amount, 0);
  const totalRemaining = totalSales - totalPaid;
  const unpaidCount = (sales || []).filter(s => s.payment_status !== "paid").length;

  const filtered = (sales || []).filter(s => {
    const matchSearch = s.doc_number.toLowerCase().includes(search.toLowerCase()) ||
      (s.clients?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || s.payment_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openDialog = (sale: any, mode: "pay" | "history") => {
    setSelectedSale(sale);
    setDialogMode(mode);
  };

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <h1 className="font-heading text-xl font-bold mb-6">Paiements & Finances</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Chiffre d'affaires", value: formatDZD(totalSales), icon: TrendingUp, color: "text-primary" },
          { label: "Total encaissé", value: formatDZD(totalPaid), icon: DollarSign, color: "text-green-600" },
          { label: "Reste à encaisser", value: formatDZD(totalRemaining), icon: CreditCard, color: "text-orange-500" },
          { label: "Ventes impayées", value: unpaidCount.toString(), icon: AlertCircle, color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="bg-card p-4 rounded-lg border">
            <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
            <p className="font-heading text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder="N° document ou client..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 px-3 rounded-md border text-sm bg-background" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Tous statuts</option>
          <option value="paid">Payé</option>
          <option value="partial">Partiel</option>
          <option value="unpaid">Non payé</option>
        </select>
      </div>

      {/* Sales payment table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <DollarSign className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
          <p className="font-medium">Aucune vente trouvée</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-start px-4 py-2.5 font-medium">Document</th>
                <th className="text-start px-4 py-2.5 font-medium">Client</th>
                <th className="text-start px-4 py-2.5 font-medium">Date</th>
                <th className="text-end px-4 py-2.5 font-medium">Total</th>
                <th className="text-end px-4 py-2.5 font-medium">Payé</th>
                <th className="text-end px-4 py-2.5 font-medium">Reste</th>
                <th className="text-start px-4 py-2.5 font-medium">Statut</th>
                <th className="text-end px-4 py-2.5 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(s => {
                  const remaining = s.total - s.paid_amount;
                  return (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="px-4 py-3 font-mono text-xs text-primary">{s.doc_number}</td>
                      <td className="px-4 py-3">{s.clients?.name || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.sale_date}</td>
                      <td className="px-4 py-3 text-end font-medium">{formatDZD(s.total)}</td>
                      <td className="px-4 py-3 text-end">{formatDZD(s.paid_amount)}</td>
                      <td className="px-4 py-3 text-end font-medium">{remaining > 0 ? formatDZD(remaining) : "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={s.payment_status === "paid" ? "success" : s.payment_status === "partial" ? "warning" : "destructive"}>
                          {s.payment_status === "paid" ? "Payé" : s.payment_status === "partial" ? "Partiel" : "Non payé"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openDialog(s, "history")}>
                            Historique
                          </Button>
                          {s.payment_status !== "paid" && (
                            <Button size="sm" className="h-7 text-xs" onClick={() => openDialog(s, "pay")}>
                              <Plus className="h-3 w-3 me-1" />Payer
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={!!dialogMode} onOpenChange={open => { if (!open) setDialogMode(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "pay" ? "Enregistrer un paiement" : "Historique des paiements"}
              {selectedSale && <span className="text-muted-foreground font-normal text-sm ms-2">{selectedSale.doc_number}</span>}
            </DialogTitle>
          </DialogHeader>
          {dialogMode === "pay" && selectedSale && (
            <AddPaymentForm sale={selectedSale} onDone={() => setDialogMode(null)} />
          )}
          {dialogMode === "history" && selectedSale && (
            <PaymentHistory saleId={selectedSale.id} />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
