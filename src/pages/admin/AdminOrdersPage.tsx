import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { formatDZD } from "@/data/mockData";

const orders = [
  { id: "CMD-001", buyer: "Mohamed B.", seller: "Artisan Cuir Alger", date: "15/01", items: 2, status: "delivered", total: 15400, commission: 1540 },
  { id: "CMD-002", buyer: "Amina K.", seller: "Temps Naturel DZ", date: "14/01", items: 1, status: "shipped", total: 5900, commission: 590 },
  { id: "CMD-003", buyer: "Yacine M.", seller: "L'Atelier", date: "13/01", items: 3, status: "processing", total: 10200, commission: 1020 },
  { id: "CMD-004", buyer: "Fatima R.", seller: "Terre & Feu", date: "12/01", items: 1, status: "pending", total: 3000, commission: 300 },
];

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "pending" | "default" }> = {
  delivered: { label: "Livré", variant: "success" },
  shipped: { label: "Expédié", variant: "default" },
  processing: { label: "En cours", variant: "warning" },
  pending: { label: "En attente", variant: "pending" },
};

export default function AdminOrdersPage() {
  return (
    <DashboardLayout type="admin" title="Administration">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Gestion commandes</h1>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 pl-10 pr-3 rounded-md border bg-background text-sm" placeholder="Rechercher..." />
        </div>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium">Commande</th>
            <th className="text-left px-4 py-2.5 font-medium">Acheteur</th>
            <th className="text-left px-4 py-2.5 font-medium">Vendeur</th>
            <th className="text-left px-4 py-2.5 font-medium">Date</th>
            <th className="text-left px-4 py-2.5 font-medium">Statut</th>
            <th className="text-right px-4 py-2.5 font-medium">Total</th>
            <th className="text-right px-4 py-2.5 font-medium">Commission</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-mono text-xs text-primary">{o.id}</td>
                <td className="px-4 py-3">{o.buyer}</td>
                <td className="px-4 py-3">{o.seller}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3"><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></td>
                <td className="px-4 py-3 text-right font-medium">{formatDZD(o.total)}</td>
                <td className="px-4 py-3 text-right text-primary font-medium">{formatDZD(o.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
