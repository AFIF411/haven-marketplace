import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "pending" | "default" }> = {
  delivered: { label: "Livré", variant: "success" },
  shipped: { label: "Expédié", variant: "default" },
  processing: { label: "En cours", variant: "warning" },
  pending: { label: "En attente", variant: "pending" },
};

export default function ClientOrdersPage() {
  return (
    <DashboardLayout type="client" title="Mon compte">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">Mes commandes</h1>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 pl-10 pr-3 rounded-md border bg-background text-sm" placeholder="Rechercher..." />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {["Toutes", "En cours", "Expédiées", "Livrées"].map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium">Commande</th>
            <th className="text-left px-4 py-2.5 font-medium">Date</th>
            <th className="text-left px-4 py-2.5 font-medium">Boutique</th>
            <th className="text-left px-4 py-2.5 font-medium">Statut</th>
            <th className="text-left px-4 py-2.5 font-medium">Articles</th>
            <th className="text-right px-4 py-2.5 font-medium">Total</th>
          </tr></thead>
          <tbody>
            {[...mockOrders, ...mockOrders].map((o, i) => (
              <tr key={`${o.id}-${i}`} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3"><Link to={`/account/orders/${o.id}`} className="font-mono text-primary hover:underline text-xs">{o.id}</Link></td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3">{o.shop}</td>
                <td className="px-4 py-3"><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                <td className="px-4 py-3 text-right font-medium">{o.total} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
