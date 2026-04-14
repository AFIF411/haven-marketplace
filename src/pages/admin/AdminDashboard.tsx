import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { TrendingUp, Users, Store, ShoppingBag, DollarSign, Package, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDZD } from "@/data/mockData";

const stats = [
  { label: "Chiffre d'affaires", value: formatDZD(8245000), change: "+18%", icon: DollarSign },
  { label: "Commandes", value: "1 560", change: "+12%", icon: ShoppingBag },
  { label: "Utilisateurs", value: "8 430", change: "+25%", icon: Users },
  { label: "Boutiques", value: "156", change: "+8", icon: Store },
  { label: "Produits", value: "4 230", change: "+120", icon: Package },
  { label: "Réclamations", value: "12", change: "-3", icon: AlertTriangle },
];

const recentActivity = [
  { text: "Nouvelle boutique inscrite : Atelier du Bois (Tizi Ouzou)", time: "Il y a 5 min", type: "info" },
  { text: "Commande CMD-1560 nécessite une validation", time: "Il y a 15 min", type: "warning" },
  { text: "Retrait de 80 000 DA demandé par Artisan Cuir Alger", time: "Il y a 30 min", type: "info" },
  { text: "Réclamation résolue #REC-045", time: "Il y a 1h", type: "success" },
  { text: "Produit signalé dans boutique Mode Express", time: "Il y a 2h", type: "warning" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout type="admin" title="Administration">
      <h1 className="font-heading text-xl font-bold mb-6">Dashboard admin</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card p-4 rounded-lg border">
            <s.icon className="h-5 w-5 text-primary mb-2" />
            <p className="font-heading text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <span className="text-xs text-success font-medium flex items-center gap-0.5 mt-1"><TrendingUp className="h-3 w-3" />{s.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-heading font-semibold mb-3">Activité récente</h2>
          <div className="bg-card rounded-lg border divide-y">
            {recentActivity.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <p className="text-sm">{a.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-heading font-semibold mb-3">Ventes (30j)</h2>
          <div className="bg-card rounded-lg border p-4 h-64 flex items-center justify-center">
            <div className="w-full">
              <div className="flex items-end justify-between h-40 px-2">
                {Array.from({length: 15}, (_, i) => (
                  <div key={i} className="flex-1 mx-0.5">
                    <div className="bg-primary rounded-t" style={{ height: `${30 + Math.random() * 70}%` }} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">15 derniers jours</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
