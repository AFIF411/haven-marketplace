import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

const orders = [
  { id: "CMD-V-001", customer: "Amina Khelifi", date: "15/01/2024", items: 2, status: "new", total: 15400 },
  { id: "CMD-V-002", customer: "Yacine Mansouri", date: "14/01/2024", items: 1, status: "processing", total: 5900 },
  { id: "CMD-V-003", customer: "Fatima Rahmani", date: "13/01/2024", items: 3, status: "shipped", total: 10200 },
  { id: "CMD-V-004", customer: "Karim Derradji", date: "12/01/2024", items: 1, status: "delivered", total: 3000 },
  { id: "CMD-V-005", customer: "Nadia Boudiaf", date: "11/01/2024", items: 2, status: "delivered", total: 20500 },
];

export default function VendorOrdersPage() {
  const { t } = useTranslation();

  const statusMap: Record<string, { label: string; variant: "warning" | "default" | "success" | "pending" }> = {
    new: { label: t("status.new"), variant: "warning" },
    processing: { label: t("status.preparing"), variant: "pending" },
    shipped: { label: t("status.shipped"), variant: "default" },
    delivered: { label: t("status.delivered"), variant: "success" },
  };

  const filters = [t("filter.all"), t("filter.new"), t("filter.preparing"), t("filter.shipped"), t("filter.delivered")];

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">{t("vendor.orders")}</h1>
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
            <th className="text-start px-4 py-2.5 font-medium">{t("table.customer")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.date")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.items")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.status")}</th>
            <th className="text-end px-4 py-2.5 font-medium">{t("table.total")}</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-mono text-xs text-primary">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                <td className="px-4 py-3"><Badge variant={statusMap[o.status].variant}>{statusMap[o.status].label}</Badge></td>
                <td className="px-4 py-3 text-end font-medium">{formatDZD(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
