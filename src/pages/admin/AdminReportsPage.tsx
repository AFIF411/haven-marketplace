import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useAdminStats } from "@/hooks/useMarketplace";
import { BarChart3, ShoppingBag, Store, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const revenueData = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"][i],
  revenue: Math.round(50000 + Math.random() * 200000),
  orders: Math.round(20 + Math.random() * 100),
}));

const topShopsData = [
  { name: "Artisan Cuir", value: 145000 },
  { name: "Atelier Sens", value: 98000 },
  { name: "Temps Naturel", value: 76000 },
  { name: "Terre & Feu", value: 54000 },
];

export default function AdminReportsPage() {
  const { data: stats, loading } = useAdminStats();

  return (
    <DashboardLayout type="admin" title="Rapports">
      <PageHeader title="Rapports plateforme" description="Vue d'ensemble des performances de la marketplace" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Boutiques actives" value={loading ? "…" : stats?.activeShops ?? 0} icon={<Store className="h-5 w-5" />} delta={`+${stats?.pendingShops ?? 0} en attente`} />
        <StatCard label="Commandes totales" value={loading ? "…" : stats?.orders ?? 0} icon={<ShoppingBag className="h-5 w-5" />} trend="up" delta="+12% ce mois" />
        <StatCard label="GMV (DZD)" value={loading ? "…" : (stats?.revenue ?? 0).toLocaleString("fr-DZ")} icon={<BarChart3 className="h-5 w-5" />} trend="up" delta="+8.3%" />
        <StatCard label="Produits" value={loading ? "…" : stats?.products ?? 0} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-heading font-semibold mb-4">Chiffre d'affaires sur 12 mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="CA (DZD)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-heading font-semibold mb-4">Top boutiques (CA)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topShopsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-4 lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4">Commandes par mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="orders" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
