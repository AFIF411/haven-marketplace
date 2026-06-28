import { Link, Navigate } from "react-router-dom";
import { ShoppingBag, Heart, MapPin, Star, Store, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { mockOrders, formatDZD } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";

export default function ClientDashboard() {
  const { user, roles } = useAuth();
  const { t } = useTranslation();

  if (!user) return <Navigate to="/login" replace />;

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "pending" | "default" }> = {
    delivered: { label: t("status.delivered"), variant: "success" },
    shipped: { label: t("status.shipped"), variant: "default" },
    processing: { label: t("status.processing"), variant: "warning" },
    pending: { label: t("status.pending"), variant: "pending" },
  };

  return (
    <DashboardLayout type="client" title={t("sidebar.myAccount")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("client.hello")}, {user.firstName} 👋</h1>

      {!roles.includes("vendeur") && (
        <Link to="/account/become-vendor" className="group block mb-6 p-5 rounded-lg border border-primary/30 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/60 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold">Devenez vendeur sur OneClick Tijara</p>
              <p className="text-sm text-muted-foreground">Ouvrez votre boutique en ligne en quelques clics.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("client.orders"), value: "12", icon: ShoppingBag },
          { label: t("client.wishlist"), value: "8", icon: Heart },
          { label: t("client.addresses"), value: "2", icon: MapPin },
          { label: t("client.reviewsGiven"), value: "5", icon: Star },
        ].map(s => (
          <div key={s.label} className="bg-card p-4 rounded-lg border">
            <s.icon className="h-5 w-5 text-primary mb-2" />
            <p className="font-heading text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-heading font-semibold mb-3">{t("client.recentOrders")}</h2>
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary/50">
              <th className="text-start px-4 py-2.5 font-medium">{t("table.order")}</th>
              <th className="text-start px-4 py-2.5 font-medium">{t("table.date")}</th>
              <th className="text-start px-4 py-2.5 font-medium">{t("table.status")}</th>
              <th className="text-end px-4 py-2.5 font-medium">{t("table.total")}</th>
            </tr></thead>
            <tbody>
              {mockOrders.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3"><Link to={`/account/orders/${o.id}`} className="font-mono text-primary hover:underline text-xs">{o.id}</Link></td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3"><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></td>
                  <td className="px-4 py-3 text-end font-medium">{formatDZD(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
