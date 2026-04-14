import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { DollarSign, TrendingUp, ArrowDownToLine, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDZD } from "@/data/mockData";
import { useTranslation } from "@/contexts/I18nContext";

const transactions = [
  { id: "TRX-001", type: "sale", date: "15/01/2024", amount: 15400, commission: 1540, net: 13860, status: "completed" },
  { id: "TRX-002", type: "sale", date: "14/01/2024", amount: 5900, commission: 590, net: 5310, status: "completed" },
  { id: "TRX-003", type: "withdrawal", date: "10/01/2024", amount: -50000, commission: 0, net: -50000, status: "pending" },
  { id: "TRX-004", type: "sale", date: "08/01/2024", amount: 10200, commission: 1020, net: 9180, status: "completed" },
];

export default function VendorFinancesPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout type="vendor" title={t("sidebar.vendorSpace")}>
      <h1 className="font-heading text-xl font-bold mb-6">{t("vendor.finances")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("vendor.balance"), value: formatDZD(154000), icon: DollarSign },
          { label: t("vendor.pendingBalance"), value: formatDZD(29500), icon: CreditCard },
          { label: t("vendor.totalRevenue"), value: formatDZD(824500), icon: TrendingUp },
          { label: t("vendor.withdrawals"), value: formatDZD(540000), icon: ArrowDownToLine },
        ].map(s => (
          <div key={s.label} className="bg-card p-4 rounded-lg border">
            <s.icon className="h-5 w-5 text-primary mb-2" />
            <p className="font-heading text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-semibold">{t("vendor.transactions")}</h2>
        <Button size="sm"><ArrowDownToLine className="me-1 h-4 w-4" /> {t("vendor.requestWithdrawal")}</Button>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-secondary/50">
            <th className="text-start px-4 py-2.5 font-medium">{t("table.ref")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.type")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.date")}</th>
            <th className="text-end px-4 py-2.5 font-medium">{t("table.amount")}</th>
            <th className="text-end px-4 py-2.5 font-medium">{t("table.commission")}</th>
            <th className="text-end px-4 py-2.5 font-medium">{t("table.net")}</th>
            <th className="text-start px-4 py-2.5 font-medium">{t("table.status")}</th>
          </tr></thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                <td className="px-4 py-3">{tx.type === "sale" ? t("vendor.sale") : t("vendor.withdrawal")}</td>
                <td className="px-4 py-3 text-muted-foreground">{tx.date}</td>
                <td className="px-4 py-3 text-end font-medium">{tx.amount > 0 ? '+' : ''}{formatDZD(tx.amount)}</td>
                <td className="px-4 py-3 text-end text-muted-foreground">{tx.commission > 0 ? `-${formatDZD(tx.commission)}` : '-'}</td>
                <td className="px-4 py-3 text-end font-medium">{tx.net > 0 ? '+' : ''}{formatDZD(tx.net)}</td>
                <td className="px-4 py-3"><Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>{tx.status === 'completed' ? t("status.completed") : t("status.pending")}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
