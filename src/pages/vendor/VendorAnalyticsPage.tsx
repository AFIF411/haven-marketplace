import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useVendorStats } from "@/hooks/useMarketplace";
import { BarChart3, Eye, ShoppingBag, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SHOP_ID = "s1";

const visitsData = Array.from({ length: 30 }).map((_, i) => ({
  day: `J${i + 1}`,
  visits: Math.round(50 + Math.random() * 200),
}));

const conversionData = [
  { name: "Lun", taux: 2.4 },
  { name: "Mar", taux: 3.1 },
  { name: "Mer", taux: 2.8 },
  { name: "Jeu", taux: 3.6 },
  { name: "Ven", taux: 4.2 },
  { name: "Sam", taux: 5.1 },
  { name: "Dim", taux: 3.9 },
];

export default function VendorAnalyticsPage() {
  const { data: stats, loading } = useVendorStats(SHOP_ID);

  return (
    <DashboardLayout type="vendor" title="Analytics">
      <PageHeader title="Analytics" description="Performance de votre boutique" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Vues boutique" value={loading ? "…" : "2 458"} icon={<Eye className="h-5 w-5" />} trend="up" delta="+18%" />
        <StatCard label="Commandes" value={loading ? "…" : stats?.orders ?? 0} icon={<ShoppingBag className="h-5 w-5" />} trend="up" delta="+5" />
        <StatCard label="CA (DZD)" value={loading ? "…" : (stats?.revenue ?? 0).toLocaleString("fr-DZ")} icon={<BarChart3 className="h-5 w-5" />} trend="up" delta="+12.4%" />
        <StatCard label="Taux conversion" value="3.8%" icon={<TrendingUp className="h-5 w-5" />} trend="up" delta="+0.4 pts" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-4 lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4">Visites sur 30 jours</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={visitsData}>
              <defs>
                <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#visitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-heading font-semibold mb-4">Taux de conversion par jour (%)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="taux" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-heading font-semibold mb-4">Synthèse</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Panier moyen</span><span className="font-medium">6 650 DZD</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Produits actifs</span><span className="font-medium">{stats?.products ?? 0}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Commandes en attente</span><span className="font-medium">{stats?.pendingOrders ?? 0}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Stock faible</span><span className="font-medium text-warning">{stats?.lowStock ?? 0}</span></li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
