import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { TrendingUp, Users, Store, ShoppingBag, DollarSign, Package, AlertTriangle } from "lucide-react";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

export default function AdminDashboard() {
  const { t } = useTranslation();

  const stats = [
    { label: t("vendor.revenue"), value: formatDZD(8245000), change: "+18%", icon: DollarSign },
    { label: t("client.orders"), value: "1 560", change: "+12%", icon: ShoppingBag },
    { label: t("admin.users"), value: "8 430", change: "+25%", icon: Users },
    { label: t("admin.shops"), value: "156", change: "+8", icon: Store },
    { label: t("vendor.products"), value: "4 230", change: "+120", icon: Package },
    { label: t("admin.complaints"), value: "12", change: "-3", icon: AlertTriangle },
  ];

  const recentActivity = [
    { text: `${t("admin.activity.newShop")} : Atelier du Bois (Tizi Ouzou)`, time: t("admin.ago5min") },
    { text: `CMD-1560 ${t("admin.activity.orderValidation")}`, time: t("admin.ago15min") },
    { text: `${t("admin.activity.withdrawalRequest")} Artisan Cuir Alger (80 000 DA)`, time: t("admin.ago30min") },
    { text: `${t("admin.activity.complaintResolved")} #REC-045`, time: t("admin.ago1h") },
    { text: `${t("admin.activity.reportedProduct")} Mode Express`, time: t("admin.ago2h") },
  ];

  return (
    <DashboardLayout type="admin" title={t("sidebar.administration")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("admin.dashboard")}</h1>

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
          <h2 className="font-heading font-semibold mb-3">{t("admin.recentActivity")}</h2>
          <div className="bg-card rounded-lg border divide-y">
            {recentActivity.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <p className="text-sm">{a.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ms-4">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-heading font-semibold mb-3">{t("admin.sales30d")}</h2>
          <div className="bg-card rounded-lg border p-4 h-64 flex items-center justify-center">
            <div className="w-full">
              <div className="flex items-end justify-between h-40 px-2">
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i} className="flex-1 mx-0.5">
                    <div className="bg-primary rounded-t" style={{ height: `${30 + Math.random() * 70}%` }} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">{t("admin.last15days")}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
