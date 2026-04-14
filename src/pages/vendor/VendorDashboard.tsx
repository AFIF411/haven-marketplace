import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { TrendingUp, ShoppingBag, DollarSign, Eye, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

export default function VendorDashboard() {
  const { t } = useTranslation();

  const stats = [
    { label: t("vendor.revenue"), value: formatDZD(824500), change: "+12%", icon: DollarSign },
    { label: t("client.orders"), value: "156", change: "+8%", icon: ShoppingBag },
    { label: t("vendor.visitors"), value: "3 240", change: "+15%", icon: Eye },
    { label: t("vendor.activeProducts"), value: "42", change: "+2", icon: Package },
  ];

  const recentOrders = [
    { id: "CMD-001", customer: "Amina K.", date: t("admin.today"), status: "new", total: 5900 },
    { id: "CMD-002", customer: "Yacine M.", date: t("admin.yesterday"), status: "processing", total: 15400 },
    { id: "CMD-003", customer: "Fatima R.", date: t("admin.yesterday"), status: "shipped", total: 3700 },
    { id: "CMD-004", customer: "Karim D.", date: t("admin.twoDaysAgo"), status: "delivered", total: 11800 },
  ];

  const statusColors: Record<string, "warning" | "default" | "success" | "pending"> = {
    new: "warning", processing: "default", shipped: "default", delivered: "success"
  };
  const statusLabels: Record<string, string> = {
    new: t("status.new"), processing: t("status.preparing"), shipped: t("status.shipped"), delivered: t("status.delivered")
  };

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("vendor.dashboard")}</h1>

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
          <h2 className="font-heading font-semibold mb-3">{t("vendor.recentOrders")}</h2>
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-start px-4 py-2.5 font-medium">{t("table.order")}</th>
                <th className="text-start px-4 py-2.5 font-medium">{t("table.customer")}</th>
                <th className="text-start px-4 py-2.5 font-medium">{t("table.status")}</th>
                <th className="text-end px-4 py-2.5 font-medium">{t("table.total")}</th>
              </tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3 font-mono text-xs text-primary">{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3"><Badge variant={statusColors[o.status]}>{statusLabels[o.status]}</Badge></td>
                    <td className="px-4 py-3 text-end font-medium">{formatDZD(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-heading font-semibold mb-3">{t("vendor.salesOverview")}</h2>
          <div className="bg-card rounded-lg border p-4 h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="flex items-end justify-center gap-1 h-32 mb-4">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="w-8 bg-primary/20 rounded-t" style={{ height: `${h}%` }}>
                    <div className="w-full bg-primary rounded-t" style={{ height: `${60 + Math.random() * 40}%` }} />
                  </div>
                ))}
              </div>
              <p className="text-xs">{t("vendor.daysChart")}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
