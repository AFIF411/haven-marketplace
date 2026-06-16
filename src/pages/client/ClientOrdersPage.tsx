import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockOrders, formatDZD } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

const STATUS_FILTERS = ["all", "processing", "shipped", "delivered"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

export default function ClientOrdersPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "pending" | "default" }> = {
    delivered: { label: t("status.delivered"), variant: "success" },
    shipped: { label: t("status.shipped"), variant: "default" },
    processing: { label: t("status.processing"), variant: "warning" },
    pending: { label: t("status.pending"), variant: "pending" },
  };

  const filterLabels: Record<StatusFilter, string> = {
    all: t("filter.all"),
    processing: t("filter.inProgress"),
    shipped: t("filter.shipped"),
    delivered: t("filter.delivered"),
  };

  const filtered = useMemo(() => {
    let list = mockOrders;
    if (filter !== "all") list = list.filter(o => o.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(o => String(o.id).toLowerCase().includes(q) || String(o.shop ?? "").toLowerCase().includes(q));
    }
    return list;
  }, [query, filter]);

  return (
    <DashboardLayout type="client" title={t("sidebar.myAccount")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">{t("client.myOrders")}</h1>
        <div className="relative w-56">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} className="w-full h-9 ps-10 pe-3 rounded-md border bg-background text-sm" placeholder={t("filter.search")} />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {STATUS_FILTERS.map(f => (
          <Button key={f} onClick={() => setFilter(f)} size="sm" variant={filter === f ? "default" : "outline"} className="rounded-full">
            {filterLabels[f]}
          </Button>
        ))}
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">Aucune commande.</div>
        ) : (
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
              {filtered.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3"><Link to={`/account/orders/${o.id}`} className="font-mono text-primary hover:underline text-xs">{o.id}</Link></td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3">{o.shop}</td>
                  <td className="px-4 py-3"><Badge variant={statusMap[o.status]?.variant ?? "default"}>{statusMap[o.status]?.label ?? o.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                  <td className="px-4 py-3 text-end font-medium">{formatDZD(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
