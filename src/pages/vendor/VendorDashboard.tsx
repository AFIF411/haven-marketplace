import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { TrendingUp, ShoppingBag, DollarSign, Eye, Package, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Chiffre d'affaires", value: "12 450 €", change: "+12%", icon: DollarSign },
  { label: "Commandes", value: "156", change: "+8%", icon: ShoppingBag },
  { label: "Visiteurs", value: "3 240", change: "+15%", icon: Eye },
  { label: "Produits actifs", value: "42", change: "+2", icon: Package },
];

const recentOrders = [
  { id: "CMD-001", customer: "Marie L.", date: "Aujourd'hui", status: "new", total: 89 },
  { id: "CMD-002", customer: "Pierre M.", date: "Hier", status: "processing", total: 234 },
  { id: "CMD-003", customer: "Sophie R.", date: "Hier", status: "shipped", total: 56 },
  { id: "CMD-004", customer: "Lucas D.", date: "Il y a 2j", status: "delivered", total: 178 },
];

const statusColors: Record<string, "warning" | "default" | "success" | "pending"> = {
  new: "warning", processing: "default", shipped: "default", delivered: "success"
};
const statusLabels: Record<string, string> = {
  new: "Nouvelle", processing: "En préparation", shipped: "Expédiée", delivered: "Livrée"
};

export default function VendorDashboard() {
  return (
    <DashboardLayout type="vendor" title="Espace vendeur">
      <h1 className="font-heading text-xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-success font-medium flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{s.change}</span>
            </div>
            <p className="font-heading text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-heading font-semibold mb-3">Commandes récentes</h2>
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-left px-4 py-2.5 font-medium">Commande</th>
                <th className="text-left px-4 py-2.5 font-medium">Client</th>
                <th className="text-left px-4 py-2.5 font-medium">Statut</th>
                <th className="text-right px-4 py-2.5 font-medium">Total</th>
              </tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3 font-mono text-xs text-primary">{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3"><Badge variant={statusColors[o.status]}>{statusLabels[o.status]}</Badge></td>
                    <td className="px-4 py-3 text-right font-medium">{o.total} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-heading font-semibold mb-3">Aperçu ventes (7j)</h2>
          <div className="bg-card rounded-lg border p-4 h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="flex items-end justify-center gap-1 h-32 mb-4">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="w-8 bg-primary/20 rounded-t" style={{ height: `${h}%` }}>
                    <div className="w-full bg-primary rounded-t" style={{ height: `${60 + Math.random() * 40}%` }} />
                  </div>
                ))}
              </div>
              <p className="text-xs">Lun Mar Mer Jeu Ven Sam Dim</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
