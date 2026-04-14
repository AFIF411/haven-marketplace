import { Link } from "react-router-dom";
import { ShoppingBag, Heart, MapPin, Star } from "lucide-react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { mockOrders, formatDZD } from "@/data/mockData";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "pending" | "default" }> = {
  delivered: { label: "Livré", variant: "success" },
  shipped: { label: "Expédié", variant: "default" },
  processing: { label: "En cours", variant: "warning" },
  pending: { label: "En attente", variant: "pending" },
};

export default function ClientDashboard() {
  return (
    <DashboardLayout type="client" title="Mon compte">
      <h1 className="font-heading text-xl font-bold mb-6">Bonjour, Mohamed 👋</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Commandes", value: "12", icon: ShoppingBag },
          { label: "Wishlist", value: "8", icon: Heart },
          { label: "Adresses", value: "2", icon: MapPin },
          { label: "Avis donnés", value: "5", icon: Star },
        ].map(s => (
          <div key={s.label} className="bg-card p-4 rounded-lg border">
            <s.icon className="h-5 w-5 text-primary mb-2" />
            <p className="font-heading text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-heading font-semibold mb-3">Commandes récentes</h2>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary/50">
              <th className="text-left px-4 py-2.5 font-medium">Commande</th>
              <th className="text-left px-4 py-2.5 font-medium">Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Statut</th>
              <th className="text-right px-4 py-2.5 font-medium">Total</th>
            </tr></thead>
            <tbody>
              {mockOrders.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3"><Link to={`/account/orders/${o.id}`} className="font-mono text-primary hover:underline text-xs">{o.id}</Link></td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3"><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium">{formatDZD(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
