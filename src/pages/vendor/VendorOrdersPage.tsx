import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const orders = [
  { id: "CMD-V-001", customer: "Marie Lambert", date: "15/01/2024", items: 2, status: "new", total: 234 },
  { id: "CMD-V-002", customer: "Pierre Martin", date: "14/01/2024", items: 1, status: "processing", total: 89 },
  { id: "CMD-V-003", customer: "Sophie Roux", date: "13/01/2024", items: 3, status: "shipped", total: 156 },
  { id: "CMD-V-004", customer: "Lucas Durand", date: "12/01/2024", items: 1, status: "delivered", total: 45 },
  { id: "CMD-V-005", customer: "Emma Petit", date: "11/01/2024", items: 2, status: "delivered", total: 312 },
];

const statusMap: Record<string, { label: string; variant: "warning" | "default" | "success" | "pending" }> = {
  new: { label: "Nouvelle", variant: "warning" },
  processing: { label: "En préparation", variant: "pending" },
  shipped: { label: "Expédiée", variant: "default" },
  delivered: { label: "Livrée", variant: "success" },
};

export default function VendorOrdersPage() {
  return (
    <DashboardLayout type="vendor" title="Espace vendeur">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Commandes</h1>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 pl-10 pr-3 rounded-md border bg-background text-sm" placeholder="Rechercher..." />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {["Toutes", "Nouvelles", "En préparation", "Expédiées", "Livrées"].map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium">Commande</th>
            <th className="text-left px-4 py-2.5 font-medium">Client</th>
            <th className="text-left px-4 py-2.5 font-medium">Date</th>
            <th className="text-left px-4 py-2.5 font-medium">Articles</th>
            <th className="text-left px-4 py-2.5 font-medium">Statut</th>
            <th className="text-right px-4 py-2.5 font-medium">Total</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-mono text-xs text-primary">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                <td className="px-4 py-3"><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></td>
                <td className="px-4 py-3 text-right font-medium">{o.total} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
