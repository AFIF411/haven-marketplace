import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Ban, Check } from "lucide-react";
import { mockShops, formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

export default function AdminVendorsPage() {
  const { t } = useTranslation();

  const filters = [t("filter.allM"), t("filter.actifs"), t("filter.pendingFilter"), t("filter.suspended")];

  return (
    <DashboardLayout type="admin" title={t("sidebar.administration")}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold">{t("admin.manageVendors")}</h1>
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
            <th className="text-start px-4 py-2.5 font-medium">{t("table.seller")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.shop")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.products")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.revenue")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.status")}</th>
            <th className="text-end px-4 py-2.5 font-medium">{t("table.actions")}</th>
          </tr></thead>
          <tbody>
            {mockShops.map(s => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 flex items-center gap-2">
                  <img src={s.logo} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                  <span className="font-medium">{s.name}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                <td className="px-4 py-3">{s.products}</td>
                <td className="px-4 py-3">{formatDZD(s.reviews * 800)}</td>
                <td className="px-4 py-3"><Badge variant={s.verified ? "success" : "warning"}>{s.verified ? t("common.verified") : t("status.pending")}</Badge></td>
                <td className="px-4 py-3 text-end">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Check className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Ban className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
