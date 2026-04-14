import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOrders, formatDZD } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

export default function ClientOrdersPage() {
  const { t } = useTranslation();

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "pending" | "default" }> = {
    delivered: { label: t("status.delivered"), variant: "success" },
    shipped: { label: t("status.shipped"), variant: "default" },
    processing: { label: t("status.processing"), variant: "warning" },
    pending: { label: t("status.pending"), variant: "pending" },
  };

  const filters = [t("filter.all"), t("filter.inProgress"), t("filter.shipped"), t("filter.delivered")];

  return (
    <DashboardLayout type="client" title={t("sidebar.myAccount")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">{t("client.myOrders")}</h1>
        <div className="relative w-56">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder={t("filter.search")} />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {filters.map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full">{f}</Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-start px-4 py-2.5 font-medium">{t("table.order")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.date")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.shop")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.status")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.items")}</th>
            <th className="text-end px-4 py-2.5 font-medium">{t("table.total")}</th>
          </tr></thead>
          <tbody>
            {[...mockOrders, ...mockOrders].map((o, i) => (
              <tr key={`${o.id}-${i}`} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3"><Link to={`/account/orders/${o.id}`} className="font-mono text-primary hover:underline text-xs">{o.id}</Link></td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3">{o.shop}</td>
                <td className="px-4 py-3"><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                <td className="px-4 py-3 text-end font-medium">{formatDZD(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
